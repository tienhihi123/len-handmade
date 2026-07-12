import emailjs from "@emailjs/browser";
import { LoggedOrder } from "../types";
import { BRAND_NAME, BRAND_EMAIL } from "../constants/brand";

// EmailJS phía client (không cần Blaze). Thiếu env → mọi hàm no-op + console.warn.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
const TEMPLATE_ORDER = import.meta.env.VITE_EMAILJS_TEMPLATE_ORDER as string | undefined;
const TEMPLATE_SHOP = import.meta.env.VITE_EMAILJS_TEMPLATE_SHOP as string | undefined;

const isEmailConfigured = !!(SERVICE_ID && PUBLIC_KEY && TEMPLATE_ORDER && TEMPLATE_SHOP);

// Hàng đợi tuần tự: EmailJS free giới hạn tốc độ — cách nhau tối thiểu 1100ms,
// một email lỗi không làm gãy hàng đợi, caller luôn fire-and-forget + .catch().
const MIN_GAP_MS = 1100;
let queueTail: Promise<void> = Promise.resolve();

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function enqueue(templateId: string, params: Record<string, string>): Promise<void> {
  if (!isEmailConfigured) {
    console.warn("[emailService] Thiếu VITE_EMAILJS_* env — email bị bỏ qua (no-op).");
    return Promise.resolve();
  }
  const task = queueTail.then(async () => {
    await emailjs.send(SERVICE_ID as string, templateId, params, { publicKey: PUBLIC_KEY as string });
    await new Promise((resolve) => setTimeout(resolve, MIN_GAP_MS));
  });
  // Hàng đợi tiếp tục dù task lỗi; lỗi được ném về caller của task hiện tại.
  queueTail = task.catch(() => undefined);
  return task;
}

function formatVnd(value: number): string {
  return `${value.toLocaleString("vi-VN")}đ`;
}

function orderItemsText(order: LoggedOrder): string {
  return (order.items ?? [])
    .map((item) => `• ${escapeHtml(item.productName)} (${escapeHtml(item.color)} / ${escapeHtml(item.size)}) x${item.quantity} — ${formatVnd(item.subtotal)}`)
    .join("\n");
}

const PAYMENT_LABEL: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  banking: "Chuyển khoản ngân hàng",
  vietqr: "VietQR",
  momo: "Ví MoMo"
};

function baseParams(order: LoggedOrder): Record<string, string> {
  return {
    customer_name: escapeHtml(order.customerName ?? "Quý khách"),
    customer_email: order.customerEmail ?? "",
    customer_phone: escapeHtml(order.customerPhone ?? ""),
    order_id: order.orderCode || order.id,
    order_date: new Date(order.time).toLocaleString("vi-VN"),
    order_items: orderItemsText(order),
    subtotal: formatVnd(order.totalPrice + (order.discountApplied ?? 0) + (order.coinsUsed ?? 0)),
    shipping_fee: "Miễn phí",
    total: formatVnd(order.totalPrice),
    payment_method: PAYMENT_LABEL[order.paymentMethod ?? "cod"] ?? "Khác",
    payment_status: order.paymentStatus ?? "unpaid",
    event_time: new Date().toLocaleString("vi-VN"),
    shop_email: BRAND_EMAIL
  };
}

/** Email xác nhận đơn cho KHÁCH — gọi ngay sau khi transaction tạo đơn commit. */
export function sendOrderConfirmationEmail(order: LoggedOrder): Promise<void> {
  if (!order.customerEmail) return Promise.resolve();
  const needTransfer = order.paymentMethod && order.paymentMethod !== "cod";
  return enqueue(TEMPLATE_ORDER ?? "", {
    ...baseParams(order),
    to_email: order.customerEmail,
    subject: `${BRAND_NAME} — Xác nhận đơn hàng ${order.orderCode}`,
    headline: "Cảm ơn bạn đã đặt hàng! 🧶",
    payment_instruction: needTransfer
      ? "Bạn vui lòng chuyển khoản theo hướng dẫn trên trang đặt hàng, sau đó bấm \"Tôi đã chuyển khoản\" để shop xác nhận nhé."
      : "Bạn thanh toán khi nhận hàng — shipper sẽ liên hệ trước khi giao.",
    message: `Đơn hàng của bạn đã được ghi nhận và đang chờ ${BRAND_NAME} xác nhận. Chúng mình sẽ chăm chút từng mũi len để gửi đến bạn sớm nhất!`
  });
}

