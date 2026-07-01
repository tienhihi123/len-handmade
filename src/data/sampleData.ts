/**
 * sampleData.ts
 * Dữ liệu mẫu đầy đủ cho website Tiệm Len Nhỏ
 * Bao gồm: Customers, Orders mẫu, ProductVariants, Revenue, Notifications, InventoryLogs
 */

import { Customer, LoggedOrder, ProductVariant, OrderNotification, InventoryLog, RevenueDataPoint, TopProduct } from "../types";

// ================================================================
// 5+ KHÁCH HÀNG MẪU
// ================================================================
export const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: "cust_001",
    fullName: "Nguyễn Thị Lan Anh",
    phone: "0901234567",
    email: "lananh.nguyen@gmail.com",
    address: "12 Nguyễn Huệ, P. Bến Nghé, Quận 1, TP.HCM",
    createdAt: "2026-01-15T08:30:00.000Z",
    totalOrders: 3,
    totalSpent: 1050000
  },
  {
    id: "cust_002",
    fullName: "Trần Minh Thảo",
    phone: "0912345678",
    email: "minhthao.tran@yahoo.com",
    address: "45 Lê Văn Sỹ, P. 13, Quận 3, TP.HCM",
    createdAt: "2026-02-20T10:15:00.000Z",
    totalOrders: 2,
    totalSpent: 730000
  },
  {
    id: "cust_003",
    fullName: "Lê Hồng Nhung",
    phone: "0978123456",
    email: "hongnhung.le@gmail.com",
    address: "78 Trần Hưng Đạo, P. 5, Quận 5, TP.HCM",
    createdAt: "2026-03-10T14:20:00.000Z",
    totalOrders: 4,
    totalSpent: 1580000
  },
  {
    id: "cust_004",
    fullName: "Phạm Khánh Linh",
    phone: "0967891234",
    email: "khanhlinh.pham@outlook.com",
    address: "156 Đinh Tiên Hoàng, P. Đa Kao, Quận 1, TP.HCM",
    createdAt: "2026-04-05T09:00:00.000Z",
    totalOrders: 1,
    totalSpent: 380000
  },
  {
    id: "cust_005",
    fullName: "Võ Thị Bích Trâm",
    phone: "0934567890",
    email: "bichtram.vo@gmail.com",
    address: "23 Bùi Viện, P. Phạm Ngũ Lão, Quận 1, TP.HCM",
    createdAt: "2026-05-12T16:45:00.000Z",
    totalOrders: 2,
    totalSpent: 850000
  },
  {
    id: "cust_006",
    fullName: "Huỳnh Thu Hà",
    phone: "0945678901",
    email: "thuha.huynh@gmail.com",
    address: "89 Võ Văn Tần, P. 6, Quận 3, TP.HCM",
    createdAt: "2026-05-28T11:30:00.000Z",
    totalOrders: 1,
    totalSpent: 420000
  }
];

