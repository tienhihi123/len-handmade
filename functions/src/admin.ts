import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps } from "firebase-admin/app";

// ============================================================
// NOT DEPLOYED — source only, staged for when the project is on the
// Blaze plan. These callable functions are the ONLY place staff/{uid}
// (role/status) and other privileged writes are allowed to change; the
// matching firestore.rules deny all of these from the client directly.
//
// Every function here:
//   - requires the caller to be an authenticated, active staff member;
//   - re-validates the actor's permission against the *live* staff/{uid}
//     doc (never trusts the caller's custom claims alone, since claims
//     only refresh on next token mint);
//   - writes an auditLogs/{id} entry (append-only, before/after, reason);
//   - protects the last active Admin from demotion/disable/delete.
// ============================================================

if (getApps().length === 0) {
  initializeApp();
}
const db = getFirestore();
const auth = getAuth();

const STAFF_ROLES = [
  "admin", "store_manager", "product_inventory_manager", "order_operations",
  "customer_support", "content_marketing_manager", "review_moderator",
  "finance_reporting", "auditor"
] as const;
type StaffRoleId = (typeof STAFF_ROLES)[number];

interface StaffDoc {
  uid: string;
  email: string;
  displayName: string;
  roleId: StaffRoleId;
  status: "invited" | "active" | "suspended" | "disabled";
  assignedBy: string;
  assignedAt: string;
  updatedAt: string;
  createdAt: string;
}

async function requireActiveStaff(request: CallableRequest, allowedRoles?: StaffRoleId[]) {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Bạn cần đăng nhập.");
  const snap = await db.collection("staff").doc(uid).get();
  if (!snap.exists) throw new HttpsError("permission-denied", "Tài khoản này không phải nhân viên.");
  const staff = snap.data() as StaffDoc;
  if (staff.status !== "active") throw new HttpsError("permission-denied", "Tài khoản nhân viên không hoạt động.");
  if (allowedRoles && !allowedRoles.includes(staff.roleId)) {
    throw new HttpsError("permission-denied", "Vai trò hiện tại không có quyền thực hiện thao tác này.");
  }
  return staff;
}

async function countActiveAdmins(): Promise<number> {
  const snap = await db.collection("staff").where("roleId", "==", "admin").where("status", "==", "active").get();
  return snap.size;
}

async function writeAuditLog(entry: {
  actorId: string; actorName: string; actorRole: string; action: string; module: string;
  targetId?: string; targetType?: string; before?: unknown; after?: unknown; reason?: string;
  result: "success" | "failure";
}) {
  await db.collection("auditLogs").add({ ...entry, createdAt: FieldValue.serverTimestamp() });
}

