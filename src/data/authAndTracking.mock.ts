import { Product } from "../types";
import chuaLanhTamHonImg from "../assets/images/chualanhtamhon.png";
import hangTangWImg from "../assets/images/hangtangw.png";

// Roles defined in specifications
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
  password?: string; // used for demo check
  role: UserRole;
  status: "active" | "locked";
  avatar: string;
  createdAt: string;
  lastLoginAt: string;
  totalLoginCount: number;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  targetId?: string;
  targetName?: string;
  targetType?: string;
  createdAt: string;
}

export interface ProductViewStats {
  productId: string;
  productName: string;
  category: string;
  totalViews: number;
  uniqueViewers: number;
  lastViewedAt: string;
  viewedByUserIds: string[];
}

export interface Coupon {
  code: string;
  name: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minOrderValue: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  applicableProducts: string[]; // ids
  applicableCategories: string[]; // names
  applicableRoles: UserRole[];
  status: "Nháp" | "Đang hoạt động" | "Đã lên lịch" | "Hết hạn" | "Đã tắt";
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  coinReward: number;
  conditionType: string;
  status: "Chưa làm" | "Đang làm" | "Có thể nhận thưởng" | "Đã nhận thưởng";
  period: string;
  limitCount: number;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  startDate: string;
  endDate: string;
  position: "Hero trang chủ" | "Dưới danh mục sản phẩm" | "Trang sản phẩm" | "Trang blog" | "Popup khuyến mãi";
  status: "Nháp" | "Đang hoạt động" | "Đã lên lịch" | "Hết hạn" | "Đã tắt";
  displayTarget: "tất cả" | "khách mới" | "khách đã đăng nhập" | "khách đã mua hàng";
}

export interface MarketingArticle {
  id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  content: string;
  tag: string;
  metaTitle: string;
  metaDescription: string;
  status: "nháp" | "đã xuất bản" | "đã lên lịch";
  date: string;
  author: string;
  ctaLink: string;
}

// ---------------------- MOCK DATA ----------------------

export const demoUsers: DemoUser[] = [
  {
    id: "user_admin",
    name: "Admin Tiệm Len Nhỏ",
    email: "admin@lenhandmade.vn",
    password: "123456",
    role: "admin",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    createdAt: "2026-01-01",
    lastLoginAt: "2026-05-30T07:15:00Z",
    totalLoginCount: 48
  },
  {
    id: "user_owner",
    name: "Chủ cửa hàng (Store Owner)",
    email: "owner@tiemlennho.vn",
    password: "123456",
    role: "store_owner",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
    createdAt: "2026-01-10",
    lastLoginAt: "2026-05-30T07:10:00Z",
    totalLoginCount: 35
  },
  {
    id: "user_marketing",
    name: "Nhân viên marketing (Marketing Staff)",
    email: "marketing@tiemlennho.vn",
    password: "123456",
    role: "marketing_staff",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    createdAt: "2026-02-01",
    lastLoginAt: "2026-05-29T16:00:00Z",
    totalLoginCount: 22
  },
  {
    id: "user_inventory",
    name: "Nhân viên kho (Inventory Staff)",
    email: "kho@tiemlennho.vn",
    password: "123456",
    role: "inventory_staff",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150",
    createdAt: "2026-01-15",
    lastLoginAt: "2026-05-30T06:45:00Z",
    totalLoginCount: 19
  },
  {
    id: "user_order",
    name: "Nhân viên xử lý đơn hỏa tốc",
    email: "donhang@tiemlennho.vn",
    password: "123456",
    role: "order_staff",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=150",
    createdAt: "2026-02-10",
    lastLoginAt: "2026-05-30T06:00:00Z",
    totalLoginCount: 42
  },
  {
    id: "user_content",
    name: "Nhân viên nội dung truyền thông",
    email: "content@tiemlennho.vn",
    password: "123456",
    role: "content_staff",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    createdAt: "2026-02-20",
    lastLoginAt: "2026-05-28T09:30:00Z",
    totalLoginCount: 15
  },
  {
    id: "user_customer",
    name: "Nàng thơ đan len (Khách hàng)",
    email: "khachhang@gmail.com",
    password: "123456",
    role: "customer",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    createdAt: "2026-03-01",
    lastLoginAt: "2026-05-30T07:00:00Z",
    totalLoginCount: 11
  },
  {
    id: "user_locked",
    name: "Khách bị khóa tuyển",
    email: "locked@tiemlennho.vn",
    password: "123456",
    role: "customer",
    status: "locked",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    createdAt: "2026-03-01",
    lastLoginAt: "2026-03-02T07:00:00Z",
    totalLoginCount: 1
  }
];

