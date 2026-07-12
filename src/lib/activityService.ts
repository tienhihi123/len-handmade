import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { FirestoreActivityType, FirestoreUserActivityLog } from "../types";

export const PAGE_SIZE = 20;

function mapActivityDoc(docSnap: QueryDocumentSnapshot<DocumentData>): FirestoreUserActivityLog {
  const data = docSnap.data();
  const createdAt = data.createdAt as { toDate?: () => Date } | undefined;
  return {
    id: docSnap.id,
    type: data.type,
    title: data.title,
    description: data.description,
    referenceId: data.referenceId,
    metadata: data.metadata,
    createdAt: createdAt?.toDate ? createdAt.toDate().toISOString() : ""
  };
}

/**
 * Ghi 1 dòng lịch sử hoạt động — CHỈ gọi SAU KHI hành động chính đã thành công
 * (không ghi trước transaction chính). Chỉ để hiển thị lịch sử cho khách xem lại,
 * KHÔNG phải security audit log hay dữ liệu kế toán đáng tin cậy.
 * Không bao giờ đưa password/token/API key/secret vào description hoặc metadata.
 */
export async function logActivity(
  userId: string,
  type: FirestoreActivityType,
  title: string,
  description: string,
  referenceId?: string,
  metadata?: Record<string, string | number | boolean | null>
): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await addDoc(collection(db, "users", userId, "activityLogs"), {
      type,
      title,
      description,
      ...(referenceId ? { referenceId } : {}),
      ...(metadata ? { metadata } : {}),
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn("[activityService] logActivity failed:", error);
  }
}

/** Trang đầu, real-time, mới nhất trước, giới hạn pageSize (mặc định 20). */
export function subscribeToMyActivityLogs(
  userId: string,
  onChange: (logs: FirestoreUserActivityLog[], lastDoc: QueryDocumentSnapshot<DocumentData> | null) => void,
  onError?: (error: Error) => void,
  pageSize: number = PAGE_SIZE
): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const unsubscribe = onSnapshot(
      query(collection(db, "users", userId, "activityLogs"), orderBy("createdAt", "desc"), limit(pageSize)),
      (snapshot) => {
        onChange(snapshot.docs.map(mapActivityDoc), snapshot.docs[snapshot.docs.length - 1] ?? null);
      },
      (error) => {
        console.warn(`[subscribeToMyActivityLogs] users/${userId}/activityLogs ${error.code}: ${error.message}`);
        onError?.(error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn("[activityService] subscribeToMyActivityLogs setup failed:", error);
    onError?.(error instanceof Error ? error : new Error(String(error)));
    return () => {};
  }
}

/** Trang kế tiếp — cursor pagination bằng startAfter(lastDoc), một lần (không real-time). */
export async function fetchMoreActivityLogs(
  userId: string,
  afterDoc: QueryDocumentSnapshot<DocumentData>,
  pageSize: number = PAGE_SIZE
): Promise<{ items: FirestoreUserActivityLog[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  if (!isFirebaseConfigured || !db) return { items: [], lastDoc: null };
  const snapshot = await getDocs(
    query(collection(db, "users", userId, "activityLogs"), orderBy("createdAt", "desc"), startAfter(afterDoc), limit(pageSize))
  );
  return { items: snapshot.docs.map(mapActivityDoc), lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null };
}