// ---------------- assignRole ----------------
export const assignRole = onCall(async (request) => {
  const actor = await requireActiveStaff(request, ["admin"]);
  const { targetUid, nextRoleId, reason } = request.data as { targetUid: string; nextRoleId: StaffRoleId; reason: string };
  if (!targetUid || !nextRoleId || !reason?.trim()) {
    throw new HttpsError("invalid-argument", "Thiếu targetUid, nextRoleId hoặc reason.");
  }
  if (!STAFF_ROLES.includes(nextRoleId)) throw new HttpsError("invalid-argument", "Role không hợp lệ.");

  const targetRef = db.collection("staff").doc(targetUid);
  const targetSnap = await targetRef.get();
  if (!targetSnap.exists) throw new HttpsError("not-found", "Không tìm thấy nhân viên.");
  const before = targetSnap.data() as StaffDoc;

  if (before.roleId === "admin" && before.status === "active" && nextRoleId !== "admin") {
    if ((await countActiveAdmins()) <= 1) {
      await writeAuditLog({
        actorId: actor.uid, actorName: actor.displayName, actorRole: actor.roleId,
        action: "staff.assign_role", module: "roles", targetId: targetUid, targetType: "staff",
        before, reason, result: "failure"
      });
      throw new HttpsError("failed-precondition", "Không thể hạ quyền Admin đang hoạt động cuối cùng.");
    }
  }

  const after = { ...before, roleId: nextRoleId, assignedBy: actor.uid, assignedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  await targetRef.set(after, { merge: true });
  await auth.setCustomUserClaims(targetUid, { role: nextRoleId, staffStatus: before.status, permVersion: Date.now() });
  await writeAuditLog({
    actorId: actor.uid, actorName: actor.displayName, actorRole: actor.roleId,
    action: "staff.assign_role", module: "roles", targetId: targetUid, targetType: "staff",
    before, after, reason, result: "success"
  });
  return { ok: true };
});

// ---------------- updateStaffStatus ----------------
export const updateStaffStatus = onCall(async (request) => {
  const actor = await requireActiveStaff(request, ["admin"]);
  const { targetUid, nextStatus, reason } = request.data as { targetUid: string; nextStatus: StaffDoc["status"]; reason: string };
  if (!targetUid || !nextStatus || !reason?.trim()) {
    throw new HttpsError("invalid-argument", "Thiếu targetUid, nextStatus hoặc reason.");
  }

  const targetRef = db.collection("staff").doc(targetUid);
  const targetSnap = await targetRef.get();
  if (!targetSnap.exists) throw new HttpsError("not-found", "Không tìm thấy nhân viên.");
  const before = targetSnap.data() as StaffDoc;

  const isDeactivating = nextStatus === "suspended" || nextStatus === "disabled";
  if (before.roleId === "admin" && before.status === "active" && isDeactivating) {
    if ((await countActiveAdmins()) <= 1) {
      await writeAuditLog({
        actorId: actor.uid, actorName: actor.displayName, actorRole: actor.roleId,
        action: "staff.update_status", module: "staff", targetId: targetUid, targetType: "staff",
        before, reason, result: "failure"
      });
      throw new HttpsError("failed-precondition", "Không thể khóa/vô hiệu hóa Admin đang hoạt động cuối cùng.");
    }
  }

  const after = { ...before, status: nextStatus, updatedAt: new Date().toISOString() };
  await targetRef.set(after, { merge: true });
  await auth.setCustomUserClaims(targetUid, { role: before.roleId, staffStatus: nextStatus, permVersion: Date.now() });
  await writeAuditLog({
    actorId: actor.uid, actorName: actor.displayName, actorRole: actor.roleId,
    action: "staff.update_status", module: "staff", targetId: targetUid, targetType: "staff",
    before, after, reason, result: "success"
  });
  return { ok: true };
});

// ---------------- processRefund ----------------
export const processRefund = onCall(async (request) => {
  const actor = await requireActiveStaff(request, ["admin", "finance_reporting"]);
  const { refundId, approve, reason } = request.data as { refundId: string; approve: boolean; reason: string };
  if (!refundId || !reason?.trim()) throw new HttpsError("invalid-argument", "Thiếu refundId hoặc reason.");

  const ref = db.collection("refundRequests").doc(refundId);
  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Không tìm thấy yêu cầu hoàn tiền.");
    const before = snap.data()!;

    // Idempotency: a refund that already reached a terminal state cannot be processed again.
    if (before.status === "completed" || before.status === "rejected") {
      throw new HttpsError("failed-precondition", "Yêu cầu này đã được xử lý (idempotency).");
    }

    const after = {
      ...before,
      status: approve ? "completed" : "rejected",
      processedBy: actor.uid,
      processedAt: new Date().toISOString()
    };
    tx.set(ref, after, { merge: true });
    return { before, after };
  });

  await writeAuditLog({
    actorId: actor.uid, actorName: actor.displayName, actorRole: actor.roleId,
    action: approve ? "payments.refund_approved" : "payments.refund_rejected", module: "payments",
    targetId: refundId, targetType: "refundRequest", before: result.before, after: result.after, reason, result: "success"
  });
  return { ok: true };
});

// ---------------- adjustPoints ----------------
export const adjustPoints = onCall(async (request) => {
  const actor = await requireActiveStaff(request, ["admin", "finance_reporting"]);
  const { customerId, delta, reason } = request.data as { customerId: string; delta: number; reason: string };
  if (!customerId || !Number.isFinite(delta) || !reason?.trim()) {
    throw new HttpsError("invalid-argument", "Thiếu customerId, delta hoặc reason.");
  }

  const customerRef = db.collection("customers").doc(customerId);
  const txRef = db.collection("pointsTransactions").doc();
  const after = await db.runTransaction(async (tx) => {
    const snap = await tx.get(customerRef);
    if (!snap.exists) throw new HttpsError("not-found", "Không tìm thấy khách hàng.");
    const before = snap.data()!;
    const nextBalance = (before.coins || 0) + delta;
    if (nextBalance < 0) throw new HttpsError("failed-precondition", "Số dư Xu không thể âm.");
    tx.set(customerRef, { coins: nextBalance }, { merge: true });
    tx.set(txRef, {
      id: txRef.id, userId: customerId, delta, reason, adjustedBy: actor.uid, createdAt: new Date().toISOString()
    });
    return { before: before.coins || 0, after: nextBalance };
  });

  await writeAuditLog({
    actorId: actor.uid, actorName: actor.displayName, actorRole: actor.roleId,
    action: "points.adjust", module: "points", targetId: customerId, targetType: "customer",
    before: { coins: after.before }, after: { coins: after.after }, reason, result: "success"
  });
  return { ok: true, balance: after.after };
});

