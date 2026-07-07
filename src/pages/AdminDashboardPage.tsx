import { useEffect, useMemo, useState } from "react";
import {
  TrendingUp, ShoppingCart, ClipboardList, Users, PackageX, BarChart2,
  AlertTriangle, Clock, CheckCircle2, XCircle, Truck, Package
} from "lucide-react";
import { useApp } from "../context/AppContext";
import CryptoLineChart from "../components/admin/CryptoLineChart";
import LiquidStatusBar from "../components/admin/LiquidStatusBar";

const STATUS_ORDER = [
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang chuẩn bị hàng",
  "Đang giao",
  "Hoàn tất",
  "Đã hủy"
] as const;

const STATUS_STYLES: Record<string, { gradient: [string, string] }> = {
  "Chờ xác nhận": { gradient: ["#93C5FD", "#3B82F6"] },
  "Đã xác nhận": { gradient: ["#A5B4FC", "#6366F1"] },
  "Đang chuẩn bị hàng": { gradient: ["#FCD34D", "#F59E0B"] },
  "Đang giao": { gradient: ["#D8B4FE", "#A855F7"] },
  "Hoàn tất": { gradient: ["#86EFAC", "#22C55E"] },
  "Đã hủy": { gradient: ["#F87171", "#BA1A1A"] }
};

const STATUS_ICON: Record<string, typeof Clock> = {
  "Chờ xác nhận": Clock,
  "Đã xác nhận": CheckCircle2,
  "Đang chuẩn bị hàng": Package,
  "Đang giao": Truck,
  "Hoàn tất": CheckCircle2,
  "Đã hủy": XCircle
};

function OrderStatusBadge({ status }: { status: string }) {
  const solidColor = STATUS_STYLES[status]?.gradient[1] ?? "#CEAF75";
  const Icon = STATUS_ICON[status] ?? Clock;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black text-white shadow-sm"
      style={{ backgroundColor: solidColor }}
    >
      <Icon size={10} strokeWidth={3} />
      {status}
    </span>
  );
}

function KpiCardSkeleton() {
  return (
    <div className="bg-brand-card p-5 rounded-2xl border border-brand-primary/8 shadow-sm space-y-3 animate-pulse">
      <div className="h-2.5 w-24 bg-brand-primary/10 rounded-full" />
      <div className="h-6 w-32 bg-brand-primary/10 rounded-full" />
    </div>
  );
}

