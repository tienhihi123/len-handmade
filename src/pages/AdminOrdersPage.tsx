import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Filter, RefreshCw } from "lucide-react";
import { useApp } from "../context/AppContext";
import { subscribeToAllOrdersForAdmin, updateOrderStatusInFirestore } from "../lib/firestoreOrdersAdmin";
import type { LoggedOrder } from "../types";

const statusOptions = ["all", "Chờ xác nhận", "Đã xác nhận", "Đang chuẩn bị hàng", "Đang giao", "Hoàn tất", "Đã hủy"];
const AUTO_REFRESH_INTERVAL_MS = 20000;

export default function AdminOrdersPage() {
  const { allOrders, updateOrderStatus, refreshOrders } = useApp();
  const [firestoreOrders, setFirestoreOrders] = useState<LoggedOrder[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Every admin/device sees the same real orders (with real timestamps) once
  // Firestore has any — falls back to this browser's local orders otherwise.
  useEffect(() => subscribeToAllOrdersForAdmin(setFirestoreOrders), []);
  const sourceOrders = firestoreOrders.length > 0 ? firestoreOrders : allOrders;

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshOrders();
    setSelectedOrderId(null);
    setLastRefreshedAt(new Date());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Auto-refresh so status changes made from another tab/device (e.g. a
  // customer completing checkout) show up here without a manual reload.
  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders();
      setLastRefreshedAt(new Date());
    }, AUTO_REFRESH_INTERVAL_MS);
    const handleStorage = () => {
      refreshOrders();
      setLastRefreshedAt(new Date());
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshOrders]);

  const filtered = useMemo(() => {
    return sourceOrders.filter((order) => {
      const q = search.toLowerCase();
      const matchText = order.orderCode.toLowerCase().includes(q) || (order.customerName || "").toLowerCase().includes(q) || (order.customerPhone || "").toLowerCase().includes(q);
      const matchStatus = filterStatus === "all" || order.status === filterStatus;
      return matchText && matchStatus;
    });
  }, [sourceOrders, filterStatus, search]);

  const selectedOrder = filtered.find((order) => order.id === selectedOrderId) || null;

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Quản lý đơn hàng</span>
          <h1 className="font-serif text-3xl font-black text-brand-fb">Xem & cập nhật tình trạng đơn hàng</h1>
          <p className="text-sm text-brand-fb/70 max-w-2xl">Tìm kiếm theo mã, tên khách hoặc số điện thoại và chuyển trạng thái đơn hàng với một cú nhấp.</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm hover:bg-[#8c4a3f] transition disabled:opacity-70 cursor-pointer"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} /> Làm mới trạng thái
          </button>
          <span className="text-[10px] text-brand-fb/50 font-mono">
            Cập nhật lúc {lastRefreshedAt.toLocaleTimeString("vi-VN")} · tự động mỗi 20s
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Bảng đơn hàng</p>
              <p className="text-sm text-brand-fb/60">Danh sách đơn hàng mới và đã cập nhật.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
                placeholder="Tìm mã đơn, tên, số điện thoại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="rounded-2xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status === "all" ? "Tất cả trạng thái" : status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-3xl border border-brand-primary/10 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#F4EFE6] text-[10px] uppercase tracking-[0.24em] text-brand-fb/60">
                <tr>
                  <th className="px-4 py-4">Mã đơn</th>
                  <th className="px-4 py-4">Khách hàng</th>
                  <th className="px-4 py-4">Tổng tiền</th>
                  <th className="px-4 py-4">Phương thức</th>
                  <th className="px-4 py-4">Trạng thái</th>
                  <th className="px-4 py-4">Ngày</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/10">
                {filtered.map((order) => (
                  <tr key={order.id} className="cursor-pointer hover:bg-brand-bg/60 transition" onClick={() => setSelectedOrderId(order.id)}>
                    <td className="px-4 py-4 font-mono text-brand-fb">{order.orderCode}</td>
                    <td className="px-4 py-4 text-brand-fb/70">{order.customerName}</td>
                    <td className="px-4 py-4 font-mono text-brand-fb">{order.totalPrice.toLocaleString("vi-VN")}đ</td>
                    <td className="px-4 py-4 text-brand-fb/70">{order.paymentMethod || "—"}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${
                        order.status === "Hoàn tất" ? "bg-green-50 text-green-700" : order.status === "Đã hủy" ? "bg-red-50 text-red-700" : order.status === "Chờ xác nhận" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-brand-fb/70">{new Date(order.time).toLocaleDateString("vi-VN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-brand-primary font-semibold text-xs uppercase tracking-[0.24em] mb-4">
            <Filter size={16} /> Chi tiết đơn hàng
          </div>
          {selectedOrder ? (
            <div className="space-y-5">
              <div className="rounded-3xl bg-white border border-brand-primary/10 p-4 text-sm">
                <p className="text-[11px] uppercase tracking-[0.25em] text-brand-fb/50">{selectedOrder.orderCode}</p>
                <h2 className="font-serif text-xl font-black text-brand-fb mt-2">{selectedOrder.customerName}</h2>
                <p className="text-brand-fb/70 text-xs mt-1">{selectedOrder.customerPhone}</p>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm text-brand-fb/70">
                  <div className="rounded-3xl bg-white border border-brand-primary/10 p-4">
                    <p className="text-[10px] uppercase tracking-[0.25em]">Thanh toán</p>
                    <p className="mt-2 font-semibold text-brand-fb">{selectedOrder.paymentMethod || "—"}</p>
                  </div>
                  <div className="rounded-3xl bg-white border border-brand-primary/10 p-4">
                    <p className="text-[10px] uppercase tracking-[0.25em]">Tổng tiền</p>
                    <p className="mt-2 font-semibold text-brand-fb">{selectedOrder.totalPrice.toLocaleString("vi-VN")}đ</p>
                  </div>
                </div>
                <div className="rounded-3xl bg-white border border-brand-primary/10 p-4 text-sm">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-brand-fb/50">Địa chỉ giao</p>
                  <p className="mt-2 text-brand-fb/70">{selectedOrder.shippingAddress || "Chưa có"}</p>
                </div>
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="rounded-3xl bg-white border border-brand-primary/10 p-4 text-sm">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-brand-fb/50 mb-2">Sản phẩm đặt mua</p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-start text-xs border-b border-brand-primary/5 pb-1.5 last:border-0">
                          <div>
                            <p className="font-semibold text-brand-fb">{item.productName}</p>
                            <p className="text-brand-fb/60 text-[10px]">{item.color} · {item.size} · x{item.quantity} · {item.price.toLocaleString("vi-VN")}đ</p>
                            {item.customMeasurements?.note && (
                              <p className="text-[9px] text-brand-primary/70 italic mt-0.5">📏 {item.customMeasurements.note}</p>
                            )}
                          </div>
                          <span className="font-mono font-semibold text-brand-fb shrink-0">{item.subtotal.toLocaleString("vi-VN")}đ</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {(() => {
                const validNext: Record<string, string[]> = {
                  "Chờ xác nhận": ["Đã xác nhận", "Đã hủy"],
                  "Đã xác nhận": ["Đang chuẩn bị hàng", "Đã hủy"],
                  "Đang chuẩn bị hàng": ["Đang giao", "Đã hủy"],
                  "Đang giao": ["Hoàn tất", "Đã hủy"],
                  "Hoàn tất": [],
                  "Đã hủy": []
                };
                const nextStatuses = (validNext[selectedOrder.status] || []).filter(s => s !== selectedOrder.status);
                return nextStatuses.length > 0 ? (
                  <div className="space-y-3">
                    {nextStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, status as typeof selectedOrder.status);
                          if (selectedOrder.userId) {
                            updateOrderStatusInFirestore(selectedOrder.userId, selectedOrder.id, status as typeof selectedOrder.status);
                          }
                        }}
                        className="w-full rounded-full bg-white border border-brand-primary/15 px-4 py-3 text-sm font-semibold text-brand-fb hover:bg-brand-primary/5 transition"
                      >
                        Cập nhật sang {status}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl bg-white border border-brand-primary/10 p-4 text-center text-sm text-brand-fb/70">
                    <p className="font-semibold">Đơn hàng đã kết thúc.</p>
                    <p className="mt-1">Không còn thao tác chuyển trạng thái nào khả dụng.</p>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-brand-primary/10 p-6 text-center text-sm text-brand-fb/70">
              <p className="font-semibold text-brand-fb">Chọn một đơn hàng để xem chi tiết.</p>
              <p className="mt-2">Danh sách đơn hàng hiển thị bên trái.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
