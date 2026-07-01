import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Package, Truck, CheckCircle2, Clock, XCircle,
  Phone, Hash, ChevronDown, ChevronUp, ShieldCheck, AlertCircle
} from "lucide-react";
import { LoggedOrder } from "../types";
import { SAMPLE_ORDERS } from "../data/sampleData";
import { useApp } from "../context/AppContext";

// All order statuses & their config
const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: any; step: number; percent: number }> = {
  "Chờ xác nhận":      { label: "Chờ xác nhận",       color: "text-blue-700",   bgColor: "bg-blue-50 border-blue-200",    icon: Clock,         step: 1, percent: 15 },
  "Đã xác nhận":       { label: "Đã xác nhận",         color: "text-indigo-700", bgColor: "bg-indigo-50 border-indigo-200", icon: CheckCircle2,  step: 2, percent: 35 },
  "Đang chuẩn bị hàng":{ label: "Đang chuẩn bị hàng", color: "text-amber-700",  bgColor: "bg-amber-50 border-amber-200",  icon: Package,       step: 3, percent: 55 },
  "Đang giao":         { label: "Đang giao",            color: "text-purple-700", bgColor: "bg-purple-50 border-purple-200",icon: Truck,         step: 4, percent: 78 },
  "Hoàn tất":          { label: "Hoàn tất",             color: "text-green-700",  bgColor: "bg-green-50 border-green-200",  icon: CheckCircle2,  step: 5, percent: 100 },
  "Đã hủy":            { label: "Đã hủy",               color: "text-red-700",   bgColor: "bg-red-50 border-red-200",      icon: XCircle,       step: 0, percent: 0   }
};

const PAYMENT_LABEL: Record<string, string> = {
  cod: "💵 Thanh toán khi nhận hàng (COD)",
  banking: "🏦 Chuyển khoản ngân hàng",
  vietqr: "📱 VietQR",
  momo: "💜 MoMo"
};

const TIMELINE_STEPS = [
  { label: "Chờ xác nhận",       icon: Clock,        desc: "Đơn đã được ghi nhận" },
  { label: "Đã xác nhận",        icon: CheckCircle2, desc: "Shop đã xác nhận đơn" },
  { label: "Đang chuẩn bị",      icon: Package,      desc: "Đang móc/đan sản phẩm" },
  { label: "Đang giao",          icon: Truck,        desc: "Đã bàn giao cho shipper" },
  { label: "Hoàn tất",           icon: CheckCircle2, desc: "Đã giao đến tay bạn" }
];

