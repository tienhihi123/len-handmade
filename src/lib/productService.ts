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
import { Product } from "../types";

const PRODUCTS_COLLECTION = "products";

/**
 * Subscribe to all products in real-time.
 */
export function subscribeToProducts(callback: (products: Product[]) => void): Unsubscribe {
  if (!db) return () => {};
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("name"));
  return onSnapshot(q, (snap) => {
    const products = snap.docs.map((doc) => doc.data() as Product);
    callback(products);
  });
}

/**
 * Subscribe to products filtered by category.
 */
export function subscribeToProductsByCategory(category: string, callback: (products: Product[]) => void): Unsubscribe {
  if (!db) return () => {};
  const q = query(collection(db, PRODUCTS_COLLECTION), where("category", "==", category), orderBy("name"));
  return onSnapshot(q, (snap) => {
    const products = snap.docs.map((doc) => doc.data() as Product);
    callback(products);
  });
}

/**
 * Get all products (one-time read).
 */
export async function getProducts(): Promise<Product[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
  return snap.docs.map((doc) => doc.data() as Product);
}

/**
 * Get a single product by ID.
 */
export async function getProduct(id: string): Promise<Product | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
  if (!snap.exists()) return null;
  return snap.data() as Product;
}

/**
 * Create or update a product.
 */
export async function upsertProduct(product: Product): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  const prodRef = doc(db, PRODUCTS_COLLECTION, product.id);
  await setDoc(prodRef, { ...product, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * Update specific fields of a product.
 */
export async function updateProductFields(id: string, fields: Partial<Product>): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  const prodRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(prodRef, { ...fields, updatedAt: serverTimestamp() });
}

/**
 * Delete a product by ID.
 * WARNING: Firestore rules prevent direct deletion if the product has been ordered.
 */
export async function deleteProduct(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}

/**
 * Batch update multiple products.
 */
export async function batchUpdateProducts(updates: { id: string; fields: Partial<Product> }[]): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  const batch = writeBatch(db);
  updates.forEach(({ id, fields }) => {
    const prodRef = doc(db, PRODUCTS_COLLECTION, id);
    batch.update(prodRef, { ...fields, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}
