import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, Banknote, Clock, QrCode } from "lucide-react";
import { useApp } from "../context/AppContext";
import { BRAND_NAME } from "../constants/brand";
import { reportPaymentTransferred } from "../lib/firestoreOrders";
import { sendPaymentReportedEmail } from "../lib/emailService";
import { buildVietQrImageUrl, getBankQrInfo, getMomoPhone } from "../lib/payments";
import { isFirebaseConfigured } from "../lib/firebase";

export default function OrderSuccessPage() {
  const { allOrders, currentUser, setOrdersList } = useApp();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const orderIdFromState = (location.state as { orderId?: string } | null)?.orderId;
  const orderIdFromParams = searchParams.get("orderId") || orderIdFromState;

  const order = useMemo(() => {
    if (!orderIdFromParams) return null;
    return allOrders.find((orderItem) => orderItem.id === orderIdFromParams || orderItem.orderCode === orderIdFromParams) ?? null;
  }, [allOrders, orderIdFromParams]);

  // Trạng thái nút "Tôi đã chuyển khoản"
  const [isReporting, setIsReporting] = useState(false);
  const [reportError, setReportError] = useState("");

  const paymentStatus = order?.paymentStatus ?? "unpaid";
  const needsTransfer = !!order && order.paymentMethod !== undefined && order.paymentMethod !== "cod";
  const canReport = needsTransfer && paymentStatus === "unpaid" && isFirebaseConfigured && !!currentUser;
  const bankInfo = getBankQrInfo();
  const momoPhone = getMomoPhone();

  const handleReportTransferred = async () => {
    if (!order || !currentUser || isReporting) return;
    setIsReporting(true);
    setReportError("");
    try {
      await reportPaymentTransferred(currentUser.id, order);
      // Cập nhật state local ngay để UI phản hồi tức thì (Firestore sync theo sau)
      setOrdersList((prev) =>
        prev.map((item) =>
          item.id === order.id
            ? { ...item, paymentStatus: "pending_confirmation", paymentReportedAt: new Date().toISOString() }
            : item
        )
      );
      void sendPaymentReportedEmail(order).catch((error) => {
        console.warn("[emailService] Email báo shop chuyển khoản thất bại", error);
      });
    } catch (error) {
      console.warn("[OrderSuccess] Báo chuyển khoản thất bại:", error);
      setReportError("Chưa gửi được thông báo cho shop. Bạn vui lòng thử lại nhé.");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-left">
      <div className="max-w-4xl mx-auto">
        <div className="bg-brand-card border border-brand-primary/10 rounded-[32px] p-8 shadow-sm space-y-6 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-50 text-green-700 flex items-center justify-center shadow-inner">
            <CheckCircle2 size={38} className="animate-pulse" />
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-primary font-bold">Giao dịch thành công</p>
            <h1 className="font-serif font-black text-3xl text-brand-fb">Cảm ơn bạn đã đặt hàng!</h1>
            <p className="text-sm text-brand-fb/70 leading-relaxed">
              Đơn hàng của bạn đã được ghi nhận trong hệ thống {BRAND_NAME}. Chúng mình đang chăm chút từng mũi len để giao đến bạn sớm nhất.
            </p>
          </div>

          <div className="bg-brand-bg p-4 rounded-3xl border border-brand-primary/10 text-left text-sm text-brand-fb/80 space-y-3">
            <div className="flex justify-between gap-3">
              <span className="font-sans uppercase tracking-[0.12em] text-[10px] text-brand-fb/50">Mã đơn hàng</span>
              <strong className="font-mono text-brand-primary">
                {order?.orderCode ?? orderIdFromParams ?? "Đang tạo..."}
              </strong>
            </div>
            {order ? (
              <>
                <div className="flex justify-between gap-3">
                  <span className="font-sans uppercase tracking-[0.12em] text-[10px] text-brand-fb/50">Tổng thanh toán</span>
                  <strong className="font-mono text-brand-fb">{order.totalPrice.toLocaleString("vi-VN")}đ</strong>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="font-sans uppercase tracking-[0.12em] text-[10px] text-brand-fb/50">Tình trạng</span>
                  <span className="font-semibold text-brand-fb">{order.status}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="font-sans uppercase tracking-[0.12em] text-[10px] text-brand-fb/50">Thanh toán</span>
                  <span className="font-semibold text-brand-fb">
                    {paymentStatus === "paid"
                      ? "Đã thanh toán ✅"
                      : paymentStatus === "pending_confirmation"
                      ? "Chờ shop xác nhận tiền về"
                      : order.paymentMethod === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : "Chờ chuyển khoản"}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center text-[11px] text-brand-fb/60">
                Không tìm thấy thông tin đơn hàng. Bạn có thể truy cập trang đơn hàng để xem chi tiết.
              </div>
            )}
          </div>

          {/* Khu vực chuyển khoản — chỉ hiện với đơn thanh toán online chưa trả tiền */}
          {order && needsTransfer && paymentStatus === "unpaid" && (
            <div className="bg-white p-5 rounded-3xl border border-brand-primary/15 text-left space-y-4">
              <div className="flex items-center gap-2 text-brand-fb font-bold text-sm">
                <QrCode size={16} className="text-brand-primary" /> Hướng dẫn chuyển khoản
              </div>
              {order.paymentMethod === "momo" && momoPhone ? (
                <p className="text-sm text-brand-fb/75">
                  Chuyển <strong className="font-mono">{order.totalPrice.toLocaleString("vi-VN")}đ</strong> tới Ví MoMo{" "}
                  <strong className="font-mono">{momoPhone}</strong> — nội dung:{" "}
                  <strong className="font-mono">LEN {order.id.slice(0, 12)}</strong>
                </p>
              ) : bankInfo ? (
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <img
                    src={buildVietQrImageUrl(order.totalPrice, `LEN ${order.id.slice(0, 12)}`) || ""}
                    alt="Mã VietQR thanh toán"
                    className="w-36 h-36 rounded-xl border border-brand-primary/10 bg-white object-contain"
                  />
                  <div className="text-sm text-brand-fb/75 space-y-1">
                    <p>• Số TK: <strong className="font-mono">{bankInfo.accountNo}</strong></p>
                    <p>• Chủ TK: <strong>{bankInfo.accountName}</strong></p>
                    <p>• Số tiền: <strong className="font-mono">{order.totalPrice.toLocaleString("vi-VN")}đ</strong></p>
                    <p>• Nội dung: <strong className="font-mono">LEN {order.id.slice(0, 12)}</strong></p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-brand-fb/60 italic">
                  Thông tin tài khoản nhận tiền chưa được cấu hình. Bạn vui lòng liên hệ shop để được hướng dẫn.
                </p>
              )}
              {reportError && (
                <p className="text-sm text-[#ba1a1a] font-sans">{reportError}</p>
              )}
              {canReport && (
                <button
                  onClick={handleReportTransferred}
                  disabled={isReporting}
                  className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold uppercase tracking-[0.12em] py-3 rounded-3xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Banknote size={16} className={isReporting ? "animate-pulse" : ""} />
                  {isReporting ? "Đang gửi thông báo cho shop..." : "Tôi đã chuyển khoản"}
                </button>
              )}
            </div>
          )}

          {order && needsTransfer && paymentStatus === "pending_confirmation" && (
            <div className="bg-white p-5 rounded-3xl border border-brand-primary/15 text-left flex items-start gap-3">
              <Clock size={18} className="text-brand-primary mt-0.5 shrink-0" />
              <div className="text-sm text-brand-fb/75">
                <p className="font-bold text-brand-fb">Đã ghi nhận thông báo chuyển khoản của bạn 💛</p>
                <p className="mt-1">
                  Shop sẽ kiểm tra tài khoản và xác nhận trong thời gian sớm nhất. Bạn sẽ nhận được email khi tiền về thành công.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-brand-primary text-white text-xs font-semibold uppercase tracking-[0.12em] py-3 rounded-3xl shadow-sm hover:bg-brand-primary-light transition cursor-pointer"
            >
              Xem đơn hàng
            </button>
            <Link
              to="/products"
              className="w-full inline-flex items-center justify-center gap-2 border border-brand-primary/15 rounded-3xl py-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-fb hover:bg-brand-primary/5 transition"
            >
              Tiếp tục mua sắm
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="text-xs text-brand-fb/60">
            <p className="font-semibold">Mẹo len handmade:</p>
            <p>Nhớ giữ ẩm cho sản phẩm vải len và tránh ánh nắng gắt để phom dáng luôn mềm mại, tươi mới.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
