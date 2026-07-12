import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  writeBatch,
  Unsubscribe
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { LoggedOrder, ProductVariant, ShopNotification } from "../types";
import { resolveVariantPlans } from "./firestoreOrders";

/**
 * Toàn bộ đơn cho admin — đọc từ collection gốc `orders` (mọi đơn mới đều được
 * ghi vào đây song song với users/{uid}/orders). Real-time, mới nhất trước.
 */
export function subscribeToAllOrdersForAdmin(onChange: (orders: LoggedOrder[]) => void): Unsubscribe {
  if (!isFirebaseConfigured || !db) return () => {};
  return onSnapshot(
    query(collection(db, "orders"), orderBy("time", "desc")),
    (snapshot) => onChange(snapshot.docs.map((docSnap) => docSnap.data() as LoggedOrder)),
    (error) => console.warn("[firestoreOrdersAdmin] subscribeToAllOrdersForAdmin lỗi:", error)
  );
}

function bothOrderRefs(userId: string, orderId: string) {
  if (!db) throw new Error("Firestore chưa khởi tạo");
  return {
    rootRef: doc(db, "orders", orderId),
    userRef: doc(db, "users", userId, "orders", orderId)
  };
}

/**
 * Đổi trạng thái vận hành trên CẢ HAI order documents.
 * - COD chuyển "Hoàn tất" → tự động paymentStatus = "paid" + paidAt.
 * - KHÔNG dùng cho "Đã hủy" — hủy phải qua cancelOrderAndRestock (hoàn kho).
 */
export async function updateOrderStatusEverywhere(
  userId: string,
  orderId: string,
  status: LoggedOrder["status"],
  order?: LoggedOrder
): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const nowIso = new Date().toISOString();
  const patch: Record<string, string> = { status, updatedAt: nowIso };
  if (status === "Hoàn tất" && order?.paymentMethod === "cod") {
    patch.paymentStatus = "paid";
    patch.paidAt = nowIso;
  }
  const { rootRef, userRef } = bothOrderRefs(userId, orderId);
  const batch = writeBatch(db);
  batch.update(rootRef, patch);
  batch.update(userRef, patch);
  await batch.commit();
}

/**
 * Hủy đơn + hoàn kho NGUYÊN TỬ và IDEMPOTENT:
 * - Transaction đọc trạng thái hiện tại; nếu đã "Đã hủy" thì thoát (không hoàn kho lần 2).
 * - Cộng lại stockQuantity từng variant + log "return".
 * - Cập nhật cả hai order documents trong cùng transaction.
 */
export async function cancelOrderAndRestock(userId: string, orderId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const firestore = db;
  const { rootRef, userRef } = bothOrderRefs(userId, orderId);

  // Query variant refs phải chạy ngoài transaction (transaction không query được)
  const rootSnap = await getDoc(rootRef);
  if (!rootSnap.exists()) return;
  const currentOrder = rootSnap.data() as LoggedOrder;
  if (currentOrder.status === "Đã hủy") return;
  const variantPlans = await resolveVariantPlans(currentOrder.items);
  const nowIso = new Date().toISOString();

  await runTransaction(firestore, async (tx) => {
    // Đọc lại trong transaction để chống race
    const freshSnap = await tx.get(rootRef);
    if (!freshSnap.exists()) return;
    const fresh = freshSnap.data() as LoggedOrder;
    if (fresh.status === "Đã hủy") return; // idempotent — không hoàn kho lần 2

    const variantReads: { plan: { ref: typeof rootRef; quantity: number }; data: ProductVariant | null }[] = [];
    for (const plan of variantPlans) {
      const snap = await tx.get(plan.ref);
      variantReads.push({
        plan: { ref: plan.ref, quantity: plan.quantity },
        data: snap.exists() ? (snap.data() as ProductVariant) : null
      });
    }

    const patch = { status: "Đã hủy" as const, updatedAt: nowIso };
    tx.update(rootRef, patch);
    tx.update(userRef, patch);

    for (const { plan, data } of variantReads) {
      if (!data) continue;
      const newStock = data.stockQuantity + plan.quantity;
      const newStatus: ProductVariant["status"] =
        newStock === 0 ? "out-of-stock" : newStock <= 5 ? "low-stock" : "in-stock";
      tx.update(plan.ref, { stockQuantity: newStock, status: newStatus, updatedAt: serverTimestamp() });
      tx.set(doc(firestore, "inventoryTransactions", `log_cancel_${orderId}_${data.id}`), {
        id: `log_cancel_${orderId}_${data.id}`,
        productId: data.productId,
        productName: data.productName,
        variantId: data.id,
        color: data.color,
        size: data.size,
        changeType: "return",
        quantityChanged: plan.quantity,
        previousStock: data.stockQuantity,
        newStock,
        reason: `Hoàn kho — hủy đơn ${currentOrder.orderCode || orderId}`,
        createdAt: nowIso
      });
    }
  });
}

