import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { WalletTransaction } from "../types";

export const PAGE_SIZE = 20;

// Phase B: CHỈ đọc và hiển thị ledger. KHÔNG có hàm ghi (earn/spend/refund/adjustment)
// trong service này — client không được tự tạo transaction. Khi có trusted backend
// (Cloud Function) để tính/ghi số dư an toàn, hàm ghi sẽ được thêm ở phase riêng.

function mapWalletDoc(docSnap: QueryDocumentSnapshot<DocumentData>): WalletTransaction {
  const data = docSnap.data();
  const createdAt = data.createdAt as { toDate?: () => Date } | undefined;
  return {
    id: docSnap.id,
    type: data.type,
    amount: data.amount,
    balanceBefore: data.balanceBefore,
    balanceAfter: data.balanceAfter,
    description: data.description,
    referenceType: data.referenceType,
    referenceId: data.referenceId,
    idempotencyKey: data.idempotencyKey,
    createdAt: createdAt?.toDate ? createdAt.toDate().toISOString() : ""
  };
}

/** Trang đầu, real-time, mới nhất trước, giới hạn pageSize (mặc định 20). */
export function subscribeToMyWalletTransactions(
  userId: string,
  onChange: (transactions: WalletTransaction[], lastDoc: QueryDocumentSnapshot<DocumentData> | null) => void,
  onError?: (error: Error) => void,
  pageSize: number = PAGE_SIZE
): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const unsubscribe = onSnapshot(
      query(collection(db, "users", userId, "walletTransactions"), orderBy("createdAt", "desc"), limit(pageSize)),
      (snapshot) => {
        onChange(snapshot.docs.map(mapWalletDoc), snapshot.docs[snapshot.docs.length - 1] ?? null);
      },
      (error) => {
        console.warn(`[subscribeToMyWalletTransactions] users/${userId}/walletTransactions ${error.code}: ${error.message}`);
        onError?.(error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn("[walletService] subscribeToMyWalletTransactions setup failed:", error);
    onError?.(error instanceof Error ? error : new Error(String(error)));
    return () => {};
  }
}

/** Trang kế tiếp — cursor pagination bằng startAfter(lastDoc), một lần (không real-time). */
export async function fetchMoreWalletTransactions(
  userId: string,
  afterDoc: QueryDocumentSnapshot<DocumentData>,
  pageSize: number = PAGE_SIZE
): Promise<{ items: WalletTransaction[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  if (!isFirebaseConfigured || !db) return { items: [], lastDoc: null };
  const snapshot = await getDocs(
    query(collection(db, "users", userId, "walletTransactions"), orderBy("createdAt", "desc"), startAfter(afterDoc), limit(pageSize))
  );
  return { items: snapshot.docs.map(mapWalletDoc), lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null };
}
