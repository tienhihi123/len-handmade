import { useMemo, useState } from "react";
import { LifeBuoy, Clock, AlertTriangle, RefreshCw, Wallet, Users, Gauge } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getSupportTickets, getRefundRequests } from "../../data/staff.mock";
import { SupportTicketPriority } from "../../types";

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 2)}***@${domain}`;
}

const PRIORITY_STYLE: Record<SupportTicketPriority, string> = {
  low: "bg-gray-100 text-gray-600",
  normal: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  urgent: "bg-red-100 text-red-700"
};

export default function SupportDashboardPage() {
  const { returnRequests } = useApp();
  const [tickets] = useState(() => getSupportTickets());
  const [refunds] = useState(() => getRefundRequests());

  const newTickets = tickets.filter((t) => t.status === "new");
  const inProgress = tickets.filter((t) => t.status === "in_progress");
  const overdue = tickets.filter(
    (t) => (t.status === "new" || t.status === "in_progress") && Date.now() - new Date(t.createdAt).getTime() > 24 * 3600 * 1000
  );
  const waitingCustomer = tickets.filter((t) => t.status === "waiting_customer");
  const resolvedCount = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;
  const performance = tickets.length ? Math.round((resolvedCount / tickets.length) * 100) : 0;

  const byPriority = useMemo(() => {
    const map: Record<SupportTicketPriority, number> = { low: 0, normal: 0, high: 0, urgent: 0 };
    tickets.forEach((t) => (map[t.priority] += 1));
    return map;
  }, [tickets]);

  const pendingReturns = returnRequests.filter((r) => r.status === "Chờ xử lý");
  const pendingRefunds = refunds.filter((r) => r.status === "requested" || r.status === "reviewing");

  const cards = [
    { label: "Ticket mới", value: newTickets.length, icon: LifeBuoy },
    { label: "Đang xử lý", value: inProgress.length, icon: Clock },
    { label: "Quá hạn", value: overdue.length, icon: AlertTriangle },
    { label: "Yêu cầu đổi trả", value: pendingReturns.length, icon: RefreshCw },
    { label: "Yêu cầu hoàn tiền", value: pendingRefunds.length, icon: Wallet },
    { label: "Khách cần phản hồi", value: waitingCustomer.length, icon: Users }
  ];

  return (
    <div className="space-y-8 text-left">
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Dashboard hỗ trợ</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Chăm sóc khách hàng</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white p-5 rounded-2xl border border-[#E8DDD1] shadow-sm space-y-1.5">
              <span className="text-[10px] text-[#75645A] uppercase font-bold">{c.label}</span>
              <div className="flex items-center justify-between">
                <strong className="text-lg font-mono font-black text-[#412C20]">{c.value}</strong>
                <Icon className="text-[#CEAF75]" size={17} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
          <h4 className="font-serif font-bold text-xs uppercase border-b border-[#E8DDD1] pb-3">Danh sách ticket (thông tin khách được ẩn bớt)</h4>
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {tickets.map((t) => (
              <div key={t.id} className="p-3.5 bg-[#FAF6F0] rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <strong className="text-[#412C20]">{t.subject}</strong>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</span>
                </div>
                <p className="text-[#75645A]">{t.customerName} · {maskEmail(t.customerEmail)} · {t.customerPhone}</p>
                <p className="text-[#75645A]/80 line-clamp-1">{t.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-[#E8DDD1] pb-3">
            <Gauge size={15} className="text-[#CEAF75]" />
            <h4 className="font-serif font-bold text-xs uppercase">Hiệu suất & mức ưu tiên</h4>
          </div>
          <div>
            <p className="text-[10px] text-[#75645A] uppercase font-bold mb-1">Tỉ lệ xử lý thành công</p>
            <div className="h-2.5 bg-[#FAF6F0] rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${performance}%` }} />
            </div>
            <p className="text-right text-xs font-mono font-bold mt-1">{performance}%</p>
          </div>
          <div className="space-y-2">
            {(Object.keys(byPriority) as SupportTicketPriority[]).map((p) => (
              <div key={p} className="flex justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full font-bold ${PRIORITY_STYLE[p]}`}>{p}</span>
                <span className="font-mono font-bold">{byPriority[p]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