/** Admin bấm "Đã nhận tiền" — pending_confirmation → paid trên cả hai documents. */
export async function confirmPaymentReceived(userId: string, orderId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const nowIso = new Date().toISOString();
  const patch = { paymentStatus: "paid" as const, paidAt: nowIso, updatedAt: nowIso };
  const { rootRef, userRef } = bothOrderRefs(userId, orderId);
  const batch = writeBatch(db);
  batch.update(rootRef, patch);
  batch.update(userRef, patch);
  // Đánh dấu đã xử lý notification tương ứng (nếu có)
  batch.set(
    doc(db, "shopNotifications", `payment_reported_${orderId}`),
    { read: true, updatedAt: nowIso },
    { merge: true }
  );
  await batch.commit();
}

/**
 * Admin bấm "Chưa nhận được" — quay về unpaid, GIỮ paymentReportedAt,
 * KHÔNG tạo paidAt, KHÔNG hoàn kho. Khách có thể báo chuyển khoản lại.
 */
export async function markPaymentNotReceived(userId: string, orderId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const nowIso = new Date().toISOString();
  const patch = { paymentStatus: "unpaid" as const, updatedAt: nowIso };
  const { rootRef, userRef } = bothOrderRefs(userId, orderId);
  const batch = writeBatch(db);
  batch.update(rootRef, patch);
  batch.update(userRef, patch);
  batch.set(
    doc(db, "shopNotifications", `payment_reported_${orderId}`),
    { read: true, updatedAt: nowIso },
    { merge: true }
  );
  await batch.commit();
}

/** Thông báo shop (khách báo chuyển khoản) — real-time, mới nhất trước. */
export function subscribeToShopNotifications(onChange: (items: ShopNotification[]) => void): Unsubscribe {
  if (!isFirebaseConfigured || !db) return () => {};
  return onSnapshot(
    query(collection(db, "shopNotifications"), orderBy("updatedAt", "desc")),
    (snapshot) => onChange(snapshot.docs.map((docSnap) => docSnap.data() as ShopNotification)),
    (error) => console.warn("[firestoreOrdersAdmin] subscribeToShopNotifications lỗi:", error)
  );
}

export async function markShopNotificationRead(notificationId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await updateDoc(doc(db, "shopNotifications", notificationId), {
      read: true,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn("[firestoreOrdersAdmin] markShopNotificationRead lỗi:", error);
  }
}

/**
 * @deprecated Dùng updateOrderStatusEverywhere / cancelOrderAndRestock thay thế.
 * Giữ lại cho tương thích: chỉ cập nhật phía users/{uid}/orders.
 */
export async function updateOrderStatusInFirestore(
  userId: string,
  orderId: string,
  status: LoggedOrder["status"]
): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await updateDoc(doc(db, "users", userId, "orders", orderId), { status, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.warn("[firestoreOrdersAdmin] updateOrderStatusInFirestore lỗi:", error);
  }
}
