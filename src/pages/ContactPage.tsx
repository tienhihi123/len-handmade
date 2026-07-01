import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Navigation, LogIn } from "lucide-react";
import { BRAND_EMAIL } from "../constants/brand";
import { useApp } from "../context/AppContext";
import { submitFeedbackToFirestore } from "../lib/firestoreFeedback";

export default function ContactPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const productName = (location.state as { productName?: string } | null)?.productName;
    if (productName) {
      setMsg(`Mình muốn được tư vấn màu sắc, chất liệu và giá chính xác cho mẫu "${productName}".`);
    }
  }, [location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !msg.trim()) return;

    submitFeedbackToFirestore({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      message: msg
    });

    setSent(true);
    setMsg("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-left">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header title */}
        <div className="pb-6 border-b border-brand-primary/10">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary block mb-1">✦ Liên lạc dệt ✦</span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-fb">Kết Nối Với Chúng Mình</h1>
          <p className="font-sans text-xs sm:text-sm text-brand-fb/60 mt-1">Nàng thương gửi ý kiến, đặt custom dệt tên chữ cái, thắp nơ quà sinh nhật, hay hợp tác mỹ học dệt chỉ dâu.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Store Details Coordinates */}
          <div className="lg:col-span-5 bg-white p-4 lg:p-5 rounded-2xl border border-brand-primary/10 shadow-sm space-y-8 flex flex-col justify-between text-left">
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-md text-brand-fb border-b border-brand-primary/5 pb-3">
                Thông Tin Tạp Showroom Dệt
              </h3>

              <div className="space-y-5 text-xs font-sans">
                <div className="flex gap-3.5 items-start">
                  <div className="p-2.5 rounded-full bg-brand-primary/10 text-brand-primary">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <strong className="block text-brand-fb mb-0.5">Xưởng dệt trung tâm:</strong>
                    <span className="text-brand-fb/70">252 Lý Tự Trọng, P. Bến Thành, Quận 1, TP. Hồ Chí Minh</span>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="p-2.5 rounded-full bg-brand-primary/10 text-brand-primary">
                    <Phone size={16} />
                  </div>
                  <div>
                    <strong className="block text-brand-fb mb-0.5">Hotline dệt hỗ trợ Nàng:</strong>
                    <span className="text-brand-fb/70">0912 443 1102 (Zalo 24h)</span>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="p-2.5 rounded-full bg-brand-primary/10 text-brand-primary">
                    <Mail size={16} />
                  </div>
                  <div>
                    <strong className="block text-brand-fb mb-0.5">Hòm thư dệt thơ:</strong>
                    <span className="text-brand-fb/70">{BRAND_EMAIL}</span>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="p-2.5 rounded-full bg-brand-primary/10 text-brand-primary">
                    <Clock size={16} />
                  </div>
                  <div>
                    <strong className="block text-brand-fb mb-0.5">Chu kỳ dệt rạp:</strong>
                    <span className="text-brand-fb/70">Mở cửa dạo chơi: 08:30 – 21:30 (Tất cả ngày nghỉ bông lễ)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct location routing mockup view */}
            <div className="p-4 bg-brand-bg rounded-2xl border border-brand-primary/5 space-y-2 text-xs font-sans mt-4">
              <div className="flex items-center gap-1 font-bold text-[#B45309]">
                <Navigation size={12} className="animate-spin-slow" />
                <span>Showroom Định Vị Hỏa Tốc:</span>
              </div>
              <p className="text-brand-fb/60 text-[11px]">Bến Thành Market - Đi bộ 3 phút, ngõ mộc yên tĩnh có chỗ đỗ ô tô rộng lượn nhài.</p>
            </div>
          </div>

          {/* RIGHT: Active contact sheet form inputs */}
          <div className="lg:col-span-7 bg-white p-4 lg:p-5 rounded-2xl border border-brand-primary/10 shadow-sm text-left">
            <h3 className="font-serif font-bold text-md text-brand-fb mb-1">Gửi Gắm Lá Thư Tay</h3>
            <p className="font-sans text-xs text-brand-fb/60 mb-6 font-sans">
              Chúng mình lắng tai ghi nhận mọi ý kiến, mong mỏi dệt custom túi nơ hoa trang trí ngày hội.
            </p>

            {!currentUser ? (
              <button
                onClick={() => navigate("/login", { state: { from: location.pathname } })}
                className="w-full flex items-center justify-center gap-2 bg-brand-bg hover:bg-brand-primary/10 border border-dashed border-brand-primary/30 text-brand-fb text-sm font-semibold min-h-11 px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
              >
                <LogIn size={16} /> Đăng nhập để gửi phản hồi
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-brand-fb/50 font-sans">
                  Gửi với tư cách <strong className="text-brand-fb/80">{currentUser.name}</strong> ({currentUser.email})
                </p>

                <div>
                  <label className="block text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase mb-1.5">Lời dệt nhắn của nàng:</label>
                  <textarea
                    required
                    rows={4}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Nàng thương, mình muốn thắt bó salix tulip hồng móc kèm charm tên 'Sóc Nhỏ'. Mong thợ dệt gói hộp lụa mộc sang quý giúp..."
                    className="w-full text-sm lg:text-base font-sans px-4 py-3 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white text-sm lg:text-base font-medium uppercase tracking-wider min-h-11 px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send size={16} />
                  Gửi Hài Lòng Tin nhắn dệt
                </button>
              </form>
            )}

            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-3 bg-brand-accent/20 border border-brand-accent/30 rounded-xl text-xs font-semibold text-brand-fb flex items-center gap-2"
                >
                  <CheckCircle2 size={13} className="text-brand-primary" />
                  Chúng mình đã dính nhận lá thư tay! Sẽ mail dối thoại nàng tức dốc.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
