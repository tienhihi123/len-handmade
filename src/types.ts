export interface Variant {
  id: string;
  name: string;
  value: string;
  priceModifier?: number;
  stock: number;
}

export interface CustomizationOption {
  color: string;
  size: string;
  material: string;
  quantity: number;
  stock: number;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  price: number;
  priceLabel?: string;
  priceMin?: number;
  priceMax?: number;
  requiresQuote?: boolean;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: "Bán chạy" | "Mới" | "Thủ công" | "Custom";
  image: string;
  images?: string[];           // gallery of multiple images
  caption?: string;            // social-media style caption
  shopNote?: string;
  tags?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  stockStatus?: "in-stock" | "made-to-order" | "out-of-stock";
  videoEmbed?: string;         // raw iframe embed HTML for video
  patternBy?: string;          // pattern credit (e.g. @lulubunny319)
  category: string;
  description: string;
  material: string;
  colors: { name: string; hex: string; image?: string }[];
  sizes: string[];
  materials: { name: string; priceModifier: number }[];
  stock: number;
}

// Extended ProductVariant for per-variant stock management
export interface ProductVariant {
  id: string;
  productId: string;
  productName: string;
  color: string;
  size: string;
  material: string;
  price: number;
  stockQuantity: number;
  sku: string;
  status: "in-stock" | "out-of-stock" | "low-stock";
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export interface Review {
  id: string;
  productId?: string;
  userId?: string;
  status?: "pending" | "approved" | "hidden";
  author: string;
  text: string;
  rating: number;
  role: string;
  avatar: string;
  date: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  status: "new" | "read" | "resolved";
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  content?: string;
}

export interface CartItem {
  id: string; // unique cart item id (productId + color + size + material)
  product: Product;
  selectedColor: string;
  selectedSize: string;
  selectedMaterial: string;
  quantity: number;
  customMeasurements?: {
    note: string;         // custom size/measurement note (e.g. "Dài 65cm, rộng 40cm, quai dài 25cm")
  };
}

export type UserRole =
  | "admin"
  | "store_owner"
  | "marketing_staff"
  | "inventory_staff"
  | "order_staff"
  | "content_staff"
  | "customer";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: "active" | "locked";
  avatar: string;
  createdAt: string;
  lastLoginAt: string;
  totalLoginCount: number;
  coins?: number;
}

// Customer data structure (for Admin management)
export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

export interface LoggedOrder {
  id: string;
  // Set when mirrored to Firestore (users/{userId}/orders/{id}); lets admin
  // screens address the right subcollection for status updates.
  userId?: string;
  orderCode: string;
  name: string;
  itemsCount: number;
  totalPrice: number;
  time: string;
  status: "Chờ xác nhận" | "Đã xác nhận" | "Đang chuẩn bị hàng" | "Đang giao" | "Hoàn tất" | "Đã hủy";
  shippingAddress?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  discountApplied?: number;
  coinsUsed?: number;
  paymentMethod?: "cod" | "banking" | "vietqr" | "momo";
  note?: string;
  items?: OrderItemDetail[];
}

export interface OrderItemDetail {
  productId: string;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  subtotal: number;
  customMeasurements?: {
    note: string;
  };
}

// Notification for order status changes
export interface OrderNotification {
  id: string;
  orderId: string;
  orderCode: string;
  type: "confirmed" | "preparing" | "shipping" | "completed" | "cancelled";
  receiver: string; // email or phone
  message: string;
  status: "sent" | "pending" | "failed";
  channel: "email" | "telegram" | "sms";
  createdAt: string;
}

// Inventory log for stock changes
export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  variantId?: string;
  color?: string;
  size?: string;
  changeType: "restock" | "sale" | "adjustment" | "return";
  quantityChanged: number;
  previousStock: number;
  newStock: number;
  reason: string;
  createdAt: string;
}

// Revenue data for charts
export interface RevenueDataPoint {
  date: string;       // YYYY-MM-DD
  revenue: number;
  orders: number;
  label?: string;     // display label
}

export interface TopProduct {
  productId: string;
  productName: string;
  category: string;
  totalSold: number;
  totalRevenue: number;
  image: string;
}

// ============================================================
// STAFF / CONTROL PANEL RBAC DATA MODEL
// ============================================================

// The 9 fixed staff roles. "admin" is the highest role — nothing outranks it.
export type StaffRoleId =
  | "admin"
  | "store_manager"
  | "product_inventory_manager"
  | "order_operations"
  | "customer_support"
  | "content_marketing_manager"
  | "review_moderator"
  | "finance_reporting"
  | "auditor";

export type StaffStatus = "invited" | "active" | "suspended" | "disabled";

// Mirrors the intended Firestore doc at staff/{uid}.
// Client code must never write roleId/status directly — those go through
// the assignRole / updateStaffStatus Cloud Functions (see functions/src).
export interface StaffDoc {
  uid: string;
  email: string;
  displayName: string;
  avatar: string;
  roleId: StaffRoleId;
  status: StaffStatus;
  assignedBy: string;
  assignedAt: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Mirrors the intended Firestore doc at auditLogs/{id}. Append-only.
export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: StaffRoleId;
  action: string;
  module: string;
  targetId?: string;
  targetType?: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
  result: "success" | "failure";
  createdAt: string;
}

export type OrderStatusV2 =
  | "pending_payment"
  | "payment_confirmed"
  | "processing"
  | "ready_to_ship"
  | "shipping"
  | "delivered"
  | "completed"
  | "cancel_requested"
  | "cancelled"
  | "return_requested"
  | "return_approved"
  | "returned"
  | "refund_pending"
  | "refunded";

export type SupportTicketStatus = "new" | "in_progress" | "waiting_customer" | "resolved" | "closed";
export type SupportTicketPriority = "low" | "normal" | "high" | "urgent";

export interface SupportTicket {
  id: string;
  customerUid: string;
  subject: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  relatedOrderCode?: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  assignedTo?: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

// Firestore doc at supportTickets/{id}/messages/{messageId} — two-way chat thread.
export interface TicketMessage {
  id: string;
  ticketId: string;
  senderRole: "customer" | "admin";
  senderName: string;
  body: string;
  createdAt: string;
}

export type RefundRequestStatus = "requested" | "reviewing" | "approved" | "rejected" | "processing" | "completed";

export interface RefundRequest {
  id: string;
  orderId: string;
  orderCode: string;
  customerName: string;
  amount: number;
  reason: string;
  status: RefundRequestStatus;
  requestedBy: string;
  createdAt: string;
  processedBy?: string;
  processedAt?: string;
  idempotencyKey: string;
}
