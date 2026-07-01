import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Tag, Sparkles, HelpCircle, Edit3, Check, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { calculateItemPrice, calculateCartTotal, countCartItems } from "../utils/pricing";
import { BRAND_NAME } from "../constants/brand";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, setCart, coinsWallet } = useApp();
  const [editingMeasId, setEditingMeasId] = useState<string | null>(null);
  const [editMeasValue, setEditMeasValue] = useState("");

  const cartTotal = calculateCartTotal(cart);

  const handleUpdateMeasurements = (itemId: string) => {
    setCart(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, customMeasurements: editMeasValue ? { note: editMeasValue } : undefined }
        : item
    ));
    setEditingMeasId(null);
    setEditMeasValue("");
  };

  const startEditMeasurements = (itemId: string, currentNote: string) => {
    setEditingMeasId(itemId);
    setEditMeasValue(currentNote);
  };

  const handleUpdateQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQty } : item
    ));
  };

  const handleRemoveItem = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const itemsCount = countCartItems(cart);

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-left">
      <div className="max-w-7xl mx-auto">
        
        {/* Title bar banner */}
        <div className="mb-10 pb-6 border-b border-brand-primary/10">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary block mb-1">✦ Giỏ hàng bảo an ✦</span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-fb">Chi Tiết Giỏ Mua Hàng</h1>
          <p className="font-sans text-xs sm:text-sm text-brand-fb/60 mt-1">
            Nơi rà soát tinh anh các bó hoa dệt nhài, túi Boho mây móc sợi thủ công trước khi gói thắt phong bao.
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty basket state */
          <div className="bg-white rounded-2xl border border-dashed border-brand-primary/20 p-8 lg:p-10 text-center max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary mx-auto animate-bounce">
              <ShoppingBag size={30} />
            </div>
            <h3 className="font-serif font-bold text-lg text-brand-fb">Sợi Chỉ Dệt Chưa Gom Nơ</h3>
            <p className="font-sans text-xs text-brand-fb/60 leading-relaxed max-w-xs mx-auto">
              Giỏ hàng của bạn đang rỗng tuếch lãng đãng. Cùng đảo quanh phố len nhài thơm lựa túi vai Lavender Dream xinh đẹp ngay nhé!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-medium uppercase tracking-wider min-h-11 px-4 py-2.5 rounded-xl shadow-sm cursor-pointer transition-colors duration-200"
            >
              Xem Tủ Đồ {BRAND_NAME}
            </button>
          </div>
        ) : (
          /* Cart active grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left columns: Items list */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => {
                const itemUnitCost = calculateItemPrice(item.product, item.selectedSize, item.selectedMaterial);
                const matchedColorObj = item.product.colors?.find(c => c.name === item.selectedColor);
                const resolvedItemImage = matchedColorObj?.image || item.product.image;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl border border-brand-primary/10 p-4 lg:p-5 flex gap-4 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={resolvedItemImage}
                      alt={item.product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-brand-primary/10 bg-white"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="space-y-1.5 text-left pr-6">
                        <span className="text-[10px] bg-brand-primary/15 text-brand-primary px-2 py-0.5 rounded-full font-sans select-none">
                          {item.product.category}
                        </span>
                        <h3 className="font-serif font-bold text-sm sm:text-base text-brand-fb truncate">
                          {item.product.name}
                        </h3>

                        {/* Selected Attribute swatches badges */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs bg-brand-bg text-brand-fb/80 px-2 py-0.5 rounded border border-brand-primary/5">
                            Sắc: {item.selectedColor}
                          </span>
                          <span className="text-xs bg-brand-bg text-brand-fb/80 px-2 py-0.5 rounded border border-brand-primary/5">
                            Cỡ: {item.selectedSize}
                          </span>
                          <span className="text-xs bg-brand-accent/15 text-brand-fb px-2 py-0.5 rounded">
                            Chất: {item.selectedMaterial}
                          </span>
                        </div>

                        {/* Custom measurements display + edit */}
                        {item.customMeasurements?.note && editingMeasId !== item.id && (
                          <div className="mt-1.5 flex items-start gap-1">
                            <span className="text-[10px] bg-brand-primary/5 text-brand-primary/80 px-2 py-0.5 rounded border border-brand-primary/10 italic max-w-[200px] truncate block">
                              📏 {item.customMeasurements.note}
                            </span>
                            <button
                              onClick={() => startEditMeasurements(item.id, item.customMeasurements!.note)}
                              className="text-brand-fb/30 hover:text-brand-primary transition-colors cursor-pointer shrink-0"
                              title="Sửa số đo"
                            >
                              <Edit3 size={11} />
                            </button>
                          </div>
                        )}

                        {/* Inline measurement editor */}
                        {editingMeasId === item.id && (
                          <div className="mt-2 space-y-1.5">
                            <textarea
                              value={editMeasValue}
                              onChange={(e) => setEditMeasValue(e.target.value)}
                              rows={2}
                              className="w-full text-[10px] font-sans px-3 py-2 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:border-brand-primary resize-none"
                              placeholder="VD: Dài 65cm, rộng 40cm..."
                            />
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleUpdateMeasurements(item.id)}
                                className="bg-brand-primary text-white text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-brand-primary-light transition-colors"
                              >
                                <Check size={10} /> Lưu
                              </button>
                              <button
                                onClick={() => { setEditingMeasId(null); setEditMeasValue(""); }}
                                className="bg-brand-fb/10 text-brand-fb/70 text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-brand-fb/20 transition-colors"
                              >
                                <X size={10} /> Hủy
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quantity tools and pricing summary */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-white border border-brand-primary/10 rounded-full px-3 py-1.5 shadow-sm">
                          <button
                            onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                            className="p-1 rounded-full text-brand-fb hover:text-brand-primary-light disabled:opacity-35 cursor-pointer max-w-[24px] max-h-[24px] flex items-center justify-center font-bold"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-sm font-mono font-bold text-brand-fb px-1 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                            className="p-1 rounded-full text-brand-fb hover:text-brand-primary-light cursor-pointer max-w-[24px] max-h-[24px] flex items-center justify-center font-bold"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <div className="flex flex-col text-right">
                          <span className="font-mono text-sm sm:text-md font-bold text-brand-primary">
                            {(itemUnitCost * item.quantity).toLocaleString("vi-VN")}đ
                          </span>
                          <span className="font-mono text-[9px] text-[#A89F95]">
                            Đơn giá: {itemUnitCost.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Item action */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute right-3 top-3 p-1 text-brand-fb/40 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                      title="Xóa món dệt"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Right column: Order Total cost recap sheet */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-brand-primary/10 p-4 lg:p-5 space-y-6 shadow-sm">
              <h3 className="font-serif font-bold text-sm text-brand-fb pb-3 border-b border-brand-primary/5">
                Tóm Tắt Đơn Giỏ Hàng
              </h3>

              <div className="space-y-2.5 text-xs font-sans">
                <div className="flex justify-between text-brand-fb/75">
                  <span>Tổng số sản phẩm dệt:</span>
                  <span className="font-mono font-bold text-brand-fb">{itemsCount} món</span>
                </div>
                <div className="flex justify-between text-brand-fb/75">
                  <span>Tạm tính trị giá:</span>
                  <span className="font-mono font-bold text-brand-fb">{cartTotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-brand-fb/75">
                  <span>Phí ship lụa:</span>
                  <span className="text-green-600 font-bold">Miễn phí dệt (0đ) 🚚</span>
                </div>
              </div>

              {/* Coins rewards notice */}
              <div className="bg-brand-bg/50 p-4 rounded-xl border border-brand-primary/10 space-y-2 text-sm text-brand-fb/60 text-left">
                <div className="flex items-center gap-1.5 text-brand-fb font-bold">
                  <Sparkles size={16} className="text-brand-primary animate-pulse" />
                  <span>Điểm xu tích lũy khả dụng:</span>
                </div>
                <p className="text-xs">
                  Nàng đang tích sẵn: <strong className="text-brand-primary font-mono">{coinsWallet.toLocaleString("vi-VN")} xu</strong> (quy đổi giảm ngay <strong className="text-brand-primary font-sans">{coinsWallet.toLocaleString("vi-VN")}đ</strong> khi checkout).
                </p>
              </div>

              <div className="pt-4 border-t border-brand-primary/5 space-y-3">
                <div className="flex justify-between items-baseline text-brand-fb pb-1">
                  <span className="font-sans text-xs font-bold">Tổng thanh toán:</span>
                  <span className="font-mono text-lg font-black text-brand-primary">
                    {cartTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white text-sm lg:text-base font-medium uppercase tracking-wider min-h-11 px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
                >
                  <ShieldCheck size={18} />
                  Tiến Hành Điền Billing (Đặt Mua)
                </button>
                
                <Link
                  to="/products"
                  className="block text-center text-xs font-sans font-medium text-brand-fb/60 hover:text-brand-primary underline"
                >
                  Tiếp tục rảo quấn sợi
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
