import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { ShieldCheck, HelpCircle, Tag, Sparkles, CreditCard, ShoppingBag, Eye } from "lucide-react";
import { useApp } from "../context/AppContext";
import { OrderItemDetail } from "../types";
import { calculateItemPrice, calculateCartTotal } from "../utils/pricing";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { 
    cart, setCart, ordersList, setOrdersList, coinsWallet, setCoinsWallet, 
    addActivity, currentUser 
  } = useApp();

  // Redirect if cart is empty
  if (cart.length === 0) {
    return <Navigate to="/products" replace />;
  }

  // Billing forms
  const [fullName, setFullName] = useState(currentUser ? currentUser.name : "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(currentUser ? currentUser.email : "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Hồ Chí Minh");
  const [embroideryText, setEmbroideryText] = useState(""); // Custom request name 
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "banking" | "vietqr" | "momo">("cod");

  // Coupon variables
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Coins checking variables
  const [useCoins, setUseCoins] = useState(false);

  function generateOrderId(): string {
    try {
      return `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}-WEAVE`;
    } catch {
      return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-WEAVE`;
    }
  }

  const [tempOrderId] = useState(generateOrderId);

  const cartTotal = calculateCartTotal(cart);

  // Coupon Rules logic (WELCOME20 = 20% off up to 100k)
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (couponInput.toUpperCase().trim() === "WELCOME20") {
      setAppliedCouponCode("WELCOME20");
      setCouponSuccess("Áp dụng thành công mã WELCOME20: Giảm 20% lên tới 100.000đ!");
    } else {
      setCouponError("Mã giảm giá không chính xác hoặc đã quá hạn tuyển.");
    }
  };

  // Math totals block
  const discountVal = appliedCouponCode === "WELCOME20" 
    ? Math.min(Math.round(cartTotal * 0.2), 100000) 
    : 0;

  const maxCoinsApplied = useCoins ? Math.min(coinsWallet, cartTotal - discountVal) : 0;
  const finalBillTotal = Math.max(0, cartTotal - discountVal - maxCoinsApplied);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim() || !email.trim()) return;

    // Summary of products representation text
    const namesRep = cart.map(i => `${i.product.name} (x${i.quantity})`).join(", ");

    // Build order items detail with measurements
    const orderItems: OrderItemDetail[] = cart.map(item => {
      const unitPrice = calculateItemPrice(item.product, item.selectedSize, item.selectedMaterial);
      return {
        productId: item.product.id,
        productName: item.product.name,
        color: item.selectedColor,
        size: item.selectedSize,
        quantity: item.quantity,
        price: unitPrice,
        subtotal: unitPrice * item.quantity,
        customMeasurements: item.customMeasurements
      };
    });

    const newOrder = {
      id: tempOrderId,
      orderCode: `LH-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${String(Math.floor(Math.random()*900)+100)}`,
      name: namesRep,
      itemsCount: cart.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: finalBillTotal,
      time: new Date().toISOString(),
      status: "Chờ xác nhận" as const,
      shippingAddress: `${address}, ${city}`,
      customerName: fullName,
      customerPhone: phone,
      customerEmail: email,
      discountApplied: discountVal,
      coinsUsed: maxCoinsApplied,
      paymentMethod,
      note: embroideryText || undefined,
      items: orderItems
    };

    // Store into shared AppContext state
    setOrdersList(prev => [newOrder, ...prev]);

    // Deduct coins from balance if applied
    if (maxCoinsApplied > 0) {
      setCoinsWallet(prev => prev - maxCoinsApplied);
    }

    addActivity("Đăng ký đơn hàng thủ công", tempOrderId, namesRep, "order");

    // Clear cart memory state
    setCart([]);
    
    // Redirect to dedicated success page
    navigate("/order-success", { state: { orderId: tempOrderId } });
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-left">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner title header */}
        <div className="mb-10 pb-6 border-b border-brand-primary/10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B45309] block mb-1">✦ Checkout ✦</span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-fb">Thủ Tục Nhận Đơn Khâu</h1>
          <p className="font-sans text-xs sm:text-sm text-brand-fb/60 mt-1">Đăng ký địa chỉ thanh toán, nhận thêu dệt tên charm chữ cái hoàn dã mộc mạc thơm lừng.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Billing address info form container */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-brand-primary/10 p-4 lg:p-5 space-y-6">
            <h3 className="font-serif font-bold text-sm text-brand-fb pb-3 border-b border-brand-primary/5">
              Thông Tin Nhận Gói Thơ
            </h3>

            <form onSubmit={handlePlaceOrder} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase mb-1.5">Tên người nhận:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Hồng Lụa..."
                    className="w-full text-sm lg:text-base font-sans px-4 py-3 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase mb-1.5">Số điện thoại liên lạc:</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912xxxxxx..."
                    className="w-full text-sm lg:text-base font-sans px-4 py-3 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase mb-1.5">Địa chỉ hòm thư điện tử (Email):</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="honglua@gmail.com..."
                  className="w-full text-sm lg:text-base font-sans px-4 py-3 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase mb-1.5">Địa chỉ giao hàng thơ:</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="252 Lý Tự Trọng, P. Bến Thành..."
                    className="w-full text-sm lg:text-base font-sans px-4 py-3 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase mb-1.5">Thành phố dệt nôi:</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-sm lg:text-base font-sans px-4 py-3 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:ring-2 focus:ring-brand-primary/20"
                  >
                    <option value="Hồ Chí Minh">TP. Hồ Chí Minh (Giao 24h) 🛵</option>
                    <option value="Hà Nội">TP. Hà Nội (Giao 48h) ✈️</option>
                    <option value="Đà Nẵng">TP. Đà Nẵng (Giao 36h)</option>
                    <option value="Cần Thơ">TP. Cần Thơ (Giao 24h)</option>
                  </select>
                </div>
              </div>

              {/* Requirement details name print */}
              <div>
                <label className="block text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase mb-1.5">
                  Thêu mác tên chữ cái yêu cầu (Tặng kèm miễn phí):
                </label>
                <input
                  type="text"
                  value={embroideryText}
                  onChange={(e) => setEmbroideryText(e.target.value)}
                  placeholder="Ví dụ: 'Ruby', 'Linh 1998'..."
                  className="w-full text-sm lg:text-base font-sans px-4 py-3 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
                <span className="text-[10px] text-brand-fb/45 block mt-1">Chúng mình sử dụng tag gỗ ép sồi hoặc miếng thêu gấm gắn trực diện lên quai.</span>
              </div>

              {/* Secure payments choices */}
              <div className="space-y-2 pt-2">
                <span className="block text-[11px] font-sans font-bold text-brand-fb/60 uppercase">Phương thức thanh toán:</span>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { id: "cod",     label: "💵 COD (Thu tiền tận tay)",       desc: "Thanh toán khi nhận hàng" },
                    { id: "vietqr",  label: "📱 VietQR",                        desc: "Quét mã QR thanh toán ngay" },
                    { id: "momo",    label: "💜 Ví MoMo",                       desc: "Chuyển khoản qua MoMo" },
                    { id: "banking", label: "🏦 Chuyển khoản ngân hàng",        desc: "Techcombank / VCB" }
                  ] as const).map(opt => (
                    <label
                      key={opt.id}
                      className={`p-3 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                        paymentMethod === opt.id ? "bg-brand-primary/5 border-brand-primary" : "bg-white border-brand-primary/10 hover:border-brand-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="pay"
                          checked={paymentMethod === opt.id}
                          onChange={() => setPaymentMethod(opt.id)}
                          className="accent-brand-primary"
                        />
                        <span className="text-xs font-sans font-bold text-brand-fb">{opt.label}</span>
                      </div>
                      <span className="text-[10px] text-brand-fb/50 font-sans pl-5">{opt.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Instructions */}
              {paymentMethod === "vietqr" && (
                <div className="p-4 rounded-2xl bg-brand-bg border border-dashed border-brand-primary/25 space-y-3 text-xs text-brand-fb/70 text-left">
                  <p className="font-bold text-brand-primary pb-1">📱 Thanh toán qua VietQR:</p>
                  <div className="flex gap-4 items-center">
                    <div className="w-24 h-24 bg-white rounded-xl border-2 border-brand-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                      <div className="text-center">
                        <div className="text-2xl">📱</div>
                        <div className="text-[9px] font-bold text-brand-fb/40 mt-1">QR Demo</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p>• Ngân hàng: <strong>Techcombank</strong></p>
                      <p>• Số TK: <strong>1903 4402 1102</strong></p>
                      <p>• Chủ TK: <strong>NGUYEN HAI NAM (LEN HANDMADE)</strong></p>
                      <p>• Nội dung: <strong>LEN {tempOrderId.slice(0,12)}</strong></p>
                      <p className="text-[10px] text-brand-primary italic">✨ Mở app ngân hàng, bấm QR Pay và quét mã trên</p>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "momo" && (
                <div className="p-4 rounded-2xl bg-brand-bg border border-dashed border-pink-200 space-y-2 text-xs text-brand-fb/70 text-left">
                  <p className="font-bold text-pink-600 pb-1">💜 Thanh toán qua Ví MoMo:</p>
                  <div className="flex gap-4 items-center">
                    <div className="w-24 h-24 bg-pink-50 rounded-xl border-2 border-pink-200 flex items-center justify-center shrink-0">
                      <div className="text-center">
                        <div className="text-2xl">💜</div>
                        <div className="text-[9px] font-bold text-pink-400 mt-1">MoMo QR</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p>• Số ví MoMo: <strong className="text-pink-600">0912 443 1102</strong></p>
                      <p>• Chủ tài khoản: <strong>NGUYEN HAI NAM</strong></p>
                      <p>• Số tiền: <strong className="text-pink-600">{finalBillTotal.toLocaleString("vi-VN")}đ</strong></p>
                      <p>• Nội dung: <strong>LEN {tempOrderId.slice(0,12)}</strong></p>
                      <p className="text-[10px] text-pink-500 italic">💜 Mở app MoMo → Chuyển tiền → Nhập số điện thoại</p>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "banking" && (
                <div className="p-4 rounded-2xl bg-brand-bg border border-dashed border-brand-primary/25 space-y-1.5 text-xs text-brand-fb/70 text-left">
                  <p className="font-bold text-brand-primary pb-1">🏦 Chuyển khoản ngân hàng:</p>
                  <p>• Ngân hàng Techcombank Chi nhánh TP.HCM</p>
                  <p>• Số TK: <strong>1903 4402 1102</strong></p>
                  <p>• Chủ TK: <strong>NGUYEN HAI NAM (LEN HANDMADE)</strong></p>
                  <p>• Nội dung CK: <strong>LEN {tempOrderId}</strong></p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white text-sm lg:text-base font-medium uppercase tracking-wider min-h-11 px-4 py-2.5 rounded-xl shadow-sm transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck size={14} />
                Hoàn Thành Khâu Dệt Đặt Hàng - {(finalBillTotal).toLocaleString("vi-VN")}đ
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: Bill totals & Coupon and coins computation sidebar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Products review table */}
            <div className="bg-white rounded-2xl border border-brand-primary/10 p-4 lg:p-5 space-y-4">
              <h4 className="font-serif font-bold text-xs text-brand-fb uppercase border-b border-brand-primary/5 pb-2">
                Tổ hợp tơ len dệt đặt
              </h4>
              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                {cart.map((item) => {
                  const linePrice = calculateItemPrice(item.product, item.selectedSize, item.selectedMaterial) * item.quantity;
                  const matchedCol = item.product.colors?.find(c => c.name === item.selectedColor);
                  const resolvedImg = matchedCol?.image || item.product.image;
                  return (
                    <div key={item.id} className="flex gap-3 text-xs items-center justify-between text-left">
                      <img
                        src={resolvedImg}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-xl border bg-white"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-grow min-w-0 pr-2">
                        <h5 className="font-sans font-bold text-brand-fb truncate text-[11px]">
                          {item.product.name}
                        </h5>
                        <p className="text-[10px] text-brand-fb/55 truncate">
                          Màu: {item.selectedColor} | Cỡ: {item.selectedSize}
                        </p>
                        {item.customMeasurements?.note && (
                          <p className="text-[9px] text-brand-primary/70 italic truncate mt-0.5">
                            📏 {item.customMeasurements.note}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex flex-col font-mono shrink-0">
                        <strong className="text-brand-fb font-bold text-[11px]">{linePrice.toLocaleString("vi-VN")}đ</strong>
                        <span className="text-[10px] text-[#A89F95]">x{item.quantity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Voucher input form */}
            <div className="bg-brand-card rounded-2xl border border-brand-primary/10 p-5 space-y-3">
              <h4 className="font-serif font-bold text-xs text-brand-fb uppercase flex items-center gap-1.5 pb-2 border-b border-brand-primary/5">
                <Tag size={12} className="text-brand-primary" />
                Mã Khuyến Quà Đặc Biệt
              </h4>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã (Ví dụ: WELCOME20)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-grow text-sm lg:text-base font-sans px-4 py-3 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-medium min-h-12 px-4 py-3 rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  Áp dụng
                </button>
              </form>

              {couponError && <p className="text-[10px] text-red-500 font-bold">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-green-600 font-bold">{couponSuccess}</p>}

              <p className="text-[10px] text-brand-fb/50 leading-relaxed font-sans mt-2">
                * Nhập mã <strong>WELCOME20</strong> để nhận ưu đãi 20% tổng đơn cho khách hàng mới (giảm tối đa 100K)!
              </p>
            </div>

            {/* Coins wallet check-out deduction panel */}
            <div className="bg-brand-card rounded-2xl border border-brand-primary/10 p-5 space-y-3.5 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-brand-primary/5">
                <h4 className="font-serif font-bold text-xs text-brand-fb uppercase flex items-center gap-1.5">
                  <Sparkles size={12} className="text-brand-primary animate-pulse" />
                  Cấn trừ xu dệt thường
                </h4>
                <span className="text-[10px] font-mono font-bold bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full">
                  {coinsWallet.toLocaleString("vi-VN")} xu sẵn
                </span>
              </div>

              {coinsWallet === 0 ? (
                <p className="text-[10px] text-brand-fb/50">Nàng chưa tích sẵn đồng xu hoa nhài nào. Hãy đọc bài viết hoặc tham gia check-in dệt hàng ngày để nhận xu lụa nhé!</p>
              ) : (
                <label className="flex items-start gap-2.5 p-3.5 rounded-xl border border-brand-primary/5 bg-brand-bg/40 cursor-pointer hover:border-brand-primary/20 transition-all">
                  <input
                    type="checkbox"
                    checked={useCoins}
                    onChange={(e) => setUseCoins(e.target.checked)}
                    className="accent-brand-primary mt-0.5"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-sans font-bold text-brand-fb">Khấu trừ toàn bộ xu khả dụng</span>
                    <p className="text-[10px] text-brand-fb/60 leading-relaxed">
                      Sử dụng tối đa <strong className="text-brand-primary font-mono">{coinsWallet.toLocaleString("vi-VN")} xu</strong> để được giảm ngay <strong className="text-brand-primary font-sans">{(maxCoinsApplied).toLocaleString("vi-VN")}VND</strong> trực tiếp vào hóa đơn.
                    </p>
                  </div>
                </label>
              )}
            </div>

            {/* BILL RECEIPT TOTAL COMPUTATIONS */}
            <div className="bg-[#FFFDF9] rounded-2xl border-2 border-dashed border-brand-primary/25 p-5 space-y-3.5">
              <h4 className="font-serif font-bold text-xs text-brand-fb uppercase pb-2 border-b border-brand-primary/10">
                Sao Lục Biên Nhận Dệt
              </h4>
              <div className="space-y-2 text-xs font-sans text-left">
                <div className="flex justify-between text-brand-fb/70">
                  <span>Tổng giá gốc giỏ dệt:</span>
                  <span className="font-mono font-semibold">{cartTotal.toLocaleString("vi-VN")}đ</span>
                </div>
                {discountVal > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Mã WELCOME20 applied:</span>
                    <span className="font-mono">-{discountVal.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
                {maxCoinsApplied > 0 && (
                  <div className="flex justify-between text-brand-primary font-semibold">
                    <span>Cấn trừ xu thưởng:</span>
                    <span className="font-mono">-{maxCoinsApplied.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-brand-fb/70">
                  <span>Phí ship lót mác mộc:</span>
                  <span className="text-green-600 font-bold uppercase text-[11px]">Free Ship 🚚</span>
                </div>
                <div className="pt-2 border-t border-brand-primary/10 flex justify-between items-baseline text-brand-fb font-bold">
                  <span>Còn lại chi trả:</span>
                  <span className="font-mono text-lg font-black text-brand-primary">
                    {finalBillTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
