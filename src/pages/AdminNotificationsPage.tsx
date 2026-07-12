import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Inbox, CheckCircle2, Mail, Banknote } from "lucide-react";
import { useApp } from "../context/AppContext";
import { subscribeToShopNotifications, markShopNotificationRead } from "../lib/firestoreOrdersAdmin";
import type { ShopNotification } from "../types";

export default function AdminNotificationsPage() {
  const { notificationsList } = useApp();
  const navigate = useNavigate();

  // Thông báo khách báo chuyển khoản — real-time từ Firestore (shopNotifications)
  const [shopNotifications, setShopNotifications] = useState<ShopNotification[]>([]);
  useEffect(() => subscribeToShopNotifications(setShopNotifications), []);
  const unreadCount = useMemo(() => shopNotifications.filter((n) => !n.read).length, [shopNotifications]);

  const handleOpenShopNotification = (notification: ShopNotification) => {
    if (!notification.read) {
      void markShopNotificationRead(notification.id).catch((error) => {
        console.warn("[AdminNotifications] Đánh dấu đã đọc thất bại", error);
      });
    }
    navigate("/admin/orders");
  };

  const sortedNotifications = useMemo(
    () => [...notificationsList].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notificationsList]
  );

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Thông báo đơn hàng</span>
        <h1 className="font-serif text-3xl font-black text-brand-fb">Bảng thông báo giao dịch</h1>
        <p className="text-sm text-brand-fb/70 max-w-2xl">Xem các tin nhắn hệ thống đã gửi khách hàng, kênh email và trạng thái thông báo.</p>
      </div>

      {/* Khách báo chuyển khoản — cần shop kiểm tra tài khoản và xác nhận */}
      <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-brand-primary">
            <Banknote size={18} />
            <p className="text-xs uppercase tracking-[0.25em] font-semibold">Khách báo chuyển khoản</p>
          </div>
          {unreadCount > 0 && (
            <span className="rounded-full bg-gold/25 px-3 py-1 text-[11px] font-bold text-brand-fb animate-pulse">
              {unreadCount} chưa xử lý
            </span>
          )}
        </div>
        {shopNotifications.length === 0 ? (
          <p className="text-sm text-brand-fb/50 italic py-4 text-center">
            Chưa có thông báo chuyển khoản nào. Khi khách bấm "Tôi đã chuyển khoản", thông báo sẽ hiện tại đây theo thời gian thực.
          </p>
        ) : (
          <div className="space-y-2 max-h-[320px] overflow-y-auto">
            {shopNotifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleOpenShopNotification(notification)}
                className={`w-full flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition cursor-pointer ${
                  notification.read
                    ? "bg-white border-brand-primary/10 hover:bg-brand-bg/60"
                    : "bg-gold/10 border-gold/40 hover:bg-gold/20"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-brand-fb truncate">
                    {notification.customerName} báo đã chuyển {notification.amount.toLocaleString("vi-VN")}đ
                  </p>
                  <p className="text-[11px] text-brand-fb/60 font-mono">
                    Đơn {notification.orderCode} · {new Date(notification.updatedAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${
                  notification.read ? "bg-divider-beige text-brand-fb/60" : "bg-brand-primary text-white"
                }`}>
                  {notification.read ? "Đã xử lý" : "Xem đơn →"}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-brand-primary mb-4">
            <Bell size={18} />
            <p className="text-xs uppercase tracking-[0.25em] font-semibold">Tổng thông báo</p>
          </div>
          <p className="text-4xl font-mono font-black text-brand-fb">{notificationsList.length}</p>
          <p className="mt-3 text-sm text-brand-fb/60">Tin nhắn đã được gửi cho khách hàng gần đây.</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-brand-primary mb-4">
            <Inbox size={18} />
            <p className="text-xs uppercase tracking-[0.25em] font-semibold">Kênh giao tiếp</p>
          </div>
          <p className="text-3xl font-bold text-brand-fb">Email / SMS</p>
          <p className="mt-3 text-sm text-brand-fb/60">Phần lớn thông báo được gửi bằng email.</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-brand-primary mb-4">
            <Mail size={18} />
            <p className="text-xs uppercase tracking-[0.25em] font-semibold">Trạng thái gửi</p>
          </div>
          <p className="text-4xl font-mono font-black text-brand-fb">{notificationsList.filter((item) => item.status === "sent").length}</p>
          <p className="mt-3 text-sm text-brand-fb/60">Các thông báo đã được hệ thống ghi nhận thành công.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[32px] border border-brand-primary/10 bg-brand-card shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#F4EFE6] text-[10px] uppercase tracking-[0.24em] text-brand-fb/60">
            <tr>
              <th className="px-4 py-4">Thời gian</th>
              <th className="px-4 py-4">Mã đơn</th>
              <th className="px-4 py-4">Kênh</th>
              <th className="px-4 py-4">Người nhận</th>
              <th className="px-4 py-4">Nội dung</th>
              <th className="px-4 py-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/10">
            {sortedNotifications.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-14 text-center text-brand-fb/50 italic">
                  Chưa có thông báo nào. Thông báo sẽ tự động xuất hiện khi trạng thái đơn hàng thật được cập nhật.
                </td>
              </tr>
            )}
            {sortedNotifications.map((item) => (
              <tr key={item.id} className="hover:bg-white transition-colors">
                <td className="px-4 py-4 font-mono text-brand-fb/70">{new Date(item.createdAt).toLocaleString("vi-VN")}</td>
                <td className="px-4 py-4 text-brand-fb font-semibold">{item.orderCode}</td>
                <td className="px-4 py-4 text-brand-fb/70 capitalize">{item.channel}</td>
                <td className="px-4 py-4 text-brand-fb/70">{item.receiver}</td>
                <td className="px-4 py-4 text-brand-fb/70 max-w-[320px] truncate">{item.message}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-700">
                    <CheckCircle2 size={14} /> {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
