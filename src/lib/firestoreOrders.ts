import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { LoggedOrder } from "../types";

// Mirrors a locally-created order into Firestore. Fails silently so
// checkout always succeeds off the local/localStorage order list even if
// Firestore rules haven't been deployed yet or the project isn't on Blaze.
export async function mirrorOrderToFirestore(userId: string, order: LoggedOrder): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    // Drop `undefined` optional fields (e.g. unset note) — the Firestore SDK
    // rejects them outright instead of just omitting the field.
    const sanitized = JSON.parse(JSON.stringify(order));
    await addDoc(collection(db, "users", userId, "orders"), {
      ...sanitized,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn("mirrorOrderToFirestore failed, order kept local-only:", error);
  }
}
