import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Star, ArrowRight, Search, AlertCircle, ShoppingBag, Eye, SlidersHorizontal, ListFilter } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Product } from "../types";
import { useDragScroll } from "../hooks/useDragScroll";
import ProductCard from "../components/ProductCard";
import { usePageSeo } from "../hooks/usePageSeo";
import { BRAND_NAME } from "../constants/brand";

export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { productsList, wishlist, setWishlist, cart, setCart, addActivity, viewStats, categoriesList } = useApp();
  const dragScroll = useDragScroll();

  // Route state checker for clicked category from home page
  const routeState = location.state as { initialCategory?: string } | null;
  const initialCat = routeState?.initialCategory || "Tất cả";

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("recommended"); // "price-asc" | "price-desc"| "rating" | "most-viewed"
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Sync routeState category if it shifts
  useEffect(() => {
    if (routeState?.initialCategory) {
      setSelectedCategory(routeState.initialCategory);
    }
  }, [routeState]);

  // Sync search keyword from URL Query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  const handleToggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const getDefaultProductVariant = (product: Product) => {
    const selectedColor = product.colors[0]?.name || "Mặc định";
    const selectedSize = product.sizes[0] || "Tiêu chuẩn";
    const selectedMaterial = product.materials[0]?.name || product.material;
    return { selectedColor, selectedSize, selectedMaterial };
  };

  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    if (product.requiresQuote) {
      navigate(`/products/${product.id}`);
      return;
    }

    const { selectedColor, selectedSize, selectedMaterial } = getDefaultProductVariant(product);
    const id = `${product.id}_${selectedColor.replace(/\s+/g, "")}_${selectedMaterial.replace(/\s+/g, "")}_${selectedSize.replace(/\s+/g, "")}`;
    const existing = cart.find(item => item.id === id);

    setCart(previous => existing
      ? previous.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...previous, { id, product, selectedColor, selectedSize, selectedMaterial, quantity: 1 }]
    );

    addActivity("Thêm giỏ hàng", product.id, `${product.name} (${selectedColor})`, "cart");
  };

  const handleBuyNow = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    if (product.requiresQuote) {
      navigate(`/products/${product.id}`);
      return;
    }

    handleAddToCart(product, event);
    navigate("/checkout");
  };

  usePageSeo(
    `Sản phẩm len handmade | ${BRAND_NAME}`,
    "Khám phá áo len, túi len, bóp mini, móc khóa và phụ kiện handmade với màu sắc có thể tùy chọn."
  );

  // Live Filtration Logic
  const getFilteredProducts = () => {
    let result = [...productsList];

    // Filter by Category
    if (selectedCategory !== "Tất cả") {
      result = result.filter(p =>
        p.category === selectedCategory ||
        (selectedCategory === "Thú bông / Amigurumi" && p.category === "Gấu bông len")
      );
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
      );
    }

    // Filter by Price cap
    result = result.filter(p => (p.priceMin ?? p.price) <= maxPrice);

    // Filter by Min Rating rating
    result = result.filter(p => p.rating >= minRating);

    // Apply Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "most-viewed") {
      // Real-time view statistic sorted!
      result.sort((a, b) => {
        const viewsA = viewStats.find(s => s.productId === a.id)?.totalViews || 0;
        const viewsB = viewStats.find(s => s.productId === b.id)?.totalViews || 0;
        return viewsB - viewsA;
      });
    }

    return result;
  };

  const filtered = getFilteredProducts();

  const DEFAULT_TITLE = "Danh Mục Sản Phẩm Mộc Mạc";
  const DEFAULT_DESCRIPTION = "Lướt xem bộ sưu tập len hand-hooked tinh chế sắc nét, túi nơ gỗ Boho, hoa trang nhã tốt nghiệp.";
  const selectedCategoryData = categoriesList.find((c) => c.name === selectedCategory);
  const pageTitle = selectedCategory === "Tất cả" ? DEFAULT_TITLE : selectedCategoryData?.name || selectedCategory;
  const pageDescription = selectedCategory === "Tất cả" ? DEFAULT_DESCRIPTION : selectedCategoryData?.description || DEFAULT_DESCRIPTION;

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-left">
      <div className="max-w-7xl mx-auto">
        {/* Banner header titles */}
        <div className="mb-10 pb-6 border-b border-brand-primary/10">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary block mb-2">✦ Cửa hàng dệt len ✦</span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-fb">{pageTitle}</h1>
          <p className="font-sans text-xs sm:text-sm text-brand-fb/60 mt-1">{pageDescription}</p>
        </div>

        {/* Filters and main grid layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LỢT FILTER PANEL (Desktop Sidebar - only visible on lg screens) */}
          <div className="hidden lg:block lg:col-span-3 bg-brand-card p-4 lg:p-5 rounded-2xl border border-brand-primary/10 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-brand-primary/5">
              <SlidersHorizontal size={16} className="text-brand-primary" />
              <h3 className="font-serif font-bold text-sm text-brand-fb">Bộ Lọc Tìm Kiếm</h3>
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-sans font-bold text-brand-fb/70 uppercase">Từ khóa dệt:</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Gõ tìm túi, hoa, thêu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-sans pl-9 pr-4 py-2 rounded-xl border border-brand-primary/10 bg-white text-brand-fb outline-none focus:border-brand-primary"
                />
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-fb/40" />
              </div>
            </div>

            {/* Categories filters vertical links */}
            <div className="space-y-2.5">
              <label className="font-label-italic text-sm text-gold flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gold/60" />
                Trưng bày nhóm
              </label>
              <ul className="space-y-1">
                {["Tất cả", "Áo len thủ công", "Túi len handmade", "Phụ kiện len", "Thú bông / Amigurumi", "Móc khóa len", "Hoa len", "Khăn len"].map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`group w-full text-left font-sans text-sm py-3 px-4 rounded-xl flex items-center justify-between transition-all duration-300 cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-gradient-to-r from-gold/15 to-gold/5 text-gold font-bold border-l-3 border-gold shadow-sm"
                          : "text-cocoa/70 hover:bg-ivory/50 hover:text-cocoa hover:translate-x-1"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {selectedCategory === cat && <span className="text-base">✦</span>}
                        {cat}
                      </span>
                      {selectedCategory === cat && <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price maximum caps slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline text-[11px] uppercase text-brand-fb/75 font-sans font-bold">
                <span>Ngân sách dệt:</span>
                <span className="font-mono text-brand-primary font-bold">{maxPrice.toLocaleString("vi-VN")}đ</span>
              </div>
              <input
                type="range"
                min="30000"
                max="500000"
                step="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-primary cursor-pointer mt-1"
              />
              <div className="flex justify-between font-mono text-[9px] text-[#A89F95]">
                <span>30.000đ</span>
                <span>500.000đ</span>
              </div>
            </div>

            {/* Star ratings minimum */}
            <div className="space-y-2.5">
              <label className="font-label-italic text-sm text-gold flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gold/60" />
                Chất lượng sao
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {[0, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    onClick={() => setMinRating(starVal)}
                    className={`group relative px-4 py-2.5 text-sm rounded-xl border-2 text-center transition-all duration-300 cursor-pointer font-sans font-semibold overflow-hidden ${
                      minRating === starVal
                        ? "bg-gold border-gold text-white shadow-soft scale-105"
                        : "bg-ivory/40 border-divider-beige text-cocoa/70 hover:border-gold/40 hover:bg-ivory hover:scale-102"
                    }`}
                  >
                    {minRating === starVal && (
                      <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    )}
                    <span className="relative">
                      {starVal === 0 ? "Tất cả" : `${starVal}★+`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* RESET ALL BUTTON */}
            <button
              onClick={() => {
                setSelectedCategory("Tất cả");
                setSearchQuery("");
                setMaxPrice(500000);
                setMinRating(0);
                setSortBy("recommended");
              }}
              className="group w-full bg-gradient-to-r from-ivory/80 to-cream/60 hover:from-gold/10 hover:to-gold/5 border-2 border-divider-beige hover:border-gold/40 text-cocoa hover:text-gold font-bold text-sm py-3.5 rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <span className="text-base group-hover:rotate-180 transition-transform duration-500">✦</span>
              <span className="font-label-italic">Đặt Lại Bộ Lọc</span>
            </button>
          </div>

          {/* MAIN PRODUCTS DISPLAY WINDOW */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            
            {/* Swiper / Horizontal Scrollable Filter Strip for mobile/tablet */}
            <div className="lg:hidden flex items-center gap-2 mb-2 w-full select-none">
              <div 
                {...dragScroll.props}
                className="flex-grow flex gap-2 overflow-x-auto pb-1.5 scrollbar-none scroll-smooth cursor-grab active:cursor-grabbing select-none"
              >
                {["Tất cả", "Áo len thủ công", "Túi len handmade", "Phụ kiện len", "Thú bông / Amigurumi", "Móc khóa len", "Hoa len", "Khăn len"].map((cat) => (
                  <button
                    key={cat}
                    onClick={(e) => dragScroll.handleItemClick(e, () => setSelectedCategory(cat))}
                    className={`px-4 py-2 rounded-full text-xs font-sans font-semibold border transition-all truncate cursor-pointer select-none whitespace-nowrap shrink-0 ${
                      selectedCategory === cat
                        ? "bg-brand-primary border-brand-primary text-white shadow-xs"
                        : "bg-white border-brand-primary/10 text-brand-fb/75 hover:bg-brand-primary/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className={`px-4.5 py-2 rounded-full border flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-all text-xs font-sans font-bold hover:bg-[#CEAF75]/5 ${
                  isFilterExpanded
                    ? "bg-[#CEAF75]" : "bg-white border-brand-primary/15 text-brand-fb"
                }`}
                style={{ color: isFilterExpanded ? "#FFF" : "" }}
              >
                <SlidersHorizontal size={12} />
                <span>Bộ lọc</span>
              </button>
            </div>

            {/* Collapsible Mobile Filters Drawer */}
            <AnimatePresence>
              {isFilterExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="lg:hidden overflow-hidden bg-brand-card p-5 rounded-2xl border border-brand-primary/10 shadow-sm space-y-5 mb-4 text-left"
                >
                  <h4 className="font-serif font-bold text-xs text-[#CEAF75] border-b border-brand-primary/5 pb-2 uppercase tracking-wider">Tùy Chọn Lọc Nâng Cao</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Keyword search box */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-sans font-bold text-brand-fb/60 uppercase block">Từ khóa dệt:</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Nhập tên sản phẩm..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full text-xs font-sans pl-9 pr-3 py-2 rounded-xl border border-brand-primary/10 bg-white text-brand-fb outline-none focus:border-brand-primary"
                        />
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-fb/40" />
                      </div>
                    </div>

                    {/* Price range caps */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline text-[10px] uppercase text-brand-fb/60 font-sans font-bold">
                        <span>Giá dệt tối đa:</span>
                        <span className="font-mono text-brand-primary font-bold">{maxPrice.toLocaleString("vi-VN")}đ</span>
                      </div>
                      <input
                        type="range"
                        min="30000"
                        max="500000"
                        step="10000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-brand-primary cursor-pointer mt-1"
                      />
                    </div>

                    {/* Quality ratings */}
                    <div className="space-y-1 col-span-1 sm:col-span-2">
                      <label className="text-[10px] font-sans font-bold text-brand-fb/60 uppercase block">Đánh giá tối thiểu:</label>
                      <div className="flex items-center gap-1.5">
                        {[0, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            onClick={() => setMinRating(starVal)}
                            className={`px-3 py-1.5 text-xs rounded-lg border text-center transition-colors font-mono cursor-pointer flex-1 ${
                              minRating === starVal
                                ? "bg-brand-primary border-brand-primary text-white"
                                : "bg-white border-brand-primary/10 text-brand-fb hover:bg-brand-primary/5"
                            }`}
                          >
                            {starVal === 0 ? "Tất cả" : `${starVal}★+`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-brand-primary/5">
                    <button
                      onClick={() => {
                        setSelectedCategory("Tất cả");
                        setSearchQuery("");
                        setMaxPrice(500000);
                        setMinRating(0);
                        setSortBy("recommended");
                      }}
                      className="text-xs font-sans font-bold text-[#A89F95] hover:text-brand-fb transition-colors underline cursor-pointer"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                    <button
                      onClick={() => setIsFilterExpanded(false)}
                      className="bg-[#CEAF75] hover:bg-[#CEAF75]/90 text-white text-xs font-sans font-bold px-5 py-2 rounded-full transition-all"
                    >
                      Áp dụng bộ lọc
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Sort toolbar header options */}
            <div className="bg-brand-card p-4 rounded-2xl border border-brand-primary/5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 font-sans text-xs text-brand-fb/60">
                <ListFilter size={14} className="text-brand-primary" />
                Tìm thấy <span className="font-mono font-bold text-brand-fb">{filtered.length}</span> sản phẩm phù ứng
              </div>

              {/* Real-time sorted button for "most viewed" of course! */}
              <div className="flex items-center gap-3">
                <span className="font-label-italic text-sm text-gold whitespace-nowrap">Sắp xếp theo</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="font-sans text-xs bg-ivory/60 backdrop-blur-sm border-2 border-gold/20 hover:border-gold/40 px-5 py-2.5 rounded-xl text-cocoa focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all cursor-pointer shadow-soft pr-10 appearance-none font-medium"
                  >
                    <option value="recommended">✦ Khuyên chọn (Mặc định)</option>
                    <option value="most-viewed">🔥 Xem nhiều nhất</option>
                    <option value="price-asc">💸 Giá thấp → cao</option>
                    <option value="price-desc">💰 Giá cao → thấp</option>
                    <option value="rating">⭐ Đánh giá cao</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gold">
                    <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 3.5l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty matching fallback warning */}
            {filtered.length === 0 ? (
              <div className="py-24 text-center bg-brand-card rounded-[32px] border border-dashed border-brand-primary/20 p-8 max-w-xl mx-auto space-y-4">
                <AlertCircle className="w-12 h-12 text-brand-primary mx-auto animate-bounce" />
                <h3 className="font-serif font-bold text-lg text-brand-fb">Không có đồ dệt khớp bộ lọc</h3>
                <p className="font-sans text-xs text-brand-fb/65 max-w-xs mx-auto">
                  Hãy giảm một vài tiêu chí lọc hoặc nhấp nút để reset tủ hàng, khám phá tơ len hoa hướng dương dệt nổi.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("Tất cả");
                    setSearchQuery("");
                    setMaxPrice(500000);
                    setMinRating(0);
                    setSortBy("recommended");
                  }}
                  className="bg-brand-primary hover:bg-brand-primary-light text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow-sm cursor-pointer"
                >
                  Thiết Lập Lại Tất Cả
                </button>
              </div>
            ) : (
              /* GRID OF PRODUCTS */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((prod) => (
                  <div key={prod.id} className="h-full">
                    <ProductCard
                      product={prod}
                      isWishlisted={wishlist.includes(prod.id)}
                      onOpen={() => navigate(`/products/${prod.id}`)}
                      onToggleWishlist={(event) => handleToggleWishlist(prod.id, event)}
                      onAddToCart={(event) => handleAddToCart(prod, event)}
                      onBuyNow={(event) => handleBuyNow(prod, event)}
                      onRequestQuote={(event) => {
                        event.stopPropagation();
                        navigate("/contact", { state: { productName: prod.name } });
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
