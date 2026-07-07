import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { Product } from "../types";

export function subscribeToProducts(onChange: (products: Product[]) => void): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const items: Product[] = snapshot.docs.map((docSnap) => docSnap.data() as Product);
        onChange(items);
      },
      (error) => console.warn("subscribeToProducts failed:", error)
    );
    return unsubscribe;
  } catch (error) {
    console.warn("subscribeToProducts setup failed:", error);
    return () => {};
  }
}

// Full-document upsert, used when a product is first synced to Firestore.
export async function upsertProductToFirestore(product: Product): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    // Drop `undefined` optional fields (priceLabel, oldPrice, etc.) — the
    // Firestore SDK rejects them outright instead of just omitting them.
    const sanitized = JSON.parse(JSON.stringify(product));
    await setDoc(doc(db, "products", product.id), sanitized);
  } catch (error) {
    console.warn("upsertProductToFirestore failed, product kept local-only:", error);
  }
}

// Partial update for the admin edit form, which only ever changes name/price
// (and category, via the categories move-product tool) — never the rest of
// the product document.
export async function updateProductFieldsInFirestore(
  productId: string,
  fields: Partial<Pick<Product, "name" | "price" | "category" | "stock">>
): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    // merge:true so this also creates the doc the first time a seed-only
    // (never-synced) product is edited from the admin panel.
    await setDoc(doc(db, "products", productId), fields, { merge: true });
  } catch (error) {
    console.warn("updateProductFieldsInFirestore failed:", error);
  }
}