export default function AdminDashboardPage() {
  const {
    currentUser, ordersList, allOrders, customersList, notificationsList,
    productVariants, logs, revenueData
  } = useApp();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  // ---- Revenue metrics ----
  const todayPoint = revenueData[revenueData.length - 1];
  const todayRevenue = todayPoint?.revenue ?? 0;

  const monthRevenue = useMemo(() => {
    if (!todayPoint) return 0;
    const currentMonth = todayPoint.date.slice(0, 7); // YYYY-MM
    return revenueData
      .filter((d) => d.date.startsWith(currentMonth))
      .reduce((sum, d) => sum + d.revenue, 0);
  }, [revenueData, todayPoint]);

  // ---- Order metrics ----
  const totalOrders = allOrders.length;
  const pendingOrders = useMemo(
    () => allOrders.filter((o) => o.status === "Chờ xác nhận").length,
    [allOrders]
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    STATUS_ORDER.forEach((s) => (counts[s] = 0));
    allOrders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [allOrders]);

  const recentOrders = useMemo(
    () => [...allOrders].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6),
    [allOrders]
  );

  // ---- Stock metrics ----
  const lowStockVariants = useMemo(
    () =>
      productVariants
        .filter((v) => v.status === "low-stock" || v.status === "out-of-stock")
        .sort((a, b) => a.stockQuantity - b.stockQuantity)
        .slice(0, 8),
    [productVariants]
  );

  // ---- Recent activity ----
  const recentActivity = useMemo(() => logs.slice(0, 8), [logs]);

  const chartData = useMemo(
    () =>
      revenueData.map((d) => ({
        key: d.date,
        label: d.label ?? d.date,
        value: d.revenue,
        secondaryLabel: `${d.orders} đơn hàng`
      })),
    [revenueData]
  );

  const notificationIcon = (type: string) => {
    if (type === "completed") return <CheckCircle2 size={14} />;
    if (type === "cancelled") return <XCircle size={14} />;
    if (type === "shipping") return <Truck size={14} />;
    if (type === "preparing") return <Package size={14} />;
    return <Clock size={14} />;
  };

  return (
    <div className="bg-brand-bg min-h-screen text-left">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Greeting header */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Bảng điều khiển</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-brand-fb">
            Chào mừng trở lại, {currentUser?.name ?? "Quản trị viên"}
          </h1>
          <p className="text-sm text-brand-fb/60">Tổng quan hoạt động kinh doanh của Tiệm Len Nhỏ.</p>
        </div>

        {/* KPI grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <KpiCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="bg-brand-card p-5 rounded-2xl border border-brand-primary/8 shadow-sm space-y-1.5">
              <span className="text-[10px] text-brand-fb/50 uppercase font-sans font-bold">Doanh thu hôm nay</span>
              <div className="flex items-center justify-between text-brand-fb">
                <strong className="text-lg font-mono font-black">{todayRevenue.toLocaleString("vi-VN")}đ</strong>
                <TrendingUp className="text-green-500" size={17} />
              </div>
            </div>
            <div className="bg-brand-card p-5 rounded-2xl border border-brand-primary/8 shadow-sm space-y-1.5">
              <span className="text-[10px] text-brand-fb/50 uppercase font-sans font-bold">Doanh thu tháng</span>
              <div className="flex items-center justify-between text-brand-fb">
                <strong className="text-lg font-mono font-black">{monthRevenue.toLocaleString("vi-VN")}đ</strong>
                <BarChart2 className="text-brand-primary" size={17} />
              </div>
            </div>
            <div className="bg-brand-card p-5 rounded-2xl border border-brand-primary/8 shadow-sm space-y-1.5">
              <span className="text-[10px] text-brand-fb/50 uppercase font-sans font-bold">Tổng đơn hàng</span>
              <div className="flex items-center justify-between text-brand-fb">
                <strong className="text-lg font-mono font-black">{totalOrders}</strong>
                <ShoppingCart className="text-blue-500" size={17} />
              </div>
            </div>
            <div className="bg-brand-card p-5 rounded-2xl border border-brand-primary/8 shadow-sm space-y-1.5">
              <span className="text-[10px] text-brand-fb/50 uppercase font-sans font-bold">Đơn đang xử lý</span>
              <div className="flex items-center justify-between text-brand-fb">
                <strong className="text-lg font-mono font-black text-brand-primary">{pendingOrders}</strong>
                <ClipboardList className="text-brand-primary" size={17} />
              </div>
            </div>
            <div className="bg-brand-card p-5 rounded-2xl border border-brand-primary/8 shadow-sm space-y-1.5">
              <span className="text-[10px] text-brand-fb/50 uppercase font-sans font-bold">Khách hàng</span>
              <div className="flex items-center justify-between text-brand-fb">
                <strong className="text-lg font-mono font-black">{customersList.length}</strong>
                <Users className="text-brand-primary" size={17} />
              </div>
            </div>
            <div className="bg-brand-card p-5 rounded-2xl border border-brand-primary/8 shadow-sm space-y-1.5">
              <span className="text-[10px] text-brand-fb/50 uppercase font-sans font-bold">Sản phẩm sắp hết</span>
              <div className="flex items-center justify-between text-brand-fb">
                <strong className="text-lg font-mono font-black text-[#BA1A1A]">{lowStockVariants.length}</strong>
                <PackageX className="text-[#BA1A1A]" size={17} />
              </div>
            </div>
          </div>
        )}

        {/* Revenue chart + Order status distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <div className="lg:col-span-8 bg-brand-card rounded-3xl border border-brand-primary/10 p-6 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-brand-primary/5 pb-3">
              <BarChart2 size={15} className="text-brand-primary" />
              <h4 className="font-serif font-bold text-xs text-brand-fb uppercase">Biểu Đồ Doanh Thu 30 Ngày Gần Nhất</h4>
            </div>
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[650px]">
                <CryptoLineChart data={chartData} height={224} emptyLabel="Chưa có dữ liệu doanh thu." />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-brand-card rounded-3xl border border-brand-primary/10 p-6 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-brand-primary/5 pb-3">
              <ClipboardList size={15} className="text-brand-primary" />
              <h4 className="font-serif font-bold text-xs text-brand-fb uppercase">Phân Bố Trạng Thái Đơn</h4>
            </div>
            {totalOrders === 0 ? (
              <p className="text-xs text-brand-fb/50 italic py-6 text-center">Chưa có đơn hàng nào.</p>
            ) : (
              <div className="space-y-3.5">
                {STATUS_ORDER.map((status) => {
                  const count = statusCounts[status] || 0;
                  const pct = totalOrders ? Math.round((count / totalOrders) * 100) : 0;
                  const [colorFrom, colorTo] = STATUS_STYLES[status]?.gradient ?? ["#CEAF75", "#A96150"];
                  return (
                    <div key={status}>
                      <LiquidStatusBar label={status} count={count} pct={pct} colorFrom={colorFrom} colorTo={colorTo} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent orders + Low stock alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <div className="lg:col-span-7 bg-brand-card rounded-3xl border border-brand-primary/10 p-6 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-brand-primary/5 pb-3">
              <ShoppingCart size={15} className="text-brand-primary" />
              <h4 className="font-serif font-bold text-xs text-brand-fb uppercase">Đơn Hàng Gần Đây</h4>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-xs text-brand-fb/50 italic py-6 text-center">Chưa có đơn hàng nào.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-sans text-left min-w-[500px]">
                  <thead className="text-[#412C20]/50 uppercase text-[10px]">
                    <tr>
                      <th className="py-2 pr-3">Mã đơn</th>
                      <th className="py-2 pr-3">Khách hàng</th>
                      <th className="py-2 pr-3 text-right">Tổng tiền</th>
                      <th className="py-2 text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-primary/5">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-2.5 pr-3 font-mono font-bold text-brand-primary">{ord.orderCode || ord.id}</td>
                        <td className="py-2.5 pr-3 text-[#412C20]/80 truncate max-w-[140px]">{ord.customerName || "—"}</td>
                        <td className="py-2.5 pr-3 text-right font-mono font-bold text-[#412C20]">{ord.totalPrice.toLocaleString("vi-VN")}đ</td>
                        <td className="py-2.5 text-right">
                          <OrderStatusBadge status={ord.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-brand-card rounded-3xl border border-brand-primary/10 p-6 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-brand-primary/5 pb-3">
              <AlertTriangle size={15} className="text-[#BA1A1A]" />
              <h4 className="font-serif font-bold text-xs text-brand-fb uppercase">Cảnh Báo Tồn Kho</h4>
            </div>
            {lowStockVariants.length === 0 ? (
              <p className="text-xs text-brand-fb/50 italic py-6 text-center">Không có sản phẩm nào sắp hết hàng.</p>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {lowStockVariants.map((v) => {
                  const isOut = v.status === "out-of-stock";
                  return (
                    <div
                      key={v.id}
                      className={`flex items-center justify-between gap-3 p-3 rounded-xl bg-white border ${isOut ? "border-[#BA1A1A]/20" : "border-brand-primary/5"}`}
                    >
                      <div className="min-w-0">
                        <p className="font-sans font-bold text-[11px] text-[#412C20] truncate">{v.productName}</p>
                        <p className="text-[10px] text-[#412C20]/50">{v.color} · {v.size}</p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isOut ? "bg-[#BA1A1A] text-white animate-warn-pulse" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {isOut && <AlertTriangle size={9} strokeWidth={3} />}
                        {isOut ? "Hết hàng" : `Còn ${v.stockQuantity}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-brand-primary/5 pb-3">
            <Clock size={15} className="text-brand-primary" />
            <h4 className="font-serif font-bold text-xs text-brand-fb uppercase">Hoạt Động Gần Đây</h4>
          </div>
          {recentActivity.length === 0 && notificationsList.length === 0 ? (
            <p className="text-xs text-brand-fb/50 italic py-6 text-center">Chưa có hoạt động nào được ghi nhận.</p>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {recentActivity.length > 0
                ? recentActivity.map((logItem) => (
                    <div key={logItem.id} className="p-3 rounded-xl bg-white border border-brand-primary/5 text-xs flex items-start gap-4">
                      <span className="text-[9px] font-mono text-brand-fb/35 shrink-0 mt-0.5">
                        {new Date(logItem.createdAt).toLocaleTimeString("vi-VN")}
                      </span>
                      <div className="flex-grow">
                        <strong className="text-brand-fb font-bold font-sans">{logItem.userName}</strong>
                        <span className="text-[9px] font-mono bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded ml-2 uppercase">
                          {logItem.role}
                        </span>
                        <p className="text-brand-fb/70 text-[11px] mt-0.5">
                          {logItem.action}: <span className="font-bold text-brand-primary">{logItem.targetName}</span>
                        </p>
                      </div>
                    </div>
                  ))
                : notificationsList.slice(0, 8).map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-white border border-brand-primary/5 text-xs flex items-start gap-3">
                      <span className="p-1.5 rounded-full bg-brand-primary/10 text-brand-primary shrink-0">{notificationIcon(n.type)}</span>
                      <div className="flex-grow">
                        <strong className="text-brand-fb font-bold font-sans">{n.receiver}</strong>
                        <p className="text-brand-fb/70 text-[11px] mt-0.5">{n.message}</p>
                      </div>
                      <span className="text-[9px] font-mono text-brand-fb/35 shrink-0">
                        {new Date(n.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
