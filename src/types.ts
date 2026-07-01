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
