import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
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

function mapReviewDoc(docSnap: { id: string; data: () => Record<string, unknown> }): Review {
  const data = docSnap.data();
  const createdAt = data.createdAt as { toDate?: () => Date } | undefined;
  return {
    id: docSnap.id,
    productId: data.productId as string,
    userId: data.userId as string,
    status: data.status as Review["status"],
    author: data.authorName as string,
    text: data.text as string,
    rating: data.rating as number,
    role: "Khách hàng",
    avatar: (data.authorAvatar as string) || "",
    date: createdAt?.toDate ? createdAt.toDate().toISOString() : ""
  };
}

// Live product reviews (approved + the current user's own pending/hidden ones), mapped to the Review shape used across the app.
//
// Chạy 2 query riêng thay vì 1 query không lọc + filter phía client:
// Firestore CHẶN TOÀN BỘ "list" query nếu rule đọc theo điều kiện per-document
// (approved || chính chủ) mà query không tự giới hạn để đảm bảo mọi doc trả về
// đều thoả rule — dẫn tới lỗi permission-denied ngay cả với review đã duyệt.
// Query A (where status == "approved") khớp đúng nhánh rule công khai.
// Query B (where userId == currentUserId, chỉ chạy khi đã đăng nhập) khớp đúng
// nhánh rule "chính chủ". Không dùng orderBy phía Firestore (tránh cần composite
// index mới) — sắp xếp mới nhất trước được xử lý ở phía client (ProductDetailPage).
export function subscribeToProductReviews(
  productId: string,
  currentUserId: string | undefined,
  onChange: (reviews: Review[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  const reviewsRef = collection(db, "products", productId, "reviews");

  let approved: Review[] = [];
  let mine: Review[] = [];
  const emit = () => {
    const merged = new Map<string, Review>();
    for (const r of approved) merged.set(r.id, r);
    for (const r of mine) merged.set(r.id, r); // chính chủ ghi đè (đủ field, kể cả pending/hidden)
    onChange(Array.from(merged.values()));
  };

  const unsubscribers: (() => void)[] = [];
  try {
    unsubscribers.push(
      onSnapshot(
        query(reviewsRef, where("status", "==", "approved")),
        (snapshot) => {
          approved = snapshot.docs.map(mapReviewDoc);
          emit();
        },
        (error) => {
          console.warn("subscribeToProductReviews (approved) failed:", error.code, error.message);
          onError?.(error);
        }
      )
    );

    if (currentUserId) {
      unsubscribers.push(
        onSnapshot(
          query(reviewsRef, where("userId", "==", currentUserId)),
          (snapshot) => {
            mine = snapshot.docs.map(mapReviewDoc);
            emit();
          },
          (error) => {
            console.warn("subscribeToProductReviews (own) failed:", error.code, error.message);
            onError?.(error);
          }
        )
      );
    }
  } catch (error) {
    console.warn("subscribeToProductReviews setup failed:", error);
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }

  return () => unsubscribers.forEach((u) => u());
}

// Tất cả đánh giá của MỘT khách hàng, trên mọi sản phẩm ("Đánh giá của tôi").
// collectionGroup + where("userId","==",uid) khớp đúng nhánh "chính chủ" của rule
// products/{id}/reviews (existing().userId == request.auth.uid) — không cần đổi rule.
// Không dùng orderBy (tránh cần bật thêm Collection Group index cho createdAt+userId cùng lúc);
// sắp xếp mới nhất trước xử lý ở phía client.
export function subscribeToMyReviews(
  userId: string,
  onChange: (reviews: Review[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const unsubscribe = onSnapshot(
      query(collectionGroup(db, "reviews"), where("userId", "==", userId)),
      (snapshot) => {
        onChange(snapshot.docs.map(mapReviewDoc));
      },
      (error) => {
        console.warn("subscribeToMyReviews failed:", error.code, error.message);
        onError?.(error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn("subscribeToMyReviews setup failed:", error);
    onError?.(error instanceof Error ? error : new Error(String(error)));
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
