import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, ShoppingBag, PackageOpen, Undo2, Plus, Calendar, Bell, ShieldEllipsis, Users, FileBarChart } from "lucide-react";
import { CartItem } from "../types";

export interface LoggedOrder {
  id: string;
  name: string;
  itemsCount: number;
  totalPrice: number;
  time: string;
  status: "Chờ xác nhận" | "Đang khâu dệt" | "Đã giao";
}

interface DashboardProps {
  ordersList: LoggedOrder[];
  onTriggerMockSale: () => void;
}

export default function Dashboard({ ordersList, onTriggerMockSale }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "inventory">("orders");

  // Sum total revenue dynamically based on transactions list
  const totalRevenue = ordersList.reduce((acc, order) => acc + order.totalPrice, 2450000);

  const mockInventory = [
    { id: "inv_1", name: "Túi Len Hồng Premium", category: "Túi len", currentStock: 12, minLimit: 5, status: "Còn hàng" },
    { id: "inv_2", name: "Áo Len Bướm Handmade", category: "Áo len", currentStock: 99, minLimit: 10, status: "Còn hàng" },
    { id: "inv_3", name: "Túi Len Đi Học Đi Biển", category: "Túi len", currentStock: 99, minLimit: 5, status: "Còn hàng" }
  ];

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, scale: 0.98 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-150px" },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  });

  return (
    <section id="dashboard" className="py-20 bg-[#FAF7F2] border-t border-brand-primary/10 px-4 relative overflow-hidden">
      {/* Absolute decorative backdrops */}
      <div className="absolute right-10 bottom-10 w-96 h-96 rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto" id="dashboard-wrapper">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest text-brand-primary block mb-2"
          >
            Module Khóa Luận Tốt Nghiệp ✦ Nghiệp Vụ Quản Lý
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif font-bold text-2xl sm:text-3xl text-brand-fb mb-4"
          >
            Bảng Quản Trị Hệ Thống / Backoffice Preview
          </motion.h2>
          <p className="font-sans text-brand-fb/70 text-xs sm:text-sm">
            Giao diện trực quan dành cho Chủ cửa hàng quản lý biến thể sản phẩm, giám sát doanh thu dập dệt, kiểm kho tự động và theo dõi cập nhật đơn hàng tức thì.
          </p>
        </div>

        {/* Dashboard Frame */}
        <motion.div
          {...fadeUp(0.1)}
          className="soft-glass border border-brand-primary/15 rounded-[32px] overflow-hidden shadow-2xl bg-white/80"
          id="admin-dashboard-container"
        >
          {/* Admin Header Panel */}
          <div className="bg-brand-primary/5 px-6 py-5 border-b border-brand-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-md">
                <ShieldEllipsis className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-brand-primary">Module Backoffice</span>
                <h3 className="font-serif font-bold text-sm text-brand-fb">Bảng điều hành Tiệm Len Nhỏ</h3>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onTriggerMockSale}
                className="bg-brand-primary hover:bg-brand-primary-light text-white text-xs font-sans font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Khám phá và mô phỏng giao dịch mua hàng để cập nhật trạng thái dashboard tức thì"
              >
                <Plus size={14} />
                Giả lập Đơn Hàng Mới
              </button>
              <div className="bg-white px-3.5 py-2 rounded-xl border border-brand-primary/10 flex items-center gap-1.5 font-sans text-[11px] text-brand-fb/70 font-semibold select-none">
                <Calendar size={13} className="text-brand-primary" />
                2026/05/22 (UTC)
              </div>
            </div>
          </div>

          {/* Grid metric blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-brand-primary/10">
            {/* Metric 1 */}
            <div className="p-6 border-r border-b lg:border-b-0 border-brand-primary/10 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-sans font-medium text-brand-fb/60">Doanh thu hôm nay:</span>
                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                  <TrendingUp size={16} />
                </div>
              </div>
              <span className="font-mono text-xl sm:text-2xl font-bold text-brand-fb leading-none">
                {totalRevenue.toLocaleString("vi-VN")}đ
              </span>
              <p className="text-[10px] font-sans text-green-600 font-semibold mt-2.5 flex items-center gap-1">
                <span>↑ +18.4% so với hôm qua</span>
              </p>
            </div>

            {/* Metric 2 */}
            <div className="p-6 border-r border-b lg:border-b-0 border-brand-primary/10 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-sans font-medium text-brand-fb/60">Đơn hàng mới:</span>
                <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                  <ShoppingBag size={16} />
                </div>
              </div>
              <span className="font-mono text-xl sm:text-2xl font-bold text-brand-fb leading-none">
                {ordersList.length} đơn dệt
              </span>
              <p className="text-[10px] font-sans text-brand-fb/50 mt-2.5">
                Chờ xác nhận & phân sợi
              </p>
            </div>

            {/* Metric 3 */}
            <div className="p-6 border-r border-b sm:border-b-0 border-brand-primary/10 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-sans font-medium text-brand-fb/60">Sản phẩm sắp hết kho:</span>
                <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
                  <PackageOpen size={16} />
                </div>
              </div>
              <span className="font-mono text-xl sm:text-2xl font-bold text-green-600 leading-none">
                0 mẫu
              </span>
              <p className="text-[10px] font-sans text-green-600 font-semibold mt-2.5">
                Tồn kho đầy đủ
              </p>
            </div>

            {/* Metric 4 */}
            <div className="p-6 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-sans font-medium text-brand-fb/60">Yêu cầu hoàn trả / Đổi trả:</span>
                <div className="p-2 rounded-lg bg-red-50 text-red-600">
                  <Undo2 size={16} />
                </div>
              </div>
              <span className="font-mono text-xl sm:text-2xl font-bold text-brand-primary leading-none">
                0 yêu cầu
              </span>
              <p className="text-[10px] font-sans text-green-600 font-semibold mt-2.5">
                Độ hài lòng người dùng: 100%
              </p>
            </div>
          </div>

          {/* Admin Lower Panel Tabs Content */}
          <div className="p-6">
            <div className="flex border-b border-brand-border pb-3 mb-6 gap-6">
              <button
                onClick={() => setActiveTab("orders")}
                className={`font-serif font-bold text-sm cursor-pointer relative pb-3 transition-colors ${
                  activeTab === "orders" ? "text-brand-primary" : "text-brand-fb/50 hover:text-brand-fb"
                }`}
              >
                Nhật ký Transactions tơ dệt ({ordersList.length})
                {activeTab === "orders" && (
                  <motion.div layoutId="activeTabUnder" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("inventory")}
                className={`font-serif font-bold text-sm cursor-pointer relative pb-3 transition-colors ${
                  activeTab === "inventory" ? "text-brand-primary" : "text-brand-fb/50 hover:text-brand-fb"
                }`}
              >
                Giám sát Biến Thể & Số Tồn Kho (5 dòng)
                {activeTab === "inventory" && (
                  <motion.div layoutId="activeTabUnder" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                )}
              </button>
            </div>

            {/* Tab content area */}
            <AnimatePresence mode="out-in">
              {activeTab === "orders" ? (
                <motion.div
                  key="orders-grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {ordersList.length === 0 ? (
                    <div className="py-12 bg-brand-bg/20 rounded-2xl border border-dashed border-brand-primary/10 text-center text-brand-fb/60 flex flex-col items-center justify-center">
                      <ShoppingBag size={24} className="text-brand-fb/40 mb-3" />
                      <span className="font-sans text-xs">Chưa thu nhận giao dịch mới trong phiên này.</span>
                      <button
                        onClick={onTriggerMockSale}
                        className="mt-3 text-xs bg-brand-primary text-white hover:bg-brand-primary-light font-sans px-4 py-2 rounded-xl transition-all font-semibold shadow-sm cursor-pointer"
                      >
                        Tạo đơn dệt thử nghiệm
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans min-w-[600px] border-collapse">
                        <thead>
                          <tr className="bg-brand-bg/40 text-brand-fb/65 border-b border-brand-border">
                            <th className="p-3">MÃ ĐƠN HÀNG</th>
                            <th className="p-3">SẢN PHẨM PHÂN FILE</th>
                            <th className="p-3 text-center">SỐ LƯỢNG KÈM</th>
                            <th className="p-3 text-right">TỔNG TIÊN THANH TOÁN</th>
                            <th className="p-3 text-center">THÌ GIỜ THANH TOÁN</th>
                            <th className="p-3 text-center">TRẠNG THÁI DỆT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordersList.map((order, ind) => (
                            <motion.tr
                              key={order.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: ind * 0.05 }}
                              className="border-b border-brand-primary/5 hover:bg-brand-primary/[0.02] transition-colors"
                            >
                              <td className="p-3 font-mono font-bold text-brand-primary uppercase">
                                {order.id}
                              </td>
                              <td className="p-3 font-semibold text-brand-fb">
                                {order.name}
                              </td>
                              <td className="p-3 text-center font-mono">
                                {order.itemsCount} chiếc
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-brand-primary">
                                {order.totalPrice.toLocaleString("vi-VN")}đ
                              </td>
                              <td className="p-3 text-center font-mono text-brand-fb/50 text-[11px]">
                                {order.time}
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold inline-block ${
                                  order.status === "Chờ xác nhận"
                                    ? "bg-orange-50 text-orange-600 border border-orange-200"
                                    : order.status === "Đang khâu dệt"
                                    ? "bg-blue-50 text-blue-600 border border-blue-200 animate-pulse"
                                    : "bg-green-50 text-green-600 border border-green-200"
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="inv-grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="overflow-x-auto"
                >
                  <table className="w-full text-left text-xs font-sans min-w-[500px] border-collapse">
                    <thead>
                      <tr className="bg-brand-bg/40 text-brand-fb/65 border-b border-brand-border">
                        <th className="p-3">MÃ KHO</th>
                        <th className="p-3">TÊN SẢN PHẨM</th>
                        <th className="p-3">DANH MỤC</th>
                        <th className="p-3 text-center">TỒN KHO THỰC</th>
                        <th className="p-3 text-center">ĐỘ TRỮ TỐI THIỂU MẪU CHUẨN</th>
                        <th className="p-3 text-center">TRẠNG THÁI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockInventory.map((item) => (
                        <tr key={item.id} className="border-b border-brand-primary/5 hover:bg-brand-primary/[0.02] transition-colors">
                          <td className="p-3 font-mono text-brand-fb/50 uppercase">{item.id}</td>
                          <td className="p-3 font-bold text-brand-fb">{item.name}</td>
                          <td className="p-3 text-brand-fb/70">{item.category}</td>
                          <td className="p-3 text-center font-mono font-bold text-brand-primary">{item.currentStock} cái</td>
                          <td className="p-3 text-center font-mono text-brand-fb/50">{item.minLimit} cái</td>
                          <td className="p-3 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold inline-block ${
                              item.currentStock > item.minLimit
                                ? "bg-green-50 text-green-600 border border-green-200"
                                : "bg-red-50 text-red-600 border border-red-200 animate-pulse"
                            }`}>
                              {item.currentStock > item.minLimit ? "Đủ hàng" : "Yêu cầu khâu dệt tiếp ⚠️"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