// ================================================================
// 5+ ĐƠN HÀNG MẪU (với đa dạng trạng thái)
// ================================================================
export const SAMPLE_ORDERS: LoggedOrder[] = [
  {
    id: "ORD-A1B2C3D4-WEAVE",
    orderCode: "LH-20260601-001",
    name: "Túi Len Hồng Handmade Premium (x1), Bóp len mini (x1)",
    itemsCount: 2,
    totalPrice: 430400,
    time: "2026-06-01T08:30:00.000Z",
    status: "Hoàn tất",
    shippingAddress: "12 Nguyễn Huệ, Quận 1, TP.HCM",
    customerName: "Nguyễn Thị Lan Anh",
    customerPhone: "0901234567",
    customerEmail: "lananh.nguyen@gmail.com",
    discountApplied: 0,
    coinsUsed: 0,
    paymentMethod: "banking",
    note: "Gói quà tặng sinh nhật bạn, có thể thêm thiệp không?",
    items: [
      { productId: "prod_1", productName: "Túi Len Hồng Handmade Premium", color: "Hồng Pastel", size: "Tiêu chuẩn (22cm)", quantity: 1, price: 380400, subtotal: 380400 },
      { productId: "new_mini_pouch", productName: "Bóp len mini xinh xinh", color: "Hồng dâu", size: "Mini", quantity: 1, price: 50000, subtotal: 50000 }
    ]
  },
  {
    id: "ORD-E5F6G7H8-WEAVE",
    orderCode: "LH-20260605-002",
    name: "Shell Butterfly Top (x1)",
    itemsCount: 1,
    totalPrice: 380000,
    time: "2026-06-05T14:22:00.000Z",
    status: "Đang giao",
    shippingAddress: "45 Lê Văn Sỹ, Quận 3, TP.HCM",
    customerName: "Trần Minh Thảo",
    customerPhone: "0912345678",
    customerEmail: "minhthao.tran@yahoo.com",
    discountApplied: 0,
    coinsUsed: 0,
    paymentMethod: "vietqr",
    note: "",
    items: [
      { productId: "prod_9", productName: "Shell Butterfly Top", color: "Xanh Nước Biển", size: "S (45–52kg)", quantity: 1, price: 380000, subtotal: 380000 }
    ]
  },
  {
    id: "ORD-I9J0K1L2-WEAVE",
    orderCode: "LH-20260608-003",
    name: "Túi len đi học, đi chơi, đi biển (x1), Hộp Quà Ấm Áp (x1)",
    itemsCount: 2,
    totalPrice: 550000,
    time: "2026-06-08T09:45:00.000Z",
    status: "Đang chuẩn bị hàng",
    shippingAddress: "78 Trần Hưng Đạo, Quận 5, TP.HCM",
    customerName: "Lê Hồng Nhung",
    customerPhone: "0978123456",
    customerEmail: "hongnhung.le@gmail.com",
    discountApplied: 0,
    coinsUsed: 0,
    paymentMethod: "momo",
    note: "Tặng quà tốt nghiệp, nhờ thêm tên 'Nhung 2026' nhé ạ",
    items: [
      { productId: "new_sunflower_bag", productName: "Túi len đi học, đi chơi, đi biển", color: "Hoa hướng dương pastel", size: "Tiêu chuẩn", quantity: 1, price: 200000, subtotal: 200000 },
      { productId: "prod_7", productName: "Hộp Quà Ấm Áp Cho Người Thương", color: "Hồng Ngọt Ngào", size: "Tiêu chuẩn", quantity: 1, price: 350000, subtotal: 350000 }
    ]
  },
  {
    id: "ORD-M3N4O5P6-WEAVE",
    orderCode: "LH-20260610-004",
    name: "Áo len bướm handmade (x1)",
    itemsCount: 1,
    totalPrice: 100000,
    time: "2026-06-10T16:10:00.000Z",
    status: "Đã xác nhận",
    shippingAddress: "156 Đinh Tiên Hoàng, Quận 1, TP.HCM",
    customerName: "Phạm Khánh Linh",
    customerPhone: "0967891234",
    customerEmail: "khanhlinh.pham@outlook.com",
    discountApplied: 0,
    coinsUsed: 0,
    paymentMethod: "cod",
    note: "",
    items: [
      { productId: "new_butterfly_top", productName: "Áo len bướm handmade", color: "Hồng pastel", size: "Đặt theo số đo", quantity: 1, price: 100000, subtotal: 100000 }
    ]
  },
  {
    id: "ORD-Q7R8S9T0-WEAVE",
    orderCode: "LH-20260615-005",
    name: "Fairyland Butterfly Vest (x1), Bóp len mini (x2)",
    itemsCount: 3,
    totalPrice: 520000,
    time: "2026-06-15T11:30:00.000Z",
    status: "Chờ xác nhận",
    shippingAddress: "23 Bùi Viện, Quận 1, TP.HCM",
    customerName: "Võ Thị Bích Trâm",
    customerPhone: "0934567890",
    customerEmail: "bichtram.vo@gmail.com",
    discountApplied: 104000,
    coinsUsed: 0,
    paymentMethod: "vietqr",
    note: "Giao trước 5h chiều nha shop",
    items: [
      { productId: "prod_8", productName: "Fairyland Butterfly Vest", color: "Xanh Bạc Hà", size: "S (dưới 50kg)", quantity: 1, price: 420000, subtotal: 420000 },
      { productId: "new_mini_pouch", productName: "Bóp len mini xinh xinh", color: "Xanh lá", size: "Mini", quantity: 2, price: 50000, subtotal: 100000 }
    ]
  },
  {
    id: "ORD-U1V2W3X4-WEAVE",
    orderCode: "LH-20260617-006",
    name: "Túi Len Hồng Handmade Premium (x1)",
    itemsCount: 1,
    totalPrice: 420000,
    time: "2026-06-17T08:00:00.000Z",
    status: "Đã hủy",
    shippingAddress: "89 Võ Văn Tần, Quận 3, TP.HCM",
    customerName: "Huỳnh Thu Hà",
    customerPhone: "0945678901",
    customerEmail: "thuha.huynh@gmail.com",
    discountApplied: 0,
    coinsUsed: 0,
    paymentMethod: "cod",
    note: "Đặt nhầm size",
    items: [
      { productId: "prod_1", productName: "Túi Len Hồng Handmade Premium", color: "Tím Nhạt", size: "Cỡ vừa (28cm)", quantity: 1, price: 420400, subtotal: 420400 }
    ]
  }
];

