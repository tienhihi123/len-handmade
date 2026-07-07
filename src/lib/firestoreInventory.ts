import { collectionGroup, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { ProductVariant } from "../types";

export function subscribeToVariants(onChange: (variants: ProductVariant[]) => void): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const unsubscribe = onSnapshot(
      collectionGroup(db, "variants"),
      (snapshot) => {
        const items: ProductVariant[] = snapshot.docs.map((docSnap) => docSnap.data() as ProductVariant);
        onChange(items);
      },
      (error) => console.warn("subscribeToVariants failed:", error)
    );
    return unsubscribe;
  } catch (error) {
    console.warn("subscribeToVariants setup failed:", error);
    return () => {};
  }
}

export async function upsertVariantToFirestore(variant: ProductVariant): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await setDoc(doc(db, "products", variant.productId, "variants", variant.id), variant);
  } catch (error) {
    console.warn("upsertVariantToFirestore failed, variant kept local-only:", error);
  }
}
