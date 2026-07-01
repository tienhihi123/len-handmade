import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Mail as MailIcon, Phone as PhoneIcon, MapPin as MapPinIcon } from "lucide-react";
// Import modular layout/nav components
import Logo from "./components/Logo";
import Header from "./components/Header";
import Chatbot from "./components/Chatbot";
import AuthIntroOverlay from "./components/AuthIntroOverlay";
import ProtectedRoute from "./components/ProtectedRoute";
import { BRAND_NAME, BRAND_TAGLINE, BRAND_EMAIL, BRAND_COPYRIGHT } from "./constants/brand";

// Import Multi-page views
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import ReturnsPage from "./pages/ReturnsPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import AdminLayout from "./components/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminInventoryPage from "./pages/AdminInventoryPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminRevenuePage from "./pages/AdminRevenuePage";
import AdminCustomersPage from "./pages/AdminCustomersPage";
import AdminNotificationsPage from "./pages/AdminNotificationsPage";
import AdminReviewsFeedbackPage from "./pages/AdminReviewsFeedbackPage";
import AdminBlogPage from "./pages/AdminBlogPage";
import AdminDocsPage from "./pages/AdminDocsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

const ADMIN_ACCESS_ROLES = [
  "admin",
  "store_owner",
  "marketing_staff",
  "inventory_staff",
  "order_staff",
  "content_staff"
];

export default function App() {
  const location = useLocation();

  // Scroll back to page top on each route transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="bg-brand-bg text-brand-fb font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-brand-primary/20">
      
      {/* Intro visual curtain blocker */}
      <AuthIntroOverlay />
      
      {/* Dynamic responsive sticky navigation bar */}
      <Header />

      {/* Primary site content routing block */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/returns" element={<ProtectedRoute><ReturnsPage /></ProtectedRoute>} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/admin" element={<ProtectedRoute requiredRoles={ADMIN_ACCESS_ROLES}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="inventory" element={<AdminInventoryPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="revenue" element={<AdminRevenuePage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="reviews-feedback" element={<AdminReviewsFeedbackPage />} />
            <Route path="blog" element={<AdminBlogPage />} />
            <Route path="docs" element={<AdminDocsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRoles={ADMIN_ACCESS_ROLES}><AdminDashboardPage /></ProtectedRoute>} />
        </Routes>
      </main>

      {/* Floaty interactive Chatbot widget */}
      <Chatbot />

      {/* Footer — Premium Artisan Yarn Boutique */}
      <footer className="bg-brand-ink text-white/80 font-sans pt-16 pb-8 px-6 md:px-12 configuration-footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">

          {/* Cột 1: Brand Logo & Mô tả */}
          <div className="md:col-span-4 space-y-4 pr-4">
            <div className="flex items-center gap-3">
              {/* Vòng tròn Logo: dùng component <Logo /> trên nền kem linen */}
              <div className="w-10 h-10 rounded-full bg-[#F4EFEA] border border-[#A47E5C]/30 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden p-1">
                <Logo className="w-full h-full text-[#2B221B]" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold tracking-wide text-lg leading-none">{BRAND_NAME}</span>
                <span className="text-[#A47E5C] text-xs uppercase tracking-widest font-medium mt-1">{BRAND_TAGLINE}</span>
              </div>
            </div>
            <p className="text-sm text-white/63 leading-relaxed max-w-[320px]">
              Cửa hàng chuyên cung cấp sản phẩm dệt len thêu gấm thủ công hoa nổi, phụ kiện nơ túi gỗ Boho và đồ lưu niệm tốt nghiệp cao cấp. Trao gửi hạnh phúc thông qua từng thớ vải tơ dệt mộc dã thơm mùi nhài.
            </p>
          </div>

          {/* Cột 2: Khám phá */}
          <div className="md:col-span-2 md:pl-4">
            <h4 className="text-xs font-bold tracking-widest text-white/90 uppercase mb-5 font-sans">Khám Phá</h4>
            <ul className="space-y-3.5 text-sm">
              {["Trang chủ", "Thế giới Móc Sợi", "Tạp chí Sợi Len", "Kênh liên hệ", "Tra cứu đơn hàng"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 hover:text-[#A47E5C] transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Kênh liên lạc */}
          <div className="md:col-span-3 md:pl-4">
            <h4 className="text-xs font-bold tracking-widest text-white/90 uppercase mb-5 font-sans">Kênh Liên Lạc</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3 text-white/60">
                <MailIcon className="w-4 h-4 min-w-[16px] min-h-[16px] flex-shrink-0 text-[#A47E5C] mt-0.5" />
                <span className="hover:text-[#A47E5C] cursor-pointer transition-colors break-all">{BRAND_EMAIL}</span>
              </li>
              <li className="flex items-start gap-3 text-white/60">
                <PhoneIcon className="w-4 h-4 min-w-[16px] min-h-[16px] flex-shrink-0 text-[#A47E5C] mt-0.5" />
                <span>0912 443 1102</span>
              </li>
              <li className="flex items-start gap-3 text-white/60">
                <MapPinIcon className="w-4 h-4 min-w-[16px] min-h-[16px] flex-shrink-0 text-[#A47E5C] mt-0.5" />
                <span className="leading-relaxed">252 Lý Tự Trọng, P. Bến Thành, Quận 1, TP. Hồ Chí Minh</span>
              </li>
            </ul>
          </div>

          {/* Cột 4: Chính sách */}
          <div className="md:col-span-3 md:pl-4">
            <h4 className="text-xs font-bold tracking-widest text-white/90 uppercase mb-5 font-sans">Chính Sách</h4>
            <ul className="space-y-3.5 text-sm">
              {["Chính sách đổi trả 7 ngày", "Kháng khuẩn gấm", "Bảo đảm kim móc mộc", "Hội thợ len Việt"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 hover:text-[#A47E5C] transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 md:pr-20">
          <p>{BRAND_COPYRIGHT}</p>
          <p className="flex items-center gap-2 font-medium">
            <span>Bảo mật giao dịch mã hóa</span>
            <span className="text-white/20">♦</span>
            <span className="text-[#A47E5C]">SSL Secure</span>
          </p>
        </div>
      </footer>




    </div>
  );
}
