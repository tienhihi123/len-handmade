import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, Star, ArrowLeft, RefreshCw, Sparkles, CheckCircle2, 
  ChevronRight, Shield, Globe, Award, Copy, HelpCircle, Eye, ShoppingBag
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Product, CartItem } from "../types";
import SafeImage from "../components/SafeImage";
import { usePageSeo } from "../hooks/usePageSeo";
import { calculateItemPrice, parseSizeModifier } from "../utils/pricing";
import { BRAND_NAME } from "../constants/brand";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    productsList, reviewsList, setReviewsList, trackView, 
    wishlist, setWishlist, viewStats, cart, setCart, addActivity
  } = useApp();

  // Find the current product
  const product = productsList.find(p => p.id === id);

  usePageSeo(
    product ? `${product.name} | ${BRAND_NAME}` : `Sản phẩm | ${BRAND_NAME}`,
    product?.description || "Khám phá sản phẩm len handmade được làm thủ công tỉ mỉ."
  );

  // States for interactive custom styles
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [customNote, setCustomNote] = useState<string>("");
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Review submission states
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewSent, setReviewSent] = useState(false);

  // Trigger telemetry tracking and load default options
  useEffect(() => {
    if (product) {
      trackView(product.id, product.name, product.category);
      
      // Load default options from data structure, prioritizing pre-selected color from navigation state
      const stateColor = location.state?.selectedColor;
      if (stateColor && product.colors?.some(c => c.name === stateColor)) {
        setSelectedColor(stateColor);
      } else if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name);
      }
      if (product.materials && product.materials.length > 0) {
        setSelectedMaterial(product.materials[0].name);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      setCustomNote("");
    }
  }, [product, id, location.state]);

  if (!product) {
    return (
      <div className="bg-brand-bg min-h-screen pt-32 pb-24 text-center px-4 flex flex-col items-center justify-center">
        <div className="max-w-md bg-white p-4 lg:p-5 rounded-2xl border border-brand-primary/10 shadow-sm space-y-4">
          <HelpCircle size={44} className="text-brand-primary mx-auto animate-bounce" />
          <h2 className="font-serif font-black text-xl text-brand-fb">Mẫu Len Không Tồn Tại</h2>
          <p className="font-sans text-xs text-brand-fb/60">Quấn nhầm chuỗi sợi len rồi! Tác phẩm bạn tìm kiếm có lẽ đã được dệt bán ẩn hoặc đang thu hoạch mác len mới.</p>
          <button
            onClick={() => navigate("/products")}
            className="w-full bg-brand-primary hover:bg-brand-primary-light text-white text-xs font-semibold py-3 rounded-full transition-colors cursor-pointer"
          >
            Quay lại gian hàng mộc mạc
          </button>
        </div>
      </div>
    );
  }

  const finalUnitPrice = calculateItemPrice(product, selectedSize, selectedMaterial);

  // Build gallery from product images or fall back to main image + color images
  const galleryImages: string[] = (() => {
    if (product.images && product.images.length > 0) return product.images;
    const imgs = [product.image];
    product.colors.forEach(c => {
      if (c.image && !imgs.includes(c.image)) imgs.push(c.image);
    });
    return imgs;
  })();

  // Map each gallery image index to its associated color name (if any)
  const imageToColorMap: Record<number, string | null> = {};
  galleryImages.forEach((img, idx) => {
    const color = product.colors.find(c => c.image === img);
    imageToColorMap[idx] = color?.name || null;
  });

  // When selecting a thumbnail, sync activeImageIdx and optionally selectedColor
  const handleSelectImage = (idx: number) => {
    setActiveImageIdx(idx);
    const mappedColor = imageToColorMap[idx];
    if (mappedColor) setSelectedColor(mappedColor);
  };

  // When selecting a color, sync selectedColor and optionally activeImageIdx
  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);
    const colorObj = product.colors.find(c => c.name === colorName);
    if (colorObj?.image) {
      const imgIdx = galleryImages.findIndex(img => img === colorObj.image);
      if (imgIdx >= 0) setActiveImageIdx(imgIdx);
    }
  };

  const displayedImage = galleryImages[activeImageIdx] || product.image;

  // Real product view stats from actual tracking data
  const stat = viewStats?.find(s => s.productId === product.id);
  const totalProductViews = stat ? stat.totalViews : 0;

  const isWishlisted = wishlist.some(item => item === product.id || item.startsWith(product.id + "::"));

  const handleToggleWishlist = () => {
    setWishlist(prev => {
      const exists = prev.some(item => item === product.id || item.startsWith(product.id + "::"));
      if (exists) {
        return prev.filter(item => item !== product.id && !item.startsWith(product.id + "::"));
      } else {
        const entry = selectedColor ? `${product.id}::${selectedColor}` : product.id;
        return [...prev, entry];
      }
    });
  };

  const handleContactShop = () => {
    navigate("/contact", { state: { productName: product.name } });
  };

  const handleAddToCart = () => {
    const measurementSuffix = customNote ? `_${customNote.replace(/\s+/g, "").slice(0, 20)}` : "";
    const id = `${product.id}_${selectedColor.replace(/\s+/g, "")}_${selectedMaterial.replace(/\s+/g, "")}_${selectedSize.replace(/\s+/g, "")}${measurementSuffix}`;
    const cartItem: CartItem = { id, product, selectedColor, selectedSize, selectedMaterial, quantity: 1 };
    if (customNote) cartItem.customMeasurements = { note: customNote };
    const existing = cart.find(item => item.id === id);
    setCart(prev => existing
      ? prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...prev, cartItem]
    );
    addActivity("Thêm giỏ hàng", product.id, `${product.name} (${selectedColor})`, "cart");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    const addedReview = {
      id: `rev_detail_${Date.now()}`,
      author,
      text,
      rating,
      role: `Nàng mua mẫu ${product.name}`,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      date: "Vừa xong"
    };

    setReviewsList(prev => [addedReview, ...prev]);
    setAuthor("");
    setText("");
    setReviewSent(true);
    setTimeout(() => setReviewSent(false), 3000);
  };

  // 3 related products
  const relatedProducts = productsList.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-left">
      <div className="max-w-7xl mx-auto">
        
        {/* Back navigation line */}
        <div className="mb-6 flex items-center justify-between font-sans text-xs">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-brand-fb/60 hover:text-brand-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Quay lại dạo phố
          </button>
          
          <div className="flex items-center gap-1.5 text-brand-fb/40">
            <Link to="/" className="hover:text-brand-primary">Trang chủ</Link>
            <ChevronRight size={10} />
            <Link to="/products" className="hover:text-brand-primary">Sản phẩm</Link>
            <ChevronRight size={10} />
            <span className="text-brand-fb/70 font-semibold truncate max-w-[120px]">{product.name}</span>
          </div>
        </div>

        {/* Product presentation sheet */}
        <div className="bg-white rounded-2xl border border-brand-primary/10 p-4 lg:p-5 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Showcase Image column */}
          <div className="lg:col-span-6 relative space-y-4">
            <div className="aspect-square rounded-[28px] overflow-hidden bg-brand-bg relative border border-brand-primary/10">
              <SafeImage
                src={displayedImage}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {product.badge && (
                <span className="absolute top-5 left-5 bg-brand-primary text-white text-[10px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-md shadow">
                  {product.badge}
                </span>
              )}
              {/* Video play button overlay if product has video */}
              {product.videoEmbed && (
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="absolute bottom-4 right-4 bg-black/70 hover:bg-brand-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all cursor-pointer group"
                  title="Xem video sản phẩm"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform"><path d="M8 5v14l11-7z"/></svg>
                </button>
              )}
            </div>

            {/* HÀNG THUMBNAIL: flex-wrap để thoáng đất, không giới hạn chiều cao */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectImage(idx)}
                    className={`w-11 h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 min-w-11 min-h-11 flex-none rounded-full overflow-hidden transition-all duration-200 ${
                      activeImageIdx === idx
                        ? "border-2 border-transparent ring-2 ring-[#2B221B] ring-offset-2"
                        : "border border-gray-200 hover:border-[#2B221B] hover:scale-105"
                    }`}
                  >
                    <img src={img} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                {/* Video thumbnail if present */}
                {product.videoEmbed && (
                  <button
                    onClick={() => setVideoModalOpen(true)}
                    className="w-11 h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 min-w-11 min-h-11 flex-none rounded-full overflow-hidden border border-gray-200 bg-black/80 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:border-[#2B221B] group"
                    title="Xem video"
                  >
                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 group-hover:scale-110 transition-transform"><path d="M8 5v14l11-7z"/></svg>
                  </button>
                )}
              </div>
            )}

            {/* Handcrafted quality metrics banner below image */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-brand-bg/40 p-4 lg:min-h-20 lg:px-4 lg:py-4 rounded-xl border border-brand-primary/5 text-center space-y-1.5">
                <Globe size={20} className="w-6 h-6 lg:w-7 lg:h-7 text-brand-primary mx-auto" />
                <span className="block text-[10px] sm:text-xs lg:text-sm font-sans font-bold text-brand-fb">Dệt Nam Việt</span>
              </div>
              <div className="bg-brand-bg/40 p-4 lg:min-h-20 lg:px-4 lg:py-4 rounded-xl border border-brand-primary/5 text-center space-y-1.5">
                <Shield size={20} className="w-6 h-6 lg:w-7 lg:h-7 text-brand-primary mx-auto" />
                <span className="block text-[10px] sm:text-xs lg:text-sm font-sans font-bold text-brand-fb">Bọc thơm sả chanh</span>
              </div>
              <div className="bg-brand-bg/40 p-4 lg:min-h-20 lg:px-4 lg:py-4 rounded-xl border border-brand-primary/5 text-center space-y-1.5">
                <Award size={20} className="w-6 h-6 lg:w-7 lg:h-7 text-brand-primary mx-auto" />
                <span className="block text-[10px] sm:text-xs lg:text-sm font-sans font-bold text-brand-fb">Nét đan 100% tay</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Custom configuration and details sheet */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-6">
              
               {/* Product header info */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-brand-primary/10 text-brand-primary px-3 py-0.5 rounded-full font-sans font-semibold">
                      {product.category}
                    </span>
                    <div className="flex items-center text-yellow-500 gap-0.5">
                      <Star size={12} className="fill-current" />
                      <span className="text-xs font-mono font-semibold text-brand-fb leading-none mt-0.5">
                        {product.rating.toFixed(1)} / 5.0
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#CEAF75] bg-[#CEAF75]/10 px-2.5 py-0.5 rounded-full font-sans font-semibold animate-pulse select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block" />
                    <Eye size={12} className="shrink-0" />
                    <span>{totalProductViews > 0 ? `${totalProductViews} lượt xem` : "Theo dõi lượt xem"}</span>
                  </div>
                </div>
                <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-brand-fb tracking-tight leading-snug">
                  {product.name}
                </h1>
                
                {/* Product price ticker */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-brand-primary">
                    {product.priceLabel || `${finalUnitPrice.toLocaleString("vi-VN")}đ`}
                  </span>
                  {product.oldPrice && (
                    <span className="font-mono text-xs sm:text-sm text-brand-fb/30 line-through">
                      {(product.oldPrice + (product.materials?.find(m => m.name === selectedMaterial)?.priceModifier ?? 0)).toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </div>
              </div>

              {/* Caption social-media style */}
              {product.caption && (
                <div className="bg-gradient-to-br from-brand-primary/5 to-pink-50 border border-brand-primary/15 rounded-2xl p-4 space-y-1">
                  <span className="text-[9px] font-sans font-bold text-brand-primary uppercase tracking-wider">✨ Caption từ tiệm</span>
                  <p className="font-sans text-xs text-brand-fb/80 leading-relaxed whitespace-pre-line italic">
                    "{product.caption}"
                  </p>
                </div>
              )}

              {/* Pattern credit */}
              {product.patternBy && (
                <div className="flex items-center gap-2 text-xs font-sans text-brand-fb/60">
                  <Sparkles size={12} className="text-brand-primary" />
                  <span>Pattern by <span className="font-bold text-brand-primary">{product.patternBy}</span></span>
                </div>
              )}

              {/* Description summary */}
              <p className="font-sans text-xs sm:text-sm lg:text-base text-brand-fb/70 leading-relaxed border-t border-brand-primary/5 pt-4">
                {product.description}
              </p>

              {product.shopNote && (
                <div className="rounded-2xl border border-[#DDB8B0]/55 bg-[#FFF7F5] p-4 text-sm leading-relaxed text-[#4A2F24]">
                  <span className="font-bold">💬 Chủ shop nhắn:</span> {product.shopNote}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#A8B5A2]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4A2F24]">
                  {product.stockStatus === "made-to-order" ? "Làm theo đơn" : product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                </span>
                {product.tags?.map(tag => (
                  <span key={tag} className="rounded-full border border-[#8C6A53]/15 px-3 py-1 text-[10px] text-[#8C6A53]">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* DYNAMIC CUSTOMIZATION ATTRIBUTES */}
              <div className="space-y-4 pt-2 border-t border-brand-primary/5">
                
                {/* 1. Color variations swatch */}
                <div className="space-y-2">
                  <span className="text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase block">Tone sắc màu len dệt: <span className="text-brand-primary font-bold">{selectedColor}</span></span>
                  <div className="flex gap-2.5 flex-wrap">
                    {product.colors.map((col) => (
                      <button
                        key={col.name}
                        onClick={() => handleSelectColor(col.name)}
                        style={{ backgroundColor: col.hex }}
                        className={`w-6 h-6 lg:w-7 lg:h-7 min-w-6 min-h-6 flex-none rounded-full border-2 transition-transform relative cursor-pointer group shadow-sm flex items-center justify-center ${
                          selectedColor === col.name
                            ? "border-brand-primary scale-110"
                            : "border-brand-primary/10 hover:scale-105"
                        }`}
                        title={col.name}
                      >
                        {selectedColor === col.name && (
                          <span className="w-2 h-2 rounded-full bg-brand-fb" />
                        )}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-brand-fb text-white text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-2 pointer-events-none z-10">
                          {col.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Select material level with price additions */}
                <div className="space-y-2">
                  <span className="text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase block">Cốt liệu tơ tơ len:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.materials.map((mat) => (
                      <button
                        key={mat.name}
                        onClick={() => setSelectedMaterial(mat.name)}
                        className={`min-h-11 px-4 py-2.5 rounded-xl border font-sans text-sm font-medium text-left transition-colors duration-200 cursor-pointer flex justify-between items-center ${
                          selectedMaterial === mat.name
                            ? "bg-brand-primary/10 border-brand-primary text-brand-primary"
                            : "bg-white border-brand-primary/10 text-brand-fb hover:bg-brand-primary/5"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{mat.name}</span>
                          <span className="text-xs text-brand-fb/50 font-normal">Chất mịn kháng xơ</span>
                        </div>
                        <span className="font-mono text-[10px] lg:text-xs">
                          {mat.priceModifier > 0 ? `+${mat.priceModifier.toLocaleString("vi-VN")}đ` : "Giá gốc"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Choose Custom sizing */}
                <div className="space-y-2">
                  <span className="text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase block">Chọn Khung Size dệt rộng:</span>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => {
                      const optionMod = parseSizeModifier(size);

                      return (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            // Clear measurements when switching away from custom size
                            if (customNote && !size.includes("số đo") && !size.includes("Custom") && !size.includes("Tùy chỉnh")) {
                              setCustomNote("");
                            }
                          }}
                          className={`min-h-11 px-4 py-2.5 rounded-xl border font-sans text-sm font-medium transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                            selectedSize === size
                              ? "bg-brand-primary text-white border-brand-primary"
                              : "bg-white border-brand-primary/10 text-brand-fb/80 hover:bg-brand-primary/5"
                          }`}
                        >
                          <span>{size}</span>
                          {optionMod > 0 && (
                            <span className={`text-[9px] font-mono ${selectedSize === size ? "text-brand-secondary" : "text-brand-primary"}`}>
                              (+{optionMod / 1000}K)
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Measurement input for custom size */}
                {(selectedSize.includes("số đo") || selectedSize.includes("Custom") || selectedSize.includes("Tùy chỉnh") || product.requiresQuote) && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase block">Nhập số đo / ghi chú khung dệt:</span>
                    <textarea
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="VD: Dài 65cm, rộng 40cm, quai dài 25cm. Vai muốn thêm lót chỉ vàng nhài..."
                      rows={3}
                      className="w-full text-sm lg:text-base font-sans px-4 py-3 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"
                    />
                    <p className="text-[10px] lg:text-xs text-brand-fb/40 font-sans italic">
                      ✂️ Nghệ nhân dệt sẽ căn cứ vào số đo bạn gửi để điều chỉnh khung dệt phù hợp nhất.
                    </p>
                  </div>
                )}

              </div>

              {/* Quantity Picker & Action Buttons */}
              <div className="pt-6 border-t border-brand-primary/5 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleContactShop}
                  className="flex-1 w-full bg-brand-primary hover:bg-brand-primary/90 text-white text-sm lg:text-base font-medium uppercase tracking-wider min-h-11 px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
                >
                  Nhắn shop
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 w-full border-2 border-brand-primary bg-white text-brand-primary hover:bg-brand-primary hover:text-white text-sm lg:text-base font-medium uppercase tracking-wider min-h-11 px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
                >
                  <ShoppingBag size={16} />
                  Thêm vào giỏ
                </button>

                {/* Wishlist toggle icon */}
                <button
                  onClick={handleToggleWishlist}
                  className="shrink-0 min-h-11 w-11 h-11 rounded-xl border border-brand-primary/10 hover:border-brand-primary bg-white text-brand-fb hover:text-brand-primary cursor-pointer transition-colors duration-200 flex items-center justify-center"
                >
                  <Heart
                    size={16}
                    className={isWishlisted ? "fill-brand-primary text-brand-primary animate-pulse" : ""} 
                  />
                </button>
              </div>

              {/* Bullet notes of organic policy */}
              <div className="bg-brand-bg/50 p-4 lg:p-5 rounded-2xl border border-brand-primary/5 text-xs lg:text-sm font-sans text-brand-fb/60 space-y-2 mt-4">
                <div className="flex items-center gap-1.5 font-semibold text-brand-fb">
                  <CheckCircle2 size={13} className="text-brand-primary" />
                  <span>Chính sách Dệt Bảo An 100%:</span>
                </div>
                <p>• Hộp quà giấy mộc lót ẩm, ép ruy băng gai gai, xông bột mộc tước mốc nhài dịu.</p>
                <p>• Nhận thêu dệt chữ tên hoặc móc tên chữ cái đính rùa rùa miễn phí 100%.</p>
                <p>• Đổi trả thủ công len lỗi khâu xơ lỗi phom không biến dạng trong 7 ngày đầu.</p>
              </div>

            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 space-y-8" id="product-detail-related">
            <h2 className="font-serif font-bold text-xl text-brand-fb text-left border-b border-brand-primary/10 pb-4">
              Mẫu phối dệt tương thích lãng mạn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    navigate(`/products/${prod.id}`);
                  }}
                  className="bg-brand-card rounded-2xl border border-brand-primary/5 p-4 cursor-pointer hover:shadow-lg transition-all text-left flex gap-4 group"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-16 object-cover rounded-xl border border-brand-primary/10 bg-white"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 space-y-1 min-w-0">
                    <span className="text-[9px] bg-brand-primary/5 text-brand-primary px-1.5 py-0.5 rounded-full font-sans">
                      {prod.category}
                    </span>
                    <h4 className="font-serif font-bold text-xs text-brand-fb truncate group-hover:text-brand-primary transition-colors">
                      {prod.name}
                    </h4>
                    <span className="font-mono text-xs font-bold text-brand-primary block">
                      {prod.priceLabel || `${prod.price.toLocaleString("vi-VN")}đ`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOMER REVIEWS FOR THAT SPECIAL ITEM */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12" id="product-detail-feedbacks">
          
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif font-bold text-xl text-brand-fb text-left border-b border-brand-primary/10 pb-4">
              Cảm từ gọng chỉ dệt ({reviewsList.length + 1})
            </h2>

            <div className="space-y-4">
              {/* Default detailed review for custom feel */}
              <div className="p-5 bg-white rounded-2xl border border-brand-primary/5 shadow-sm text-left flex gap-4">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
                  alt="Jane Doe"
                  className="w-10 h-10 rounded-full object-cover border"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-grow space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-xs text-brand-fb">Linh Đan (Nàng thơ Hà Nội)</h4>
                    <div className="flex text-yellow-500">
                      <Star size={9} className="fill-current" /><Star size={9} className="fill-current" /><Star size={9} className="fill-current" /><Star size={9} className="fill-current" /><Star size={9} className="fill-current" />
                    </div>
                  </div>
                  <span className="text-[9px] bg-brand-accent/15 text-brand-fb/80 px-1.5 py-0.5 rounded-md font-sans block w-fit">Đang mua Cotton Mộc Phấn</span>
                  <p className="font-sans text-xs text-brand-fb/75 italic leading-relaxed">
                    “Dệt móc xịn dã man luôn đó ạ, túi lavender phồng tròn to đú đẩm dầy rực rỡ, hộp lụa mộc thắt dây thừng gai kẹp cành salix nhài tỏa khói thơm nức lòng luôn.”
                  </p>
                  <span className="text-[9px] font-mono text-brand-fb/20 block">2 ngày trước</span>
                </div>
              </div>

              {reviewsList.map((rev) => (
                <div key={rev.id} className="p-5 bg-white rounded-2xl border border-brand-primary/5 shadow-sm text-left flex gap-4">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover border"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-xs text-brand-fb">{rev.author}</h4>
                      <div className="flex text-yellow-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={9} className="fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[9px] text-[#A89F95] block font-sans">{rev.role}</span>
                    <p className="font-sans text-xs text-brand-fb/75 italic leading-relaxed">“{rev.text}”</p>
                    <span className="text-[9px] font-mono text-brand-fb/20 block">{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add review form area */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-4 lg:p-5 border border-brand-primary/10 shadow-sm text-left space-y-4">
              <h3 className="font-serif font-bold text-md text-brand-fb">Góp Một Kim Sợi Ý</h3>
              <p className="font-sans text-xs text-brand-fb/60 pb-2">Nếu đã từng lướt hay ôm mẫu sợi này, hân hoan gõ dệt vài dòng làm quà tặng tinh thần cho các thợ Len nhé!</p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase mb-1">Tên nàng dệt:</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Mỹ Hoa Sài Gòn..."
                    className="w-full text-sm lg:text-base font-sans px-4 py-3 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase mb-1">Số sao yêu chuộng:</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-0.5 text-yellow-500 cursor-pointer"
                      >
                        <Star size={18} className={rating >= s ? "fill-current" : "text-gray-300"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase mb-1">Cảm tưởng chạm len:</label>
                  <textarea
                    required
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Mũi dệt căng tròn, thêu tên ngộ nghĩnh mềm mại lắm các chị thợ dệt ơi..."
                    className="w-full text-sm lg:text-base font-sans px-4 py-3 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white text-sm lg:text-base font-medium min-h-11 px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  Gửi tặng đánh giá
                </button>
              </form>

              <AnimatePresence>
                {reviewSent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-green-50 text-green-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={13} />
                    Gói dệt đánh giá đã được lưu nơ lưu bút!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>


      {/* VIDEO MODAL POPUP */}
      <AnimatePresence>
        {videoModalOpen && product.videoEmbed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/85 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setVideoModalOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-black rounded-3xl overflow-hidden shadow-2xl w-full max-w-sm"
              style={{ aspectRatio: "9/16" }}
            >
              <button
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-brand-primary text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="text-sm font-bold leading-none">✕</span>
              </button>
              <iframe
                src={product.videoEmbed + "&autoplay=1"}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                scrolling="no"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