export default function TrackOrderPage() {
  const { ordersList } = useApp();

  // Combine global orders + sample orders (deduplicate)
  const allOrders = [
    ...ordersList,
    ...SAMPLE_ORDERS.filter(s => !ordersList.some(o => o.id === s.id))
  ];

  const [searchType, setSearchType] = useState<"code" | "phone">("code");
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<LoggedOrder | null | "not-found">(null);
  const [expanded, setExpanded] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const query = searchInput.trim().toUpperCase();
    let found: LoggedOrder | undefined;

    if (searchType === "code") {
      found = allOrders.find(o =>
        o.id.toUpperCase() === query ||
        (o.orderCode && o.orderCode.toUpperCase() === query)
      );
    } else {
      // search by phone — return the LATEST order with that phone
      const matches = allOrders.filter(o =>
        o.customerPhone && o.customerPhone.replace(/\s/g, "") === searchInput.trim().replace(/\s/g, "")
      );
      found = matches.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0];
    }

    setHasSearched(true);
    setSearchResult(found ?? "not-found");
    setExpanded(false);
  };

  const order = searchResult !== "not-found" ? searchResult as LoggedOrder : null;
  const config = order ? (STATUS_CONFIG[order.status] ?? STATUS_CONFIG["Chờ xác nhận"]) : null;

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="text-center space-y-3 pb-8 border-b border-brand-primary/10">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary block">
            ✦ Tra Cứu Đơn Hàng ✦
          </span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-fb">
            Theo Dõi Đơn Hàng
          </h1>
          <p className="font-sans text-sm text-brand-fb/60 max-w-md mx-auto leading-relaxed">
            Nhập mã đơn hàng hoặc số điện thoại để tra cứu tình trạng đơn hàng của bạn. Không cần đăng nhập.
          </p>
        </div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-brand-primary/15 p-6 sm:p-8 shadow-sm space-y-5"
        >
          {/* Search Type Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setSearchType("code")}
              className={`flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                searchType === "code"
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-brand-fb/60 border-brand-primary/15 hover:border-brand-primary/40"
              }`}
            >
              <Hash size={14} />
              Mã đơn hàng
            </button>
            <button
              onClick={() => setSearchType("phone")}
              className={`flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                searchType === "phone"
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-brand-fb/60 border-brand-primary/15 hover:border-brand-primary/40"
              }`}
            >
              <Phone size={14} />
              Số điện thoại
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-[11px] font-sans font-bold text-brand-fb/60 uppercase mb-2">
                {searchType === "code" ? "Nhập mã đơn hàng:" : "Nhập số điện thoại đặt hàng:"}
              </label>
              <input
                type={searchType === "phone" ? "tel" : "text"}
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder={searchType === "code" ? "Ví dụ: LH-20260601-001 hoặc ORD-XXXXXX-WEAVE" : "Ví dụ: 0901234567"}
                className="w-full text-sm font-sans px-4 py-3 rounded-xl border border-brand-primary/15 bg-brand-bg text-brand-fb outline-none focus:border-brand-primary transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary-light text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <Search size={16} />
              Tra cứu ngay
            </button>
          </form>

          <p className="text-center text-[11px] text-brand-fb/40 font-sans">
            🔒 Thông tin đơn hàng được bảo mật tuyệt đối
          </p>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div
              key={searchResult === "not-found" ? "notfound" : order?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Not Found */}
              {searchResult === "not-found" && (
                <div className="bg-white rounded-3xl border border-red-100 p-8 text-center space-y-3 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                    <AlertCircle size={28} className="text-red-400" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-brand-fb">Không tìm thấy đơn hàng</h3>
                  <p className="text-xs text-brand-fb/60 font-sans leading-relaxed max-w-xs mx-auto">
                    {searchType === "code"
                      ? "Mã đơn hàng không tồn tại. Vui lòng kiểm tra lại mã đơn trong email xác nhận."
                      : "Không có đơn hàng nào với số điện thoại này. Hãy thử mã đơn hàng."
                    }
                  </p>
                </div>
              )}

              {/* Found Order */}
              {order && config && (
                <div className="bg-white rounded-3xl border border-brand-primary/15 shadow-sm overflow-hidden">

                  {/* Order Header */}
                  <div className={`p-6 ${config.bgColor} border-b`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-fb/60">
                            {order.orderCode || order.id}
                          </span>
                          <ShieldCheck size={13} className="text-brand-primary" />
                        </div>
                        <h2 className="font-serif font-bold text-lg text-brand-fb">
                          {order.customerName}
                        </h2>
                        <p className="text-xs text-brand-fb/60 font-sans">
                          Đặt ngày {new Date(order.time).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border ${config.bgColor} ${config.color} self-start sm:self-center`}>
                        <config.icon size={15} />
                        {order.status}
                      </div>
                    </div>
                  </div>

                  {/* Progress Timeline (only for non-cancelled) */}
                  {order.status !== "Đã hủy" && (
                    <div className="p-6 border-b border-brand-primary/8">
                      <h3 className="font-serif font-bold text-sm text-brand-fb mb-4">Tiến Trình Đơn Hàng</h3>

                      {/* Progress Bar */}
                      <div className="relative h-2 bg-brand-primary/10 rounded-full mb-6">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${config.percent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-2 bg-brand-primary rounded-full"
                        />
                      </div>

                      {/* Step Icons */}
                      <div className="grid grid-cols-5 gap-1">
                        {TIMELINE_STEPS.map((step, idx) => {
                          const isActive = (config.step) > idx;
                          const isCurrent = config.step === idx + 1;
                          return (
                            <div key={step.label} className="text-center space-y-1.5">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto border-2 transition-all ${
                                isActive
                                  ? "bg-brand-primary border-brand-primary text-white shadow-md"
                                  : "bg-white border-brand-primary/15 text-brand-fb/30"
                              } ${isCurrent ? "ring-2 ring-brand-primary/30 ring-offset-2" : ""}`}>
                                <step.icon size={13} />
                              </div>
                              <span className={`block text-[9px] font-sans font-semibold leading-tight ${isActive ? "text-brand-fb" : "text-brand-fb/35"}`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Cancelled Notice */}
                  {order.status === "Đã hủy" && (
                    <div className="p-6 border-b border-brand-primary/8">
                      <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                        <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-sm text-red-700">Đơn hàng đã bị hủy</p>
                          <p className="text-xs text-red-600/80 mt-0.5">
                            {order.note ? `Lý do: ${order.note}` : "Đơn hàng đã được hủy. Vui lòng liên hệ shop nếu cần hỗ trợ."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Details Toggle */}
                  <div
                    onClick={() => setExpanded(e => !e)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-brand-primary/3 transition-colors border-b border-brand-primary/8 select-none"
                  >
                    <span className="text-xs font-bold text-brand-fb font-sans uppercase">Chi tiết đơn hàng</span>
                    {expanded ? <ChevronUp size={16} className="text-brand-primary" /> : <ChevronDown size={16} className="text-brand-primary" />}
                  </div>

                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 space-y-5 bg-brand-bg/40">

                          {/* Order Items */}
                          {order.items && order.items.length > 0 && (
                            <div className="space-y-2.5">
                              <h4 className="text-[11px] font-bold font-sans uppercase text-brand-fb/60">Sản phẩm đặt mua</h4>
                              {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-xs font-sans bg-white rounded-xl p-3 border border-brand-primary/8">
                                  <div>
                                    <p className="font-bold text-brand-fb">{item.productName}</p>
                                    <p className="text-brand-fb/55 text-[10px]">{item.color} · {item.size} · x{item.quantity}</p>
                                    {item.customMeasurements?.note && (
                                      <p className="text-[9px] text-brand-primary/70 italic mt-0.5">📏 {item.customMeasurements.note}</p>
                                    )}
                                  </div>
                                  <span className="font-mono font-bold text-brand-fb">{item.subtotal.toLocaleString("vi-VN")}đ</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Info Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                            <div className="space-y-2">
                              <p className="text-brand-fb/50 uppercase text-[10px] font-bold">Thông tin giao hàng</p>
                              <p className="text-brand-fb/80">{order.shippingAddress || "Chưa có thông tin"}</p>
                              {order.customerPhone && <p className="text-brand-fb/80">📞 {order.customerPhone}</p>}
                            </div>
                            <div className="space-y-2">
                              <p className="text-brand-fb/50 uppercase text-[10px] font-bold">Thanh toán</p>
                              <p className="text-brand-fb/80">{order.paymentMethod ? PAYMENT_LABEL[order.paymentMethod] : "—"}</p>
                            </div>
                          </div>

                          {/* Note */}
                          {order.note && (
                            <div className="text-xs font-sans bg-white rounded-xl p-3 border border-brand-primary/8">
                              <span className="text-brand-fb/50 text-[10px] font-bold uppercase block mb-1">Ghi chú đơn hàng</span>
                              <p className="text-brand-fb/80 italic">"{order.note}"</p>
                            </div>
                          )}

                          {/* Totals */}
                          <div className="bg-white rounded-xl border-2 border-dashed border-brand-primary/20 p-4 space-y-2 text-xs font-sans">
                            <div className="flex justify-between text-brand-fb/70">
                              <span>Tổng tiền hàng:</span>
                              <span className="font-mono">{(order.totalPrice + (order.discountApplied || 0) + (order.coinsUsed || 0)).toLocaleString("vi-VN")}đ</span>
                            </div>
                            {(order.discountApplied || 0) > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>Mã giảm giá:</span>
                                <span className="font-mono">-{order.discountApplied!.toLocaleString("vi-VN")}đ</span>
                              </div>
                            )}
                            <div className="flex justify-between text-brand-fb/70">
                              <span>Phí vận chuyển:</span>
                              <span className="text-green-600 font-bold">Miễn phí 🚚</span>
                            </div>
                            <div className="border-t border-brand-primary/10 pt-2 flex justify-between font-bold text-brand-fb text-sm">
                              <span>Tổng thanh toán:</span>
                              <span className="font-mono text-brand-primary">{order.totalPrice.toLocaleString("vi-VN")}đ</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer: Contact */}
                  <div className="p-5 flex flex-col sm:flex-row gap-3 items-center justify-between bg-brand-bg/30">
                    <p className="text-xs text-brand-fb/50 font-sans text-center sm:text-left">
                      Cần hỗ trợ? Liên hệ ngay với chúng mình 💙
                    </p>
                    <a
                      href="tel:0912443110"
                      className="bg-brand-primary text-white text-xs font-bold px-5 py-2 rounded-full flex items-center gap-1.5 hover:bg-brand-primary-light transition-colors shadow-sm"
                    >
                      <Phone size={13} />
                      Gọi Shop: 0912 443 1102
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Example order codes hint */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-brand-primary/5 rounded-2xl border border-brand-primary/10 p-4 text-center space-y-2"
          >
            <p className="text-[11px] font-bold text-brand-fb/60 uppercase font-sans">📝 Mã đơn mẫu để thử nghiệm</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["LH-20260601-001", "LH-20260605-002", "LH-20260608-003"].map(code => (
                <button
                  key={code}
                  onClick={() => { setSearchType("code"); setSearchInput(code); }}
                  className="font-mono text-[11px] bg-white border border-brand-primary/20 text-brand-primary px-3 py-1 rounded-lg hover:bg-brand-primary/5 cursor-pointer transition-colors"
                >
                  {code}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-brand-fb/40 font-sans">Hoặc thử SĐT: 0901234567</p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
