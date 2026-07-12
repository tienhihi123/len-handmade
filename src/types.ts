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
  // --- bổ sung cho verified-purchase review (không đổi tên field cũ ở trên) ---
  orderId?: string;
  variantId?: string;
  // Chỉ true khi purchasedItemKeys của một đơn "Hoàn tất" thuộc đúng user chứa
  // key `${productId}_${variantId ?? "default"}` này. Đơn cũ thiếu purchasedItemKeys
  // KHÔNG được suy luận ngược — field này sẽ vắng mặt (không auto gắn true/false).
  verifiedPurchase?: boolean;
  createdAt?: string; // ISO — song song với `date` (giữ `date` cho UI cũ)
  updatedAt?: string; // ISO
  adminReply?: {
    content: string;
    repliedBy: string;
    repliedAt: string; // ISO
  };
  moderationReason?: string; // bắt buộc nhập khi admin set status "hidden"
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
  // Vòng đời thanh toán — đơn cũ thiếu field này được hiểu là "unpaid" (?? "unpaid")
  paymentStatus?: "unpaid" | "pending_confirmation" | "paid" | "refunded";
  paymentReportedAt?: string; // ISO — khách bấm "Tôi đã chuyển khoản"
  paidAt?: string;            // ISO — shop xác nhận đã nhận tiền
  refundedAt?: string;        // ISO
  updatedAt?: string;         // ISO — lần cập nhật gần nhất
  // --- Hủy đơn: request (khách gửi/admin duyệt) tách khỏi trạng thái hủy cuối ---
  cancellationRequest?: OrderCancellationRequest;
  cancelledBy?: "customer" | "admin";
  cancellationReason?: string;
  cancelledAt?: string; // ISO
  // --- Verified-purchase review: key `${productId}_${variantId ?? "default"}` cho từng item.
  // Chỉ có trên đơn MỚI (ghi tại thời điểm tạo đơn) — đơn cũ thiếu field này sẽ undefined,
  // không được migrate/backfill tự động.
  purchasedItemKeys?: string[];
}

export type OrderCancellationStatus = "pending" | "approved" | "rejected";

export interface OrderCancellationRequest {
  status: OrderCancellationStatus;
  requestedBy: "customer" | "admin";
  requestReason: string;
  requestedAt: string; // ISO
  resolvedBy?: string;
  resolutionReason?: string;
  resolvedAt?: string; // ISO
}

// Thông báo cho shop (collection shopNotifications) — khách báo chuyển khoản
export interface ShopNotification {
  id: string;
  type: "payment_reported";
  orderId: string;
  orderCode: string;
  userId: string;
  customerName: string;
  amount: number;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDetail {
  productId: string;
  productName: string;
  productImage?: string; // snapshot tại thời điểm mua — đơn cũ có thể thiếu, cần fallback UI
  variantId?: string;
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

// ============================================================
// WALLET LEDGER (users/{uid}/walletTransactions/{id})
// Phase B (đợt này): chỉ đọc + hiển thị. Không có writer client-side cho
// earn/refund/adjustment trong scope này — xem ghi chú trong walletService.
// ============================================================
export type WalletTransactionType = "earn" | "spend" | "refund" | "adjustment";

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  referenceType?: "order" | "review" | "promotion" | "admin";
  referenceId?: string;
  idempotencyKey: string;
  createdAt: string; // ISO
}

// ============================================================
// ACTIVITY LOG (Firestore, users/{uid}/activityLogs/{id})
// Chỉ để hiển thị lịch sử hoạt động cho khách xem lại — KHÔNG phải security
// audit log hay dữ liệu kế toán đáng tin cậy (đó là vai trò của AuditLogEntry
// / Cloud Function ở tầng khác, ngoài scope). Đặt tên khác `UserActivityLog`
// (loại cũ ở src/data/authAndTracking.mock.ts, local-only) để tránh trùng.
// ============================================================
export type FirestoreActivityType =
  | "login"
  | "profile_updated"
  | "password_changed"
  | "order_created"
  | "payment_reported"
  | "cancellation_requested"
  | "order_cancelled"
  | "review_created"
  | "review_updated"
  | "balance_changed";

export interface FirestoreUserActivityLog {
  id: string;
  type: FirestoreActivityType;
  title: string;
  description: string;
  referenceId?: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: string; // ISO
}

// ============================================================
// UNIQUE PRODUCT VIEWS (productViews/{productId}_{uid})
// Nguồn sự thật duy nhất cho lượt xem duy nhất theo tài khoản đã đăng nhập.
// Chỉ tính cho user đã đăng nhập — không tính guest view trong phase này.
// ============================================================
export interface ProductUniqueView {
  productId: string;
  userId: string;
  firstViewedAt: string; // ISO
  lastViewedAt: string;  // ISO
  source?: "detail" | "search" | "category" | "home";
}
