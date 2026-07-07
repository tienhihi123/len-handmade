import { useMemo } from "react";
import { ShoppingCart, Clock, Package, Truck, XCircle, AlertTriangle, ListOrdered } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function OrdersDashboardPage() {
  const { allOrders } = useApp();

  const buckets = useMemo(() => {
    const now = Date.now();
    const isToday = (t: string) => new Date(t).toDateString() === new Date().toDateString();
    return {
      newOrders: allOrders.filter((o) => o.status === "Chờ xác nhận"),
      needConfirm: allOrders.filter((o) => o.status === "Chờ xác nhận"),
      preparing: allOrders.filter((o) => o.status === "Đang chuẩn bị hàng"),
      awaitingShip: allOrders.filter((o) => o.status === "Đang giao"),
      late: allOrders.filter((o) => o.status === "Đang giao" && now - new Date(o.time).getTime() > 3 * 24 * 3600 * 1000),
      cancelled: allOrders.filter((o) => o.status === "Đã hủy"),
      today: allOrders.filter((o) => isToday(o.time))
    };
  }, [allOrders]);

  const priorityOrders = useMemo(
    () => [...allOrders].filter((o) => o.status === "Chờ xác nhận" || o.status === "Đang chuẩn bị hàng")
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .slice(0, 8),
    [allOrders]
  );

  const cards = [
    { label: "Đơn mới", value: buckets.newOrders.length, icon: ShoppingCart },
    { label: "Cần xác nhận", value: buckets.needConfirm.length, icon: Clock },
    { label: "Đang chuẩn bị", value: buckets.preparing.length, icon: Package },
    { label: "Chờ giao", value: buckets.awaitingShip.length, icon: Truck },
    { label: "Giao trễ", value: buckets.late.length, icon: AlertTriangle },
    { label: "Đơn hủy", value: buckets.cancelled.length, icon: XCircle },
    { label: "Cần xử lý hôm nay", value: buckets.today.length, icon: ListOrdered }
  ];

  return (
    <div className="space-y-8 text-left">
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Dashboard đơn hàng</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Nhân viên xử lý đơn hàng</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white p-4 rounded-2xl border border-[#E8DDD1] shadow-sm space-y-1.5">
              <span className="text-[9px] text-[#75645A] uppercase font-bold leading-tight block">{c.label}</span>
              <div className="flex items-center justify-between">
                <strong className="text-lg font-mono font-black text-[#412C20]">{c.value}</strong>
                <Icon className="text-[#CEAF75]" size={16} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-4">
        <h4 className="font-serif font-bold text-xs uppercase border-b border-[#E8DDD1] pb-3">Danh sách đơn ưu tiên xử lý</h4>
        {priorityOrders.length === 0 ? (
          <p className="text-xs text-[#75645A] italic py-6 text-center">Không có đơn nào cần ưu tiên.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[500px]">
              <thead className="text-[#75645A] uppercase text-[10px]">
                <tr><th className="py-2 pr-3">Mã đơn</th><th className="py-2 pr-3">Khách hàng</th><th className="py-2 pr-3">Trạng thái</th><th className="py-2 text-right">Thời gian</th></tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD1]">
                {priorityOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2.5 pr-3 font-mono font-bold text-[#CEAF75]">{o.orderCode || o.id}</td>
                    <td className="py-2.5 pr-3">{o.customerName || "—"}</td>
                    <td className="py-2.5 pr-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-700">{o.status}</span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-[10px] text-[#75645A]">{new Date(o.time).toLocaleString("vi-VN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