// ---------------- adjustInventory (large/important adjustments) ----------------
export const adjustInventory = onCall(async (request) => {
  const actor = await requireActiveStaff(request, ["admin", "product_inventory_manager"]);
  const { sku, quantityChanged, reason } = request.data as { sku: string; quantityChanged: number; reason: string };
  if (!sku || !Number.isFinite(quantityChanged) || !reason?.trim()) {
    throw new HttpsError("invalid-argument", "Thiếu sku, quantityChanged hoặc reason.");
  }

  const invRef = db.collection("inventory").doc(sku);
  const logRef = db.collection("inventoryTransactions").doc();
  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(invRef);
    if (!snap.exists) throw new HttpsError("not-found", "Không tìm thấy SKU.");
    const before = snap.data()!;
    const newStock = (before.stockQuantity || 0) + quantityChanged;
    if (newStock < 0) throw new HttpsError("failed-precondition", "Tồn kho không thể âm.");
    tx.set(invRef, { stockQuantity: newStock }, { merge: true });
    tx.set(logRef, {
      id: logRef.id, sku, quantityChanged, previousStock: before.stockQuantity || 0, newStock,
      reason, changeType: "adjustment", createdBy: actor.uid, createdAt: new Date().toISOString()
    });
    return { before: before.stockQuantity || 0, newStock };
  });

  await writeAuditLog({
    actorId: actor.uid, actorName: actor.displayName, actorRole: actor.roleId,
    action: "inventory.adjust", module: "inventory", targetId: sku, targetType: "inventory",
    before: { stockQuantity: result.before }, after: { stockQuantity: result.newStock }, reason, result: "success"
  });
  return { ok: true, stockQuantity: result.newStock };
});

// ---------------- updatePaymentStatus ----------------
export const updatePaymentStatus = onCall(async (request) => {
  const actor = await requireActiveStaff(request, ["admin", "finance_reporting"]);
  const { paymentId, nextStatus, reason } = request.data as { paymentId: string; nextStatus: string; reason: string };
  if (!paymentId || !nextStatus || !reason?.trim()) throw new HttpsError("invalid-argument", "Thiếu paymentId, nextStatus hoặc reason.");

  const ref = db.collection("payments").doc(paymentId);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError("not-found", "Không tìm thấy giao dịch thanh toán.");
  const before = snap.data()!;
  const after = { ...before, status: nextStatus, updatedAt: new Date().toISOString(), updatedBy: actor.uid };
  await ref.set(after, { merge: true });

  await writeAuditLog({
    actorId: actor.uid, actorName: actor.displayName, actorRole: actor.roleId,
    action: "payments.update_status", module: "payments", targetId: paymentId, targetType: "payment",
    before, after, reason, result: "success"
  });
  return { ok: true };
});

// ---------------- exportSensitiveData ----------------
// Generates a signed, time-limited export rather than handing raw rows back
// to the client — never inline plaintext PII/financial data in the response.
export const exportSensitiveData = onCall(async (request) => {
  const actor = await requireActiveStaff(request, ["admin", "finance_reporting"]);
  const { dataset, reason } = request.data as { dataset: "customers" | "orders" | "payments"; reason: string };
  if (!dataset || !reason?.trim()) throw new HttpsError("invalid-argument", "Thiếu dataset hoặc reason.");

  await writeAuditLog({
    actorId: actor.uid, actorName: actor.displayName, actorRole: actor.roleId,
    action: "reports.export", module: dataset, reason, result: "success"
  });

  // TODO once on Blaze: stream `dataset` to a Cloud Storage object with a
  // short-lived signed URL and return that URL instead of raw data.
  throw new HttpsError("unimplemented", "Xuất dữ liệu nhạy cảm cần Cloud Storage + Blaze plan — chưa triển khai.");
});
