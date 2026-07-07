import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

const SETTINGS_DOC = "blogCategories";

export function subscribeToBlogCategories(onChange: (categories: string[]) => void): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const unsubscribe = onSnapshot(
      doc(db, "settings", SETTINGS_DOC),
      (snapshot) => {
        const data = snapshot.data();
        if (data && Array.isArray(data.categories)) onChange(data.categories);
      },
      (error) => console.warn("subscribeToBlogCategories failed:", error)
    );
    return unsubscribe;
  } catch (error) {
    console.warn("subscribeToBlogCategories setup failed:", error);
    return () => {};
  }
}

export async function saveBlogCategoriesToFirestore(categories: string[]): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await setDoc(doc(db, "settings", SETTINGS_DOC), { categories });
  } catch (error) {
    console.warn("saveBlogCategoriesToFirestore failed, kept local-only:", error);
  }
}
