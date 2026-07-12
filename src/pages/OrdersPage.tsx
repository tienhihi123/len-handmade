import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Package, Truck, CheckCircle2, Clock, MapPin, Navigation, Info, AlertCircle, 
  ArrowRight, ShieldCheck, ChevronDown, ChevronUp, RotateCcw 
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function OrdersPage() {
  const navigate = useNavigate();
  const { ordersList, currentUser, ordersLoading } = useApp();

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Toggle order expansion to view timeline maps
  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  // Helper determining timeline steps and progress percentage
  const getProgressState = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return { percent: 15, step: 1, text: "Nhận dệt đăng kiểm" };
      case "Đang khâu dệt":
        return { percent: 45, step: 2, text: "Kim khâu tay nghệ nhân 🧶" };
      case "Đang vận chuyển":
        return { percent: 75, step: 3, text: "Shipper lụa giao rảo phố" };
      case "Đã giao":
        return { percent: 100, step: 4, text: "Trao hộp mộc lót hoa nhài" };
      case "Đã hủy":
        return { percent: 0, step: 0, text: "Đơn bị thôi dệt" };
      default:
        return { percent: 15, step: 1, text: "Cập nhật dệt" };
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-left">
      <div className="max-w-4xl mx-auto">
        
        {/* Banner title */}
        <div className="mb-10 pb-6 border-b border-brand-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary block mb-1">✦ Backoffice khách ✦</span>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-fb">Theo Dõi Đơn Hàng</h1>
            <p className="font-sans text-xs sm:text-sm text-brand-fb/60 mt-1">Lục lại lịch sử khâu dệt, tiến trình móc ghim ruy băng và vận lộ trình dệt tơ.</p>
          </div>
          
          <button
            onClick={() => navigate("/returns")}
            className="self-start sm:self-center bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary text-xs font-bold px-4 py-2.5 rounded-full border border-brand-primary/10 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            Yêu cầu Hoàn trả Len
          </button>
        </div>

        {ordersLoading ? (
          <div className="bg-brand-card rounded-3xl p-12 text-center border border-brand-primary/5 space-y-4">
            <Package size={40} className="text-brand-primary/40 mx-auto animate-pulse" />
            <h3 className="font-serif font-bold text-lg text-brand-fb">Đang tải đơn hàng của bạn...</h3>
            <p className="font-sans text-xs text-brand-fb/60">Kết nối tới hệ thống đơn hàng thời gian thực.</p>
          </div>
        ) : ordersList.length === 0 ? (
          <div className="bg-brand-card rounded-3xl p-12 text-center border border-brand-primary/5 space-y-4">
            <Package size={40} className="text-brand-primary/40 mx-auto animate-pulse" />
            <h3 className="font-serif font-bold text-lg text-brand-fb">Nàng chưa gửi gắm đơn khâu nào</h3>
            <p className="font-sans text-xs text-brand-fb/60 max-w-xs mx-auto">Tất cả đơn hàng của bạn sau khi thanh toán COD or Banking sẽ hiển lộ live tại bảng theo dõi mộc này.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-brand-primary text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow cursor-pointer font-sans"
            >
              Dạo Chơi Xem Túi Hộp
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {ordersList.map((order) => {
              const expand = expandedOrderId === order.id;
              const progress = getProgressState(order.status);

              return (
                <div 
                  key={order.id} 
                  className="bg-brand-card rounded-[28px] border border-brand-primary/8 overflow-hidden shadow-sm hover:shadow-md transition-all text-left"
                >
                  {/* Closed header card */}
                  <div 
                    onClick={() => toggleExpand(order.id)}
                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-brand-primary/5 transition-colors select-none"
                  >
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-primary">{order.id}</span>
                        <span className="text-[10px] text-brand-fb/40font-mono">| {new Date(order.time).toLocaleDateString("vi-VN")}</span>
                        
                        {/* Interactive dynamic status badge */}
                        <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full ${
                          order.status === "Đã giao" ? "bg-green-100 text-green-700" :
                          order.status === "Chờ xác nhận" ? "bg-blue-100 text-blue-700" :
                          order.status === "Đang khâu dệt" ? "bg-yellow-100 text-yellow-700" :
                          order.status === "Đang vận chuyển" ? "bg-purple-100 text-purple-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {order.status}
                        </span>

                        {/* Badge trạng thái thanh toán */}
                        {(order.paymentStatus ?? "unpaid") === "paid" ? (
                          <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-sage-accent/20 text-brand-fb">Đã thanh toán</span>
                        ) : (order.paymentStatus ?? "unpaid") === "pending_confirmation" ? (
                          <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-gold/20 text-brand-fb animate-pulse">Chờ xác nhận tiền</span>
                        ) : order.paymentMethod && order.paymentMethod !== "cod" ? (
                          <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-divider-beige text-brand-fb/70">Chờ chuyển khoản</span>
                        ) : null}
                      </div>
                      <h3 className="font-serif font-bold text-xs sm:text-sm text-brand-fb line-clamp-1">
                        {order.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-brand-primary/5">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-brand-fb/40 block font-sans">Tổng thanh toán:</span>
                        <strong className="font-mono text-sm font-bold text-brand-fb">{order.totalPrice.toLocaleString("vi-VN")}đ</strong>
                      </div>
                      
                      <button className="p-1.5 rounded-full bg-brand-primary/5 text-brand-primary">
                        {expand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Tracker Timeline Details */}
                  {expand && (
                    <div className="border-t border-brand-primary/5 p-6 bg-[#FCFAF5]/50 space-y-8 animate-fadeIn">
                      
                      {/* Timeline steps progress line layout */}
                      <div className="space-y-4">
                        <div className="relative pt-2">
                          <div className="h-1 bg-brand-primary/10 rounded-full w-full">
                            <div 
                              className="h-1 bg-brand-primary rounded-full transition-all duration-700"
                              style={{ width: `${progress.percent}%` }}
                            />
                          </div>

                          {/* Coordinates milestones */}
                          <div className="grid grid-cols-4 gap-2 pt-4 relative">
                            {[
                              { label: "Đơn Mới", step: 1, icon: Clock, desc: "Đã ghim sổ" },
                              { label: "Móc Dệt", step: 2, icon: Package, desc: "Thợ đan đan" },
                              { label: "Bưu Lộ", step: 3, icon: Truck, desc: "Đóng bọc đi" },
                              { label: "Giao Nhận", step: 4, icon: CheckCircle2, desc: "Thơm tươm tay" }
                            ].map((mil) => {
                              const active = progress.step >= mil.step;
                              const IconCl = mil.icon;
                              return (
                                <div key={mil.step} className="text-center space-y-1">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto border transition-all ${
                                    active 
                                      ? "bg-brand-primary text-white border-brand-primary shadow" 
                                      : "bg-white text-brand-fb/30 border-brand-primary/10"
                                  }`}>
                                    <IconCl size={13} />
                                  </div>
                                  <span className={`block text-[10px] font-sans font-semibold ${active ? "text-brand-fb" : "text-brand-fb/40"}`}>
                                    {mil.label}
                                  </span>
                                  <span className="text-[8px] font-sans text-brand-fb/35 block leading-none">
                                    {mil.desc}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Map coordinate tracking component */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-2">
                        
                        {/* Map graphical mockup */}
                        <div className="md:col-span-7 bg-[#FFFDF9] rounded-2xl border border-brand-primary/15 h-52 relative overflow-hidden flex items-center justify-center shadow-inner">
                          
                          {/* Aesthetic stylized vectors path mapping background */}
                          <div className="absolute inset-0 select-none opacity-20 bg-[radial-gradient(#B45309_1px,transparent_1px)] [background-size:16px_16px]" />
                          <svg className="absolute inset-0 w-full h-full text-brand-primary/15" viewBox="0 0 300 200" fill="none">
                            <path d="M 20 180 Q 150 140, 180 80 T 280 30" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
                            <circle cx="20" cy="180" r="4" fill="hsl(18, 45%, 48%)" />
                            <circle cx="180" cy="80" r="4" fill="hsl(18, 45%, 48%)" />
                            <circle cx="280" cy="30" r="5" fill="hsl(105, 22%, 58%)" />
                          </svg>

                          {/* Dynamic pulse navigation marker */}
                          <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute z-10 w-4 h-4 rounded-full bg-brand-primary/30 flex items-center justify-center border border-brand-primary"
                            style={{ 
                              left: order.status === "Chờ xác nhận" ? "15%" :
                                    order.status === "Đang khâu dệt" ? "35%" :
                                    order.status === "Đang vận chuyển" ? "64%" : "91%" ,
                              top: order.status === "Chờ xác nhận" ? "82%" :
                                   order.status === "Đang khâu dệt" ? "65%" :
                                   order.status === "Đang vận chuyển" ? "42%" : "12%" 
                            }}
                          >
                            <div className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
                          </motion.div>

                          {/* Float visual directions HUD info card */}
                          <div className="absolute bottom-3 left-3 bg-brand-fb/85 backdrop-blur-md text-white p-3 rounded-xl max-w-[200px] text-left text-[9px] font-sans space-y-1 shadow">
                            <div className="flex items-center gap-1 font-bold text-brand-secondary uppercase">
                              <Navigation size={9} className="animate-pulse" />
                              <span>Đang định vị lộ trình</span>
                            </div>
                            <p className="font-mono text-white/80">Tốc: 10.7756° N, 106.7011° E</p>
                            <p className="truncate text-white/60">Giao dịch bởi: Shipper dệt Len</p>
                          </div>

                          <span className="absolute top-2 right-2.5 bg-brand-primary text-white text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded shadow">
                            MAPS MOCK
                          </span>
                        </div>

                        {/* Deliver updates logs text */}
                        <div className="md:col-span-5 bg-[#FFF] p-4 rounded-2xl border border-brand-primary/5 text-xs text-left relative flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-1.5 font-bold text-brand-fb border-b border-brand-primary/5 pb-1.5">
                              <Info size={13} className="text-brand-primary" />
                              <span>Chi Tiết Hành Trình</span>
                            </div>

                            <div className="space-y-2.5 text-[11px] font-sans">
                              <div className="flex gap-2">
                                <span className="font-bold text-brand-primary">Lộ điểm:</span>
                                <span className="text-brand-fb/70">{progress.text}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-bold text-brand-primary">Địa chỉ:</span>
                                <span className="text-brand-fb/70 truncate">{order.shippingAddress || "Chưa đồng bộ"}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-bold text-brand-primary">Khách ký:</span>
                                <span className="text-brand-fb/70">{order.customerName}</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick return lodge trigger for standard delivered orders */}
                          {order.status === "Đã giao" && (
                            <button
                              onClick={() => navigate("/returns", { state: { orderId: order.id, productName: order.name } })}
                              className="mt-4 w-full bg-[#1F2937] hover:bg-black text-[10px] text-white font-sans font-bold py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <RotateCcw size={10} />
                              Hàng xơ phom? Đổi trả ngay
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
