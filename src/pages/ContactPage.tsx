import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Navigation, LogIn, MessageCircle, ChevronDown } from "lucide-react";
import { BRAND_EMAIL } from "../constants/brand";
import { useApp } from "../context/AppContext";
import { submitFeedbackToFirestore } from "../lib/firestoreFeedback";
import { submitSupportTicket } from "../data/staff.mock";
import {
  createTicketInFirestore,
  subscribeToMyTickets,
  subscribeToTicketMessages,
  sendTicketMessage
} from "../lib/firestoreTickets";
import { isFirebaseConfigured } from "../lib/firebase";
import type { SupportTicket, SupportTicketStatus, TicketMessage } from "../types";
import BrandCard from "../components/BrandCard";

const TICKET_STATUS_LABEL: Record<SupportTicketStatus, string> = {
  new: "Mới gửi",
  in_progress: "Đang xử lý",
  waiting_customer: "Chờ bạn phản hồi",
  resolved: "Đã xử lý",
  closed: "Đã đóng"
};

export default function ContactPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const [myTickets, setMyTickets] = useState<SupportTicket[]>([]);
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<TicketMessage[]>([]);
  const [threadReply, setThreadReply] = useState("");

  useEffect(() => {
    const productName = (location.state as { productName?: string } | null)?.productName;
    if (productName) {
      setMsg(`Mình muốn được tư vấn màu sắc, chất liệu và giá chính xác cho mẫu "${productName}".`);
    }
  }, [location.state]);

  useEffect(() => {
    if (!currentUser) return;
    return subscribeToMyTickets(currentUser.id, setMyTickets);
  }, [currentUser]);

  useEffect(() => {
    if (!openTicketId) {
      setThreadMessages([]);
      return;
    }
    return subscribeToTicketMessages(openTicketId, setThreadMessages);
  }, [openTicketId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !msg.trim()) return;

    submitFeedbackToFirestore({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      message: msg
    });

    // Also raises a real support ticket (visible to staff in /admin/tickets),
    // tied to the actual logged-in customer rather than fixture data.
    const ticketInput = {
      customerUid: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      subject: `Lá thư tay từ ${currentUser.name}`,
      message: msg
    };
    if (isFirebaseConfigured) {
      createTicketInFirestore(ticketInput);
    } else {
      submitSupportTicket(ticketInput);
    }

    setSent(true);
    setMsg("");
    setTimeout(() => setSent(false), 3000);
  };

  const handleSendThreadReply = (ticketId: string) => {
    if (!currentUser || !threadReply.trim()) return;
    sendTicketMessage(ticketId, { senderRole: "customer", senderName: currentUser.name, body: threadReply.trim() });
    setThreadReply("");
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
          <div className="lg:col-span-4 bg-white p-4 lg:p-5 rounded-2xl border border-brand-primary/10 shadow-sm space-y-8 flex flex-col justify-between text-left">
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
                    <span className="text-brand-fb/70">0966 092 483 (Zalo 24h)</span>
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

          {/* MIDDLE: Active contact sheet form inputs */}
          <div className="lg:col-span-5 bg-white p-4 lg:p-5 rounded-2xl border border-brand-primary/10 shadow-sm text-left">
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

            {currentUser && myTickets.length > 0 && (
              <div className="mt-6 pt-6 border-t border-brand-primary/10 space-y-3">
                <h4 className="font-serif font-bold text-sm text-brand-fb flex items-center gap-1.5">
                  <MessageCircle size={15} className="text-brand-primary" /> Tin nhắn của tôi
                </h4>
                {myTickets.map((t) => {
                  const isOpen = openTicketId === t.id;
                  return (
                    <div key={t.id} className="rounded-xl border border-brand-primary/10 overflow-hidden">
                      <button
                        onClick={() => setOpenTicketId(isOpen ? null : t.id)}
                        className="w-full flex items-center justify-between gap-2 px-3.5 py-3 text-left hover:bg-brand-bg/60 transition cursor-pointer"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-brand-fb truncate">{t.subject}</p>
                          <p className="text-[10px] text-brand-fb/50 mt-0.5">Cập nhật lúc {new Date(t.updatedAt).toLocaleString("vi-VN")}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-brand-bg border border-brand-primary/10 text-brand-fb">
                            {TICKET_STATUS_LABEL[t.status]}
                          </span>
                          <ChevronDown size={14} className={`text-brand-fb/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 space-y-2.5">
                          <div className="max-h-56 overflow-y-auto space-y-2">
                            {threadMessages.length === 0 ? (
                              <p className="text-[11px] text-brand-fb/50 italic">Chưa có tin nhắn.</p>
                            ) : (
                              threadMessages.map((m) => (
                                <div
                                  key={m.id}
                                  className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] ${
                                    m.senderRole === "customer" ? "ml-auto bg-brand-primary/10 text-brand-fb" : "bg-brand-bg text-brand-fb"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold">{m.senderName}</span>
                                    <span className="text-[9px] text-brand-fb/40 font-mono shrink-0">
                                      {m.createdAt ? new Date(m.createdAt).toLocaleString("vi-VN") : ""}
                                    </span>
                                  </div>
                                  <p className="mt-0.5">{m.body}</p>
                                </div>
                              ))
                            )}
                          </div>
                          {t.status !== "closed" && (
                            <div className="flex gap-2">
                              <input
                                value={threadReply}
                                onChange={(e) => setThreadReply(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") { e.preventDefault(); handleSendThreadReply(t.id); }
                                }}
                                placeholder="Nhắn thêm cho shop..."
                                className="flex-1 rounded-xl border border-brand-primary/15 bg-white px-3 py-2 text-xs outline-none focus:border-brand-primary"
                              />
                              <button
                                onClick={() => handleSendThreadReply(t.id)}
                                className="shrink-0 rounded-xl bg-brand-primary text-white px-3 py-2 cursor-pointer hover:bg-brand-primary/90 transition"
                              >
                                <Send size={13} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Brand visit card + QR */}
          <div className="lg:col-span-3">
            <BrandCard variant="compact" />
          </div>

        </div>
      </div>
    </div>
  );
}
