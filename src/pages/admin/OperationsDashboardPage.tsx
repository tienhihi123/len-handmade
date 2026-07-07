import { useMemo } from "react";
import { TrendingUp, ShoppingCart, Truck, PackageX, Star, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function OperationsDashboardPage() {
  const { revenueData, allOrders, productVariants, reviewsList, logs } = useApp();

  const todayRevenue = revenueData[revenueData.length - 1]?.revenue ?? 0;
  const monthRevenue = useMemo(() => {
    const last = revenueData[revenueData.length - 1];
    if (!last) return 0;
    const month = last.date.slice(0, 7);
    return revenueData.filter((d) => d.date.startsWith(month)).reduce((s, d) => s + d.revenue, 0);
  }, [revenueData]);

  const newOrders = allOrders.filter((o) => o.status === "Chờ xác nhận");
  const processingOrders = allOrders.filter((o) => o.status === "Đang chuẩn bị hàng" || o.status === "Đã xác nhận");
  const lateShipping = allOrders.filter(
    (o) => o.status === "Đang giao" && Date.now() - new Date(o.time).getTime() > 3 * 24 * 3600 * 1000
  );
  const lowStock = productVariants.filter((v) => v.status === "low-stock" || v.status === "out-of-stock");
  const attentionReviews = reviewsList.filter((r) => r.rating <= 2 || r.status === "pending");
  const staffActivity = logs.slice(0, 8);

  const cards = [
    { label: "Doanh thu hôm nay", value: `${todayRevenue.toLocaleString("vi-VN")}đ`, icon: TrendingUp },
    { label: "Doanh thu tháng", value: `${monthRevenue.toLocaleString("vi-VN")}đ`, icon: TrendingUp },
    { label: "Đơn mới", value: newOrders.length, icon: ShoppingCart },
    { label: "Đơn đang xử lý", value: processingOrders.length, icon: Clock },
    { label: "Đơn giao chậm", value: lateShipping.length, icon: Truck },
    { label: "Sản phẩm sắp hết", value: lowStock.length, icon: PackageX }
  ];

  return (
    <div className="space-y-8 text-left">
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Dashboard vận hành</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Quản lý cửa hàng</h1>
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
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#E8DDD1] pb-3">
            <Star size={15} className="text-[#CEAF75]" />
            <h4 className="font-serif font-bold text-xs uppercase">Review cần chú ý ({attentionReviews.length})</h4>
          </div>
          {attentionReviews.length === 0 ? (
            <p className="text-xs text-[#75645A] italic py-4 text-center">Không có review nào cần chú ý.</p>
          ) : (
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {attentionReviews.slice(0, 8).map((r) => (
                <div key={r.id} className="p-3 bg-[#FAF6F0] rounded-xl text-xs">
                  <div className="flex justify-between">
                    <strong>{r.author}</strong>
                    <span className="font-mono text-amber-600">{r.rating}★</span>
                  </div>
                  <p className="text-[#75645A] mt-1 line-clamp-2">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#E8DDD1] pb-3">
            <Clock size={15} className="text-[#CEAF75]" />
            <h4 className="font-serif font-bold text-xs uppercase">Hoạt động nhân viên gần đây</h4>
          </div>
          {staffActivity.length === 0 ? (
            <p className="text-xs text-[#75645A] italic py-4 text-center">Chưa có hoạt động nào.</p>
          ) : (
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {staffActivity.map((l) => (
                <div key={l.id} className="p-3 bg-[#FAF6F0] rounded-xl text-xs flex justify-between">
                  <span><strong>{l.userName}</strong> — {l.action} {l.targetName && <em className="text-[#CEAF75]">{l.targetName}</em>}</span>
                  <span className="text-[9px] text-[#75645A] font-mono">{new Date(l.createdAt).toLocaleTimeString("vi-VN")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
