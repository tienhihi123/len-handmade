import { useLocation, useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function AdminUnauthorizedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser } = useApp();
  const reason = (location.state as { reason?: string } | null)?.reason
    || "Bạn không có quyền truy cập trang này trong Control Panel.";

  return (
    <div className="min-h-screen bg-[#2B221B] flex items-center justify-center px-4 text-center">
      <div className="max-w-md w-full bg-[#FBF6F0] rounded-3xl p-8 space-y-5 shadow-2xl">
        <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldAlert className="text-[#BA1A1A]" size={26} />
        </div>
        <h1 className="font-serif text-2xl font-black text-[#412C20]">Không có quyền truy cập</h1>
        <p className="text-sm text-[#75645A] leading-relaxed">{reason}</p>
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => navigate("/admin/login")}
            className="w-full rounded-full bg-[#CEAF75] text-white text-xs font-bold uppercase tracking-[0.18em] py-3 hover:opacity-90 transition cursor-pointer"
          >
            Về trang đăng nhập Control Panel
          </button>
          <button
            onClick={() => {
              logoutUser();
              navigate("/");
            }}
            className="w-full rounded-full border border-[#E8DDD1] text-[#412C20] text-xs font-bold uppercase tracking-[0.18em] py-3 hover:bg-white transition cursor-pointer"
          >
            Đăng xuất và về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