// ================================================================
// PRODUCT VARIANTS - Tồn kho theo biến thể
// ================================================================
export const SAMPLE_PRODUCT_VARIANTS: ProductVariant[] = [
  // Túi Len Hồng (prod_1)
  { id: "var_001", productId: "prod_1", productName: "Túi Len Hồng Handmade Premium", color: "Hồng Pastel", size: "Tiêu chuẩn (22cm)", material: "Len Cotton Nhật Organic", price: 380400, stockQuantity: 8, sku: "TLH-HP-22-CO", status: "in-stock" },
  { id: "var_002", productId: "prod_1", productName: "Túi Len Hồng Handmade Premium", color: "Kem Sữa", size: "Tiêu chuẩn (22cm)", material: "Len Cotton Nhật Organic", price: 380400, stockQuantity: 4, sku: "TLH-KS-22-CO", status: "low-stock" },
  { id: "var_003", productId: "prod_1", productName: "Túi Len Hồng Handmade Premium", color: "Hồng Pastel", size: "Cỡ vừa (28cm)", material: "Len Lông Cừu Milk Cotton cao cấp", price: 450400, stockQuantity: 3, sku: "TLH-HP-28-LC", status: "low-stock" },
  { id: "var_004", productId: "prod_1", productName: "Túi Len Hồng Handmade Premium", color: "Xanh Sage", size: "Tiêu chuẩn (22cm)", material: "Len Cotton Nhật Organic", price: 380400, stockQuantity: 2, sku: "TLH-XS-22-CO", status: "low-stock" },

  // Bóp len mini (new_mini_pouch)
  { id: "var_005", productId: "new_mini_pouch", productName: "Bóp len mini xinh xinh", color: "Hồng dâu", size: "Mini", material: "Cotton 4ply", price: 50000, stockQuantity: 20, sku: "BLM-HD-MI-C4", status: "in-stock" },
  { id: "var_006", productId: "new_mini_pouch", productName: "Bóp len mini xinh xinh", color: "Xanh lá", size: "Mini", material: "Cotton 4ply", price: 50000, stockQuantity: 15, sku: "BLM-XL-MI-C4", status: "in-stock" },
  { id: "var_007", productId: "new_mini_pouch", productName: "Bóp len mini xinh xinh", color: "Cam san hô", size: "Mini", material: "Cotton 4ply", price: 50000, stockQuantity: 12, sku: "BLM-CS-MI-C4", status: "in-stock" },

  // Túi len đi học (new_sunflower_bag)
  { id: "var_008", productId: "new_sunflower_bag", productName: "Túi len đi học, đi chơi, đi biển", color: "Hoa hướng dương pastel", size: "Tiêu chuẩn", material: "Cotton giữ phom", price: 200000, stockQuantity: 5, sku: "TLD-HH-TC-CG", status: "low-stock" },
  { id: "var_009", productId: "new_sunflower_bag", productName: "Túi len đi học, đi chơi, đi biển", color: "Nền kem", size: "Tiêu chuẩn", material: "Cotton giữ phom", price: 200000, stockQuantity: 7, sku: "TLD-NK-TC-CG", status: "in-stock" },
  { id: "var_010", productId: "new_sunflower_bag", productName: "Túi len đi học, đi chơi, đi biển", color: "Phối màu tự chọn", size: "Đặt kích thước riêng", material: "Cotton giữ phom", price: 250000, stockQuantity: 99, sku: "TLD-PM-KR-CG", status: "in-stock" },

  // Áo len bướm (new_butterfly_top)
  { id: "var_011", productId: "new_butterfly_top", productName: "Áo len bướm handmade", color: "Nâu cacao", size: "Đặt theo số đo", material: "Cotton Milk", price: 100000, stockQuantity: 99, sku: "ALB-NC-SM-CM", status: "in-stock" },
  { id: "var_012", productId: "new_butterfly_top", productName: "Áo len bướm handmade", color: "Hồng pastel", size: "Đặt theo số đo", material: "Cotton Milk", price: 100000, stockQuantity: 99, sku: "ALB-HP-SM-CM", status: "in-stock" },

  // Fairyland Butterfly Vest (prod_8)
  { id: "var_013", productId: "prod_8", productName: "Fairyland Butterfly Vest", color: "Xanh Bạc Hà", size: "S (dưới 50kg)", material: "Sợi Milk Cotton 5ply", price: 420000, stockQuantity: 3, sku: "FBV-XBH-S-MC5", status: "low-stock" },
  { id: "var_014", productId: "prod_8", productName: "Fairyland Butterfly Vest", color: "Vàng Kem Nhạt", size: "M (50–60kg)", material: "Sợi Milk Cotton 5ply", price: 450000, stockQuantity: 2, sku: "FBV-VKN-M-MC5", status: "low-stock" },
  { id: "var_015", productId: "prod_8", productName: "Fairyland Butterfly Vest", color: "Hồng Nhạt", size: "S (dưới 50kg)", material: "Sợi Cotton Organic mịn hơn", price: 470000, stockQuantity: 1, sku: "FBV-HN-S-SCO", status: "low-stock" },

  // Shell Butterfly Top (prod_9)
  { id: "var_016", productId: "prod_9", productName: "Shell Butterfly Top", color: "Xanh Nước Biển", size: "S (45–52kg)", material: "Sợi Cotton Summer mát lạnh", price: 380000, stockQuantity: 5, sku: "SBT-XNB-S-CS", status: "low-stock" },
  { id: "var_017", productId: "prod_9", productName: "Shell Butterfly Top", color: "Hồng San Hô", size: "M (52–60kg)", material: "Sợi Cotton Summer mát lạnh", price: 400000, stockQuantity: 3, sku: "SBT-HSH-M-CS", status: "low-stock" },
  { id: "var_018", productId: "prod_9", productName: "Shell Butterfly Top", color: "Trắng Sữa", size: "XS (dưới 45kg)", material: "Sợi Bamboo Silk siêu mát", price: 440000, stockQuantity: 0, sku: "SBT-TS-XS-BS", status: "out-of-stock" },

  // Hộp Quà (prod_7)
  { id: "var_019", productId: "prod_7", productName: "Hộp Quà Ấm Áp Cho Người Thương", color: "Hồng Ngọt Ngào", size: "Tiêu chuẩn", material: "Sợi Milk Cotton cao cấp", price: 350000, stockQuantity: 10, sku: "HQA-HNN-TC-MC", status: "in-stock" },
  { id: "var_020", productId: "prod_7", productName: "Hộp Quà Ấm Áp Cho Người Thương", color: "Xanh Dương Bình Yên", size: "Đặc chế Hộp Quà", material: "Sợi Milk Cotton cao cấp", price: 400000, stockQuantity: 5, sku: "HQA-XD-HQ-MC", status: "low-stock" }
];

