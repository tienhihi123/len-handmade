import { collectionGroup, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { LoggedOrder } from "../types";

// Admin-side view across every customer's orders, via a collectionGroup
// query on users/*/orders — no separate top-level orders mirror needed,
// the existing per-user orders subcollection rule already grants staff
// read access for any uid.
export function subscribeToAllOrdersForAdmin(onChange: (orders: LoggedOrder[]) => void): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const unsubscribe = onSnapshot(
      query(collectionGroup(db, "orders"), orderBy("time", "desc")),
      (snapshot) => {
        const items: LoggedOrder[] = snapshot.docs.map((docSnap) => docSnap.data() as LoggedOrder);
        onChange(items);
      },
      (error) => console.warn("subscribeToAllOrdersForAdmin failed:", error)
    );
    return unsubscribe;
  } catch (error) {
    console.warn("subscribeToAllOrdersForAdmin setup failed:", error);
    return () => {};
  }
}

export async function updateOrderStatusInFirestore(
  userId: string,
  orderId: string,
  status: LoggedOrder["status"]
): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await updateDoc(doc(db, "users", userId, "orders", orderId), { status });
  } catch (error) {
    console.warn("updateOrderStatusInFirestore failed:", error);
  }
}
