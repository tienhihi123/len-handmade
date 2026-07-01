import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { Review } from "../types";

export interface SubmitReviewInput {
  productId: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  text: string;
}

export async function submitReviewToFirestore(input: SubmitReviewInput): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await addDoc(collection(db, "products", input.productId, "reviews"), {
      productId: input.productId,
      userId: input.userId,
      authorName: input.authorName,
      authorAvatar: input.authorAvatar || "",
      rating: input.rating,
      text: input.text,
      status: "pending",
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn("submitReviewToFirestore failed, review kept local-only:", error);
  }
}

// Live product reviews (approved + the current user's own pending/hidden ones), mapped to the Review shape used across the app.
export function subscribeToProductReviews(
  productId: string,
  currentUserId: string | undefined,
  onChange: (reviews: Review[]) => void
): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const reviewsRef = collection(db, "products", productId, "reviews");
    const unsubscribe = onSnapshot(
      query(reviewsRef, orderBy("createdAt", "desc")),
      (snapshot) => {
        const items: Review[] = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              productId: data.productId,
              userId: data.userId,
              status: data.status,
              author: data.authorName,
              text: data.text,
              rating: data.rating,
              role: "Khách hàng",
              avatar: data.authorAvatar || "",
              date: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : ""
            } as Review;
          })
          .filter((r) => r.status === "approved" || r.userId === currentUserId);
        onChange(items);
      },
      (error) => console.warn("subscribeToProductReviews failed:", error)
    );
    return unsubscribe;
  } catch (error) {
    console.warn("subscribeToProductReviews setup failed:", error);
    return () => {};
  }
}

// All reviews across every product, for admin moderation.
export function subscribeToAllReviews(onChange: (reviews: Review[]) => void): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const unsubscribe = onSnapshot(
      query(collectionGroup(db, "reviews"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const items: Review[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            productId: data.productId,
            userId: data.userId,
            status: data.status,
            author: data.authorName,
            text: data.text,
            rating: data.rating,
            role: "Khách hàng",
            avatar: data.authorAvatar || "",
            date: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : ""
          } as Review;
        });
        onChange(items);
      },
      (error) => console.warn("subscribeToAllReviews failed:", error)
    );
    return unsubscribe;
  } catch (error) {
    console.warn("subscribeToAllReviews setup failed:", error);
    return () => {};
  }
}

export async function setReviewStatus(
  productId: string,
  reviewId: string,
  status: "approved" | "hidden"
): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await updateDoc(doc(db, "products", productId, "reviews", reviewId), { status });
  } catch (error) {
    console.warn("setReviewStatus failed:", error);
  }
}
