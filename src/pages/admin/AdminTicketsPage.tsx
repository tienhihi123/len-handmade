import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { getSupportTickets, saveSupportTickets } from "../../data/staff.mock";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { SupportTicket, SupportTicketStatus, TicketMessage } from "../../types";
import { isFirebaseConfigured } from "../../lib/firebase";
import {
  subscribeToTicketsForAdmin,
  subscribeToTicketMessages,
  sendTicketMessage,
  updateTicketStatusInFirestore
} from "../../lib/firestoreTickets";

const STATUS_LABEL: Record<SupportTicketStatus, string> = {
  new: "Mới",
  in_progress: "Đang xử lý",
  waiting_customer: "Chờ khách",
  resolved: "Đã xử lý",
  closed: "Đã đóng"
};

export default function AdminTicketsPage() {
  const { can, staff } = useAdminAuth();
  const [localTickets, setLocalTickets] = useState<SupportTicket[]>(() => getSupportTickets());
  const [firestoreTickets, setFirestoreTickets] = useState<SupportTicket[]>([]);
  const [openThreadId, setOpenThreadId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<TicketMessage[]>([]);
  const [reply, setReply] = useState("");

  useEffect(() => subscribeToTicketsForAdmin(setFirestoreTickets), []);
  const tickets = isFirebaseConfigured && firestoreTickets.length > 0 ? firestoreTickets : localTickets;

  useEffect(() => {
    if (!openThreadId) {
      setThreadMessages([]);
      return;
    }
    return subscribeToTicketMessages(openThreadId, setThreadMessages);
  }, [openThreadId]);

  const updateStatus = (id: string, status: SupportTicketStatus) => {
    setLocalTickets((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t));
      saveSupportTickets(next);
      return next;
    });
    updateTicketStatusInFirestore(id, status);
  };

  const handleSendReply = (ticketId: string) => {
    const body = reply.trim();
    if (!body) return;
    sendTicketMessage(ticketId, {
      senderRole: "admin",
      senderName: staff?.displayName || "Đội ngũ Tiệm Len Nhỏ",
      body
    });
    setReply("");
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Hỗ trợ khách hàng</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Ticket hỗ trợ ({tickets.length})</h1>
      </div>

      <div className="space-y-3">
        {tickets.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-[#E8DDD1] text-center text-xs text-[#75645A] italic">
            Chưa có ticket hỗ trợ nào. Ticket sẽ tự động xuất hiện khi khách hàng gửi yêu cầu qua trang Liên hệ.
          </div>
        )}
        {tickets.map((t) => {
          const isOpen = openThreadId === t.id;
          return (
            <div key={t.id} className="bg-white p-5 rounded-2xl border border-[#E8DDD1] space-y-2 text-xs">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <strong className="text-sm font-serif">{t.subject}</strong>
                  <p className="text-[#75645A] mt-0.5">{t.customerName} · {t.relatedOrderCode || "—"}</p>
                </div>
                <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#FAF6F0] border border-[#E8DDD1]">{STATUS_LABEL[t.status]}</span>
              </div>
              <p className="text-[#75645A]/80">{t.lastMessage}</p>
              {can("feedback.update") && t.status !== "closed" && (
                <div className="flex gap-1.5 flex-wrap pt-1">
                  {(["in_progress", "waiting_customer", "resolved"] as SupportTicketStatus[])
                    .filter((s) => s !== t.status)
                    .map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(t.id, s)}
                        className="px-3 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#E8DDD1] text-[10px] font-bold hover:bg-white transition cursor-pointer"
                      >
                        → {STATUS_LABEL[s]}
                      </button>
                    ))}
                  {can("feedback.close") && (
                    <button onClick={() => updateStatus(t.id, "closed")} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold cursor-pointer">Đóng ticket</button>
                  )}
                </div>
              )}

              <button
                onClick={() => setOpenThreadId(isOpen ? null : t.id)}
                className="pt-1 text-[10px] font-bold text-[#CEAF75] hover:text-[#bfa066] transition cursor-pointer"
              >
                {isOpen ? "Ẩn hội thoại" : "Xem & trả lời hội thoại"}
              </button>

              {isOpen && (
                <div className="pt-2 border-t border-[#E8DDD1] space-y-2">
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {threadMessages.length === 0 ? (
                      <p className="text-[#75645A]/60 italic">Chưa có tin nhắn nào trong hội thoại này.</p>
                    ) : (
                      threadMessages.map((m) => (
                        <div
                          key={m.id}
                          className={`max-w-[85%] rounded-xl px-3 py-2 ${
                            m.senderRole === "admin" ? "ml-auto bg-[#CEAF75]/12 text-[#412C20]" : "bg-[#FAF6F0] text-[#412C20]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[10px]">{m.senderName}</span>
                            <span className="text-[9px] text-[#75645A]/60 font-mono shrink-0">
                              {m.createdAt ? new Date(m.createdAt).toLocaleString("vi-VN") : ""}
                            </span>
                          </div>
                          <p className="mt-0.5">{m.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); handleSendReply(t.id); }
                      }}
                      placeholder="Trả lời khách hàng..."
                      className="flex-1 rounded-xl border border-[#E8DDD1] px-3 py-2 text-xs outline-none focus:border-[#CEAF75]"
                    />
                    <button
                      onClick={() => handleSendReply(t.id)}
                      className="shrink-0 rounded-xl bg-[#412C20] text-white px-3.5 py-2 cursor-pointer hover:bg-[#2b1c14] transition"
                    >
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
