// ============================================================
// TEMPORARY CLIENT-SIDE STAFF ADAPTER
//
// The production design for this system is:
//   staff/{uid} in Firestore, roleId/status mutated only via the
//   assignRole / updateStaffStatus Cloud Functions (functions/src/admin.ts),
//   which also set the matching custom claims (role, staffStatus,
//   permVersion) so Firestore Rules can trust request.auth.token.*.
//
// That requires the project to be on the Blaze plan with Cloud Functions
// deployed. Until then, this module is the *only* source of staff/role
// data for the Control Panel, backed by localStorage. It intentionally
// mirrors the Firestore staff/{uid} + auditLogs/{id} shapes so swapping
// this adapter for real Firestore calls later is a small, mechanical diff.
//
// Turn this adapter off by deleting this file and the imports in
// src/context/AdminAuthContext.tsx once every staff member has a real
// Firestore staff/{uid} document and custom claims provisioned.
// ============================================================

import { AuditLogEntry, RefundRequest, StaffDoc, StaffRoleId, StaffStatus, SupportTicket } from "../types";
import { demoUsers } from "./authAndTracking.mock";
import { LEGACY_ROLE_MIGRATION_MAP } from "../lib/permissions";

const STAFF_KEY = "len_staff_directory_v1";
const AUDIT_KEY = "len_audit_logs_v1";
const TICKETS_KEY = "len_support_tickets_v1";
const REFUNDS_KEY = "len_refund_requests_v1";

function readJson<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Migration: seed the staff directory once from legacy demoUsers ----
function migrateLegacyStaff(): StaffDoc[] {
  const now = new Date().toISOString();
  const migrated: StaffDoc[] = [];
  demoUsers.forEach((u) => {
    const roleId = LEGACY_ROLE_MIGRATION_MAP[u.role];
    if (!roleId) return; // customers and unmapped roles are not staff
    migrated.push({
      uid: u.id,
      email: u.email.toLowerCase(),
      displayName: u.name,
      avatar: u.avatar,
      roleId,
      status: u.status === "locked" ? "suspended" : "active",
      assignedBy: "system_migration",
      assignedAt: now,
      lastLoginAt: u.lastLoginAt || null,
      createdAt: u.createdAt || now,
      updatedAt: now
    });
  });
  return migrated;
}

export function getStaffDirectory(): StaffDoc[] {
  const existing = localStorage.getItem(STAFF_KEY);
  if (existing) {
    try {
      return JSON.parse(existing) as StaffDoc[];
    } catch {
      /* fall through to re-seed */
    }
  }
  const seeded = migrateLegacyStaff();
  writeJson(STAFF_KEY, seeded);
  return seeded;
}

function saveStaffDirectory(list: StaffDoc[]): void {
  writeJson(STAFF_KEY, list);
}

export function findStaffByEmail(email: string): StaffDoc | null {
  const lower = email.toLowerCase().trim();
  return getStaffDirectory().find((s) => s.email === lower) || null;
}

export function findStaffByUid(uid: string): StaffDoc | null {
  return getStaffDirectory().find((s) => s.uid === uid) || null;
}

export function countActiveAdmins(list = getStaffDirectory()): number {
  return list.filter((s) => s.roleId === "admin" && s.status === "active").length;
}

export interface StaffMutationResult {
  ok: boolean;
  error?: string;
  staff?: StaffDoc;
}

interface Actor {
  uid: string;
  name: string;
  roleId: StaffRoleId;
}