// Role redirections after authenticating
export const roleRedirects: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  store_owner: "/admin/dashboard",
  marketing_staff: "/admin/marketing",
  inventory_staff: "/admin/inventory",
  order_staff: "/admin/orders",
  content_staff: "/admin/blog",
  customer: "/account"
};

// Permissions config structure
export type PermissionType = string;

export const permissions: Record<UserRole, PermissionType[]> = {
  admin: ["all"],
  store_owner: [
    "view_dashboard",
    "manage_products",
    "manage_inventory",
    "manage_orders",
    "manage_staff",
    "view_reports",
    "manage_marketing",
    "manage_coupons",
    "manage_banners",
    "manage_missions",
    "manage_coins",
    "view_user_tracking",
    "view_product_analytics"
  ],
  marketing_staff: [
    "view_marketing_dashboard",
    "manage_marketing_articles",
    "manage_banners",
    "manage_coupons",
    "manage_campaigns",
    "manage_missions",
    "view_marketing_reports",
    "view_product_analytics"
  ],
  inventory_staff: [
    "view_products",
    "manage_inventory",
    "view_stock_history",
    "view_low_stock_products"
  ],
  order_staff: [
    "view_orders",
    "update_order_status",
    "manage_shipping",
    "view_customer_order_info"
  ],
  content_staff: [
    "manage_blog",
    "manage_seo",
    "manage_home_content",
    "manage_marketing_articles"
  ],
  customer: [
    "view_products",
    "manage_cart",
    "checkout",
    "view_own_orders",
    "create_return_request",
    "write_review",
    "use_coupon",
    "use_coins",
    "complete_missions"
  ]
};

// Menus items configuration per role
export interface MenuItem {
  name: string;
  path: string;
  icon: string;
}

