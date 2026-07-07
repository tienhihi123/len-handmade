import { useApp } from "../../context/AppContext";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminReturnsPage() {
  const { returnRequests, setReturnRequests } = useApp();
  const { can } = useAdminAuth();

  const handleDecision = (id: string, status: "Đã chấp nhận" | "Đã từ chối") => {
    setReturnRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Vận hành</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Đổi trả & Hoàn tiền</h1>
      </div>

      {returnRequests.length === 0 ? (
        <p className="text-xs text-[#75645A] italic py-8 text-center bg-white rounded-2xl border border-dashed border-[#E8DDD1]">Chưa có yêu cầu đổi trả nào.</p>
      ) : (
        <div className="space-y-3">
          {returnRequests.map((r) => (
            <div key={r.id} className="bg-white p-5 rounded-2xl border border-[#E8DDD1] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <strong className="font-mono text-[#CEAF75]">{r.id}</strong>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                  r.status === "Chờ xử lý" ? "bg-amber-100 text-amber-700" :
                  r.status === "Đã chấp nhận" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>{r.status}</span>
              </div>
              <p className="font-serif font-bold text-sm">{r.productName}</p>
              <p className="text-[#75645A]">Mã đơn: {r.orderId}</p>
              <p className="italic text-[#75645A] bg-[#FAF6F0] p-2.5 rounded-lg">"{r.reason}"</p>
              {r.status === "Chờ xử lý" && can("returns.review") && (
                <div className="flex gap-2 pt-1">
                  {can("returns.approve") && (
                    <button onClick={() => handleDecision(r.id, "Đã chấp nhận")} className="px-4 py-1.5 rounded-md bg-green-600 text-white text-[10px] font-bold cursor-pointer">Chấp nhận</button>
                  )}
                  {can("returns.reject") && (
                    <button onClick={() => handleDecision(r.id, "Đã từ chối")} className="px-4 py-1.5 rounded-md border border-red-200 text-red-600 text-[10px] font-bold cursor-pointer">Từ chối</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
