import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  runTransaction
} from "firebase/firestore";
import { InventoryLog, ProductVariant } from "../types";
import { getVariant, updateVariantFields } from "./variantService";

const INVENTORY_TRANSACTIONS_COLLECTION = "inventoryTransactions";

/**
 * Subscribe to all inventory transactions in real-time.
 * CHỈ dùng ở trang admin — Firestore Rules yêu cầu role staff (admin/product_manager/
 * store_manager/auditor) mới đọc được collection này.
 */
export function subscribeToInventoryTransactions(
  callback: (logs: InventoryLog[]) => void,
  onError?: (error: import("firebase/firestore").FirestoreError) => void
): Unsubscribe {
  if (!db) return () => {};
  const q = query(collection(db, INVENTORY_TRANSACTIONS_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const logs = snap.docs.map((doc) => doc.data() as InventoryLog);
      callback(logs);
    },
    (error) => {
      console.warn(`[subscribeToInventoryTransactions] ${INVENTORY_TRANSACTIONS_COLLECTION} ${error.code}: ${error.message}`);
      onError?.(error);
    }
  );
}

/**
 * Subscribe to inventory transactions for a specific variant.
 */
export function subscribeToVariantTransactions(variantId: string, callback: (logs: InventoryLog[]) => void): Unsubscribe {
  if (!db) return () => {};
  const q = query(
    collection(db, INVENTORY_TRANSACTIONS_COLLECTION),
    where("variantId", "==", variantId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const logs = snap.docs.map((doc) => doc.data() as InventoryLog);
    callback(logs);
  });
}

/**
 * Get all inventory transactions (one-time read).
 */
export async function getInventoryTransactions(): Promise<InventoryLog[]> {
  if (!db) return [];
  const q = query(collection(db, INVENTORY_TRANSACTIONS_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data() as InventoryLog);
}

/**
 * Adjust variant stock using a Firestore transaction.
 * This ensures atomicity: the stock is read, modified, and the log is written in a single transaction.
 * Returns the updated variant and the created log entry.
 */
export async function adjustVariantStock(
  variantId: string,
  change: number,
  reason: string,
  changeType: "restock" | "sale" | "adjustment" | "return"
): Promise<{ variant: ProductVariant; log: InventoryLog }> {
  if (!db) throw new Error("Firestore not initialized");

  const variantRef = doc(db, "productVariants", variantId);
  const logsRef = collection(db, INVENTORY_TRANSACTIONS_COLLECTION);

  return runTransaction(db, async (transaction) => {
    const variantSnap = await transaction.get(variantRef);
    if (!variantSnap.exists()) {
      throw new Error(`Variant ${variantId} not found`);
    }

    const variant = variantSnap.data() as ProductVariant;
    const previousStock = variant.stockQuantity;
    const newStock = Math.max(0, previousStock + change);

    if (newStock < 0) {
      throw new Error("Stock cannot be negative");
    }

    const newStatus: ProductVariant["status"] =
      newStock === 0 ? "out-of-stock" : newStock <= 5 ? "low-stock" : "in-stock";

    // Update variant
    transaction.update(variantRef, {
      stockQuantity: newStock,
      status: newStatus,
      updatedAt: serverTimestamp()
    });

    // Create inventory log
    const log: InventoryLog = {
      id: `log_inv_${Date.now()}`,
      productId: variant.productId,
      productName: variant.productName,
      variantId: variant.id,
      color: variant.color,
      size: variant.size,
      changeType,
      quantityChanged: change,
      previousStock,
      newStock,
      reason,
      createdAt: new Date().toISOString()
    };

    const logRef = doc(logsRef, log.id);
    transaction.set(logRef, log);

    return {
      variant: { ...variant, stockQuantity: newStock, status: newStatus },
      log
    };
  });
}
