import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, serverTimestamp, Unsubscribe } from "firebase/firestore";
import { StaffDoc, StaffRoleId, StaffStatus } from "../types";

/**
 * Read staff/{uid} document to determine role and status.
 * Returns null if the document does not exist.
 */
export async function getStaffDoc(uid: string): Promise<StaffDoc | null> {
  if (!db) return null;
  try {
    const staffRef = doc(db, "staff", uid);
    const snap = await getDoc(staffRef);
    if (!snap.exists()) return null;
    return snap.data() as StaffDoc;
  } catch (error) {
    console.error("getStaffDoc error:", error);
    return null;
  }
}

/**
 * Check if the given uid has an active staff document with status "active".
 * Returns the staff document if active, otherwise null.
 */
export async function getActiveStaff(uid: string): Promise<StaffDoc | null> {
  const staff = await getStaffDoc(uid);
  if (!staff || staff.status !== "active") return null;
  return staff;
}

/**
 * Check if the given uid is a super_admin or admin with status "active".
 */
export async function isSuperAdmin(uid: string): Promise<boolean> {
  const staff = await getActiveStaff(uid);
  if (!staff) return false;
  return staff.roleId === "admin";
}

/**
 * Subscribe to the staff/{uid} document in real-time.
 * The callback is invoked whenever the document changes.
 */
export function subscribeToStaff(uid: string, callback: (staff: StaffDoc | null) => void): Unsubscribe {
  if (!db) return () => {};
  const staffRef = doc(db, "staff", uid);
  return onSnapshot(
    staffRef,
    (snap) => {
      if (!snap.exists()) {
        callback(null);
      } else {
        callback(snap.data() as StaffDoc);
      }
    },
    (error) => {
      // Permission denied, network error, or other Firestore error
      console.error("[staffService] subscribeToStaff error:", error);
      callback(null); // Treat error as "no staff document" — user will be unauthorized
    }
  );
}

/**
 * Create or update a staff document.
 * Only super_admin can call this.
 */
export async function upsertStaff(staff: Partial<StaffDoc> & { uid: string }): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  const staffRef = doc(db, "staff", staff.uid);
  await setDoc(staffRef, { ...staff, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * Update staff status (active, suspended, disabled).
 */
export async function updateStaffStatus(uid: string, status: StaffStatus): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  const staffRef = doc(db, "staff", uid);
  await updateDoc(staffRef, { status, updatedAt: serverTimestamp() });
}

/**
 * List all staff documents.
 * Returns empty array if Firestore is not initialized.
 */
export async function listStaff(): Promise<StaffDoc[]> {
  if (!db) return [];
  const staffCol = collection(db, "staff");
  const snap = await getDocs(staffCol);
  return snap.docs.map((doc) => doc.data() as StaffDoc);
}
