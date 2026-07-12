import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  writeBatch
} from "firebase/firestore";
import { ProductVariant } from "../types";

const VARIANTS_COLLECTION = "productVariants";

/**
 * Subscribe to all variants in real-time.
 */
export function subscribeToVariants(callback: (variants: ProductVariant[]) => void): Unsubscribe {
  if (!db) return () => {};
  const q = query(collection(db, VARIANTS_COLLECTION), orderBy("productName"));
  return onSnapshot(
    q,
    (snap) => {
      const variants = snap.docs.map((doc) => doc.data() as ProductVariant);
      callback(variants);
    },
    (error) => console.warn(`[subscribeToVariants] ${VARIANTS_COLLECTION} ${error.code}: ${error.message}`)
  );
}

/**
 * Subscribe to variants for a specific product.
 */
export function subscribeToProductVariants(productId: string, callback: (variants: ProductVariant[]) => void): Unsubscribe {
  if (!db) return () => {};
  const q = query(collection(db, VARIANTS_COLLECTION), where("productId", "==", productId));
  return onSnapshot(q, (snap) => {
    const variants = snap.docs.map((doc) => doc.data() as ProductVariant);
    callback(variants);
  });
}

/**
 * Get all variants (one-time read).
 */
export async function getVariants(): Promise<ProductVariant[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, VARIANTS_COLLECTION));
  return snap.docs.map((doc) => doc.data() as ProductVariant);
}

/**
 * Get a single variant by ID.
 */
export async function getVariant(id: string): Promise<ProductVariant | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, VARIANTS_COLLECTION, id));
  if (!snap.exists()) return null;
  return snap.data() as ProductVariant;
}

/**
 * Create or update a variant.
 */
export async function upsertVariant(variant: ProductVariant): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  const varRef = doc(db, VARIANTS_COLLECTION, variant.id);
  await setDoc(varRef, { ...variant, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * Update specific fields of a variant.
 */
export async function updateVariantFields(id: string, fields: Partial<ProductVariant>): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  const varRef = doc(db, VARIANTS_COLLECTION, id);
  await updateDoc(varRef, { ...fields, updatedAt: serverTimestamp() });
}

/**
 * Delete a variant by ID.
 */
export async function deleteVariant(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  await deleteDoc(doc(db, VARIANTS_COLLECTION, id));
}

/**
 * Batch update multiple variants.
 */
export async function batchUpdateVariants(updates: { id: string; fields: Partial<ProductVariant> }[]): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  const batch = writeBatch(db);
  updates.forEach(({ id, fields }) => {
    const varRef = doc(db, VARIANTS_COLLECTION, id);
    batch.update(varRef, { ...fields, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}