export const roleMenus: Record<UserRole, MenuItem[]> = {
  admin: [
    { name: "Dashboard", path: "/admin/dashboard", icon: "LayoutDashboard" },
    { name: "Sản phẩm", path: "/admin/products", icon: "ShoppingBag" },
    { name: "Phòng Kho", path: "/admin/inventory", icon: "Boxes" },
    { name: "Đơn hàng", path: "/admin/orders", icon: "FileText" },
    { name: "Vận chuyển", path: "/admin/shipping", icon: "Truck" },
    { name: "Hoàn trả", path: "/admin/returns", icon: "Undo2" },
    { name: "Marketing", path: "/admin/marketing", icon: "Megaphone" },
    { name: "Banner", path: "/admin/banners", icon: "Image" },
    { name: "Mã giảm giá", path: "/admin/coupons", icon: "Ticket" },
    { name: "Quà Xu & Nhiệm vụ", path: "/admin/missions", icon: "Coins" },
    { name: "Blog & SEO", path: "/admin/blog", icon: "BookOpen" },
    { name: "Khách hàng", path: "/admin/customers", icon: "Users" },
    { name: "Hệ thống cài đặt", path: "/admin/settings", icon: "Settings" }
  ],
  store_owner: [
    { name: "Dashboard", path: "/admin/dashboard", icon: "LayoutDashboard" },
    { name: "Sản phẩm", path: "/admin/products", icon: "ShoppingBag" },
    { name: "Kho và Tồn", path: "/admin/inventory", icon: "Boxes" },
    { name: "Đơn hàng", path: "/admin/orders", icon: "FileText" },
    { name: "Hoàn hàng", path: "/admin/returns", icon: "Undo2" },
    { name: "Tiếp thị", path: "/admin/marketing", icon: "Megaphone" },
    { name: "Nhân lực", path: "/admin/staff", icon: "Users" }
  ],
  marketing_staff: [
    { name: "Tiếp thị Chung", path: "/admin/marketing", icon: "Megaphone" },
    { name: "Ảnh Banners", path: "/admin/banners", icon: "Image" },
    { name: "Quản lý Coupon", path: "/admin/coupons", icon: "Ticket" },
    { name: "Quà tặng Nhiệm vụ", path: "/admin/missions", icon: "Coins" },
    { name: "Bài viết PR", path: "/admin/marketing-articles", icon: "FileEdit" }
  ],
  inventory_staff: [
    { name: "Tủ Kho sắm", path: "/admin/inventory", icon: "Boxes" },
    { name: "Hàng mẫu", path: "/admin/products", icon: "ShoppingBag" },
    { name: "Lịch sử Kho", path: "/admin/inventory-history", icon: "ClipboardList" }
  ],
  order_staff: [
    { name: "Đơn hàng xử lý", path: "/admin/orders", icon: "FileText" },
    { name: "Hãng vận chuyển", path: "/admin/shipping", icon: "Truck" }
  ],
  content_staff: [
    { name: "Tạp chí Blog", path: "/admin/blog", icon: "BookOpen" },
    { name: "Tối ưu SEO", path: "/admin/seo", icon: "SearchCode" },
    { name: "Banner trang chủ", path: "/admin/banners", icon: "Image" },
    { name: "Bài truyền thông", path: "/admin/marketing-articles", icon: "FileEdit" }
  ],
  customer: [
    { name: "Hồ sơ của tôi", path: "/account", icon: "User" },
    { name: "Đơn mua", path: "/orders", icon: "ListFilter" },
    { name: "Ví voucher", path: "/account/vouchers", icon: "Ticket" },
    { name: "Kho tích Xu", path: "/account/coins", icon: "Coins" },
    { name: "Nhiệm vụ lấy xu", path: "/account/missions", icon: "Gamepad" },
    { name: "Gửi hoàn sửa đổi", path: "/returns", icon: "Undo2" }
  ]
};

// Route protection matrix based on Role
export const roleRouteAccess: Record<UserRole, string[]> = {
  admin: ["/admin/**", "/account", "/"],
  store_owner: ["/admin/dashboard", "/admin/products", "/admin/inventory", "/admin/orders", "/admin/returns", "/admin/marketing", "/admin/staff", "/account", "/"],
  marketing_staff: ["/admin/marketing", "/admin/banners", "/admin/coupons", "/admin/missions", "/admin/marketing-articles", "/account", "/"],
  inventory_staff: ["/admin/inventory", "/admin/products", "/admin/inventory-history", "/account", "/"],
  order_staff: ["/admin/orders", "/admin/shipping", "/account", "/"],
  content_staff: ["/admin/blog", "/admin/seo", "/admin/banners", "/admin/marketing-articles", "/account", "/"],
  customer: ["/account", "/account/vouchers", "/account/coins", "/account/missions", "/orders", "/returns", "/"]
};

// ---------------------- TRACKING & ACTIVITY LOGS STORED IN Memory ----------------------

export const userActivityLogs: UserActivityLog[] = [
  {
    id: "act_1",
    userId: "user_customer",
    userName: "Nàng thơ đan len",
    role: "customer",
    action: "login",
    createdAt: "2026-05-30T07:00:00Z"
  },
  {
    id: "act_2",
    userId: "user_customer",
    userName: "Nàng thơ đan len",
    role: "customer",
    action: "view_product",
    targetId: "prod_1",
    targetName: "Túi Len Hồng Handmade - Premium Edition",
    targetType: "product",
    createdAt: "2026-05-30T07:01:10Z"
  },
  {
    id: "act_3",
    userId: "user_admin",
    userName: "Admin Tiệm Len Nhỏ",
    role: "admin",
    action: "login",
    createdAt: "2026-05-30T07:15:00Z"
  }
];

