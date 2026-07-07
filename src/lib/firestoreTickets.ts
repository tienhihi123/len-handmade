import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { SupportTicket, SupportTicketStatus, TicketMessage } from "../types";

export interface CreateTicketInput {
  customerUid: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subject: string;
  message: string;
  relatedOrderCode?: string;
}

export async function createTicketInFirestore(input: CreateTicketInput): Promise<string | null> {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const now = serverTimestamp();
    const ref = await addDoc(collection(db, "supportTickets"), {
      customerUid: input.customerUid,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone || "",
      relatedOrderCode: input.relatedOrderCode || "",
      subject: input.subject,
      status: "new" as SupportTicketStatus,
      priority: "normal",
      lastMessage: input.message,
      createdAt: now,
      updatedAt: now
    });
    await addDoc(collection(db, "supportTickets", ref.id, "messages"), {
      ticketId: ref.id,
      senderRole: "customer",
      senderName: input.customerName,
      body: input.message,
      createdAt: now
    });
    return ref.id;
  } catch (error) {
    console.warn("createTicketInFirestore failed, ticket kept local-only:", error);
    return null;
  }
}

function mapTicket(docSnap: any): SupportTicket {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    customerUid: data.customerUid || "",
    subject: data.subject,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone || "",
    relatedOrderCode: data.relatedOrderCode || undefined,
    status: data.status,
    priority: data.priority,
    assignedTo: data.assignedTo || undefined,
    lastMessage: data.lastMessage,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : "",
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : ""
  };
}

export function subscribeToTicketsForAdmin(onChange: (tickets: SupportTicket[]) => void): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const unsubscribe = onSnapshot(
      query(collection(db, "supportTickets"), orderBy("updatedAt", "desc")),
      (snapshot) => onChange(snapshot.docs.map(mapTicket)),
      (error) => console.warn("subscribeToTicketsForAdmin failed:", error)
    );
    return unsubscribe;
  } catch (error) {
    console.warn("subscribeToTicketsForAdmin setup failed:", error);
    return () => {};
  }
}

export function subscribeToMyTickets(customerUid: string, onChange: (tickets: SupportTicket[]) => void): () => void {
  if (!isFirebaseConfigured || !db || !customerUid) return () => {};
  try {
    const unsubscribe = onSnapshot(
      query(collection(db, "supportTickets"), where("customerUid", "==", customerUid)),
      (snapshot) => {
        const items = snapshot.docs.map(mapTicket);
        items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        onChange(items);
      },
      (error) => console.warn("subscribeToMyTickets failed:", error)
    );
    return unsubscribe;
  } catch (error) {
    console.warn("subscribeToMyTickets setup failed:", error);
    return () => {};
  }
}

export async function updateTicketStatusInFirestore(ticketId: string, status: SupportTicketStatus): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await updateDoc(doc(db, "supportTickets", ticketId), { status, updatedAt: serverTimestamp() });
  } catch (error) {
    console.warn("updateTicketStatusInFirestore failed:", error);
  }
}

export function subscribeToTicketMessages(
  ticketId: string,
  onChange: (messages: TicketMessage[]) => void
): () => void {
  if (!isFirebaseConfigured || !db || !ticketId) return () => {};
  try {
    const unsubscribe = onSnapshot(
      query(collection(db, "supportTickets", ticketId, "messages"), orderBy("createdAt", "asc")),
      (snapshot) => {
        const items: TicketMessage[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ticketId,
            senderRole: data.senderRole,
            senderName: data.senderName,
            body: data.body,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : ""
          };
        });
        onChange(items);
      },
      (error) => console.warn("subscribeToTicketMessages failed:", error)
    );
    return unsubscribe;
  } catch (error) {
    console.warn("subscribeToTicketMessages setup failed:", error);
    return () => {};
  }
}

export async function sendTicketMessage(
  ticketId: string,
  message: { senderRole: "customer" | "admin"; senderName: string; body: string }
): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    const now = serverTimestamp();
    await addDoc(collection(db, "supportTickets", ticketId, "messages"), {
      ticketId,
      ...message,
      createdAt: now
    });
    await setDoc(
      doc(db, "supportTickets", ticketId),
      {
        lastMessage: message.body,
        updatedAt: now,
        status: message.senderRole === "admin" ? "waiting_customer" : "in_progress"
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("sendTicketMessage failed:", error);
  }
}
