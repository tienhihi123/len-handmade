import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { Category } from "../types";

export function subscribeToCategories(onChange: (categories: Category[]) => void): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const unsubscribe = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        const items: Category[] = snapshot.docs.map((docSnap) => docSnap.data() as Category);
        onChange(items);
      },
      (error) => console.warn("subscribeToCategories failed:", error)
    );
    return unsubscribe;
  } catch (error) {
    console.warn("subscribeToCategories setup failed:", error);
    return () => {};
  }
}

export async function upsertCategoryToFirestore(category: Category): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await setDoc(doc(db, "categories", category.id), category);
  } catch (error) {
    console.warn("upsertCategoryToFirestore failed, category kept local-only:", error);
  }
}

export async function deleteCategoryFromFirestore(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await deleteDoc(doc(db, "categories", id));
  } catch (error) {
    console.warn("deleteCategoryFromFirestore failed:", error);
  }
}