// ================================================================
// NOTIFICATIONS MẪU
// ================================================================
export const SAMPLE_NOTIFICATIONS: OrderNotification[] = [
  {
    id: "notif_001",
    orderId: "ORD-A1B2C3D4-WEAVE",
    orderCode: "LH-20260601-001",
    type: "completed",
    receiver: "lananh.nguyen@gmail.com",
    message: "✅ Đơn hàng LH-20260601-001 của bạn đã được giao thành công! Cảm ơn Lan Anh đã tin tưởng Tiệm Len Nhỏ 🧶💕",
    status: "sent",
    channel: "email",
    createdAt: "2026-06-04T15:00:00.000Z"
  },
  {
    id: "notif_002",
    orderId: "ORD-E5F6G7H8-WEAVE",
    orderCode: "LH-20260605-002",
    type: "shipping",
    receiver: "minhthao.tran@yahoo.com",
    message: "🚚 Đơn hàng LH-20260605-002 đang trên đường giao đến bạn! Shipper sẽ liên hệ sớm. Cảm ơn Minh Thảo 🌸",
    status: "sent",
    channel: "email",
    createdAt: "2026-06-07T10:30:00.000Z"
  },
  {
    id: "notif_003",
    orderId: "ORD-I9J0K1L2-WEAVE",
    orderCode: "LH-20260608-003",
    type: "preparing",
    receiver: "hongnhung.le@gmail.com",
    message: "🧶 Đơn hàng LH-20260608-003 đang được chuẩn bị! Chúng mình đang thêu tên và hoàn thiện sản phẩm cho Hồng Nhung 💕",
    status: "sent",
    channel: "telegram",
    createdAt: "2026-06-09T08:00:00.000Z"
  },
  {
    id: "notif_004",
    orderId: "ORD-M3N4O5P6-WEAVE",
    orderCode: "LH-20260610-004",
    type: "confirmed",
    receiver: "khanhlinh.pham@outlook.com",
    message: "✔️ Đơn hàng LH-20260610-004 đã được xác nhận! Chúng mình sẽ bắt đầu chuẩn bị hàng cho Khánh Linh ngay 🎀",
    status: "sent",
    channel: "email",
    createdAt: "2026-06-10T17:00:00.000Z"
  },
  {
    id: "notif_005",
    orderId: "ORD-U1V2W3X4-WEAVE",
    orderCode: "LH-20260617-006",
    type: "cancelled",
    receiver: "thuha.huynh@gmail.com",
    message: "❌ Đơn hàng LH-20260617-006 đã bị hủy theo yêu cầu. Tiệm Len Nhỏ rất tiếc và mong được phục vụ Thu Hà trong lần tới 💙",
    status: "sent",
    channel: "email",
    createdAt: "2026-06-17T09:00:00.000Z"
  }
];