// ---------------------- MOST VIEWED PRODUCTS STATS ----------------------

export const productViewStats: ProductViewStats[] = [
  {
    productId: "prod_1",
    productName: "Túi Len Hồng Handmade - Premium Edition",
    category: "Túi len handmade",
    totalViews: 840,
    uniqueViewers: 310,
    lastViewedAt: "2026-05-30T07:20:00Z",
    viewedByUserIds: ["user_customer"]
  },
  // Entries for products that are no longer available have been removed.
];

// Helper functions for user acts
export function addUserActivityLog(log: Omit<UserActivityLog, "id" | "createdAt">): UserActivityLog {
  const newLog: UserActivityLog = {
    ...log,
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString()
  };
  userActivityLogs.unshift(newLog);
  return newLog;
}

export function getUserActivityByUserId(userId: string): UserActivityLog[] {
  return userActivityLogs.filter(log => log.userId === userId);
}

export function getRecentUserActivities(limit = 10): UserActivityLog[] {
  return userActivityLogs.slice(0, limit);
}

export function getActivitiesByRole(role: UserRole): UserActivityLog[] {
  return userActivityLogs.filter(log => log.role === role);
}

// Helper functions for tracking products views
export function trackProductView(userId: string, productId: string, productName: string, category: string) {
  let stats = productViewStats.find(p => p.productId === productId);
  if (!stats) {
    stats = {
      productId,
      productName,
      category,
      totalViews: 0,
      uniqueViewers: 0,
      lastViewedAt: "",
      viewedByUserIds: []
    };
    productViewStats.push(stats);
  }
  stats.totalViews += 1;
  stats.lastViewedAt = new Date().toISOString();
  if (userId) {
    if (!stats.viewedByUserIds.includes(userId)) {
      stats.viewedByUserIds.push(userId);
      stats.uniqueViewers += 1;
    }
  } else {
    // Generate guest viewer logic
    stats.uniqueViewers += 1;
  }
  // Add log line as well
  addUserActivityLog({
    userId: userId || "guest",
    userName: userId ? (demoUsers.find(u => u.id === userId)?.name || "Khách ẩn") : "Khách vãng lai",
    role: userId ? (demoUsers.find(u => u.id === userId)?.role || "customer") : "customer",
    action: "view_product",
    targetId: productId,
    targetName: productName,
    targetType: "product"
  });
}

export function getMostViewedProducts(limit = 5): ProductViewStats[] {
  return [...productViewStats].sort((a, b) => b.totalViews - a.totalViews).slice(0, limit);
}

export function sortProductsByMostViewed(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const viewA = productViewStats.find(v => v.productId === a.id)?.totalViews || 0;
    const viewB = productViewStats.find(v => v.productId === b.id)?.totalViews || 0;
    if (viewB !== viewA) {
      return viewB - viewA;
    }
    // tie-breaker: rating
    return b.rating - a.rating;
  });
}

export function getProductViewStatsByCategory(category: string): ProductViewStats[] {
  return productViewStats.filter(p => p.category === category);
}

// ---------------------- DEMO AUTHENTICATION FUNCTIONS ----------------------

export function loginDemoUser(email: string, password?: string) {
  const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error("Không tìm thấy tài khoản này trong tủ dột!");
  }
  if (password && user.password !== password) {
    throw new Error("Mật khẩu khâu chỉ không chính xác, vui lòng thử lại!");
  }
  if (user.status === "locked") {
    throw new Error("Tài khoản len này đã bị tạm khóa do vi phạm bộ quy tắc ứng xử!");
  }

  user.lastLoginAt = new Date().toISOString();
  user.totalLoginCount += 1;

  // Add activity log
  addUserActivityLog({
    userId: user.id,
    userName: user.name,
    role: user.role,
    action: "login"
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      totalLoginCount: user.totalLoginCount
    },
    role: user.role,
    permissions: permissions[user.role],
    redirectPath: roleRedirects[user.role]
  };
}

export function logoutDemoUser(userId: string) {
  const user = demoUsers.find(u => u.id === userId);
  if (user) {
    addUserActivityLog({
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: "logout"
    });
  }
}

