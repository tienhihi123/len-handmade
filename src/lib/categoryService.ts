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
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  Unsubscribe
} from "firebase/firestore";
import { Category } from "../types";

const CATEGORIES_COLLECTION = "categories";

/**
 * Subscribe to all categories in real-time.
 */
export function subscribeToCategories(callback: (categories: Category[]) => void): Unsubscribe {
  if (!db) return () => {};
  const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("name"));
  return onSnapshot(q, (snap) => {
    const cats = snap.docs.map((doc) => doc.data() as Category);
    callback(cats);
  });
}

/**
 * Get all categories (one-time read).
 */
export async function getCategories(): Promise<Category[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, CATEGORIES_COLLECTION));
  return snap.docs.map((doc) => doc.data() as Category);
}

/**
 * Get a single category by ID.
 */
export async function getCategory(id: string): Promise<Category | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, CATEGORIES_COLLECTION, id));
  if (!snap.exists()) return null;
  return snap.data() as Category;
}

/**
 * Create or update a category.
 */
export async function upsertCategory(category: Category): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  const catRef = doc(db, CATEGORIES_COLLECTION, category.id);
  await setDoc(catRef, { ...category, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * Delete a category by ID.
 */
export async function deleteCategory(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
}
