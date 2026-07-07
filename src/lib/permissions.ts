import { StaffRoleId, StaffStatus, UserRole } from "../types";
import { findStaffByEmail } from "../data/staff.mock";

// ============================================================
// CENTRAL PERMISSION MAP
// Never write `user.role === "admin"` in feature code.
// Always call hasStaffPermission(staff, "products.update").
// ============================================================

export const PERMISSION_KEYS = [
  "dashboard.view",

  "products.view", "products.create", "products.update", "products.publish", "products.archive", "products.delete",

  "categories.view", "categories.create", "categories.update", "categories.archive",

  "inventory.view", "inventory.adjust", "inventory.import", "inventory.export",

  "orders.view", "orders.update_status", "orders.assign", "orders.cancel", "orders.request_cancel",
  "orders.refund", "orders.request_refund", "orders.export",

  "payments.view", "payments.reconcile", "payments.refund",

  "returns.view", "returns.review", "returns.approve", "returns.reject",

  "customers.view", "customers.update", "customers.block", "customers.export",

  "reviews.view", "reviews.approve", "reviews.hide", "reviews.delete", "reviews.reply",

  "feedback.view", "feedback.assign", "feedback.update", "feedback.close",

  "coupons.view", "coupons.create", "coupons.update", "coupons.disable",

  "points.view", "points.adjust", "points.request_adjust",

  "blog.view", "blog.create", "blog.update", "blog.publish", "blog.archive",

  "banners.view", "banners.create", "banners.update", "banners.publish", "banners.archive",

  "notifications.view", "notifications.create", "notifications.manage",

  "reports.view", "reports.export",

  "staff.view", "staff.create", "staff.update", "staff.disable",

  "roles.view", "roles.assign",

  "settings.view", "settings.update",

  "audit.view"
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const STAFF_ROLE_LABELS: Record<StaffRoleId, string> = {
  admin: "Quản trị viên",
  store_manager: "Quản lý cửa hàng",
  product_inventory_manager: "Quản lý sản phẩm và kho",
  order_operations: "Nhân viên xử lý đơn hàng",
  customer_support: "Chăm sóc khách hàng",
  content_marketing_manager: "Quản lý nội dung và Marketing",
  review_moderator: "Kiểm duyệt đánh giá",
  finance_reporting: "Tài chính và Báo cáo",
  auditor: "Kiểm toán viên"
};

// Dashboard landing route per role, used right after successful staff login.
export const STAFF_ROLE_DASHBOARD_PATH: Record<StaffRoleId, string> = {
  admin: "/admin",
  store_manager: "/admin/operations",
  product_inventory_manager: "/admin/products-dashboard",
  order_operations: "/admin/orders-dashboard",
  customer_support: "/admin/support-dashboard",
  content_marketing_manager: "/admin/marketing-dashboard",
  review_moderator: "/admin/reviews-dashboard",
  finance_reporting: "/admin/finance-dashboard",
  auditor: "/admin/audit-dashboard"
};

const ALL_PERMISSIONS: PermissionKey[] = [...PERMISSION_KEYS];

// Role -> permission matrix. "admin" gets every key (highest role, nothing above it).
export const ROLE_PERMISSIONS: Record<StaffRoleId, PermissionKey[]> = {
  admin: ALL_PERMISSIONS,

  store_manager: [
    "dashboard.view",
    "products.view", "products.update",
    "categories.view",
    "inventory.view", "inventory.adjust",
    "orders.view", "orders.update_status", "orders.assign",
    "customers.view",
    "coupons.view", "coupons.create", "coupons.update", "coupons.disable",
    "reviews.view",
    "reports.view",
    "notifications.view",
    "settings.view"
  ],

  product_inventory_manager: [
    "dashboard.view",
    "products.view", "products.create", "products.update", "products.publish", "products.archive",
    "categories.view", "categories.create", "categories.update", "categories.archive",
    "inventory.view", "inventory.adjust", "inventory.import", "inventory.export",
    "reports.view"
  ],

  order_operations: [
    "dashboard.view",
    "orders.view", "orders.update_status", "orders.assign", "orders.request_cancel", "orders.export",
    "customers.view"
  ],

  customer_support: [
    "dashboard.view",
    "customers.view",
    "orders.view", "orders.request_cancel", "orders.request_refund",
    "returns.view", "returns.review",
    "feedback.view", "feedback.assign", "feedback.update", "feedback.close",
    "points.view", "points.request_adjust",
    "reviews.view", "reviews.reply"
  ],

  content_marketing_manager: [
    "dashboard.view",
    "blog.view", "blog.create", "blog.update", "blog.publish", "blog.archive",
    "banners.view", "banners.create", "banners.update", "banners.publish", "banners.archive",
    "coupons.view", "coupons.create", "coupons.update", "coupons.disable",
    "reports.view",
    "customers.view"
  ],

  review_moderator: [
    "dashboard.view",
    "reviews.view", "reviews.approve", "reviews.hide", "reviews.delete", "reviews.reply",
    "feedback.view"
  ],

  finance_reporting: [
    "dashboard.view",
    "payments.view", "payments.reconcile", "payments.refund",
    "returns.view",
    "orders.view", "orders.refund", "orders.export",
    "points.view",
    "coupons.view",
    "reports.view", "reports.export"
  ],

  auditor: [
    "dashboard.view",
    "products.view",
    "inventory.view",
    "orders.view",
    "customers.view",
    "reports.view",
    "audit.view",
    "roles.view",
    "staff.view"
  ]
};

export interface StaffLike {
  roleId: StaffRoleId;
  status: StaffStatus;
}

/** Central permission check. Never inline `role === "admin"` in feature code. */
export function hasStaffPermission(staff: StaffLike | null | undefined, key: PermissionKey): boolean {
  if (!staff) return false;
  if (staff.status !== "active") return false;
  const perms = ROLE_PERMISSIONS[staff.roleId];
  if (!Array.isArray(perms)) return false;
  return perms.includes(key);
}

export function hasAnyStaffPermission(staff: StaffLike | null | undefined, keys: PermissionKey[]): boolean {
  return keys.some((k) => hasStaffPermission(staff, k));
}

export function isStaffActive(staff: StaffLike | null | undefined): boolean {
  return !!staff && staff.status === "active";
}

// ============================================================
// LEGACY ROLE MIGRATION
// The old system used a flat UserRole array on DemoUser
// (admin, store_owner, marketing_staff, inventory_staff, order_staff,
// content_staff, customer). Map those onto the 9 new staff roles so
// existing demo accounts keep working while the new permission system
// becomes the single source of truth for /admin access.
// This adapter is temporary — see src/data/staff.mock.ts header comment.
// ============================================================
/**
 * Used by the customer-facing /login flow: if the authenticated email
 * belongs to an active staff member, send them to their role dashboard
 * instead of the storefront account page. Non-staff (or inactive staff)
 * always land on /account — this endpoint never blocks login.
 */
export function resolvePostLoginRedirect(email: string): string {
  const staff = findStaffByEmail(email);
  if (staff && staff.status === "active") {
    return STAFF_ROLE_DASHBOARD_PATH[staff.roleId];
  }
  return "/account";
}

export const LEGACY_ROLE_MIGRATION_MAP: Partial<Record<UserRole, StaffRoleId>> = {
  admin: "admin",
  store_owner: "store_manager",
  inventory_staff: "product_inventory_manager",
  order_staff: "order_operations",
  marketing_staff: "content_marketing_manager",
  content_staff: "content_marketing_manager"
  // "customer" intentionally has no staff role mapping.
};
