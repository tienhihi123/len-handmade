import { useEffect, useMemo, useState } from "react";
import { BarChart3, TrendingUp, CreditCard, PieChart, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";
import CryptoLineChart from "../components/admin/CryptoLineChart";
import { subscribeToAllOrdersForAdmin } from "../lib/firestoreOrdersAdmin";
import type { LoggedOrder } from "../types";

interface RealProductPerformance {
  productId: string;
  productName: string;
  orderCount: number;
  totalSold: number;
  totalRevenue: number;
}

// Đơn được tính doanh thu: online đã xác nhận tiền (paid) hoặc COD đã hoàn tất.
// KHÔNG tính: unpaid, pending_confirmation, refunded, đơn hủy.
function isCountableOrder(order: LoggedOrder): boolean {
  if (order.status === "Đã hủy") return false;
  const paymentStatus = order.paymentStatus ?? "unpaid";
  if (paymentStatus === "refunded") return false;
  if (paymentStatus === "paid") return true;
  return (order.paymentMethod ?? "cod") === "cod" && order.status === "Hoàn tất";
}

export default function AdminRevenuePage() {
  const { allOrders, viewStats } = useApp();

  // Doanh thu tính từ đơn Firestore THẬT — không dùng sample revenueData nữa
  const [firestoreOrders, setFirestoreOrders] = useState<LoggedOrder[]>([]);
  useEffect(() => subscribeToAllOrdersForAdmin(setFirestoreOrders), []);
  const sourceOrders = firestoreOrders.length > 0 ? firestoreOrders : allOrders;

  const countableOrders = useMemo(() => sourceOrders.filter(isCountableOrder), [sourceOrders]);

  const totalRevenue = useMemo(
    () => countableOrders.reduce((sum, order) => sum + order.totalPrice, 0),
    [countableOrders]
  );

  // Chuỗi doanh thu theo ngày từ đơn hợp lệ (ngày ghi nhận: paidAt ?? time)
  const revenueByDay = useMemo(() => {
    const map = new Map<string, { revenue: number; orders: number }>();
    countableOrders.forEach((order) => {
      const dateKey = (order.paidAt ?? order.time).slice(0, 10);
      const entry = map.get(dateKey) ?? { revenue: 0, orders: 0 };
      entry.revenue += order.totalPrice;
      entry.orders += 1;
      map.set(dateKey, entry);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, entry]) => ({ date, ...entry }));
  }, [countableOrders]);

  const chartData = useMemo(
    () =>
      revenueByDay.map((d) => ({
        key: d.date,
        label: new Date(d.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
        value: d.revenue,
        secondaryLabel: `${d.orders} đơn hàng`
      })),
    [revenueByDay]
  );
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayRevenue = revenueByDay.find((d) => d.date === todayKey)?.revenue ?? 0;
  const totalOrders = countableOrders.length;
  const averageOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

  // Real per-product performance, aggregated straight from actual order line items
  // (not sample/mock data) — sold quantity, revenue, and order count all come from allOrders.
  const realProductPerformance = useMemo<RealProductPerformance[]>(() => {
    const map = new Map<string, RealProductPerformance>();
    countableOrders.forEach((order) => {
      const seenInThisOrder = new Set<string>();
      (order.items ?? []).forEach((item) => {
        const entry = map.get(item.productId) ?? {
          productId: item.productId,
          productName: item.productName,
          orderCount: 0,
          totalSold: 0,
          totalRevenue: 0
        };
        entry.totalSold += item.quantity;
        entry.totalRevenue += item.subtotal;
        if (!seenInThisOrder.has(item.productId)) {
          entry.orderCount += 1;
          seenInThisOrder.add(item.productId);
        }
        map.set(item.productId, entry);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [countableOrders]);

  const viewsByProduct = useMemo(() => {
    const map = new Map<string, number>();
    viewStats.forEach((v) => map.set(v.productId, v.totalViews));
    return map;
  }, [viewStats]);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Báo cáo doanh thu</span>
        <h1 className="font-serif text-3xl font-black text-brand-fb">Kênh số liệu tài chính Tiệm Len Nhỏ</h1>
        <p className="text-sm text-brand-fb/70 max-w-2xl">Phân tích doanh thu theo ngày, tháng và hiệu suất sản phẩm theo một cuộc hành trình thương mại ấm áp.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-brand-primary font-semibold text-xs uppercase tracking-[0.25em] mb-3"><TrendingUp size={16} /> Tổng doanh thu</div>
          <p className="text-3xl font-mono font-black text-brand-fb">{totalRevenue.toLocaleString("vi-VN")}đ</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-brand-primary font-semibold text-xs uppercase tracking-[0.25em] mb-3"><CreditCard size={16} /> Doanh thu hôm nay</div>
          <p className="text-3xl font-mono font-black text-brand-fb">{todayRevenue.toLocaleString("vi-VN")}đ</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-brand-primary font-semibold text-xs uppercase tracking-[0.25em] mb-3"><BarChart3 size={16} /> Đơn hợp lệ (đã thu tiền)</div>
          <p className="text-3xl font-mono font-black text-brand-fb">{totalOrders}</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-brand-primary font-semibold text-xs uppercase tracking-[0.25em] mb-3"><PieChart size={16} /> Giá trị trung bình</div>
          <p className="text-3xl font-mono font-black text-brand-fb">{averageOrder.toLocaleString("vi-VN")}đ</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Doanh thu theo ngày</span>
              <p className="text-sm text-brand-fb/60">Biểu đồ đường doanh thu thời gian thực.</p>
            </div>
            <FileText size={16} className="text-brand-primary" />
          </div>

          <CryptoLineChart data={chartData} height={280} emptyLabel="Chưa có dữ liệu doanh thu." />
        </div>

        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-brand-primary font-semibold text-xs uppercase tracking-[0.24em] mb-4">Sản phẩm bán chạy</div>
          {realProductPerformance.length === 0 ? (
            <p className="text-xs text-brand-fb/50 italic py-6 text-center">Chưa có dữ liệu bán hàng thực tế.</p>
          ) : (
            <div className="space-y-4">
              {realProductPerformance.slice(0, 5).map((product) => (
                <div key={product.productId} className="flex items-center gap-3 rounded-3xl bg-white border border-brand-primary/10 p-4">
                  <div className="w-12 h-12 rounded-3xl bg-brand-bg flex items-center justify-center text-brand-primary font-bold">{product.productName.slice(0, 1)}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-brand-fb">{product.productName}</p>
                    <p className="text-[11px] text-brand-fb/60">{product.totalSold} sản phẩm · {product.totalRevenue.toLocaleString("vi-VN")}đ</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Hiệu suất sản phẩm</span>
            <p className="text-sm text-brand-fb/60">Bảng đánh giá doanh thu theo sản phẩm.</p>
          </div>
        </div>
        {realProductPerformance.length === 0 ? (
          <p className="text-xs text-brand-fb/50 italic py-8 text-center">Chưa có đơn hàng nào để thống kê hiệu suất.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#F4EFE6] text-[10px] uppercase tracking-[0.24em] text-brand-fb/60">
                <tr>
                  <th className="px-4 py-4">Sản phẩm</th>
                  <th className="px-4 py-4">Đơn</th>
                  <th className="px-4 py-4">Số lượng</th>
                  <th className="px-4 py-4">Doanh thu</th>
                  <th className="px-4 py-4">Tỷ lệ chuyển đổi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/10">
                {realProductPerformance.map((product) => {
                  const views = viewsByProduct.get(product.productId) ?? 0;
                  const conversion = views > 0 ? Math.min(100, Math.round((product.totalSold / views) * 100)) : null;
                  return (
                    <tr key={product.productId} className="hover:bg-white transition-colors">
                      <td className="px-4 py-4 font-semibold text-brand-fb">{product.productName}</td>
                      <td className="px-4 py-4 text-brand-fb/70">{product.orderCount}</td>
                      <td className="px-4 py-4 text-brand-fb/70">{product.totalSold}</td>
                      <td className="px-4 py-4 font-mono text-brand-fb">{product.totalRevenue.toLocaleString("vi-VN")}đ</td>
                      <td className="px-4 py-4 text-brand-fb/70">
                        {conversion === null ? (
                          <span className="text-brand-fb/40 italic text-xs">Chưa có lượt xem</span>
                        ) : (
                          `${conversion}%`
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