// -------------------- PERMISSIONS & ROUTING VALIDATOR --------------------

export function hasPermission(role: UserRole, permission: PermissionType): boolean {
  if (!role) return false;
  const userPerms = permissions[role];
  if (!userPerms) return false;
  if (userPerms.includes("all")) return true;
  return userPerms.includes(permission);
}

export function canAccessRoute(role: UserRole, routePath: string): boolean {
  if (!role) return false;
  const allowed = roleRouteAccess[role];
  if (!allowed) return false;
  
  // Quick checker
  if (allowed.includes(routePath)) return true;
  if (allowed.includes("/admin/**") && routePath.startsWith("/admin")) return true;
  
  return false;
}

// ---------------------- REALTIME SIMULATION EMITTINGS ----------------------

export function simulateRealtimeTracking(callback: (statUpdate: any) => void) {
  const interval = setInterval(() => {
    // Random activity picker
    const randomProduct = productViewStats[Math.floor(Math.random() * productViewStats.length)];
    const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];

    if (randomProduct && randomUser) {
      randomProduct.totalViews += Math.floor(Math.random() * 3) + 1;
      randomProduct.lastViewedAt = new Date().toISOString();
      
      callback({
        type: "product_view",
        productId: randomProduct.productId,
        productName: randomProduct.productName,
        totalViews: randomProduct.totalViews,
        activeUser: randomUser.name,
        timestamp: new Date().toLocaleTimeString("vi-VN")
      });
    }
  }, 15000);

  return () => clearInterval(interval);
}

// ---------------------- EXTRA MOCK MARKETING DATA DATA MODEL ----------------------

export const coupons: Coupon[] = [
  {
    code: "WELCOME20",
    name: "Mã đón tiếp nàng thơ 20%",
    type: "percentage",
    value: 20,
    minOrderValue: 0,
    maxDiscount: 100000,
    startDate: "2026-05-10",
    endDate: "2026-10-30",
    usageLimit: 500,
    usedCount: 42,
    applicableProducts: [],
    applicableCategories: [],
    applicableRoles: ["customer"],
    status: "Đang hoạt động"
  },
  {
    code: "FREESHIP",
    name: "Ưu đãi dệt sợi miễn phí giao hàng",
    type: "free_shipping",
    value: 25000,
    minOrderValue: 150000,
    maxDiscount: 25000,
    startDate: "2026-05-15",
    endDate: "2026-08-30",
    usageLimit: 1000,
    usedCount: 156,
    applicableProducts: [],
    applicableCategories: [],
    applicableRoles: [],
    status: "Đang hoạt động"
  },
  {
    code: "LENSINH50K",
    name: "Mã tri ân khách sắm Sinh nhật 50K",
    type: "fixed",
    value: 50000,
    minOrderValue: 300000,
    maxDiscount: 50000,
    startDate: "2026-05-20",
    endDate: "2026-06-30",
    usageLimit: 100,
    usedCount: 12,
    applicableProducts: [],
    applicableCategories: ["Túi len handmade", "Gấu bông len"],
    applicableRoles: [],
    status: "Đang hoạt động"
  }
];

