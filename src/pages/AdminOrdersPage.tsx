import { useEffect, useMemo, useState } from "react";
import { Filter, RefreshCw, Banknote, CircleDollarSign, CheckCircle2, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  subscribeToAllOrdersForAdmin,
  updateOrderStatusEverywhere,
  cancelOrderAndRestock,
  confirmPaymentReceived,
  markPaymentNotReceived
} from "../lib/firestoreOrdersAdmin";
import { sendOrderStatusEmail, sendPaymentConfirmedEmail } from "../lib/emailService";
import type { LoggedOrder } from "../types";

const statusOptions = ["all", "Chờ xác nhận", "Đã xác nhận", "Đang chuẩn bị hàng", "Đang giao", "Hoàn tất", "Đã hủy"];
const paymentFilterOptions = [
  { value: "all", label: "Tất cả thanh toán" },
  { value: "unpaid", label: "Chưa thanh toán" },
  { value: "pending_confirmation", label: "Chờ xác nhận tiền" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "refunded", label: "Đã hoàn tiền" }
];
const AUTO_REFRESH_INTERVAL_MS = 20000;

// Badge thanh toán — chỉ dùng màu trong palette (divider-beige / gold / sage / dusty-pink)
function PaymentBadge({ order }: { order: LoggedOrder }) {
  const paymentStatus = order.paymentStatus ?? "unpaid";
  if (paymentStatus === "paid") {
    return <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold bg-sage-accent/25 text-brand-fb">Đã thanh toán</span>;
  }
  if (paymentStatus === "pending_confirmation") {
    return <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold bg-gold/25 text-brand-fb animate-pulse">💰 Chờ xác nhận tiền</span>;
  }
  if (paymentStatus === "refunded") {
    return <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold bg-dusty-pink/25 text-brand-fb">Đã hoàn tiền</span>;
  }
  return <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold bg-divider-beige text-brand-fb/70">Chưa thanh toán</span>;
}

