import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
  DocumentReference,
  Unsubscribe
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { LoggedOrder, OrderItemDetail, ProductVariant, ShopNotification } from "../types";

/** Lỗi nghiệp vụ khi tạo đơn (hết hàng, chưa cấu hình...) — message hiển thị được cho khách. */
export class OrderCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderCreationError";
  }
}

/**
 * Dựng lại item đơn hàng SẠCH cho payload ghi Firestore — chỉ định nghĩa đúng
 * field cần thiết, field optional (variantId/productImage/customMeasurements)
 * dùng conditional spread. KHÔNG spread nguyên `...item` gốc (item gốc có thể
 * chứa field undefined từ nơi khác gọi tới).
 */
function buildCleanOrderItem(item: OrderItemDetail, variantId: string | undefined): OrderItemDetail {
  return {
    productId: item.productId,
    productName: item.productName,
    color: item.color,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.subtotal,
    ...(variantId ? { variantId } : {}),
    ...(item.productImage ? { productImage: item.productImage } : {}),
    ...(item.customMeasurements ? { customMeasurements: item.customMeasurements } : {})
  };
}

interface VariantPlan {
  ref: DocumentReference;
  quantity: number;
  label: string;
}

/**
 * Tìm variant khớp (productId + color + size) cho từng dòng hàng.
 * Phải query TRƯỚC transaction vì transaction Firestore không hỗ trợ query.
 * Sản phẩm không có variant tracking sẽ được bỏ qua (không chặn bán).
 */
export async function resolveVariantPlans(items: LoggedOrder["items"]): Promise<VariantPlan[]> {
  if (!db || !items) return [];
  const plans: VariantPlan[] = [];
  for (const item of items) {
    const snap = await getDocs(
      query(
        collection(db, "productVariants"),
        where("productId", "==", item.productId),
        where("color", "==", item.color),
        where("size", "==", item.size)
      )
    );
    if (snap.empty) continue;
    const variantDoc = snap.docs[0];
    const existing = plans.find((plan) => plan.ref.path === variantDoc.ref.path);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      plans.push({ ref: variantDoc.ref, quantity: item.quantity, label: item.productName });
    }
  }
  return plans;
}

/**
 * Tra variantId cho từng item (khớp productId + color + size) — dùng để gắn
 * `variantId` lên OrderItemDetail và tính `purchasedItemKeys` cho verified-purchase
 * review. Query riêng với resolveVariantPlans (hàm đó gộp quantity theo variant,
 * không giữ ánh xạ ngược về item gốc).
 */
async function resolveItemVariantIds(items: LoggedOrder["items"]): Promise<(string | undefined)[]> {
  if (!db || !items) return [];
  const firestore = db;
  const cache = new Map<string, string | undefined>();
  const results: (string | undefined)[] = [];
  for (const item of items) {
    const cacheKey = `${item.productId}__${item.color}__${item.size}`;
    if (cache.has(cacheKey)) {
      results.push(cache.get(cacheKey));
      continue;
    }
    const snap = await getDocs(
      query(
        collection(firestore, "productVariants"),
        where("productId", "==", item.productId),
        where("color", "==", item.color),
        where("size", "==", item.size)
      )
    );
    const variantId = snap.empty ? undefined : snap.docs[0].id;
    cache.set(cacheKey, variantId);
    results.push(variantId);
  }
  return results;
}

/**
 * Tạo đơn + trừ tồn kho trong CÙNG MỘT transaction:
 * - Ghi orders/{orderId} và users/{uid}/orders/{orderId} (luôn đồng bộ 2 phía).
 * - Trừ stockQuantity từng variant, không cho âm, kèm inventoryTransactions log.
 * - Transaction fail → không có order nào được ghi, không trừ kho một phần.
 */