export const missions: Mission[] = [
  {
    id: "mis_1",
    title: "Đăng nhập hôm nay gặt hái ngọc sương",
    description: "Nhận điểm thưởng chuyên cần dệt xơ, nuôi nấng khâu chỉ hằng ngày tủ.",
    coinReward: 500,
    conditionType: "daily_login",
    status: "Có thể nhận thưởng",
    period: "Mỗi ngày",
    limitCount: 1
  },
  {
    id: "mis_2",
    title: "Hoàn chỉnh nốt thắt hồ sơ",
    description: "Điền đầy đủ nốt thắt Email và số điện thoại bảo chứng đơn giao.",
    coinReward: 2000,
    conditionType: "update_profile",
    status: "Chưa làm",
    period: "Một lần",
    limitCount: 1
  },
  {
    id: "mis_3",
    title: "Mua kết quả thêu mộc đầu tiên",
    description: "Hoàn thành thanh toán hóa đơn dệt và nhận gói hoa thơm.",
    coinReward: 5000,
    conditionType: "first_checkout",
    status: "Chưa làm",
    period: "Một lần",
    limitCount: 1
  },
  {
    id: "mis_4",
    title: "Chia sẻ dệt tay tới nàng thơ dạo",
    description: "Quảng bá nốt dệt tay của Tiệm Len Nhỏ lên trang Facebook/Insta.",
    coinReward: 1000,
    conditionType: "share_product",
    status: "Chưa làm",
    period: "Mỗi tuần",
    limitCount: 1
  },
  {
    id: "mis_5",
    title: "Đọc cẩm nang thời trang dệt sợi",
    description: "Đọc trọn vẹn 1 bài báo hay trong tủ sách blog truyền cảm hứng.",
    coinReward: 300,
    conditionType: "read_blog",
    status: "Chưa làm",
    period: "Mỗi ngày",
    limitCount: 3
  }
];

export const banners: Banner[] = [
  {
    id: "ban_1",
    title: "Mùa dệt hạ – Sợi hoa tỏa ngát hương",
    description: "BST Túi Len Lavender Dream phối quai gỗ mộc mạc thơm dịu dàng sắc mây.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200",
    ctaText: "Khám phá dệt",
    ctaLink: "/products",
    startDate: "2026-05-10",
    endDate: "2026-08-30",
    position: "Hero trang chủ",
    status: "Đang hoạt động",
    displayTarget: "tất cả"
  },
  {
    id: "ban_2",
    title: "Phiếu Welcome 20% giảm kịch sâu sắc",
    description: "Tặng riêng nàng thơ đăng ký khâu chỉ đầu tiên, gạt bớt mọi băn khoăn vận chuyển.",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=600",
    ctaText: "Lưu mã liền",
    ctaLink: "/account/vouchers",
    startDate: "2026-05-01",
    endDate: "2026-12-31",
    position: "Popup khuyến mãi",
    status: "Đang hoạt động",
    displayTarget: "khách mới"
  }
];

export const marketingArticles: MarketingArticle[] = [
  {
    id: "mar_1",
    title: "Hành Trình Chữa Lành Tâm Hồn Qua Từng Sợi Chỉ Len Mộc Mạc",
    slug: "chua-lanh-qua-soi-len-handmade",
    image: chuaLanhTamHonImg,
    description: "Vì sao môn nghệ thuật móc kim dệt len lại trở thành trào lưu chánh niệm giúp xua tan áp lực lo âu đô thị đầy mỹ thuật lý tính.",
    content: `<h3>Nghệ thuật khâu móc và Sức mạnh bình ổn tinh thần</h3>
              <p>Mỗi đường kim lượn qua nốt chỉ là một khoảnh khắc bạn hoàn toàn tập trung vào thực tại. Nhiều nàng thơ chia sẻ rằng họ tìm thấy nhịp thở điều hòa sâu sắc khi đan từng sợi tơ dệt Tulip nổi.</p>
              <h3>Vì sao chiếc túi dệt tay thơm nhài lại sang trọng?</h3>
              <p>Không chỉ sở hữu giá trị sử dụng lâu dính, Tiệm Len Nhỏ giữ vững chữ tín nhờ chất sợi tinh khôi, tẩm sáp cỏ thô mướt mềm và xông nhài sấy khô chống ổ mốc triệt để.</p>`,
    tag: "Chữa lành",
    metaTitle: "Móc Len Thiền Định Chữa Lành Mộc Mạc | Tiệm Len Nhỏ",
    metaDescription: "Khám phá nghệ thuật móc len Amigurumi chữa lành và đền tặng giá trị nhân sinh của đồ thủ công tinh chế.",
    status: "đã xuất bản",
    date: "28 Tháng 5, 2026",
    author: "Sáng Lập Nguyễn Hà",
    ctaLink: "/products"
  },
  {
    id: "mar_2",
    title: "HÀNG TẶNG XIN VUI LÒNG KHÔNG TRẢ LẠI",
    slug: "chu-tin-trong-hop-qua-tang-handmade",
    image: hangTangWImg,
    description: "Đằng sau ruy băng đỏ thắm dập rêu mộc mạc là chiếc gối nhồi bông gòn micro-elastic cao cấp nhất cho bé yêu học đường.",
    content: `<h3>Chiếc gấu bông bảo an từ vật lụa organic</h3>
              <p>Chúng mình từ chối sợi tổng hợp tái chế độc hại. Mọi Amigurumi nhồi thú bông thỏ Bunny đều móc bằng tơ Cotton dẻo dai đanh bóng nhập khẩu nguyên mác.</p>
              <h3>Hành trình giao quà bảo mật</h3>
              <p>Gói bọc ba lớp rơm lót chống va đập xô rão dáng cánh hoa, bảo hành đổi trả mệt nghỉ nếu nàng cảm nhận vết bẩn dù là nhỏ ríu tơ.</p>`,
    tag: "Quà tặng",
    metaTitle: "Hộp Quà Tốt Nghiệp Sợi Len Tinh Hoa Độc Bản | Tiệm Len Nhỏ",
    metaDescription: "Cẩm nang tinh lọc mẫu hoa len tốt nghiệp thêu dệt, bọc gói thắt nơ lụa nhung cao cấp sang lành nhất.",
    status: "đã xuất bản",
    date: "25 Tháng 5, 2026",
    author: "Nghệ nhân Thảo Trâm",
    ctaLink: "/products"
  }
];

