import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { Feedback } from "../types";

export interface SubmitFeedbackInput {
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
}

export async function submitFeedbackToFirestore(input: SubmitFeedbackInput): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await addDoc(collection(db, "feedback"), {
      userId: input.userId,
      userName: input.userName,
      userEmail: input.userEmail,
      message: input.message,
      status: "new",
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn("submitFeedbackToFirestore failed:", error);
  }
}

export function subscribeToAllFeedback(onChange: (items: Feedback[]) => void): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const unsubscribe = onSnapshot(
      query(collection(db, "feedback"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const items: Feedback[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            userId: data.userId,
            userName: data.userName,
            userEmail: data.userEmail,
            message: data.message,
            status: data.status,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : ""
          } as Feedback;
        });
        onChange(items);
      },
      (error) => console.warn("subscribeToAllFeedback failed:", error)
    );
    return unsubscribe;
  } catch (error) {
    console.warn("subscribeToAllFeedback setup failed:", error);
    return () => {};
  }
}

export async function setFeedbackStatus(
  feedbackId: string,
  status: "read" | "resolved"
): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await updateDoc(doc(db, "feedback", feedbackId), { status });
  } catch (error) {
    console.warn("setFeedbackStatus failed:", error);
  }
}
