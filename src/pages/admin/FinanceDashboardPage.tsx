import { useEffect, useMemo, useState } from "react";
import { TrendingUp, CreditCard, XCircle, Wallet, PieChart, Coins, FileWarning, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getRefundRequests, processRefundLocal } from "../../data/staff.mock";
import { subscribeToAllOrdersForAdmin } from "../../lib/firestoreOrdersAdmin";
import type { LoggedOrder } from "../../types";

export default function FinanceDashboardPage() {
  const { allOrders, currentUser } = useApp();
  const { staff, can } = useAdminAuth();
  const [refunds, setRefunds] = useState(() => getRefundRequests());
  const [reasonDraft, setReasonDraft] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  // Số liệu tài chính tính từ đơn Firestore THẬT (không dùng sample revenueData)
  const [firestoreOrders, setFirestoreOrders] = useState<LoggedOrder[]>([]);
  useEffect(() => subscribeToAllOrdersForAdmin(setFirestoreOrders), []);
  const sourceOrders = firestoreOrders.length > 0 ? firestoreOrders : allOrders;

  // Đơn tính doanh thu: online paid hoặc COD hoàn tất; loại hủy/unpaid/pending/refunded
  const countableOrders = useMemo(
    () =>
      sourceOrders.filter((o) => {
        if (o.status === "Đã hủy") return false;
        const ps = o.paymentStatus ?? "unpaid";
        if (ps === "refunded") return false;
        if (ps === "paid") return true;
        return (o.paymentMethod ?? "cod") === "cod" && o.status === "Hoàn tất";
      }),
    [sourceOrders]
  );

  const todayKey = new Date().toISOString().slice(0, 10);
  const monthKey = todayKey.slice(0, 7);
  const revenueDateOf = (o: LoggedOrder) => (o.paidAt ?? o.time).slice(0, 10);
  const todayRevenue = useMemo(
    () => countableOrders.filter((o) => revenueDateOf(o) === todayKey).reduce((s, o) => s + o.totalPrice, 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [countableOrders]
  );
  const monthRevenue = useMemo(
    () => countableOrders.filter((o) => revenueDateOf(o).startsWith(monthKey)).reduce((s, o) => s + o.totalPrice, 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [countableOrders]
  );

  const paymentSuccess = countableOrders.length;
  const paymentFailed = sourceOrders.filter((o) => o.status === "Đã hủy").length;
  const pendingRefunds = refunds.filter((r) => r.status === "requested" || r.status === "reviewing");
  const completedRefunds = refunds.filter((r) => r.status === "completed");
  const totalDiscount = sourceOrders.reduce((s, o) => s + (o.discountApplied || 0), 0);
  const totalCoinsUsed = sourceOrders.reduce((s, o) => s + (o.coinsUsed || 0), 0);

  const byPaymentMethod = useMemo(() => {
    const map = new Map<string, number>();
    countableOrders.forEach((o) => {
      const method = o.paymentMethod || "cod";
      map.set(method, (map.get(method) || 0) + o.totalPrice);
    });
    return Array.from(map.entries());
  }, [countableOrders]);

  const cards = [
    { label: "Doanh thu hôm nay", value: `${todayRevenue.toLocaleString("vi-VN")}đ`, icon: TrendingUp },
    { label: "Doanh thu tháng", value: `${monthRevenue.toLocaleString("vi-VN")}đ`, icon: TrendingUp },
    { label: "Thanh toán thành công", value: paymentSuccess, icon: CheckCircle2 },
    { label: "Thanh toán thất bại", value: paymentFailed, icon: XCircle },
    { label: "Refund pending", value: pendingRefunds.length, icon: FileWarning },
    { label: "Refund completed", value: completedRefunds.length, icon: Wallet },
    { label: "Chiết khấu áp dụng", value: `${totalDiscount.toLocaleString("vi-VN")}đ`, icon: PieChart },
    { label: "Xu đã sử dụng", value: totalCoinsUsed, icon: Coins }
  ];

  const handleProcess = (id: string, approve: boolean) => {
    if (!staff || !currentUser) return;
    const reason = reasonDraft[id]?.trim();
    if (!reason) {
      setMessage("Vui lòng nhập lý do trước khi xử lý.");
      return;
    }
    const res = processRefundLocal(id, { uid: staff.uid, name: currentUser.name, roleId: staff.roleId }, approve, reason);
    if (!res.ok) {
      setMessage(res.error || "Không thể xử lý yêu cầu.");
      return;
    }
    setRefunds(getRefundRequests());
    setMessage(approve ? "Đã duyệt hoàn tiền." : "Đã từ chối yêu cầu.");
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Dashboard tài chính</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Tài chính và Báo cáo</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#E8DDD1] pb-3">
            <CreditCard size={15} className="text-[#CEAF75]" />
            <h4 className="font-serif font-bold text-xs uppercase">Doanh thu theo phương thức thanh toán</h4>
          </div>
          <div className="space-y-2">
            {byPaymentMethod.map(([method, total]) => (
              <div key={method} className="flex justify-between text-xs bg-[#FAF6F0] p-2.5 rounded-lg">
                <span className="font-semibold uppercase">{method}</span>
                <span className="font-mono font-bold text-[#CEAF75]">{total.toLocaleString("vi-VN")}đ</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-[#E8DDD1] pb-3">
            <h4 className="font-serif font-bold text-xs uppercase">Yêu cầu hoàn tiền cần đối soát</h4>
            <span className="text-[9px] text-[#75645A]">≥500.000đ chỉ Admin/Tài chính được duyệt</span>
          </div>
          {message && <p className="text-[11px] font-semibold text-[#CEAF75]">{message}</p>}
          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {refunds.map((r) => (
              <div key={r.id} className="p-3.5 bg-[#FAF6F0] rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <strong>{r.orderCode}</strong> — {r.customerName}
                    <p className="text-[#75645A] mt-0.5">{r.reason}</p>
                  </div>
                  <span className="font-mono font-bold text-[#CEAF75] shrink-0">{r.amount.toLocaleString("vi-VN")}đ</span>
                </div>
                <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-white border border-[#E8DDD1]">{r.status}</span>
                {(r.status === "requested" || r.status === "reviewing") && can("payments.refund") && (
                  <div className="flex gap-2 items-center pt-1">
                    <input
                      value={reasonDraft[r.id] || ""}
                      onChange={(e) => setReasonDraft((prev) => ({ ...prev, [r.id]: e.target.value }))}
                      placeholder="Lý do quyết định..."
                      className="flex-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-[#E8DDD1] outline-none"
                    />
                    <button onClick={() => handleProcess(r.id, true)} className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-[10px] font-bold cursor-pointer">Duyệt</button>
                    <button onClick={() => handleProcess(r.id, false)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold cursor-pointer">Từ chối</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
