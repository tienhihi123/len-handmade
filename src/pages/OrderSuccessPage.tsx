import { useMemo } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import { useApp } from "../context/AppContext";
import { BRAND_NAME } from "../constants/brand";

export default function OrderSuccessPage() {
  const { allOrders } = useApp();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const orderIdFromState = (location.state as any)?.orderId as string | undefined;
  const orderIdFromParams = searchParams.get("orderId") || orderIdFromState;

  const order = useMemo(() => {
    if (!orderIdFromParams) return null;
    return allOrders.find((orderItem) => orderItem.id === orderIdFromParams || orderItem.orderCode === orderIdFromParams);
  }, [allOrders, orderIdFromParams]);

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
              </>
            ) : (
              <div className="text-center text-[11px] text-brand-fb/60">
                Không tìm thấy thông tin đơn hàng. Bạn có thể truy cập trang đơn hàng để xem chi tiết.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-brand-primary text-white text-xs font-semibold uppercase tracking-[0.12em] py-3 rounded-3xl shadow-sm hover:bg-brand-primary-light transition"
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
