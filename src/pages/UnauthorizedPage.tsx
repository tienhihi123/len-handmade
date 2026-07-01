import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 flex flex-col items-center justify-center">
      <div className="max-w-md bg-brand-card p-8 rounded-[32px] border border-red-200 shadow-sm text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert size={28} className="animate-bounce" />
        </div>

        <div className="space-y-2 text-center">
          <h2 className="font-serif font-black text-lg text-brand-fb">Từ Chối Quyền Truy Cập! 🛑</h2>
          <p className="font-sans text-xs text-brand-fb/60 leading-relaxed">
            Phận mục dệt này đòi hỏi quyền hạn đặc trách cấp cao (Admin/Staff) trên Backoffice của Len. Tài khoản hiện hành của nàng chỉ có thể dạo ngắm và đặt đơn dệt thôi nhé.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-brand-primary hover:bg-brand-primary-light text-white text-xs font-bold py-3 rounded-full shadow-sm cursor-pointer"
          >
            Đăng nhập vai trò Thợ Dệt
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white text-brand-fb border border-brand-primary/10 hover:border-brand-primary text-xs font-sans py-2.5 rounded-full cursor-pointer flex items-center justify-center gap-1"
          >
            <ArrowLeft size={12} /> Quay về Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
}
