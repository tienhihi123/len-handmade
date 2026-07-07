import { useState, FormEvent } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminCouponsPage() {
  const { activeCoupons, setActiveCoupons } = useApp();
  const { can } = useAdminAuth();
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(30000);

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setActiveCoupons((prev) => [
      {
        code: code.toUpperCase().trim(),
        name: `Mã giảm ${discount.toLocaleString()}đ`,
        type: "fixed",
        value: discount,
        minOrderValue: 150000,
        maxDiscount: discount,
        startDate: new Date().toISOString(),
        endDate: "2026-12-31",
        usageLimit: 100,
        usedCount: 0,
        applicableProducts: [],
        applicableCategories: [],
        applicableRoles: ["customer"],
        status: "Đang hoạt động"
      },
      ...prev
    ]);
    setCode("");
    setShowForm(false);
  };

  const toggleDisable = (couponCode: string) => {
    setActiveCoupons((prev) =>
      prev.map((c) => (c.code === couponCode ? { ...c, status: c.status === "Đã tắt" ? "Đang hoạt động" : "Đã tắt" } : c))
    );
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Marketing</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Mã giảm giá ({activeCoupons.length})</h1>
        </div>
        {can("coupons.create") && (
          <button onClick={() => setShowForm((v) => !v)} className="inline-flex items-center gap-2 rounded-full bg-[#CEAF75] text-white px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] cursor-pointer">
            <Plus size={14} /> Tạo mã mới
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-5 rounded-2xl border border-[#E8DDD1] grid gap-3 sm:grid-cols-3">
          <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="Mã (VD: LEN30K)" className="rounded-xl border border-[#E8DDD1] px-3.5 py-2.5 text-sm outline-none" />
          <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="rounded-xl border border-[#E8DDD1] px-3.5 py-2.5 text-sm outline-none" />
          <button type="submit" className="rounded-xl bg-[#412C20] text-white text-xs font-bold py-2.5 cursor-pointer">Lưu</button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeCoupons.map((c) => (
          <div key={c.code} className="bg-white p-4 rounded-2xl border border-[#E8DDD1] space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <strong className="font-mono text-[#CEAF75]">{c.code}</strong>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${c.status === "Đang hoạt động" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{c.status}</span>
            </div>
            <p className="text-[#75645A]">{c.name}</p>
            <p className="font-mono">{c.usedCount}/{c.usageLimit} đã dùng</p>
            {can("coupons.disable") && (
              <button onClick={() => toggleDisable(c.code)} className="text-[10px] font-bold text-[#BA1A1A] cursor-pointer">
                {c.status === "Đã tắt" ? "Kích hoạt lại" : "Tắt mã"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
