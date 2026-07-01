import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ShoppingCart, ShieldAlert, BadgeCheck, Leaf, Tag } from "lucide-react";
import { Product, CartItem } from "../types";

interface CustomizerProps {
  product: Product;
  onAddToCart: (product: Product, color: string, size: string, material: string, qty: number, customMeasurements?: { note: string }) => void;
}

export default function Customizer({ product, onAddToCart }: CustomizerProps) {
  // Variant states
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedMaterial, setSelectedMaterial] = useState(product.materials[0]?.name || "");
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  // Reset variant choices when active product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || "");
      setSelectedSize(product.sizes[0] || "");
      setSelectedMaterial(product.materials[0]?.name || "");
      setQuantity(1);
      setCustomNote("");
    }
  }, [product]);

  // Calculate dynamic pricing & stock limits based on variants
  const getPricing = () => {
    const basePrice = product.price;
    const materialModifier = product.materials.find(m => m.name === selectedMaterial)?.priceModifier || 0;
    
    // Size pricing premium: Medium/Large versions or larger bouquet sizes add to cost
    let sizeModifier = 0;
    const isMediumSize = selectedSize.includes("Vừa") || selectedSize.includes("nhỏ") === false && selectedSize.includes("Tiêu chuẩn") === false && selectedSize.includes("5 cành") === false;
    
    if (isMediumSize) {
      if (product.id === "prod_1") sizeModifier = 40000;
      else if (selectedSize.includes("9 cành")) sizeModifier = 90000;
      else if (selectedSize.includes("15 cành")) sizeModifier = 200000;
      else if (selectedSize.includes("cỡ đại")) sizeModifier = 30000;
      else sizeModifier = 30000;
    }

    const unitPrice = basePrice + materialModifier + sizeModifier;
    const totalPrice = unitPrice * quantity;

    return { unitPrice, totalPrice };
  };

  // Mock dynamic stock levels per variant combination (unique for graduation thesis)
  const getDynamicStock = () => {
    // Generate an pseudo-stable stock based on color/size hash
    const str = `${selectedColor}-${selectedSize}-${selectedMaterial}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const finalStock = Math.abs((hash % 15) + 3); // ensures 3 to 18 stock remains
    return Math.min(finalStock, product.stock);
  };

  const currentMaxStock = getDynamicStock();
  const { unitPrice, totalPrice } = getPricing();

  // Adjust quantity logic
  const handleQtyChange = (delta: number) => {
    const nextQty = quantity + delta;
    if (nextQty >= 1 && nextQty <= currentMaxStock) {
      setQuantity(nextQty);
    }
  };

  const handleAddToCart = () => {
    const measurements = customNote ? { note: customNote } : undefined;
    onAddToCart(product, selectedColor, selectedSize, selectedMaterial, quantity, measurements);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  });

  return (
    <section id="customizer" className="py-20 bg-brand-bg/50 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto" id="customizer-wrapper">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            {...fadeUp(0.1)}
            className="text-xs font-semibold uppercase tracking-widest text-brand-primary block mb-2"
          >
            Trải Nghiệm Độc Bản ✦ Live Customizer
          </motion.span>
          <motion.h2
            {...fadeUp(0.25)}
            className="font-serif font-bold text-3xl sm:text-4xl text-brand-fb mb-5"
          >
            Cá Nhân Hóa Sản Phẩm Của Riêng Bạn
          </motion.h2>
          <p className="font-sans text-brand-fb/70 text-sm md:text-md">
            Hệ thống quản lý biến thể tiên tiến. Lựa chọn màu sắc, kích cỡ và sợi len tinh tế. Hệ thống sẽ tự động điều dọn kho và tính toán giá dệt tức thì.
          </p>
        </div>

        {/* Customization Panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Product Image Frame & Material Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-3 rounded-[32px] border border-brand-primary/10 shadow-md relative overflow-hidden group"
            >
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-brand-bg/30 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Active badge */}
                <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] font-mono tracking-wider font-semibold px-3 py-1 rounded-full shadow-sm animate-pulse">
                  {product.badge || "Thủ công"}
                </div>

                {/* Micro visual overlay */}
                <div className="absolute bottom-4 left-4 right-4 soft-glass px-4 py-3 border border-brand-primary/15 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-brand-primary" />
                    <span className="font-sans text-xs font-semibold text-brand-fb">Sợi Sinh Học Hữu Cơ</span>
                  </div>
                  <span className="font-sans text-[10px] text-brand-primary font-bold uppercase">Chứng nhận OEKO-TEK</span>
                </div>
              </div>
            </motion.div>

            {/* Quick specifications display */}
            <div className="soft-glass p-5 rounded-2xl border border-brand-primary/10 space-y-3">
              <h4 className="font-serif font-bold text-xs text-brand-fb uppercase tracking-wide">Thuộc Tính Sợi Dệt</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/40 p-2.5 rounded-xl border border-brand-primary/5">
                  <span className="block text-[10px] font-sans text-brand-fb/50">Chất liệu gốc:</span>
                  <span className="font-sans text-xs font-semibold text-brand-fb">{product.material}</span>
                </div>
                <div className="bg-white/40 p-2.5 rounded-xl border border-brand-primary/5">
                  <span className="block text-[10px] font-sans text-brand-fb/50">Tiêu chuẩn kim móc:</span>
                  <span className="font-sans text-xs font-semibold text-brand-fb">3.0 - 4.5mm dệt mượt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer panel widgets */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-brand-card rounded-[36px] p-6 sm:p-8 border border-brand-primary/15 shadow-xl relative overflow-hidden"
              id="live-configuration-panel"
            >
              {/* Product Info */}
              <div className="border-b border-brand-border pb-5 mb-5 space-y-2">
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-brand-fb">{product.name}</h3>
                <p className="font-sans text-xs text-brand-fb/60 leading-relaxed">{product.description}</p>
                
                <div className="flex items-center gap-2 pt-1.5">
                  <span className="font-mono text-xl font-bold text-brand-primary">
                    {unitPrice.toLocaleString("vi-VN")}đ
                  </span>
                  {product.oldPrice && (
                    <span className="font-mono text-xs text-brand-fb/40 line-through">
                      {product.oldPrice.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                  <span className="text-[10px] font-sans bg-brand-accent/20 text-brand-fb/80 px-2 py-0.5 rounded-md font-semibold font-mono self-center">
                    Miễn giảm vận chuyển quốc gia 🚚
                  </span>
                </div>
              </div>

              {/* 1. VARIANT: Màu sắc */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-sans font-semibold text-brand-fb uppercase tracking-wider">Lựa chọn Màu sắc:</span>
                  <span className="text-brand-primary font-mono font-bold">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => {
                        setSelectedColor(col.name);
                        setQuantity(1); // safety reset
                      }}
                      className={`p-1 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor === col.name ? "border-brand-primary scale-110" : "border-transparent hover:scale-105"
                      }`}
                      title={col.name}
                    >
                      <div
                        className="w-7 h-7 rounded-full shadow-inner border border-black/10"
                        style={{ backgroundColor: col.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. VARIANT: Kích thước */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-sans font-semibold text-brand-fb uppercase tracking-wider">Kích thước mộc quai:</span>
                  <span className="text-brand-primary font-semibold">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => {
                        setSelectedSize(sz);
                        setQuantity(1); // safety reset
                        // Clear measurements when switching away from custom size
                        if (customNote && !sz.includes("số đo") && !sz.includes("Custom") && !sz.includes("Tùy chỉnh")) {
                          setCustomNote("");
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-sans font-medium transition-all border cursor-pointer select-none ${
                        selectedSize === sz
                          ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                          : "bg-white text-brand-fb/80 border-brand-primary/10 hover:border-brand-primary/20"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Measurement input for custom size */}
              {(selectedSize.includes("số đo") || selectedSize.includes("Custom") || selectedSize.includes("Tùy chỉnh") || product.requiresQuote) && (
                <div className="space-y-3 mb-6 animate-fadeIn">
                  <span className="text-xs font-sans font-semibold text-brand-fb uppercase tracking-wider">Nhập số đo / ghi chú khung dệt:</span>
                  <textarea
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="VD: Dài 65cm, rộng 40cm, quai dài 25cm. Vai muốn thêm lót chỉ vàng nhài..."
                    rows={3}
                    className="w-full text-xs font-sans px-4 py-3 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none focus:border-brand-primary resize-none"
                  />
                  <p className="text-[10px] text-brand-fb/40 font-sans italic">
                    ✂️ Nghệ nhân dệt sẽ căn cứ vào số đo bạn gửi để điều chỉnh khung dệt phù hợp nhất.
                  </p>
                </div>
              )}

              {/* 3. VARIANT: Chất liệu sợi */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-sans font-semibold text-brand-fb uppercase tracking-wider">Tổng hợp chất len sợi dệt:</span>
                  <span className="text-brand-primary font-semibold">{selectedMaterial}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.materials.map((mat) => (
                    <button
                      key={mat.name}
                      onClick={() => {
                        setSelectedMaterial(mat.name);
                        setQuantity(1); // safety reset
                      }}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedMaterial === mat.name
                          ? "bg-brand-primary/5 border-brand-primary shadow-inner"
                          : "bg-white border-brand-primary/10 hover:border-brand-primary/20"
                      }`}
                    >
                      <span className="font-serif font-bold text-xs text-brand-fb block">
                        {mat.name}
                      </span>
                      <span className="font-sans text-[10px] text-brand-fb/50 block mt-1">
                        + {mat.priceModifier.toLocaleString("vi-VN")}đ chênh tơ
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Inventory Stock & Quantity Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center bg-brand-bg/40 p-5 rounded-2xl border border-brand-primary/5 mb-6">
                {/* Real-time Dynamic Stock Tracker */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-sans">
                    {currentMaxStock > 5 ? (
                      <BadgeCheck className="w-5 h-5 text-green-600" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-yellow-600" />
                    )}
                    <span className="font-sans font-semibold text-brand-fb/80">Số mẫu tồn kho khả dụng:</span>
                  </div>
                  <span className="font-mono text-lg font-bold text-brand-fb mt-2 block">
                    {currentMaxStock} chiếc tinh gọn
                  </span>
                  <span className="text-xs text-brand-fb/40 font-sans block mt-1">
                    (Giới hạn dệt để đảm bảo độ tỉ mỉ)
                  </span>
                </div>

                {/* Quantity Ticker Counter */}
                <div className="flex flex-col items-end sm:items-end md:items-stretch lg:items-end">
                  <span className="text-xs uppercase font-sans font-bold text-brand-fb/50 tracking-wider mb-3">
                    Lượng kim đặt:
                  </span>
                  <div className="flex items-center gap-3 bg-white border border-brand-primary/10 rounded-full px-4 py-1.5 shadow-sm w-36 justify-between">
                    <button
                      onClick={() => handleQtyChange(-1)}
                      className="p-1 rounded-full text-brand-fb hover:text-brand-primary transition-colors cursor-pointer"
                      disabled={quantity <= 1}
                      title="Giảm lượng đặt"
                    >
                      -
                    </button>
                    <span className="font-mono text-base font-semibold text-brand-fb px-1">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQtyChange(1)}
                      className="p-1 rounded-full text-brand-fb hover:text-brand-primary transition-colors cursor-pointer"
                      disabled={quantity >= currentMaxStock}
                      title="Tăng lượng đặt"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Core CTA & Realtime Total Cost */}
              <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div>
                  <span className="text-[10px] uppercase font-sans font-bold text-brand-fb/50 tracking-wider">Tổng ngân sách:</span>
                  <span className="block font-mono text-2xl font-bold text-brand-primary leading-none mt-1">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 sm:flex-initial font-sans font-semibold text-xs bg-brand-primary hover:bg-brand-primary-light text-white px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer relative"
                  >
                    <ShoppingCart size={15} />
                    {justAdded ? "✓ Đã thêm giỏ dệt!" : "Thêm vào giỏ đặt dệt"}
                  </button>
                </div>
              </div>

              {/* Just added animation micro toast */}
              <AnimatePresence>
                {justAdded && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute inset-x-0 bottom-4 mx-auto w-max soft-glass px-5 py-2.5 rounded-full text-xs text-brand-fb border-brand-primary/25 shadow-lg flex items-center gap-2 z-50 text-brand-primary font-bold"
                  >
                    <Tag className="w-4 h-4 animate-bounce" />
                    <span>✓ Đã cập nhật sản phẩm dệt vào giỏ hàng!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