export async function createOrderInFirestore(userId: string, order: LoggedOrder): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    throw new OrderCreationError("Hệ thống đặt hàng trực tuyến chưa sẵn sàng. Vui lòng thử lại sau.");
  }
  if (!order.items || order.items.length === 0) {
    throw new OrderCreationError("Đơn hàng không có sản phẩm nào. Vui lòng kiểm tra lại giỏ hàng.");
  }
  // Field bắt buộc của từng item: phải có giá trị hợp lệ, không thì throw rõ ràng
  // (không âm thầm ghi field rỗng/undefined vào Firestore).
  for (const item of order.items) {
    if (!item.productId || !item.productName || !item.color || !item.size) {
      throw new OrderCreationError("Thông tin sản phẩm trong đơn hàng bị thiếu. Vui lòng thử lại từ giỏ hàng.");
    }
    if (!Number.isFinite(item.quantity) || item.quantity <= 0 || !Number.isFinite(item.price) || !Number.isFinite(item.subtotal)) {
      throw new OrderCreationError("Số lượng hoặc giá sản phẩm không hợp lệ. Vui lòng thử lại.");
    }
  }

  const firestore = db;
  const variantPlans = await resolveVariantPlans(order.items);
  const itemVariantIds = await resolveItemVariantIds(order.items);
  // Field optional (variantId/productImage/customMeasurements) được dựng sạch qua
  // buildCleanOrderItem — không spread nguyên item gốc, không ghi key undefined.
  const cleanItems = order.items.map((item, idx) => buildCleanOrderItem(item, itemVariantIds[idx]));
  // purchasedItemKeys luôn là string[] hợp lệ — variantId rỗng dùng fallback "default".
  const purchasedItemKeys: string[] = cleanItems.map((item) => `${item.productId}_${item.variantId ?? "default"}`);

  const nowIso = new Date().toISOString();
  const payload = {
    ...order,
    items: cleanItems,
    purchasedItemKeys,
    userId,
    paymentStatus: order.paymentStatus ?? "unpaid",
    updatedAt: nowIso,
    createdAt: serverTimestamp()
  };

  const rootRef = doc(firestore, "orders", order.id);
  const userRef = doc(firestore, "users", userId, "orders", order.id);

  await runTransaction(firestore, async (tx) => {
    // 1) Đọc toàn bộ trước khi ghi (yêu cầu của Firestore transaction)
    const variantReads: { plan: VariantPlan; data: ProductVariant | null }[] = [];
    for (const plan of variantPlans) {
      const snap = await tx.get(plan.ref);
      variantReads.push({ plan, data: snap.exists() ? (snap.data() as ProductVariant) : null });
    }
    // 2) Kiểm tra tồn kho — không cho âm
    for (const { plan, data } of variantReads) {
      if (!data) continue;
      if (data.stockQuantity < plan.quantity) {
        throw new OrderCreationError(
          `"${plan.label}" chỉ còn ${data.stockQuantity} sản phẩm trong kho. Bạn vui lòng giảm số lượng nhé.`
        );
      }
    }
    // 3) Ghi đơn cả hai phía
    tx.set(rootRef, payload);
    tx.set(userRef, payload);
    // 4) Trừ kho từng variant + log
    for (const { plan, data } of variantReads) {
      if (!data) continue;
      const newStock = data.stockQuantity - plan.quantity;
      const newStatus: ProductVariant["status"] =
        newStock === 0 ? "out-of-stock" : newStock <= 5 ? "low-stock" : "in-stock";
      tx.update(plan.ref, { stockQuantity: newStock, status: newStatus, updatedAt: serverTimestamp() });
      tx.set(doc(firestore, "inventoryTransactions", `log_sale_${order.id}_${data.id}`), {
        id: `log_sale_${order.id}_${data.id}`,
        productId: data.productId,
        productName: data.productName,
        variantId: data.id,
        color: data.color,
        size: data.size,
        changeType: "sale",
        quantityChanged: -plan.quantity,
        previousStock: data.stockQuantity,
        newStock,
        reason: `Bán hàng — đơn ${order.orderCode || order.id}`,
        createdAt: nowIso
      });
    }
  });
}

/**
 * Khách bấm "Tôi đã chuyển khoản":
 * - unpaid → pending_confirmation trên CẢ HAI order documents (write batch nguyên tử).
 * - Upsert shopNotifications/payment_reported_{orderId} (ID xác định — không tạo trùng).
 */
export async function reportPaymentTransferred(userId: string, order: LoggedOrder): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    throw new OrderCreationError("Không thể kết nối hệ thống. Vui lòng thử lại sau.");
  }
  const nowIso = new Date().toISOString();
  const patch = {
    paymentStatus: "pending_confirmation" as const,
    paymentReportedAt: nowIso,
    updatedAt: nowIso
  };
  const notification: ShopNotification = {
    id: `payment_reported_${order.id}`,
    type: "payment_reported",
    orderId: order.id,
    orderCode: order.orderCode || order.id,
    userId,
    customerName: order.customerName ?? "Khách hàng",
    amount: order.totalPrice,
    read: false,
    createdAt: nowIso,
    updatedAt: nowIso
  };
  const batch = writeBatch(db);
  batch.update(doc(db, "orders", order.id), patch);
  batch.update(doc(db, "users", userId, "orders", order.id), patch);
  batch.set(doc(db, "shopNotifications", notification.id), notification);
  await batch.commit();
}

/** Đơn của một khách — real-time, mới nhất trước. */
export function subscribeToUserOrders(
  userId: string,
  onChange: (orders: LoggedOrder[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured || !db) return () => {};
  return onSnapshot(
    query(collection(db, "users", userId, "orders"), orderBy("time", "desc")),
    (snapshot) => onChange(snapshot.docs.map((docSnap) => docSnap.data() as LoggedOrder)),
    (error) => {
      console.warn(`[subscribeToUserOrders] users/${userId}/orders ${error.code}: ${error.message}`);
      onError?.(error);
    }
  );
}

/**
 * @deprecated Giữ lại cho tương thích cũ — luồng chính dùng createOrderInFirestore.
 * Mirror một chiều users/{uid}/orders, nuốt lỗi để checkout local không gãy.
 */
export async function mirrorOrderToFirestore(userId: string, order: LoggedOrder): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await setDoc(doc(db, "users", userId, "orders", order.id), {
      ...order,
      userId,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn("[firestoreOrders] mirrorOrderToFirestore lỗi, đơn giữ local:", error);
  }
}
