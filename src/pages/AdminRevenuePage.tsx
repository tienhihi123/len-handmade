import { useMemo } from "react";
import { motion } from "motion/react";
import { BarChart3, TrendingUp, CreditCard, PieChart, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AdminRevenuePage() {
  const { revenueData, topProducts, allOrders } = useApp();
  const totalRevenue = useMemo(() => revenueData.reduce((sum, item) => sum + item.revenue, 0), [revenueData]);
  const todayRevenue = Math.max(0, revenueData.slice(-1)[0]?.revenue || 0);
  const totalOrders = allOrders.length;
  const averageOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

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
          <div className="flex items-center gap-2 text-brand-primary font-semibold text-xs uppercase tracking-[0.25em] mb-3"><BarChart3 size={16} /> Tổng đơn hàng</div>
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
              <p className="text-sm text-brand-fb/60">Mô phỏng biểu đồ đường doanh thu.</p>
            </div>
            <FileText size={16} className="text-brand-primary" />
          </div>

          <div className="relative h-72 rounded-3xl bg-[#F4EFE6] p-4">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-primary/10 rounded-full" />
            {revenueData.map((item, idx) => (
              <div
                key={item.date}
                className="absolute bottom-0 w-8 rounded-t-3xl bg-brand-primary shadow-sm"
                style={{ left: `${idx * 12}%`, height: `${Math.min(260, item.revenue / (totalRevenue / 8 || 1))}px` }}
              />
            ))}
            <div className="absolute inset-x-0 top-4 flex justify-between text-[10px] text-brand-fb/50 font-mono">
              <span>Thấp</span>
              <span>Cao</span>
            </div>
          </div>
        </div>

        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-brand-primary font-semibold text-xs uppercase tracking-[0.24em] mb-4">Sản phẩm bán chạy</div>
          <div className="space-y-4">
            {topProducts.slice(0, 5).map((product) => (
              <div key={product.productId} className="flex items-center gap-3 rounded-3xl bg-white border border-brand-primary/10 p-4">
                <div className="w-12 h-12 rounded-3xl bg-brand-bg flex items-center justify-center text-brand-primary font-bold">{product.productName.slice(0, 1)}</div>
                <div className="flex-1">
                  <p className="font-semibold text-brand-fb">{product.productName}</p>
                  <p className="text-[11px] text-brand-fb/60">{product.totalSold} sản phẩm · {product.totalRevenue.toLocaleString("vi-VN")}đ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Hiệu suất sản phẩm</span>
            <p className="text-sm text-brand-fb/60">Bảng đánh giá doanh thu theo sản phẩm.</p>
          </div>
        </div>
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
              {topProducts.map((product) => (
                <tr key={product.productId} className="hover:bg-white transition-colors">
                  <td className="px-4 py-4 font-semibold text-brand-fb">{product.productName}</td>
                  <td className="px-4 py-4 text-brand-fb/70">{Math.max(1, Math.round(product.totalSold / 2))}</td>
                  <td className="px-4 py-4 text-brand-fb/70">{product.totalSold}</td>
                  <td className="px-4 py-4 font-mono text-brand-fb">{product.totalRevenue.toLocaleString("vi-VN")}đ</td>
                  <td className="px-4 py-4 text-brand-fb/70">{Math.min(100, Math.round((product.totalSold / 80) * 100))}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