export function inviteStaff(
  email: string,
  displayName: string,
  roleId: StaffRoleId,
  actor: Actor
): StaffMutationResult {
  const list = getStaffDirectory();
  const lower = email.toLowerCase().trim();
  if (list.some((s) => s.email === lower)) {
    return { ok: false, error: "Email này đã tồn tại trong danh sách nhân viên." };
  }
  const now = new Date().toISOString();
  const newStaff: StaffDoc = {
    uid: `staff_${Date.now()}`,
    email: lower,
    displayName: displayName.trim() || lower,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName || lower)}`,
    roleId,
    status: "invited",
    assignedBy: actor.uid,
    assignedAt: now,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now
  };
  const next = [newStaff, ...list];
  saveStaffDirectory(next);
  appendAuditLog({
    actorId: actor.uid,
    actorName: actor.name,
    actorRole: actor.roleId,
    action: "staff.invite",
    module: "staff",
    targetId: newStaff.uid,
    targetType: "staff",
    after: newStaff,
    reason: `Mời nhân viên mới với vai trò ${roleId}`,
    result: "success"
  });
  return { ok: true, staff: newStaff };
}

export function assignStaffRole(
  uid: string,
  nextRoleId: StaffRoleId,
  actor: Actor,
  reason: string
): StaffMutationResult {
  const list = getStaffDirectory();
  const target = list.find((s) => s.uid === uid);
  if (!target) return { ok: false, error: "Không tìm thấy nhân viên." };
  if (!reason.trim()) return { ok: false, error: "Bắt buộc nhập lý do thay đổi role." };

  // Protect the last active admin from being demoted.
  if (target.roleId === "admin" && target.status === "active" && nextRoleId !== "admin") {
    if (countActiveAdmins(list) <= 1) {
      appendAuditLog({
        actorId: actor.uid,
        actorName: actor.name,
        actorRole: actor.roleId,
        action: "staff.assign_role",
        module: "roles",
        targetId: uid,
        targetType: "staff",
        before: target,
        reason,
        result: "failure"
      });
      return { ok: false, error: "Không thể hạ quyền Admin đang hoạt động cuối cùng." };
    }
  }

  const before = { ...target };
  const now = new Date().toISOString();
  const updated: StaffDoc = { ...target, roleId: nextRoleId, assignedBy: actor.uid, assignedAt: now, updatedAt: now };
  const next = list.map((s) => (s.uid === uid ? updated : s));
  saveStaffDirectory(next);
  appendAuditLog({
    actorId: actor.uid,
    actorName: actor.name,
    actorRole: actor.roleId,
    action: "staff.assign_role",
    module: "roles",
    targetId: uid,
    targetType: "staff",
    before,
    after: updated,
    reason,
    result: "success"
  });
  return { ok: true, staff: updated };
}

export function updateStaffStatusLocal(
  uid: string,
  nextStatus: StaffStatus,
  actor: Actor,
  reason: string
): StaffMutationResult {
  const list = getStaffDirectory();
  const target = list.find((s) => s.uid === uid);
  if (!target) return { ok: false, error: "Không tìm thấy nhân viên." };
  if (!reason.trim()) return { ok: false, error: "Bắt buộc nhập lý do." };

  const isDeactivating = nextStatus === "suspended" || nextStatus === "disabled";
  if (target.roleId === "admin" && target.status === "active" && isDeactivating) {
    if (countActiveAdmins(list) <= 1) {
      appendAuditLog({
        actorId: actor.uid,
        actorName: actor.name,
        actorRole: actor.roleId,
        action: "staff.update_status",
        module: "staff",
        targetId: uid,
        targetType: "staff",
        before: target,
        reason,
        result: "failure"
      });
      return { ok: false, error: "Không thể khóa/vô hiệu hóa Admin đang hoạt động cuối cùng." };
    }
  }

  const before = { ...target };
  const now = new Date().toISOString();
  const updated: StaffDoc = { ...target, status: nextStatus, updatedAt: now };
  const next = list.map((s) => (s.uid === uid ? updated : s));
  saveStaffDirectory(next);
  appendAuditLog({
    actorId: actor.uid,
    actorName: actor.name,
    actorRole: actor.roleId,
    action: "staff.update_status",
    module: "staff",
    targetId: uid,
    targetType: "staff",
    before,
    after: updated,
    reason,
    result: "success"
  });
  return { ok: true, staff: updated };
}

export function touchStaffLastLogin(uid: string): void {
  const list = getStaffDirectory();
  const next = list.map((s) => (s.uid === uid ? { ...s, lastLoginAt: new Date().toISOString() } : s));
  saveStaffDirectory(next);
}

// ---- Audit log (append-only from the client's perspective) ----
export function getAuditLogs(): AuditLogEntry[] {
  return readJson<AuditLogEntry[]>(AUDIT_KEY, []);
}

export function appendAuditLog(entry: Omit<AuditLogEntry, "id" | "createdAt">): AuditLogEntry {
  const full: AuditLogEntry = {
    ...entry,
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString()
  };
  const list = getAuditLogs();
  writeJson(AUDIT_KEY, [full, ...list].slice(0, 500));
  return full;
}

// ---- Support tickets (Customer Support role dashboard) ----

// Starts empty (real tickets only) — demo fixtures are no longer seeded so
// admins only ever see tickets real customers actually submitted.
export function getSupportTickets(): SupportTicket[] {
  const existing = localStorage.getItem(TICKETS_KEY);
  if (existing) return JSON.parse(existing) as SupportTicket[];
  writeJson(TICKETS_KEY, []);
  return [];
}

export function saveSupportTickets(list: SupportTicket[]): void {
  writeJson(TICKETS_KEY, list);
}

// Appends a real ticket raised by a logged-in customer (e.g. from the Contact page).
export function submitSupportTicket(input: {
  customerUid?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subject: string;
  message: string;
  relatedOrderCode?: string;
}): SupportTicket {
  const now = new Date().toISOString();
  const ticket: SupportTicket = {
    id: `tic_${Date.now()}`,
    customerUid: input.customerUid || "",
    subject: input.subject,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone || "",
    relatedOrderCode: input.relatedOrderCode,
    status: "new",
    priority: "normal",
    lastMessage: input.message,
    createdAt: now,
    updatedAt: now
  };
  const list = getSupportTickets();
  saveSupportTickets([ticket, ...list]);
  return ticket;
}

// ---- Refund requests (Finance / Customer Support) ----
function seedRefundRequests(): RefundRequest[] {
  const now = Date.now();
  return [
    {
      id: "rf_001",
      orderId: "LH-20260617-006",
      orderCode: "LH-20260617-006",
      customerName: "Lê Bảo Trâm",
      amount: 420000,
      reason: "Sản phẩm lỗi chỉ, khách yêu cầu hoàn tiền thay vì đổi.",
      status: "requested",
      requestedBy: "staff_cs_1",
      createdAt: new Date(now - 20 * 3600 * 1000).toISOString(),
      idempotencyKey: "rf_001_LH-20260617-006"
    },
    {
      id: "rf_002",
      orderId: "LH-20260602-902",
      orderCode: "LH-20260602-902",
      customerName: "Khách hàng mộc mạc",
      amount: 100000,
      reason: "Giao trễ so với cam kết, khách hủy nhận hàng.",
      status: "completed",
      requestedBy: "staff_cs_1",
      processedBy: "user_admin",
      processedAt: new Date(now - 48 * 3600 * 1000).toISOString(),
      createdAt: new Date(now - 72 * 3600 * 1000).toISOString(),
      idempotencyKey: "rf_002_LH-20260602-902"
    }
  ];
}

export function getRefundRequests(): RefundRequest[] {
  const existing = localStorage.getItem(REFUNDS_KEY);
  if (existing) return JSON.parse(existing) as RefundRequest[];
  const seeded = seedRefundRequests();
  writeJson(REFUNDS_KEY, seeded);
  return seeded;
}

export function saveRefundRequests(list: RefundRequest[]): void {
  writeJson(REFUNDS_KEY, list);
}

/**
 * Client-side stand-in for the processRefund Cloud Function.
 * Enforces: idempotency (no double refund), and refunds >= 500,000đ
 * require admin or finance_reporting role.
 * Real enforcement MUST happen server-side once Cloud Functions are
 * deployed — see functions/src/admin.ts::processRefund.
 */
export function processRefundLocal(
  refundId: string,
  actor: Actor,
  approve: boolean,
  reason: string
): StaffMutationResult {
  const list = getRefundRequests();
  const target = list.find((r) => r.id === refundId);
  if (!target) return { ok: false, error: "Không tìm thấy yêu cầu hoàn tiền." };

  if (target.status === "completed" || target.status === "rejected") {
    return { ok: false, error: "Yêu cầu này đã được xử lý, không thể xử lý lại (idempotency)." };
  }

  const HIGH_VALUE_THRESHOLD = 500000;
  if (approve && target.amount >= HIGH_VALUE_THRESHOLD && actor.roleId !== "admin" && actor.roleId !== "finance_reporting") {
    return { ok: false, error: "Hoàn tiền từ 500.000đ trở lên chỉ Admin hoặc Tài chính được duyệt." };
  }

  const before = { ...target };
  const now = new Date().toISOString();
  const updated: RefundRequest = {
    ...target,
    status: approve ? "completed" : "rejected",
    processedBy: actor.uid,
    processedAt: now
  };
  const next = list.map((r) => (r.id === refundId ? updated : r));
  saveRefundRequests(next);
  appendAuditLog({
    actorId: actor.uid,
    actorName: actor.name,
    actorRole: actor.roleId,
    action: approve ? "payments.refund_approved" : "payments.refund_rejected",
    module: "payments",
    targetId: refundId,
    targetType: "refundRequest",
    before,
    after: updated,
    reason,
    result: "success"
  });
  return { ok: true };
}