// ---------------------- CENTRAL REALTIME ACCUMULATOR STATS ----------------------

export const dashboardStatsByRole = {
  admin: {
    totalUsers: 840,
    totalViews: 2810,
    mostViewedProduct: "Túi Len Hồng Handmade - Premium Edition (840 lượt views)",
    activeCustomer: "Nguyễn Khánh Linh (4 login, 12 items mua)",
    totalOrders: 148,
    totalRevenue: 52400000,
    totalCouponUsed: 198,
    totalCoinsAwarded: 1250000,
    totalMissionsFinished: 412,
    onlineCount: 14
  },
  store_owner: {
    totalRevenue: 52400000,
    completedOrders: 132,
    pendingOrders: 11,
    canceledOrders: 5,
    bestsellerProduct: "Túi Len Hồng Handmade - Premium Edition",
    lowStockWarningCount: 2, // prod 6 and prod 3
    currentInventoryValue: 24390000,
    unhandledReturnsCount: 1,
    successPaymentRate: "94.6%"
  },
  marketing_staff: {
    totalCampaigns: 4,
    totalCouponsDistributed: 2000,
    totalCouponsUsed: 198,
    totalCoinsIssued: 1250000,
    revenueFromCampaigns: 18450000,
    couponConversionRate: "9.9%",
    activeBanner: "Mùa dệt hạ (Hero)",
    marketingArticlesPublishedCount: 2
  },
  inventory_staff: {
    lowStockProducts: [],
    recentStockLogs: [
      { id: "stk_1", productId: "prod_1", productName: "Túi Len Hồng Handmade", action: "Xuất kho giao lẻ", qty: 1, date: "2026-05-30T07:11:00" },
      { id: "stk_2", productId: "prod_1", productName: "Túi Len Hồng Handmade", action: "Nhập xưởng dệt mới", qty: 10, date: "2026-05-30T06:00:00" }
    ]
  },
  order_staff: {
    newOrdersCount: 2,
    preparingOrdersCount: 4,
    shippingOrdersCount: 3,
    deliveredOrdersCount: 139,
    failedOrdersCount: 2,
    returnRequestsCount: 1
  },
  content_staff: {
    blogViewsCount: 4210,
    topSearchKeyword: "túi len quai gỗ hoa nổi",
    seoHealthScore: "98/100",
    missingSeoMetaCount: 0
  },
  customer: {
    recentViews: ["prod_1"],
    suggestedProducts: [],
    coinsBalance: 5000,
    couponsAvailable: ["WELCOME20", "FREESHIP"],
    claimedMissionsCount: 1
  }
};