// ================================================================
// INVENTORY LOGS MẪU
// ================================================================
export const SAMPLE_INVENTORY_LOGS: InventoryLog[] = [
  {
    id: "log_inv_001",
    productId: "prod_1",
    productName: "Túi Len Hồng Handmade Premium",
    variantId: "var_001",
    color: "Hồng Pastel",
    size: "Tiêu chuẩn (22cm)",
    changeType: "sale",
    quantityChanged: -1,
    previousStock: 9,
    newStock: 8,
    reason: "Đơn hàng LH-20260601-001",
    createdAt: "2026-06-01T08:30:00.000Z"
  },
  {
    id: "log_inv_002",
    productId: "new_mini_pouch",
    productName: "Bóp len mini xinh xinh",
    variantId: "var_005",
    color: "Hồng dâu",
    size: "Mini",
    changeType: "sale",
    quantityChanged: -1,
    previousStock: 21,
    newStock: 20,
    reason: "Đơn hàng LH-20260601-001",
    createdAt: "2026-06-01T08:30:00.000Z"
  },
  {
    id: "log_inv_003",
    productId: "prod_9",
    productName: "Shell Butterfly Top",
    variantId: "var_016",
    color: "Xanh Nước Biển",
    size: "S (45–52kg)",
    changeType: "sale",
    quantityChanged: -1,
    previousStock: 6,
    newStock: 5,
    reason: "Đơn hàng LH-20260605-002",
    createdAt: "2026-06-05T14:22:00.000Z"
  },
  {
    id: "log_inv_004",
    productId: "prod_8",
    productName: "Fairyland Butterfly Vest",
    variantId: "var_013",
    color: "Xanh Bạc Hà",
    size: "S (dưới 50kg)",
    changeType: "restock",
    quantityChanged: 5,
    previousStock: 0,
    newStock: 5,
    reason: "Nhập hàng mới từ xưởng",
    createdAt: "2026-06-12T10:00:00.000Z"
  },
  {
    id: "log_inv_005",
    productId: "prod_9",
    productName: "Shell Butterfly Top",
    variantId: "var_018",
    color: "Trắng Sữa",
    size: "XS (dưới 45kg)",
    changeType: "sale",
    quantityChanged: -2,
    previousStock: 2,
    newStock: 0,
    reason: "Đơn hàng khách đặt trước",
    createdAt: "2026-06-14T09:00:00.000Z"
  }
];

