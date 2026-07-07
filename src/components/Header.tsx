import { useState, ChangeEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Logo from "./Logo";
import {
  ShoppingBag, Heart, Search, Menu, X, Trash2, Plus, Minus, ShieldCheck,
  User, LayoutDashboard, CreditCard, Award, LogOut
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAdminAuth } from "../context/AdminAuthContext";
import { BRAND_NAME, BRAND_TAGLINE } from "../constants/brand";
import { calculateCartTotal, countCartItems } from "../utils/pricing";
import { STAFF_ROLE_DASHBOARD_PATH } from "../lib/permissions";

// Animated middle logo featuring single main dynamic vector logo
function LogoHookAnimated() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div 
      className="relative flex items-center justify-center select-none cursor-pointer w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
      onClick={handleLogoClick}
    >
      {/* Main Dynamic Vector Logo from Uploaded Image */}
      <Logo size="100%" animate={true} />
    </div>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    cart, setCart, wishlist, setWishlist, currentUser, logoutUser, hasPermission, productsList, setProductsList
  } = useApp();
  const { isActiveStaff, staff } = useAdminAuth();
  const accountLinkPath = isActiveStaff && staff ? STAFF_ROLE_DASHBOARD_PATH[staff.roleId] : "/account";

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [hoveredCartImage, setHoveredCartImage] = useState<string | null>(null);

  const cartTotal = calculateCartTotal(cart);

  const handleRemoveFromCart = (itemId: string) => {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;
    if (!window.confirm(`Xoá "${item.product.name}" khỏi giỏ dệt?`)) return;
    // Restore stock to the product
    setProductsList(prev =>
      prev.map(p =>
        p.id === item.product.id ? { ...p, stock: p.stock + item.quantity } : p
      )
    );
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
  };

  // Dynamic navigation options
  const menuItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Sản phẩm", path: "/products" },
    { label: "Blog", path: "/blog" },
    { label: "Liên hệ", path: "/contact" },
    { label: "Tra cứu đơn", path: "/track-order" }
  ];

  const handleItemClick = (item: { label: string; path: string }) => {
    navigate(item.path);
  };

  // Dynamic autocomplete suggestions
  const searchSuggestions = searchVal.trim().length > 0
    ? productsList.filter(prod => 
        prod.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchVal.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSuggestionClick = (productId: string) => {
    setIsSearchOpen(false);
    setSearchVal("");
    navigate(`/products/${productId}`);
  };

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-[#FBF6F0] border-b border-[#E8DDD1]/60 transition-all duration-300">
        <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] lg:px-[32px] xl:px-[48px] h-[64px] lg:h-[96px] grid grid-cols-[1fr_auto_1fr] items-center gap-6">
          {/* Left: Brand section */}
          <div className="justify-self-start flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 -ml-2 rounded-full flex items-center justify-center cursor-pointer lg:hidden transition-all duration-200 active:scale-95"
              aria-label="Menu"
              style={{ minWidth: "44px", minHeight: "44px" }}
            >
              {isMobileMenuOpen ? <X size={22} className="text-[#3F2B22]" /> : <Menu size={22} className="text-[#3F2B22]" />}
            </button>

            {/* Logo icon */}
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 lg:w-11 lg:h-11 flex-none relative flex items-center justify-center cursor-pointer bg-transparent border-none"
              aria-label="Trang chủ"
            >
              <Logo size="100%" animate={true} />
            </button>

            {/* Brand name + subtitle */}
            <div className="flex-col hidden sm:flex">
              <span className="font-serif text-lg lg:text-xl font-semibold text-[#3F2B22] leading-none whitespace-nowrap">
                {BRAND_NAME}
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#B38A62] whitespace-nowrap">
                {BRAND_TAGLINE}
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex justify-self-center items-center gap-6 xl:gap-[32px]">
            {[
              { label: "Trang chủ", path: "/" },
              { label: "Sản phẩm", path: "/products" },
              { label: "Giới thiệu", path: "/about" },
              { label: "Blog", path: "/blog" },
              { label: "Liên hệ", path: "/contact" },
              { label: "Tra cứu đơn", path: "/track-order" }
            ].map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleItemClick(item)}
                  className={`text-sm xl:text-base font-normal whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${
                    isActive
                      ? "text-[#B38A62] border border-[#C8A982] px-2.5 py-1.5 rounded-sm"
                      : "text-[#3F2B22] hover:text-[#B38A62] px-2.5 py-1.5 border border-transparent"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Action icons */}
          <div className="justify-self-end flex items-center gap-3 xl:gap-[16px]" id="navbar-actions">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-10 h-10 inline-flex items-center justify-center text-[#3F2B22] transition-colors hover:text-[#B38A62] cursor-pointer bg-transparent border-none"
              title="Tìm kiếm"
            >
              <Search size={20} className="w-5 h-5" />
            </button>

            {/* Dynamic Avatar / Login */}
            {currentUser ? (
              <Link
                to={accountLinkPath}
                className="w-10 h-10 rounded-full overflow-hidden border border-[#C8A982]/30 hover:border-[#B38A62] transition-all shrink-0"
                title={`Tài khoản: ${currentUser.name}`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150";
                  }}
                />
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-10 h-10 inline-flex items-center justify-center text-[#3F2B22] transition-colors hover:text-[#B38A62]"
                title="Đăng nhập"
              >
                <User size={20} className="w-5 h-5" />
              </Link>
            )}

            {/* Wishlist */}
            <Link
              to="/favorites"
              className="w-10 h-10 inline-flex items-center justify-center text-[#3F2B22] transition-colors hover:text-[#B38A62] relative shrink-0"
              title="Ưa thích"
            >
              <Heart size={20} className={`w-5 h-5 ${wishlist.length > 0 ? "fill-[#B38A62] text-[#B38A62]" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#B38A62] text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-10 h-10 inline-flex items-center justify-center text-[#3F2B22] transition-colors hover:text-[#B38A62] cursor-pointer bg-transparent border-none relative shrink-0"
              title="Giỏ dệt"
            >
              <ShoppingBag size={20} className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#B38A62] text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {countCartItems(cart)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Search Modal with Autocomplete Suggestions */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl z-50 border border-[#543D32]/10 flex flex-col gap-2.5"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tìm sợi len, túi đan, khăn choàng..."
                  value={searchVal}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setSearchVal(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchVal.trim()) {
                      setIsSearchOpen(false);
                      navigate(`/products?search=${encodeURIComponent(searchVal)}`);
                    }
                  }}
                  className="flex-grow bg-white border border-brand-primary/20 rounded-xl px-4 py-3 text-sm lg:text-base text-brand-fb placeholder-brand-fb/50 outline-none focus:ring-2 focus:ring-brand-primary/20 font-sans"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (searchVal.trim()) {
                      setIsSearchOpen(false);
                      navigate(`/products?search=${encodeURIComponent(searchVal)}`);
                    }
                  }}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200"
                >
                  Tìm
                </button>
              </div>

              {/* Autocomplete suggestions display block */}
              {searchVal.trim().length > 0 && (
                <div className="bg-white/98 rounded-xl border border-[#543D32]/10 overflow-hidden divide-y divide-[#543D32]/5 max-h-60 overflow-y-auto shadow-sm">
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSuggestionClick(prod.id)}
                        className="flex items-center gap-3 p-2.5 hover:bg-[#CEAF75]/10 cursor-pointer transition-colors text-left"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover bg-white border border-[#543D32]/5"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif font-bold text-xs text-[#412C20] truncate">{prod.name}</h5>
                          <span className="text-[9px] bg-[#CEAF75]/10 text-[#CEAF75] px-1.5 py-0.5 rounded-full font-sans font-medium uppercase tracking-wider block w-fit mt-0.5">{prod.category}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#CEAF75] shrink-0">{prod.price.toLocaleString("vi-VN")}đ</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-[#412C20]/50 italic text-center font-sans">
                      Không tìm thấy gợi ý tương thích...
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Overlay backdrop to close when clicked outside */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 top-[64px] bg-black z-30 cursor-pointer lg:hidden"
              />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden absolute top-full left-0 right-0 w-full bg-[#FBF6F0]/95 backdrop-blur-md p-4 border-b border-[#E8DDD1]/60 flex flex-col gap-2 text-left z-40 max-h-[85vh] overflow-y-auto"
              >
                {/* Mobile-only Search input */}
                <div className="relative mb-2 sm:hidden">
                  <input
                    type="text"
                    placeholder="Tìm sợi len, túi đan, khăn..."
                    value={searchVal}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setSearchVal(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchVal.trim()) {
                        setIsMobileMenuOpen(false);
                        navigate(`/products?search=${encodeURIComponent(searchVal)}`);
                      }
                    }}
                    className="w-full bg-white border border-brand-primary/20 rounded-xl pl-10 pr-4 py-3 text-sm text-brand-fb placeholder-brand-fb/50 outline-none focus:ring-2 focus:ring-brand-primary/20 font-sans"
                  />
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fb/50" />
                </div>

                {/* Mobile-only search autocomplete suggestions */}
                {searchVal.trim().length > 0 && (
                  <div className="sm:hidden bg-[#FDFBF7] rounded-xl border border-[#CEAF75]/10 overflow-hidden divide-y divide-[#CEAF75]/5 max-h-40 overflow-y-auto shadow-sm mb-2">
                    {searchSuggestions.length > 0 ? (
                      searchSuggestions.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setSearchVal("");
                            navigate(`/products/${prod.id}`);
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-[#CEAF75]/10 cursor-pointer transition-colors text-left"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover bg-white"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-serif font-bold text-[11px] text-[#412C20] truncate">{prod.name}</h5>
                            <span className="text-[8px] bg-[#CEAF75]/10 text-[#CEAF75] px-1 py-0.5 rounded-full font-sans font-medium uppercase block w-fit mt-0.5">{prod.category}</span>
                          </div>
                          <span className="font-mono text-[10px] font-bold text-[#CEAF75] shrink-0">
                            {prod.price.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-2.5 text-[10px] text-[#412C20]/50 italic text-center font-sans">
                        Không tìm thấy gợi ý...
                      </div>
                    )}
                  </div>
                )}

                {menuItems.map((item, idx) => (
                  <button
                    key={`${item.label}-${idx}`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleItemClick(item);
                    }}
                    className="font-sans text-left text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl text-[#412C20] hover:bg-[#CEAF75]/10 hover:text-[#CEAF75] transition-all w-full block border-none bg-transparent cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}

                {/* Mobile-only Wishlist link */}
                <Link
                  to="/favorites"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="sm:hidden font-sans text-left text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl text-[#412C20] hover:bg-[#CEAF75]/10 hover:text-[#CEAF75] transition-all w-full flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Heart size={14} className={wishlist.length > 0 ? "fill-[#CEAF75] text-[#CEAF75]" : ""} />
                    Sản Phẩm Ưa Thích
                  </span>
                  {wishlist.length > 0 && (
                    <span className="bg-[#CEAF75] text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Mobile Profile / Auth Indicators */}
                <div className="border-t border-[#543D32]/10 pt-2.5 mt-1 space-y-2">
                  {currentUser ? (
                    <>
                      <Link
                        to={accountLinkPath}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="font-sans text-left text-xs font-bold py-2.5 px-4 rounded-xl text-[#412C20] bg-[#F8F3EC]/50 block w-full"
                      >
                        Bộ Chỉnh Điều: {currentUser.name}
                      </Link>
                      <button
                        onClick={() => {
                          logoutUser();
                          setIsMobileMenuOpen(false);
                          navigate("/login");
                        }}
                        className="font-sans text-left text-xs font-bold py-2.5 px-4 rounded-xl text-red-600 bg-red-50 w-full block cursor-pointer text-left"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-sans text-left text-xs font-bold py-2.5 px-4 rounded-xl text-[#412C20] bg-[#CEAF75]/15 block w-full text-center uppercase"
                    >
                      Đăng nhập tài khoản
                    </Link>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer Slider overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-brand-card z-50 shadow-2xl flex flex-col p-6 border-l border-brand-primary/10"
              id="shopping-cart-drawer"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#543D32]/10">
                <div className="flex items-center gap-2 text-left">
                  <ShoppingBag className="text-[#CEAF75]" size={20} />
                  <h3 className="font-serif font-bold text-lg text-[#412C20]">Giỏ dệt của Nàng</h3>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-[#CEAF75]/10 text-[#CEAF75]">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} món
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#CEAF75]/5 text-[#412C20] hover:text-[#CEAF75] cursor-pointer transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items list container */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                {cart.length === 0 ? (
                  <div className="h-4/5 flex flex-col items-center justify-center text-center p-6 bg-[#F8F3EC]/40 rounded-2xl border border-dashed border-[#CEAF75]/10 m-2">
                    <div className="w-16 h-16 rounded-full bg-[#CEAF75]/5 flex items-center justify-center text-[#CEAF75] mb-4 animate-bounce">
                      <ShoppingBag size={28} />
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#412C20]">Sợi dệt thêu còn đang rỗng...</h4>
                    <p className="font-sans text-xs text-[#412C20]/60 max-w-xs mt-1">Giỏ hàng rỗng quẩn, hãy tìm sản phẩm xinh xắn của tiệm Len nhé!</p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate("/products");
                      }}
                      className="mt-5 font-sans font-bold text-xs bg-[#CEAF75] text-white px-5 py-2.5 rounded-full cursor-pointer shadow-sm hover:bg-[#CEAF75]/90"
                    >
                      Ghé xem Đồ Len Bán Chạy
                    </button>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => {
                    const priceMod = item.product.materials.find(m => m.name === item.selectedMaterial)?.priceModifier || 0;
                    const isMedium = item.selectedSize.includes("Vừa") || item.selectedSize.includes("nhỏ") === false && item.selectedSize.includes("Tiêu chuẩn") === false && item.selectedSize.includes("5 cành") === false;
                    const sizeMod = isMedium ? (item.product.id === "prod_1" ? 40000 : item.selectedSize.includes("9 cành") ? 90000 : item.selectedSize.includes("15 cành") ? 200000 : 0) : 0;
                    const itemUnitCost = item.product.price + priceMod + sizeMod;
                    const matchedCol = item.product.colors?.find(c => c.name === item.selectedColor);
                    const resolvedImg = matchedCol?.image || item.product.image;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
                        exit={{
                          opacity: 0,
                          scale: 0.55,
                          x: 70,
                          y: 60,
                          rotate: -12,
                          filter: "blur(3px)",
                          transition: {
                            duration: 0.45,
                            ease: [0.36, 0, 0.66, -0.56]
                          }
                        }}
                        className={`flex gap-4 bg-[#FDFBF7]/40 p-4 rounded-2xl border border-[#CEAF75]/5 shadow-sm relative overflow-visible text-left group/cartitem ${
                          hoveredCartImage === resolvedImg ? "z-50" : "z-0"
                        }`}
                      >
                        <div
                          className="relative"
                          onMouseEnter={() => setHoveredCartImage(resolvedImg)}
                          onMouseLeave={() => setHoveredCartImage(null)}
                        >
                          <img
                            src={resolvedImg}
                            alt={item.product.name}
                            className="w-20 h-20 rounded-xl object-cover border border-[#CEAF75]/10 bg-white cursor-pointer transition-all hover:border-gold/40"
                            referrerPolicy="no-referrer"
                          />

                          {/* Hover Preview Box */}
                          {hoveredCartImage === resolvedImg && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, x: -10 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.2 }}
                              className="absolute left-full ml-4 top-0 z-50 pointer-events-none"
                            >
                              <div className="w-72 h-72 bg-white rounded-2xl shadow-soft-deep border-2 border-gold/20 overflow-hidden">
                                <img
                                  src={resolvedImg}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            </motion.div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <h4 className="font-sans font-bold text-sm text-[#412C20] truncate">
                            {item.product.name}
                          </h4>

                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <span className="text-xs bg-brand-primary/5 text-brand-primary px-2 py-0.5 rounded-md font-sans">
                              {item.selectedColor}
                            </span>
                            <span className="text-xs bg-brand-primary/5 text-brand-primary px-2 py-0.5 rounded-md font-sans">
                              {item.selectedSize}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3 bg-white border border-[#CEAF75]/10 rounded-full px-3 py-1 shade-sm">
                              <button
                                onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)}
                                className="p-0.5 text-brand-fb hover:text-brand-primary-light cursor-pointer"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm font-mono font-bold text-[#412C20] px-1 min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}
                                className="p-0.5 text-brand-fb hover:text-brand-primary-light cursor-pointer"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <span className="font-mono text-sm font-bold text-brand-primary">
                              {(itemUnitCost * item.quantity).toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </div>

                        <motion.button
                          onClick={() => handleRemoveFromCart(item.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9, rotate: -5 }}
                          className="absolute right-2 top-2 p-1.5 text-[#412C20]/30 hover:text-red-500 hover:bg-red-50 rounded-md cursor-pointer transition-colors group/delete"
                        >
                          <motion.div
                            className="relative"
                            whileHover={{
                              rotate: [0, -10, 10, -10, 0],
                              transition: { duration: 0.4 }
                            }}
                          >
                            <Trash2 size={16} />
                          </motion.div>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                  </AnimatePresence>
                )}
              </div>

              {/* Cart Drawer footer block price summary */}
              {cart.length > 0 && (
                <div className="pt-4 border-t border-[#543D32]/10 space-y-4 text-left">
                  <div className="flex items-center justify-between text-brand-fb">
                    <span className="font-sans text-xs text-brand-fb/60">Tạm tính:</span>
                    <span className="font-mono text-md font-bold text-[#CEAF75]">
                      {cartTotal.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate("/cart");
                      }}
                      className="bg-[#FDFBF7] hover:bg-[#CEAF75]/5 text-[#412C20] font-sans font-bold text-xs py-3.5 rounded-full border border-[#CEAF75]/15 cursor-pointer text-center"
                    >
                      Xem Giỏ Chi Tiết
                    </button>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate("/checkout");
                      }}
                      className="bg-[#CEAF75] hover:bg-[#CEAF75]/90 text-white font-sans font-bold text-xs py-3.5 rounded-full shadow-md text-center cursor-pointer"
                    >
                      Mua Ngay COD 🚚
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
