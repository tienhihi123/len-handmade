import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, AlertTriangle, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ReturnsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { returnRequests, setReturnRequests, ordersList, addActivity } = useApp();

  // Route state checker for clicked order reference
  const routeState = location.state as { orderId?: string; productName?: string } | null;

  // Form states
  const [orderId, setOrderId] = useState(routeState?.orderId || "");
  const [productName, setProductName] = useState(routeState?.productName || "");
  const [reason, setReason] = useState("Sợi len bị xơ tủy rão phom");
  const [customDetail, setCustomDetail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !productName.trim()) return;

    const newRequest = {
      id: `RET-${Math.floor(10 + Math.random() * 90)}-CLAIM`,
      orderId,
      productName,
      reason: customDetail ? `${reason}: ${customDetail}` : reason,
      status: "Chờ xử lý" as const,
      createdAt: new Date().toISOString()
    };

    setReturnRequests(prev => [newRequest, ...prev]);
    addActivity("Khai đơn đổi trả dệt", newRequest.id, productName, "return_claim");

    setSuccess(true);
    setOrderId("");
    setProductName("");
    setCustomDetail("");
    setTimeout(() => setSuccess(false), 3500);
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-left">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header bar titles */}
        <div className="pb-6 border-b border-brand-primary/10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B45309] block mb-1">✦ Đảm bảo quyền dệt ✦</span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-fb">Yêu Cầu Hỏa Tốc Đổi Trả</h1>
          <p className="font-sans text-xs sm:text-sm text-brand-fb/60 mt-1">
            Chính sách đổi trả gối túi trong 7 ngày nếu lỗi khâu dệt từ thợ len. Chúng mình bảo hiểm gửi bù hoản miễn phí.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Create Return form container */}
          <div className="md:col-span-7 bg-brand-card p-6 sm:p-8 rounded-3xl border border-brand-primary/10 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-sm text-brand-fb flex items-center gap-1.5 border-b border-brand-primary/5 pb-3">
              <RotateCcw size={16} className="text-brand-primary" />
              Điền Đơn Đăng Ký Đổi Trả
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-sans font-bold text-brand-fb/60 uppercase mb-1.5">Mã đơn hàng bảo an:</label>
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Ví dụ: ORD-1102-SPRING..."
                  className="w-full text-xs font-sans px-4 py-2.5 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold text-brand-fb/60 uppercase mb-1.5 font-sans">Sản phẩm len muốn trả:</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ví dụ: Bó Hoa Tulip Len..."
                  className="w-full text-xs font-sans px-4 py-2.5 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold text-brand-fb/60 uppercase mb-1.5 font-sans">Nguyên cớ hoàn trả:</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs font-sans px-4 py-2.5 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none focus:border-brand-primary"
                >
                  <option value="Sợi len bị xơ tủy rão phom">Sợi len dệt xơ tủy rão phom rỗ 🧶</option>
                  <option value="Sai tone màu hoặc cỡ tùy chỉnh">Giao sai tone màu sắc phối lộn 🎨</option>
                  <option value="Đóng gói rách rưới móp méo hộp">Bao hộp mộc biến dạng rách hư 📦</option>
                  <option value="Lý do cá nhân custom khác">Lý do điều đính cá nhân thợ thêu</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold text-brand-fb/60 uppercase mb-1.5">Bản ghi trình bày chi tiết (Optional):</label>
                <textarea
                  rows={3}
                  value={customDetail}
                  onChange={(e) => setCustomDetail(e.target.value)}
                  placeholder="Trình bày thêm: Ví dụ: quai túi Lavender bị đứt chỉ khâu đáy nơ..."
                  className="w-full text-xs font-sans px-4 py-2.5 rounded-xl border border-brand-primary/15 bg-white text-brand-fb outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex gap-2 p-3 bg-yellow-50 rounded-xl border border-yellow-250 text-yellow-800 text-[10px] items-start">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  * Vui lòng đính kèm hộp sồi mộc nguyên vẹn, giữ hương nhài sấy khô để chúng mình dễ tái dệt chỉ dán.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl cursor-pointer shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                Gửi Yên cầu Đổi Trả Lên Backoffice
              </button>
            </form>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 bg-green-50 text-green-700 rounded-xl text-xs font-semibold flex items-center gap-2 text-left"
                >
                  <CheckCircle2 size={14} />
                  Nộp biên nhận đổi trả thành công! Thợ len đang xem rồi nhé.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Return list container */}
          <div className="md:col-span-5 bg-brand-card p-5 rounded-3xl border border-brand-primary/10 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-xs text-brand-fb uppercase border-b border-brand-primary/5 pb-2">
              Lịch sử khiếu đơn của Nàng ({returnRequests.length})
            </h4>

            {returnRequests.length === 0 ? (
              <p className="text-xs text-brand-fb/45 italic font-sans py-4 mt-2">Nàng chưa gửi biên khiếu nại đổi trả nào.</p>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {returnRequests.map((ret) => (
                  <div key={ret.id} className="p-4 rounded-2xl bg-white border border-brand-primary/5 space-y-2 text-left">
                    <div className="flex items-center justify-between text-[11px] font-sans">
                      <strong className="text-brand-primary font-mono">{ret.id}</strong>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        ret.status === "Chờ xử lý" ? "bg-yellow-100 text-yellow-700" :
                        ret.status === "Đã chấp nhận" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {ret.status}
                      </span>
                    </div>

                    <div className="text-[11px] space-y-1 font-sans">
                      <p className="font-bold text-brand-fb text-xs truncate">{ret.productName}</p>
                      <p className="text-brand-fb/55 text-[10px]">Mã hóa đơn: {ret.orderId}</p>
                      <p className="text-brand-fb/60 italic leading-snug">“{ret.reason}”</p>
                    </div>
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
