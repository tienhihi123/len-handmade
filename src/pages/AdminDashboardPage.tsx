import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, Package, ShoppingCart, RefreshCw, Layers, Edit3, Trash2, Plus, 
  Minus, ShieldAlert, BadgeCheck, FileText, ClipboardList, Tag, Compass, Users,
  Bell, BarChart2, Search, Phone, Mail, Calendar, AlertTriangle, CheckCircle2,
  XCircle, Clock, Truck
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Product } from "../types";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { 
    currentUser, hasPermission, productsList, setProductsList, ordersList, allOrders,
    setOrdersList, returnRequests, setReturnRequests, activeCoupons, setActiveCoupons, 
    activeMissions, setActiveMissions, logs, viewStats, marketingArticles, setMarketingArticles,
    customersList, notificationsList, productVariants, setProductVariants,
    inventoryLogs, adjustVariantStock, revenueData, topProducts, updateOrderStatus
  } = useApp();

  // Route protection - if user is anon or has customer role, send them to unauthorized warnings
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role === "customer") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Active sub-tabs memory state
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Load default available tab depending on permissions on mount
  useEffect(() => {
    if (currentUser.role === "inventory_staff") {
      setActiveTab("inventory");
    } else if (currentUser.role === "order_staff") {
      setActiveTab("orders");
    } else if (currentUser.role === "content_staff") {
      setActiveTab("blog");
    }
  }, [currentUser]);

  // Tab checklist definitions
  const tabsList = [
    { id: "dashboard",  label: "Tổng Quan",         perm: "view_dashboard" },
    { id: "revenue",    label: "Doanh Thu",           perm: "view_dashboard" },
    { id: "products",   label: "Sản Phẩm",            perm: "manage_products" },
    { id: "inventory",  label: "Quản lý Kho",         perm: "manage_inventory" },
    { id: "orders",     label: "Đơn Hàng",            perm: "manage_orders" },
    { id: "customers",  label: "Khách Hàng",          perm: "manage_orders" },
    { id: "returns",    label: "Hoàn Trả",            perm: "manage_orders" },
    { id: "notifications", label: "Thông Báo",       perm: "manage_orders" },
    { id: "marketing",  label: "Vouchers & Xu",       perm: "manage_marketing" },
    { id: "blog",       label: "SEO & Blog",          perm: "manage_blog" }
  ];

  const visibleTabs = tabsList.filter(t => hasPermission(t.perm) || currentUser.role === "admin");

  // CUSTOMER SEARCH STATE
  const [customerSearch, setCustomerSearch] = useState("");

  // ORDER FILTER STATE (for admin orders tab)
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState("");

  // PRODUCT MANAGEMENT TABS VARIABLES
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState<number>(150000);
  const [newProductCategory, setNewProductCategory] = useState("Túi len handmade");
  const [newProductMaterial, setNewProductMaterial] = useState("Milk Cotton bông sồi");

  // INVENTORY VARIABLES
  const [stockAdjustmentId, setStockAdjustmentId] = useState<string | null>(null);
  const [stockAmt, setStockAmt] = useState<number>(10);

  // META SEO MANAGE STATE VARIABLES
  const [metaTitle, setMetaTitle] = useState("Tiệm Len Nhỏ - Mỹ Nghệ Len Thủ Công Cao Cấp");
  const [metaDesc, setMetaDesc] = useState("Shop chuyên bán túi len đeo vai Lavender mộc mạc khâu dệt tay từ cuộn chỉ Cotton chất lượng.");
  const [metaSuccess, setMetaSuccess] = useState(false);

  // NEW STAFF POST WRITING VARIABLES
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("Cẩm Nang");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [blogAddSuccess, setBlogAddSuccess] = useState(false);

  // NEW COUPONS STATE CREATION
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(30000);

  // ACTION SUBMITTERS
  const handleAddNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const brandNewProduct: Product = {
      id: `prod_${Date.now()}`,
      name: newProductName,
      price: newProductPrice,
      rating: 5.0,
      reviewsCount: 0,
      stock: 24,
      image: "https://images.unsplash.com/photo-1517242046021-82ee19d4a410?auto=format&fit=crop&q=80&w=400",
      description: "Tác phẩm thủ công đan dệt độc bản lót nơ vải thính hương nhài vừa khâu.",
      category: newProductCategory,
      material: newProductMaterial,
      colors: [{ name: "Cotton Kem", hex: "#FFFDF0" }],
      materials: [{ name: "Organic Cotton Hand", priceModifier: 0 }],
      sizes: ["Tiêu chuẩn mộc"],
      badge: "Mới"
    };

    setProductsList(prev => [brandNewProduct, ...prev]);
    setNewProductName("");
    setShowAddProduct(false);
  };

  const handleDeleteProduct = (prodId: string) => {
    if (confirm("Chắc chắn dệt gỡ sản phẩm này khỏi giá trưng bày?")) {
      setProductsList(prev => prev.filter(p => p.id !== prodId));
    }
  };


  // Process client return requests
  const handleProcessReturn = (claimId: string, nextStatus: "Đã chấp nhận" | "Đã từ chối") => {
    setReturnRequests(prev => prev.map(r => 
      r.id === claimId ? { ...r, status: nextStatus } : r
    ));
  };

  // Write new Staff marketing blogs
  const handleWriteStaffBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogContent.trim()) return;

    const newStaffPost = {
      id: `art_${Date.now()}`,
      title: newBlogTitle,
      slug: newBlogTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: newBlogCategory,
      excerpt: newBlogContent.slice(0, 100) + "...",
      content: newBlogContent,
      authorId: currentUser.id,
      authorName: currentUser.name,
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString()
    };

    setMarketingArticles(prev => [newStaffPost, ...prev]);
    setNewBlogTitle("");
    setNewBlogContent("");
    setBlogAddSuccess(true);
    setTimeout(() => setBlogAddSuccess(false), 3000);
  };

  // Create coupon codes rules live
  const handleCreateCouponCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newC = {
      code: newCouponCode.toUpperCase().trim(),
      discountValue: newCouponDiscount,
      minOrderValue: 150000,
      description: `Chiết khấu giảm trực diện ${newCouponDiscount.toLocaleString()}đ cho đơn tiếp theo.`,
      isActive: true,
      expiryDate: "2026-12-31"
    };

    setActiveCoupons(prev => [newC, ...prev]);
    setNewCouponCode("");
  };

  // Calculate live cumulative metrics
  const totalCompletedEarnings = ordersList
    .filter(o => o.status === "Đã giao")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingConfirmationLength = ordersList.filter(o => o.status === "Chờ xác nhận").length;

  return (
    <div className="bg-brand-bg min-h-screen px-4 text-left">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Main Header card displaying name list badge */}
        <div className="bg-brand-fb text-white p-6 sm:p-8 rounded-[36px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
          {/* Decorative spinning ring inside panel */}
          <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full border-12 border-white/5 animate-spin-slow pointer-events-none" />

          <div className="space-y-2 text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-brand-primary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <BadgeCheck size={13} />
              Backoffice Hệ Thống Realtime Live
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-brand-cream">
              Bảng Chỉnh Điều Sản Nghiệm Len
            </h1>
            <p className="font-sans text-xs text-brand-cream/70 max-w-xl">
              Đồng bộ tài khoản: <strong className="text-white uppercase">{currentUser.name} ({currentUser.role})</strong>. Chỉ hiển thị các mác tab được cấp phép theo phân tách vai trò.
            </p>
          </div>

          <div className="flex flex-col text-left font-mono text-xs text-brand-cream/60 p-4 rounded-2xl bg-white/5 border border-white/10 select-none">
            <span>● Status: REALTIME CONNECTED</span>
            <span>● Port: 3000 Ingress</span>
            <span className="text-brand-secondary font-bold font-sans">Vận hành sấy mộc thêu dệt...</span>
          </div>
        </div>

        {/* Dynamic subtabs menu filters */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 border-b border-brand-primary/10 scrollbar-none">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-full text-xs font-sans font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-brand-primary text-white shadow"
                  : "bg-brand-card border border-brand-primary/8 text-brand-fb/75 hover:bg-brand-primary/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: REALTIME DASHBOARD STATISTICS */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Quick counters grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="bg-brand-card p-6 rounded-2xl border border-brand-primary/8 shadow-sm space-y-1">
                <span className="text-[10px] text-brand-fb/50 uppercase font-sans font-bold">Tổng tài sản bán chạy(giao)</span>
                <div className="flex items-center justify-between text-brand-fb">
                  <strong className="text-xl font-mono font-black">{totalCompletedEarnings.toLocaleString("vi-VN")}đ</strong>
                  <TrendingUp className="text-green-500" size={18} />
                </div>
              </div>
              <div className="bg-brand-card p-6 rounded-2xl border border-brand-primary/8 shadow-sm space-y-1">
                <span className="text-[10px] text-brand-fb/50 uppercase font-sans font-bold">Yêu cầu Chờ Xác Nhận</span>
                <div className="flex items-center justify-between text-brand-fb">
                  <strong className="text-xl font-mono font-black text-brand-primary">{pendingConfirmationLength} đơn</strong>
                  <ShoppingCart className="text-brand-primary" size={18} />
                </div>
              </div>
              <div className="bg-brand-card p-6 rounded-2xl border border-brand-primary/8 shadow-sm space-y-1">
                <span className="text-[10px] text-brand-fb/50 uppercase font-sans font-bold">Tổng đầu sản phẩm dệt</span>
                <div className="flex items-center justify-between text-brand-fb">
                  <strong className="text-xl font-mono font-black">{productsList.length} dáng mẫu</strong>
                  <Package className="text-blue-500" size={18} />
                </div>
              </div>
              <div className="bg-brand-card p-6 rounded-2xl border border-brand-primary/8 shadow-sm space-y-1">
                <span className="text-[10px] text-brand-fb/50 uppercase font-sans font-bold">Hộc khiếu đổi trả</span>
                <div className="flex items-center justify-between text-brand-fb">
                  <strong className="text-xl font-mono font-black text-red-500">{returnRequests.length} khiếu nại</strong>
                  <RefreshCw className="text-red-500 animate-spin-slow" size={18} />
                </div>
              </div>
            </div>

            {/* Split statistics details chart coordinates & audit logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
              
              {/* Product views realtime list */}
              <div className="lg:col-span-4 bg-brand-card rounded-3xl border border-brand-primary/10 p-5 space-y-4">
                <div className="flex items-center gap-1.5 border-b border-brand-primary/5 pb-3">
                  <Layers size={15} className="text-brand-primary" />
                  <h4 className="font-serif font-bold text-xs text-brand-fb uppercase">Mẫu dệt xem nhiều (Realtime)</h4>
                </div>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {/* Sort products in viewStats live */}
                  {[...viewStats].sort((a,b) => b.totalViews - a.totalViews).map((st) => (
                    <div key={st.productId} className="flex justify-between items-center text-xs font-sans p-2 rounded-lg bg-white/60">
                      <div className="text-left font-sans font-bold text-brand-fb text-[11px] truncate pr-4">
                        {st.productName}
                      </div>
                      <span className="font-mono font-semibold bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full text-[10px] shrink-0">
                        {st.totalViews} views
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* REALTIME SYSTEM AUDIT LOGS LIST */}
              <div className="lg:col-span-8 bg-brand-card rounded-3xl border border-brand-primary/10 p-6 space-y-4">
                <div className="flex items-center gap-1.5 border-b border-brand-primary/5 pb-3 justify-between">
                  <div className="flex items-center gap-1.5">
                    <ClipboardList size={15} className="text-brand-primary" />
                    <h4 className="font-serif font-bold text-xs text-brand-fb uppercase">Nhật Ký Hệ thống live (audit logs)</h4>
                  </div>
                  <span className="text-[10px] text-green-600 font-mono font-bold uppercase animate-pulse select-none">● Monitoring Live</span>
                </div>

                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {logs.slice(0, 15).map((logItem) => (
                    <div 
                      key={logItem.id} 
                      className="p-3 rounded-xl bg-white border border-brand-primary/5 text-xs text-left font-sans flex items-start gap-4 transition-colors hover:bg-brand-primary/5"
                    >
                      <span className="text-[9px] font-mono text-brand-fb/35 shrink-0 mt-0.5">
                        {new Date(logItem.createdAt).toLocaleTimeString("vi-VN")}
                      </span>
                      <div className="flex-grow">
                        <strong className="text-brand-fb font-bold font-sans">
                          {logItem.userName}
                        </strong>
                        <span className="text-[9px] font-mono bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded ml-2 uppercase">
                          {logItem.role}
                        </span>
                        <p className="text-brand-fb/70 text-[11px] mt-0.5">
                          {logItem.action}: <span className="font-bold text-brand-primary">{logItem.targetName}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT AND UPDATES */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fadeIn text-left">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="font-serif font-bold text-md text-brand-fb">Mẫu Đồ Len Trưng Bày ({productsList.length})</h3>
              
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="bg-brand-primary hover:bg-brand-primary-light text-white font-sans font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus size={14} />
                Thêm Mẫu Sợi Mới
              </button>
            </div>

            {/* Expandable Add Product form */}
            <AnimatePresence>
              {showAddProduct && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-brand-card border border-brand-primary/10 p-6 sm:p-8 rounded-3xl shadow-sm text-left relative overflow-hidden"
                >
                  <h4 className="font-serif font-bold text-xs text-brand-fb uppercase mb-4 border-b border-brand-primary/5 pb-2">Khai nhập mác dệt mới</h4>
                  <form onSubmit={handleAddNewProductSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-brand-fb/60 uppercase mb-1">Tên tác phẩm:</label>
                      <input
                        type="text"
                        required
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        placeholder="Ví dụ: Túi Boho mây nơ sồi..."
                        className="w-full text-xs font-sans px-3.5 py-2 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-brand-fb/60 uppercase mb-1">Đơn vị giá bán (VND):</label>
                      <input
                        type="number"
                        required
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(Number(e.target.value))}
                        placeholder="220000"
                        className="w-full text-xs font-sans px-3.5 py-2 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none focus:border-brand-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-sans font-bold text-brand-fb/60 uppercase mb-1 font-sans">Chọn phân phái nhóm:</label>
                      <select
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value)}
                        className="w-full text-xs font-sans px-3.5 py-2.5 rounded-xl border border-brand-primary/15 bg-white text-[#412C20] outline-none"
                      >
                        <option value="Túi len handmade">Túi len handmade</option>
                        <option value="Hoa len">Hoa len tốt nghiệp</option>
                        <option value="Gấu bông len">Gấu bông len hữu cơ</option>
                        <option value="Phụ kiện len">Khăn thêu mũ sồi phụ kiện</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="sm:col-span-3 bg-brand-fb hover:bg-zinc-800 text-white font-sans text-xs py-3.5 rounded-xl text-center cursor-pointer transition-colors"
                    >
                      Đăng sản phẩm lên cửa viện dệt
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List products for editing / deletion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productsList.map((prod) => (
                <div 
                  key={prod.id} 
                  className="bg-brand-card p-4 rounded-2xl border border-brand-primary/5 flex items-center justify-between text-left gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-14 h-14 object-cover rounded-xl border shrink-0 bg-white"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 text-left">
                      <h4 className="font-serif font-bold text-xs text-brand-fb truncate pr-2">{prod.name}</h4>
                      <p className="font-sans text-[10px] text-brand-fb/50 uppercase">{prod.category}</p>
                      <strong className="font-mono text-xs text-brand-primary">
                        {prod.price.toLocaleString("vi-VN")}đ
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-full cursor-pointer transition-colors"
                    title="Gỡ sản phẩm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2.5: REVENUE REPORT & SVG CHARTS */}
        {activeTab === "revenue" && (
          <div className="space-y-8 animate-fadeIn text-left">
            <h3 className="font-serif font-bold text-md text-brand-fb">Báo Cáo Doanh Thu & Biểu Đồ</h3>

            {/* Quick counters grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-brand-card p-6 rounded-2xl border border-brand-primary/8 shadow-sm space-y-1">
                <span className="text-[10px] text-[#412C20]/50 uppercase font-sans font-bold">Tổng doanh thu 30 ngày</span>
                <div className="flex items-center justify-between text-brand-fb">
                  <strong className="text-xl font-mono font-black text-brand-primary">
                    {revenueData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString("vi-VN")}đ
                  </strong>
                  <TrendingUp className="text-green-500" size={18} />
                </div>
              </div>
              <div className="bg-brand-card p-6 rounded-2xl border border-brand-primary/8 shadow-sm space-y-1">
                <span className="text-[10px] text-[#412C20]/50 uppercase font-sans font-bold">Tổng số đơn hàng</span>
                <div className="flex items-center justify-between text-brand-fb">
                  <strong className="text-xl font-mono font-black">
                    {revenueData.reduce((sum, d) => sum + d.orders, 0)} đơn
                  </strong>
                  <ShoppingCart className="text-blue-500" size={18} />
                </div>
              </div>
              <div className="bg-brand-card p-6 rounded-2xl border border-brand-primary/8 shadow-sm space-y-1">
                <span className="text-[10px] text-[#412C20]/50 uppercase font-sans font-bold">Doanh số trung bình / đơn</span>
                <div className="flex items-center justify-between text-brand-fb">
                  <strong className="text-xl font-mono font-black">
                    {(() => {
                      const totalRev = revenueData.reduce((sum, d) => sum + d.revenue, 0);
                      const totalOrd = revenueData.reduce((sum, d) => sum + d.orders, 0);
                      return totalOrd > 0 ? Math.round(totalRev / totalOrd).toLocaleString("vi-VN") : "0";
                    })()}đ
                  </strong>
                  <BarChart2 className="text-purple-500" size={18} />
                </div>
              </div>
            </div>

            {/* SVG Chart Panel */}
            <div className="bg-brand-card rounded-2xl border border-brand-primary/10 p-6 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-brand-primary/5 pb-3">
                <BarChart2 size={15} className="text-brand-primary" />
                <h4 className="font-serif font-bold text-xs text-brand-fb uppercase">Biểu Đồ Doanh Thu 30 Ngày Gần Nhất</h4>
              </div>
              
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[750px]">
                  <svg viewBox="0 0 800 300" className="w-full h-72 bg-white/50 rounded-2xl p-4 border border-brand-primary/10">
                    <line x1="50" y1="50" x2="780" y2="50" stroke="#EAE5DC" strokeDasharray="4" />
                    <line x1="50" y1="116" x2="780" y2="116" stroke="#EAE5DC" strokeDasharray="4" />
                    <line x1="50" y1="183" x2="780" y2="183" stroke="#EAE5DC" strokeDasharray="4" />
                    <line x1="50" y1="250" x2="780" y2="250" stroke="#CEAF75" strokeWidth="1.5" />
                    
                    {(() => {
                      const maxRev = Math.max(...revenueData.map(d => d.revenue), 1);
                      return revenueData.map((d, index) => {
                        const barWidth = 16;
                        const gap = (730 - (revenueData.length * barWidth)) / (revenueData.length - 1);
                        const x = 50 + index * (barWidth + gap);
                        const barHeight = (d.revenue / maxRev) * 200;
                        const y = 250 - barHeight;
                        
                        return (
                          <g key={d.date} className="group cursor-pointer">
                            <rect
                              x={x}
                              y={y}
                              width={barWidth}
                              height={barHeight}
                              fill="#CEAF75"
                              rx="3"
                              className="transition-all hover:fill-brand-fb"
                            />
                            <title>{`${d.date}: ${d.revenue.toLocaleString('vi-VN')}đ (${d.orders} đơn)`}</title>
                            {index % 4 === 0 && (
                              <text
                                x={x + barWidth / 2}
                                y="270"
                                textAnchor="middle"
                                fill="#5E4E3C"
                                className="text-[9px] font-mono select-none font-bold"
                              >
                                {d.label}
                              </text>
                            )}
                          </g>
                        );
                      });
                    })()}
                  </svg>
                </div>
              </div>
            </div>

            {/* Top Products Lists */}
            <div className="bg-brand-card rounded-2xl border border-brand-primary/10 p-6 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-brand-primary/5 pb-3">
                <TrendingUp size={15} className="text-brand-primary" />
                <h4 className="font-serif font-bold text-xs text-brand-fb uppercase">Top Sản Phẩm Bán Chạy Nhất</h4>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-sans text-left">
                  <thead className="bg-brand-bg text-[#412C20]/70 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Sản Phẩm</th>
                      <th className="p-3">Danh Mục</th>
                      <th className="p-3 text-center">Đã bán</th>
                      <th className="p-3 text-right">Tổng Doanh Thu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-primary/5">
                    {topProducts.map((p) => (
                      <tr key={p.productId} className="hover:bg-brand-primary/2">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.productName}
                            className="w-12 h-12 object-cover rounded-xl bg-white border border-brand-primary/10"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517242046021-82ee19d4a410?auto=format&fit=crop&q=80&w=150";
                            }}
                          />
                          <span className="font-bold text-[#412C20]">{p.productName}</span>
                        </td>
                        <td className="p-3 text-[#412C20]/60 font-sans">{p.category}</td>
                        <td className="p-3 text-center font-mono font-bold text-[#412C20]">{p.totalSold}</td>
                        <td className="p-3 text-right font-mono font-bold text-brand-primary">
                          {p.totalRevenue.toLocaleString("vi-VN")}đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY MONITORING LEVELS AND CHANGE LOGS */}
        {activeTab === "inventory" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="font-serif font-bold text-md text-brand-fb">Quản Lý Tồn Kho Theo Biến Thể ({productVariants.length})</h3>
            </div>

            <div className="bg-brand-card rounded-2xl border border-brand-primary/10 overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-xs font-sans text-left min-w-[700px]">
                <thead className="bg-brand-bg text-[#412C20]/70 uppercase text-[10px] whitespace-nowrap">
                  <tr>
                    <th className="p-4">Sản phẩm & Biến thể</th>
                    <th className="p-4">Mã SKU</th>
                    <th className="p-4">Chất liệu</th>
                    <th className="p-4">Số lượng</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-center">Điều chỉnh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-primary/5">
                  {productVariants.map((v) => {
                    const isLow = v.stockQuantity <= 5 && v.stockQuantity > 0;
                    const isOut = v.stockQuantity === 0;

                    return (
                      <tr key={v.id} className="hover:bg-brand-primary/2">
                        <td className="p-4 font-sans text-[#412C20]">
                          <div className="font-bold text-[#412C20]">{v.productName}</div>
                          <div className="text-[10px] text-[#412C20]/60 mt-0.5">
                            Màu sắc: <span className="font-bold text-brand-primary">{v.color}</span> | Kích thước: <span className="font-bold text-brand-primary">{v.size}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold text-[#A89F95]">{v.sku}</td>
                        <td className="p-4 text-[#412C20]/60">{v.material}</td>
                        <td className="p-4 font-mono font-bold">
                          <span className={isOut ? "text-red-650" : isLow ? "text-amber-700" : "text-[#412C20]"}>
                            {v.stockQuantity} cuộn
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            isOut ? "bg-red-100 text-red-700" :
                            isLow ? "bg-amber-100 text-amber-700 animate-pulse" :
                            "bg-green-100 text-green-700"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isOut ? "bg-red-500" : isLow ? "bg-amber-500" : "bg-green-500"}`} />
                            {v.stockQuantity === 0 ? "Hết hàng" : v.stockQuantity <= 5 ? "Sắp hết hàng" : "Còn hàng"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1.5 justify-center">
                            <button
                              onClick={() => adjustVariantStock(v.id, -1, "Điều chỉnh thủ công từ Admin")}
                              disabled={v.stockQuantity === 0}
                              className="p-1 rounded bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus size={11} />
                            </button>
                            <button
                              onClick={() => adjustVariantStock(v.id, 1, "Điều chỉnh thủ công từ Admin")}
                              className="p-1 rounded bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 cursor-pointer"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Inventory logs timeline */}
            <div className="bg-brand-card rounded-2xl border border-brand-primary/10 p-6 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-brand-primary/5 pb-3">
                <ClipboardList size={15} className="text-brand-primary" />
                <h4 className="font-serif font-bold text-xs text-brand-fb uppercase">Nhật Ký Biến Động Kho (Inventory Logs)</h4>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {inventoryLogs.slice(0, 15).map((log) => (
                  <div key={log.id} className="p-3 bg-white border border-brand-primary/5 rounded-xl text-xs flex justify-between items-start">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#412C20]">{log.productName}</span>
                        <span className="text-[10px] text-[#412C20]/55 font-mono">({log.color} / {log.size})</span>
                      </div>
                      <p className="text-[10px] text-[#412C20]/70">
                        Lý do: <span className="font-sans italic">"{log.reason}"</span>
                      </p>
                      <span className="text-[9px] text-[#A89F95] font-mono block">
                        {new Date(log.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <span className={`font-mono font-bold text-xs ${log.quantityChanged < 0 ? "text-red-650" : "text-green-650"}`}>
                        {log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged}
                      </span>
                      <div className="text-[9px] text-[#412C20]/40 font-mono mt-0.5">
                        Tồn: {log.previousStock} → {log.newStock}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDER DEBARKATION AND TRACK STATUS ONE-CLICK STATS */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <h3 className="font-serif font-bold text-md text-brand-fb">Quản Lý Đơn Hàng ({allOrders.length})</h3>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-brand-primary/10">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn, tên hoặc SĐT khách hàng..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full text-xs font-sans pl-9 pr-4 py-2.5 rounded-xl border border-brand-primary/15 bg-brand-bg text-brand-fb outline-none focus:border-brand-primary"
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-fb/40" />
              </div>
              
              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: "all", label: "Tất cả" },
                  { id: "Chờ xác nhận", label: "Chờ xác nhận" },
                  { id: "Đã xác nhận", label: "Đã xác nhận" },
                  { id: "Đang chuẩn bị hàng", label: "Đang chuẩn bị" },
                  { id: "Đang giao", label: "Đang giao" },
                  { id: "Hoàn tất", label: "Hoàn tất" },
                  { id: "Đã hủy", label: "Đã hủy" }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setOrderStatusFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-bold transition-all whitespace-nowrap cursor-pointer ${
                      orderStatusFilter === f.id
                        ? "bg-brand-primary text-white"
                        : "bg-brand-bg text-brand-fb/60 hover:bg-brand-primary/10"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const filteredOrders = allOrders.filter(ord => {
                const matchesSearch = 
                  (ord.orderCode || ord.id).toLowerCase().includes(orderSearch.toLowerCase()) ||
                  (ord.customerName || "").toLowerCase().includes(orderSearch.toLowerCase()) ||
                  (ord.customerPhone || "").includes(orderSearch);
                const matchesStatus = orderStatusFilter === "all" || ord.status === orderStatusFilter;
                return matchesSearch && matchesStatus;
              });

              return filteredOrders.length === 0 ? (
                <p className="text-xs text-brand-fb/50 italic py-8 text-center bg-brand-card rounded-2xl border border-dashed border-brand-primary/10">Không tìm thấy đơn hàng nào phù hợp.</p>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => (
                    <div 
                      key={ord.id} 
                      className="bg-brand-card p-5 rounded-2xl border border-brand-primary/8 space-y-3 shadow-sm text-left"
                    >
                      <div className="flex flex-wrap justify-between items-center text-xs gap-3">
                        <div className="space-y-0.5">
                          <strong className="text-brand-primary font-mono">{ord.orderCode || ord.id}</strong>
                          <p className="text-[#A89F95] font-sans">Thời điểm: {new Date(ord.time).toLocaleString("vi-VN")}</p>
                        </div>

                        <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full ${
                          ord.status === "Hoàn tất" ? "bg-green-100 text-green-700" :
                          ord.status === "Chờ xác nhận" ? "bg-blue-100 text-blue-700" :
                          ord.status === "Đã xác nhận" ? "bg-indigo-100 text-indigo-700" :
                          ord.status === "Đang chuẩn bị hàng" ? "bg-amber-100 text-amber-700" :
                          ord.status === "Đang giao" ? "bg-purple-100 text-purple-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="text-xs font-sans text-[#412C20]/80 space-y-1.5 border-l-2 border-brand-primary/15 pl-3">
                        <p className="font-serif font-black text-[#412C20]">{ord.name}</p>
                        <p>Khách mua: <strong>{ord.customerName}</strong> ({ord.customerPhone} | {ord.customerEmail})</p>
                        <p>Địa chỉ nhận: {ord.shippingAddress}</p>
                        <p>Thanh toán: <span className="font-bold text-indigo-650">{ord.paymentMethod?.toUpperCase() || "COD"}</span></p>
                        {ord.note && <p className="italic text-[#412C20]/60 bg-white/40 p-2 rounded">Ghi chú: "{ord.note}"</p>}
                        <p>Tổng Bill chi trả: <strong className="font-mono text-brand-primary">{ord.totalPrice.toLocaleString("vi-VN")}đ</strong></p>
                      </div>

                      {/* Items Details */}
                      {ord.items && ord.items.length > 0 && (
                        <div className="pl-3 space-y-1">
                          <span className="text-[10px] text-brand-fb/50 font-bold uppercase tracking-wider block">Sản phẩm đặt mua:</span>
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px] font-sans text-brand-fb/80 bg-white/40 px-2 py-1 rounded">
                              <span>🧶 {item.productName} ({item.color} | {item.size}) <span className="font-mono font-bold">x{item.quantity}</span></span>
                              <span className="font-mono font-semibold">{item.subtotal.toLocaleString("vi-VN")}đ</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quick change status controllers depending on current workflow state */}
                      <div className="pt-3 border-t border-brand-primary/5 flex gap-2 flex-wrap text-left justify-start">
                        {ord.status === "Chờ xác nhận" && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(ord.id, "Đã xác nhận")}
                              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-sans font-bold px-3 py-1.5 rounded-lg border border-indigo-100 cursor-pointer"
                            >
                              Xác nhận đơn ✔️
                            </button>
                            <button
                              onClick={() => updateOrderStatus(ord.id, "Đã hủy")}
                              className="bg-red-50 hover:bg-red-100 text-red-650 text-[10px] font-sans font-bold px-3 py-1.5 rounded-lg border border-red-100 cursor-pointer ml-auto"
                            >
                              Hủy đơn ❌
                            </button>
                          </>
                        )}
                        {ord.status === "Đã xác nhận" && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(ord.id, "Đang chuẩn bị hàng")}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-sans font-bold px-3 py-1.5 rounded-lg border border-amber-100 cursor-pointer"
                            >
                              Chuẩn bị hàng 🧶
                            </button>
                            <button
                              onClick={() => updateOrderStatus(ord.id, "Đã hủy")}
                              className="bg-red-50 hover:bg-red-100 text-red-650 text-[10px] font-sans font-bold px-3 py-1.5 rounded-lg border border-red-100 cursor-pointer ml-auto"
                            >
                              Hủy đơn ❌
                            </button>
                          </>
                        )}
                        {ord.status === "Đang chuẩn bị hàng" && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(ord.id, "Đang giao")}
                              className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-sans font-bold px-3 py-1.5 rounded-lg border border-purple-100 cursor-pointer"
                            >
                              Bàn giao shipper 🚚
                            </button>
                            <button
                              onClick={() => updateOrderStatus(ord.id, "Đã hủy")}
                              className="bg-red-50 hover:bg-red-100 text-red-650 text-[10px] font-sans font-bold px-3 py-1.5 rounded-lg border border-red-100 cursor-pointer ml-auto"
                            >
                              Hủy đơn ❌
                            </button>
                          </>
                        )}
                        {ord.status === "Đang giao" && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(ord.id, "Hoàn tất")}
                              className="bg-green-50 hover:bg-green-100 text-green-700 text-[10px] font-sans font-bold px-3 py-1.5 rounded-lg border border-green-100 cursor-pointer"
                            >
                              Đã giao thành công 🌸
                            </button>
                            <button
                              onClick={() => updateOrderStatus(ord.id, "Đã hủy")}
                              className="bg-red-50 hover:bg-red-100 text-red-650 text-[10px] font-sans font-bold px-3 py-1.5 rounded-lg border border-red-100 cursor-pointer ml-auto"
                            >
                              Hủy đơn ❌
                            </button>
                          </>
                        )}
                        {(ord.status === "Hoàn tất" || ord.status === "Đã hủy") && (
                          <span className="text-[10px] italic text-[#412C20]/40 py-1 font-sans">
                            Đơn hàng đã khép lại tiến trình. Không cần xử lý thêm.
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 4.5: CUSTOMER LIST */}
        {activeTab === "customers" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="font-serif font-bold text-md text-brand-fb">Quản Lý Khách Hàng ({customersList.length})</h3>
              
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Tìm khách hàng (Tên, SĐT, Email)..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full text-xs font-sans pl-9 pr-4 py-2.5 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none focus:border-brand-primary"
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-fb/40" />
              </div>
            </div>

            <div className="bg-brand-card rounded-2xl border border-brand-primary/10 overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-xs font-sans text-left min-w-[800px]">
                <thead className="bg-brand-bg text-[#412C20]/70 uppercase text-[10px] whitespace-nowrap">
                  <tr>
                    <th className="p-4">Khách Hàng</th>
                    <th className="p-4">Liên Hệ</th>
                    <th className="p-4">Địa Chỉ</th>
                    <th className="p-4 text-center">Đơn Hàng</th>
                    <th className="p-4 text-right">Tổng Chi Tiêu</th>
                    <th className="p-4">Ngày Tham Gia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-primary/5">
                  {(() => {
                    const filtered = customersList.filter(c => 
                      c.fullName.toLowerCase().includes(customerSearch.toLowerCase()) ||
                      c.phone.includes(customerSearch) ||
                      c.email.toLowerCase().includes(customerSearch.toLowerCase())
                    );
                    return filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-brand-fb/50 italic font-sans">
                          Không tìm thấy khách hàng nào.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((c) => (
                        <tr key={c.id} className="hover:bg-brand-primary/2">
                          <td className="p-4 font-bold text-[#412C20] flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center font-serif text-xs">
                              {c.fullName.split(" ").pop()?.charAt(0) || "C"}
                            </div>
                            <span>{c.fullName}</span>
                          </td>
                          <td className="p-4 text-[#412C20]/80 space-y-0.5">
                            <div className="flex items-center gap-1">
                              <Phone size={10} className="text-[#412C20]/40" />
                              <span>{c.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail size={10} className="text-[#412C20]/40" />
                              <span className="text-[#412C20]/60 text-[10px]">{c.email}</span>
                            </div>
                          </td>
                          <td className="p-4 text-[#412C20]/70 truncate max-w-[200px]" title={c.address}>
                            {c.address}
                          </td>
                          <td className="p-4 text-center font-mono font-bold text-[#412C20]">
                            {c.totalOrders} đơn
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-brand-primary">
                            {c.totalSpent.toLocaleString("vi-VN")}đ
                          </td>
                          <td className="p-4 text-[#412C20]/50 font-mono text-[10px]">
                            {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                          </td>
                        </tr>
                      ))
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PROCESSING RETURN CLAIMS PROCESSOR */}
        {activeTab === "returns" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <h3 className="font-serif font-bold text-md text-brand-fb">Duyệt Đơn Đổi Trả Lỗi Khuyết</h3>

            {returnRequests.length === 0 ? (
              <p className="text-xs text-brand-fb/50 italic py-6">Màng rạp chưa nhận đơn khiếu hoàn sồi nào.</p>
            ) : (
              <div className="space-y-4">
                {returnRequests.map((ret) => (
                  <div key={ret.id} className="bg-brand-card p-5 rounded-xl border border-brand-primary/5 space-y-2 text-xs font-sans text-left">
                    <div className="flex justify-between items-center text-[10px]">
                      <strong className="text-brand-primary font-mono">{ret.id}</strong>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        ret.status === "Chờ xử lý" ? "bg-yellow-100 text-yellow-700" :
                        ret.status === "Đã chấp nhận" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {ret.status}
                      </span>
                    </div>

                    <p className="font-serif font-bold text-brand-fb text-sm truncate">{ret.productName}</p>
                    <p className="text-[10px] text-brand-fb/50 truncate">Mã đơn dệt: {ret.orderId}</p>
                    <p className="italic text-brand-fb/70 bg-white/50 p-2.5 rounded border leading-snug">“{ret.reason}”</p>

                    {/* Accept/deny buttons */}
                    {ret.status === "Chờ xử lý" && (
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => handleProcessReturn(ret.id, "Đã chấp nhận")}
                          className="bg-green-600 text-white font-sans text-[10px] font-bold px-4 py-1.5 rounded-md cursor-pointer"
                        >
                          Chấp nhận gởi đổi bù
                        </button>
                        <button
                          onClick={() => handleProcessReturn(ret.id, "Đã từ chối")}
                          className="bg-transparent text-red-650 border border-red-200 text-[10px] font-bold px-4 py-1.5 rounded-md cursor-pointer"
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5.5: REALTIME SMS/EMAIL NOTIFICATIONS SENT LOGS */}
        {activeTab === "notifications" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="flex justify-between items-center border-b border-brand-primary/10 pb-3">
              <h3 className="font-serif font-bold text-md text-brand-fb">Nhật Ký Thông Báo Đơn Hàng ({notificationsList.length})</h3>
              <span className="text-[10px] text-green-650 font-mono font-bold uppercase animate-pulse select-none">
                ● Live Dispatcher
              </span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {notificationsList.length === 0 ? (
                <p className="text-xs text-brand-fb/50 italic py-6 text-center">Chưa có thông báo nào được tạo.</p>
              ) : (
                notificationsList.map((n) => {
                  const isCompleted = n.type === "completed";
                  const isCancelled = n.type === "cancelled";
                  const isShipping = n.type === "shipping";
                  const isPreparing = n.type === "preparing";

                  return (
                    <div 
                      key={n.id} 
                      className="p-4 rounded-2xl bg-white border border-brand-primary/8 text-xs flex items-start gap-4 hover:shadow-xs transition-shadow"
                    >
                      <div className={`p-2.5 rounded-full shrink-0 ${
                        isCompleted ? "bg-green-50 text-green-700" :
                        isCancelled ? "bg-red-50 text-red-700" :
                        isShipping ? "bg-purple-50 text-purple-700" :
                        isPreparing ? "bg-amber-50 text-amber-700" :
                        "bg-blue-50 text-blue-700"
                      }`}>
                        {isCompleted ? <CheckCircle2 size={16} /> :
                         isCancelled ? <XCircle size={16} /> :
                         isShipping ? <Truck size={16} /> :
                         isPreparing ? <Package size={16} /> :
                         <Clock size={16} />}
                      </div>

                      <div className="flex-grow space-y-1 text-left">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <div>
                            <strong className="text-[#412C20] text-[13px] font-sans">
                              {n.receiver}
                            </strong>
                            <span className="ml-2 font-mono text-[9px] bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded">
                              {n.channel.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#412C20]/35">
                            {new Date(n.createdAt).toLocaleTimeString("vi-VN")} {new Date(n.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <p className="text-[#412C20]/80 text-[11px] leading-relaxed">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-1 text-[9px] text-[#412C20]/40 font-mono">
                          <span>Mã đơn:</span>
                          <strong className="text-brand-primary">{n.orderCode}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 6: CAMPAIGNS & MARKETING VOUCHERS REDEMPTIONS */}
        {activeTab === "marketing" && (
          <div className="space-y-8 animate-fadeIn text-left">
            <h3 className="font-serif font-bold text-md text-brand-fb">Chiến dịch Khuyến Quà & Tặng Xu</h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left container create new coupon code Form */}
              <div className="md:col-span-6 bg-brand-card p-6 rounded-2xl border border-brand-primary/10 space-y-4 text-left">
                <h4 className="font-serif font-bold text-xs text-brand-fb uppercase border-b border-brand-primary/5 pb-2">Đúc Thẻ Khuyến Quà Mới</h4>
                
                <form onSubmit={handleCreateCouponCode} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-sans font-bold text-brand-fb/60 uppercase mb-1">Mã chữ hoa:</label>
                    <input
                      type="text"
                      required
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      placeholder="MÃ: KHANLOFTY..."
                      className="w-full text-xs font-sans px-3.5 py-2 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-bold text-brand-fb/60 uppercase mb-1">Cấp tiền bồi giảm (VND):</label>
                    <input
                      type="number"
                      required
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                      placeholder="25000"
                      className="w-full text-xs font-sans px-3.5 py-2 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-brand-primary-light text-white font-sans text-xs font-semibold py-3 rounded-lg cursor-pointer"
                  >
                    Sinh Thẻ Khuyến Quà
                  </button>
                </form>
              </div>

              {/* Right container available coupons lists */}
              <div className="md:col-span-6 bg-brand-card p-5 rounded-2xl border border-brand-primary/10 space-y-3.5">
                <h4 className="font-serif font-bold text-xs text-brand-fb uppercase border-b border-brand-primary/5 pb-2">Danh sách Vouchers Live</h4>
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {activeCoupons.map((c) => (
                    <div key={c.code} className="p-3 rounded-xl bg-white border border-brand-primary/5 flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-brand-primary font-mono">{c.code}</strong>
                        <p className="text-[10px] text-brand-fb/50 italic leading-snug">{c.description}</p>
                      </div>
                      <span className="font-mono font-bold text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded">
                        Giảm {c.discountValue.toLocaleString()}đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 7: BLOG & META SEO EDITOR FOR SEO KEYWORDS AND META DESCRIPTION */}
        {activeTab === "blog" && (
          <div className="space-y-8 animate-fadeIn text-left">
            <h3 className="font-serif font-bold text-md text-brand-fb">Khóa SEO Meta & Ấn Bản Thời Cuốn</h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left container SEO meta modifier */}
              <div className="md:col-span-6 bg-brand-card p-6 rounded-2xl border border-brand-primary/10 space-y-4 text-left">
                <h4 className="font-serif font-bold text-xs text-brand-fb uppercase border-b border-brand-primary/5 pb-2 flex items-center gap-1.5">
                  <FileText size={13} className="text-brand-primary" />
                  Quy Chuẩn SEO Meta tags chỉnh sửa
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-sans font-bold text-brand-fb/60 uppercase mb-1.5">Meta Title Tiêu Đề khóa:</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full text-xs font-sans px-3.5 py-2.5 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-bold text-brand-fb/60 uppercase mb-1.5">Meta Description Mô Tả rạp:</label>
                    <textarea
                      rows={3}
                      value={metaDesc}
                      onChange={(e) => setMetaDesc(e.target.value)}
                      className="w-full text-xs font-sans px-3.5 py-2.5 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setMetaSuccess(true);
                      setTimeout(() => setMetaSuccess(false), 3000);
                    }}
                    className="w-full bg-brand-fb hover:bg-zinc-800 text-white font-sans text-xs py-3 rounded-lg cursor-pointer"
                  >
                    Áp dụng SEO tags (Instant live update)
                  </button>

                  <AnimatePresence>
                    {metaSuccess && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-2 bg-green-50 text-green-700 text-[10px] rounded-lg font-bold"
                      >
                        * Meta Title và Meta Description đã được cấu trúc vào thẻ trang live!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right container Write new post logs */}
              <div className="md:col-span-6 bg-brand-card p-6 rounded-2xl border border-brand-primary/10 space-y-4 text-left">
                <h4 className="font-serif font-bold text-xs text-brand-fb uppercase border-b border-brand-primary/5 pb-2 flex items-center gap-1.5">
                  <Edit3 size={13} className="text-brand-primary" />
                  Ghi soạn bài viết tạp chí mới
                </h4>

                <form onSubmit={handleWriteStaffBlog} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-sans font-bold text-brand-fb/60 uppercase mb-1">Tựa đề bài dệt:</label>
                    <input
                      type="text"
                      required
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                      placeholder="Gõ tiêu đề bài chia sẻ..."
                      className="w-full text-xs font-sans px-3.5 py-2 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-bold text-brand-fb/60 uppercase mb-1">Kênh mục nhóm bài:</label>
                    <select
                      value={newBlogCategory}
                      onChange={(e) => setNewBlogCategory(e.target.value)}
                      className="w-full text-xs font-sans px-3.5 py-2.5 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none"
                    >
                      <option value="Cẩm Nang">Cẩm Nang Bảo Dệt</option>
                      <option value="Ý Nghĩa Quà">Ý Nghĩa Quà Sợi</option>
                      <option value="Xu Hướng">Xu Hướng Nàng Thơ Soft-Girl</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-bold text-brand-fb/60 uppercase mb-1">Nội dung thêu viết:</label>
                    <textarea
                      required
                      rows={4}
                      value={newBlogContent}
                      onChange={(e) => setNewBlogContent(e.target.value)}
                      placeholder="Bài trình bày về cách nâng niu túi gấu bông len..."
                      className="w-full text-xs font-sans px-3.5 py-2 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-brand-primary-light text-white text-xs font-semibold py-3 rounded-lg cursor-pointer"
                  >
                    Xuất bản lên Trang bài viết
                  </button>
                </form>

                <AnimatePresence>
                  {blogAddSuccess && (
                     <motion.p
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="text-[10px] text-green-600 font-bold"
                     >
                       * Đã xuất bản lên chuyên mục! Bài viết hiện diện live tại rạp Tạp chí rồi nàng nhé.
                     </motion.p>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