// ================================================================
// DỮ LIỆU DOANH THU MẪU - 30 ngày gần nhất
// ================================================================
function generateRevenueDays(): RevenueDataPoint[] {
  const data: RevenueDataPoint[] = [];
  const baseDate = new Date("2026-05-19");
  const revenues = [
    150000, 0, 380000, 230000, 0, 550000, 420000,
    180000, 350000, 0, 480000, 0, 720000, 310000,
    0, 430000, 580000, 220000, 0, 650000, 390000,
    0, 480000, 330000, 0, 570000, 280000, 430000,
    0, 520000
  ];
  const orders = [0, 0, 1, 1, 0, 2, 1, 1, 1, 0, 2, 0, 3, 1, 0, 2, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 1, 0, 2];

  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    data.push({
      date: dateStr,
      revenue: revenues[i],
      orders: orders[i],
      label: `${date.getDate()}/${date.getMonth() + 1}`
    });
  }
  return data;
}

export const SAMPLE_REVENUE_DATA: RevenueDataPoint[] = generateRevenueDays();

// ================================================================
// SẢN PHẨM BÁN CHẠY (Top Products)
// ================================================================
export const SAMPLE_TOP_PRODUCTS: TopProduct[] = [
  {
    productId: "prod_1",
    productName: "Túi Len Hồng Handmade Premium",
    category: "Túi len handmade",
    totalSold: 42,
    totalRevenue: 15976800,
    image: "/src/assets/images/crochet_bag_1779458906901.png"
  },
  {
    productId: "new_mini_pouch",
    productName: "Bóp len mini xinh xinh",
    category: "Phụ kiện len",
    totalSold: 35,
    totalRevenue: 1750000,
    image: "/products/sanpham2.2.jpg"
  },
  {
    productId: "prod_9",
    productName: "Shell Butterfly Top",
    category: "Áo len handmade",
    totalSold: 18,
    totalRevenue: 6840000,
    image: "/products/shell-top-1.jpg"
  },
  {
    productId: "new_sunflower_bag",
    productName: "Túi len đi học, đi chơi, đi biển",
    category: "Túi len handmade",
    totalSold: 14,
    totalRevenue: 2800000,
    image: "/products/sanpham4.4.jpg"
  },
  {
    productId: "prod_7",
    productName: "Hộp Quà Ấm Áp Cho Người Thương",
    category: "Quà tặng handmade",
    totalSold: 12,
    totalRevenue: 4200000,
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400"
  }
];