/** Email báo SHOP có đơn mới — gọi ngay sau khi transaction tạo đơn commit. */
export function sendShopNewOrderEmail(order: LoggedOrder): Promise<void> {
  return enqueue(TEMPLATE_SHOP ?? "", {
    ...baseParams(order),
    to_email: BRAND_EMAIL,
    subject: `🧶 Đơn hàng mới ${order.orderCode} — ${formatVnd(order.totalPrice)}`,
    headline: "Có đơn hàng mới!",
    payment_instruction: "",
    message: `Khách ${order.customerName ?? ""} vừa đặt đơn ${order.orderCode} trị giá ${formatVnd(order.totalPrice)} (${PAYMENT_LABEL[order.paymentMethod ?? "cod"]}). Vào trang quản trị để xử lý nhé.`
  });
}

/** Email báo SHOP khách đã bấm "Tôi đã chuyển khoản" — kiểm tra tài khoản. */
export function sendPaymentReportedEmail(order: LoggedOrder): Promise<void> {
  return enqueue(TEMPLATE_SHOP ?? "", {
    ...baseParams(order),
    to_email: BRAND_EMAIL,
    subject: `💰 Khách báo đã chuyển khoản — đơn ${order.orderCode}`,
    headline: "Khách báo đã chuyển khoản",
    payment_instruction: "",
    message: `Khách ${order.customerName ?? ""} báo đã chuyển ${formatVnd(order.totalPrice)} cho đơn ${order.orderCode}. Vui lòng kiểm tra tài khoản ngân hàng/MoMo rồi bấm "Đã nhận tiền" trong trang quản trị đơn hàng.`
  });
}

/** Email báo KHÁCH shop đã nhận được tiền — gọi khi admin bấm "Đã nhận tiền". */
export function sendPaymentConfirmedEmail(order: LoggedOrder): Promise<void> {
  if (!order.customerEmail) return Promise.resolve();
  return enqueue(TEMPLATE_ORDER ?? "", {
    ...baseParams(order),
    to_email: order.customerEmail,
    subject: `${BRAND_NAME} — Đã nhận thanh toán đơn ${order.orderCode} ✅`,
    headline: "Đã nhận thanh toán ✅",
    payment_instruction: "",
    message: `${BRAND_NAME} đã nhận được ${formatVnd(order.totalPrice)} cho đơn ${order.orderCode}. Đơn hàng đang được chuẩn bị — cảm ơn bạn thật nhiều! 🧶💕`
  });
}

/** Email báo KHÁCH khi trạng thái vận hành đơn thay đổi. */
export function sendOrderStatusEmail(order: LoggedOrder, newStatus: LoggedOrder["status"]): Promise<void> {
  if (!order.customerEmail) return Promise.resolve();
  const statusMessage: Record<LoggedOrder["status"], string> = {
    "Chờ xác nhận": `Đơn ${order.orderCode} đang chờ xác nhận.`,
    "Đã xác nhận": `Đơn ${order.orderCode} đã được xác nhận! Chúng mình bắt đầu chuẩn bị hàng ngay 🎀`,
    "Đang chuẩn bị hàng": `Đơn ${order.orderCode} đang được chuẩn bị — nghệ nhân len đang hoàn thiện sản phẩm cho bạn 💕`,
    "Đang giao": `Đơn ${order.orderCode} đang trên đường giao đến bạn! Shipper sẽ liên hệ sớm 🚚`,
    "Hoàn tất": `Đơn ${order.orderCode} đã giao thành công! Cảm ơn bạn đã tin tưởng ${BRAND_NAME} 🧶💕`,
    "Đã hủy": `Đơn ${order.orderCode} đã được hủy. ${BRAND_NAME} rất tiếc và mong được phục vụ bạn lần tới 💙`
  };
  return enqueue(TEMPLATE_ORDER ?? "", {
    ...baseParams(order),
    to_email: order.customerEmail,
    subject: `${BRAND_NAME} — Đơn ${order.orderCode}: ${newStatus}`,
    headline: `Cập nhật đơn hàng: ${newStatus}`,
    payment_instruction: "",
    message: statusMessage[newStatus]
  });
}