// Timeline dựa trên timestamp/status THẬT của đơn — không dựng dữ liệu giả
function OrderTimeline({ order }: { order: LoggedOrder }) {
  const statusRank: Record<LoggedOrder["status"], number> = {
    "Chờ xác nhận": 1,
    "Đã xác nhận": 2,
    "Đang chuẩn bị hàng": 3,
    "Đang giao": 4,
    "Hoàn tất": 5,
    "Đã hủy": 0
  };
  const rank = statusRank[order.status];
  const isCancelled = order.status === "Đã hủy";
  const needsTransfer = !!order.paymentMethod && order.paymentMethod !== "cod";

  const steps: { label: string; done: boolean; timestamp?: string }[] = [
    { label: "Đặt đơn", done: true, timestamp: order.time },
    ...(needsTransfer
      ? [
          { label: "Khách báo chuyển khoản", done: !!order.paymentReportedAt, timestamp: order.paymentReportedAt },
          { label: "Shop xác nhận tiền về", done: (order.paymentStatus ?? "unpaid") === "paid", timestamp: order.paidAt }
        ]
      : []),
    { label: "Xác nhận đơn", done: !isCancelled && rank >= 2 },
    { label: "Chuẩn bị hàng", done: !isCancelled && rank >= 3 },
    { label: "Đang giao", done: !isCancelled && rank >= 4 },
    { label: "Hoàn tất", done: !isCancelled && rank >= 5 }
  ];
  if (isCancelled) {
    steps.push({ label: "Đã hủy đơn (đã hoàn kho)", done: true, timestamp: order.updatedAt });
  }

  return (
    <div className="rounded-3xl bg-white border border-brand-primary/10 p-4 text-sm">
      <p className="text-[10px] uppercase tracking-[0.25em] text-brand-fb/50 mb-3">Dòng thời gian đơn hàng</p>
      <div className="space-y-2.5">
        {steps.map((step) => (
          <div key={step.label} className="flex items-start gap-2.5">
            {step.done ? (
              <CheckCircle2 size={15} className="text-brand-primary mt-0.5 shrink-0" />
            ) : (
              <Clock size={15} className="text-brand-fb/25 mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold ${step.done ? "text-brand-fb" : "text-brand-fb/40"}`}>{step.label}</p>
              {step.done && step.timestamp && (
                <p className="text-[10px] text-brand-fb/50 font-mono">{new Date(step.timestamp).toLocaleString("vi-VN")}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const { allOrders, updateOrderStatus, refreshOrders } = useApp();
  const [firestoreOrders, setFirestoreOrders] = useState<LoggedOrder[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Chống click lặp cho các hành động async (key = orderId + action)
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  // Real-time từ Firestore root orders — fallback đơn local khi Firestore trống
  useEffect(() => subscribeToAllOrdersForAdmin(setFirestoreOrders), []);
  const sourceOrders = firestoreOrders.length > 0 ? firestoreOrders : allOrders;

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshOrders();
    setSelectedOrderId(null);
    setLastRefreshedAt(new Date());
    setTimeout(() => setIsRefreshing(false), 500);
  };

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
      const matchPayment = filterPayment === "all" || (order.paymentStatus ?? "unpaid") === filterPayment;
      return matchText && matchStatus && matchPayment;
    });
  }, [sourceOrders, filterStatus, filterPayment, search]);

  const selectedOrder = filtered.find((order) => order.id === selectedOrderId) || null;
  const pendingPaymentCount = useMemo(
    () => sourceOrders.filter((o) => (o.paymentStatus ?? "unpaid") === "pending_confirmation").length,
    [sourceOrders]
  );

  // ===== Hành động thanh toán =====
  const handleConfirmPayment = async (order: LoggedOrder) => {
    if (busyAction || !order.userId) return;
    setBusyAction(`${order.id}:confirm`);
    setActionError("");
    try {
      await confirmPaymentReceived(order.userId, order.id);
      void sendPaymentConfirmedEmail(order).catch((error) => {
        console.warn("[emailService] Email xác nhận thanh toán thất bại", error);
      });
    } catch (error) {
      console.warn("[AdminOrders] Xác nhận tiền thất bại:", error);
      setActionError("Không thể xác nhận thanh toán. Vui lòng thử lại.");
    } finally {
      setBusyAction(null);
    }
  };

  const handlePaymentNotReceived = async (order: LoggedOrder) => {
    if (busyAction || !order.userId) return;
    setBusyAction(`${order.id}:notreceived`);
    setActionError("");
    try {
      await markPaymentNotReceived(order.userId, order.id);
    } catch (error) {
      console.warn("[AdminOrders] Đánh dấu chưa nhận tiền thất bại:", error);
      setActionError("Không thể cập nhật. Vui lòng thử lại.");
    } finally {
      setBusyAction(null);
    }
  };

  // ===== Đổi trạng thái vận hành (hủy → transaction hoàn kho) =====
  const handleStatusChange = async (order: LoggedOrder, status: LoggedOrder["status"]) => {
    if (busyAction) return;
    setBusyAction(`${order.id}:${status}`);
    setActionError("");
    try {
      if (order.userId) {
        if (status === "Đã hủy") {
          await cancelOrderAndRestock(order.userId, order.id);
        } else {
          await updateOrderStatusEverywhere(order.userId, order.id, status, order);
        }
      }
      // Cập nhật state local (fallback + notification in-app cho khách demo)
      updateOrderStatus(order.id, status);
      void sendOrderStatusEmail(order, status).catch((error) => {
        console.warn("[emailService] Email trạng thái đơn thất bại", error);
      });
    } catch (error) {
      console.warn("[AdminOrders] Đổi trạng thái thất bại:", error);
      setActionError("Không thể đổi trạng thái đơn. Vui lòng thử lại.");
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Quản lý đơn hàng</span>
          <h1 className="font-serif text-3xl font-black text-brand-fb">Xem & cập nhật tình trạng đơn hàng</h1>
          <p className="text-sm text-brand-fb/70 max-w-2xl">Tìm kiếm theo mã, tên khách hoặc số điện thoại; xác nhận tiền về và chuyển trạng thái đơn hàng.</p>
          {pendingPaymentCount > 0 && (
            <p className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-fb bg-gold/20 rounded-full px-3 py-1.5 animate-pulse">
              <CircleDollarSign size={14} className="text-brand-primary" />
              {pendingPaymentCount} đơn đang chờ xác nhận tiền về
            </p>
          )}
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
            Cập nhật lúc {lastRefreshedAt.toLocaleTimeString("vi-VN")} · real-time Firestore
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Bảng đơn hàng</p>
              <p className="text-sm text-brand-fb/60">Danh sách đơn hàng mới và đã cập nhật.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
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
              <select
                className="rounded-2xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
              >
                {paymentFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
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
                  <th className="px-4 py-4">Thanh toán</th>
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
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <PaymentBadge order={order} />
                        <p className="text-[10px] text-brand-fb/50">{order.paymentMethod || "—"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${
                        order.status === "Hoàn tất" ? "bg-sage-accent/25 text-brand-fb" : order.status === "Đã hủy" ? "bg-dusty-pink/25 text-brand-fb" : order.status === "Chờ xác nhận" ? "bg-divider-beige text-brand-fb/70" : "bg-gold/20 text-brand-fb"
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
          {actionError && (
            <div className="mb-4 rounded-2xl border border-[#ba1a1a]/20 bg-[#ba1a1a]/5 px-4 py-3 text-xs text-[#ba1a1a]">
              {actionError}
            </div>
          )}
          {selectedOrder ? (
            <div className="space-y-5">
              <div className="rounded-3xl bg-white border border-brand-primary/10 p-4 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-brand-fb/50">{selectedOrder.orderCode}</p>
                  <PaymentBadge order={selectedOrder} />
                </div>
                <h2 className="font-serif text-xl font-black text-brand-fb mt-2">{selectedOrder.customerName}</h2>
                <p className="text-brand-fb/70 text-xs mt-1">{selectedOrder.customerPhone}</p>
              </div>

              {/* Xác nhận tiền về — chỉ hiện khi khách đã báo chuyển khoản */}
              {(selectedOrder.paymentStatus ?? "unpaid") === "pending_confirmation" && (
                <div className="rounded-3xl bg-gold/10 border border-gold/40 p-4 space-y-3">
                  <p className="text-xs font-bold text-brand-fb flex items-center gap-1.5">
                    <Banknote size={14} className="text-brand-primary" /> Khách báo đã chuyển {selectedOrder.totalPrice.toLocaleString("vi-VN")}đ
                  </p>
                  {selectedOrder.paymentReportedAt && (
                    <p className="text-[10px] text-brand-fb/60 font-mono">
                      Báo lúc {new Date(selectedOrder.paymentReportedAt).toLocaleString("vi-VN")}
                    </p>
                  )}
                  <p className="text-[11px] text-brand-fb/70">Kiểm tra tài khoản ngân hàng/MoMo trước khi xác nhận.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleConfirmPayment(selectedOrder)}
                      disabled={busyAction !== null || !selectedOrder.userId}
                      className="rounded-full bg-brand-primary text-white px-3 py-2.5 text-xs font-bold hover:bg-[#8c4a3f] transition disabled:opacity-60 cursor-pointer"
                    >
                      {busyAction === `${selectedOrder.id}:confirm` ? "Đang xác nhận..." : "✅ Đã nhận tiền"}
                    </button>
                    <button
                      onClick={() => handlePaymentNotReceived(selectedOrder)}
                      disabled={busyAction !== null || !selectedOrder.userId}
                      className="rounded-full bg-white border border-brand-primary/20 text-brand-fb px-3 py-2.5 text-xs font-bold hover:bg-brand-primary/5 transition disabled:opacity-60 cursor-pointer"
                    >
                      {busyAction === `${selectedOrder.id}:notreceived` ? "Đang cập nhật..." : "Chưa nhận được"}
                    </button>
                  </div>
                </div>
              )}

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

                <OrderTimeline order={selectedOrder} />

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
                const validNext: Record<string, LoggedOrder["status"][]> = {
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
                        onClick={() => handleStatusChange(selectedOrder, status)}
                        disabled={busyAction !== null}
                        className="w-full rounded-full bg-white border border-brand-primary/15 px-4 py-3 text-sm font-semibold text-brand-fb hover:bg-brand-primary/5 transition disabled:opacity-60 cursor-pointer"
                      >
                        {busyAction === `${selectedOrder.id}:${status}` ? "Đang cập nhật..." : `Cập nhật sang ${status}`}
                      </button>
                    ))}
                    <p className="text-[10px] text-brand-fb/50 text-center">
                      Hủy đơn sẽ tự động hoàn tồn kho · COD hoàn tất tự tính đã thanh toán
                    </p>
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
