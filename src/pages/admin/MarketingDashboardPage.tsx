import { useMemo } from "react";
import { FileText, Calendar, Megaphone, Ticket, Image as ImageIcon, TrendingUp } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function MarketingDashboardPage() {
  const { marketingArticles, activeCoupons, activeMissions, viewStats } = useApp();

  const drafts = marketingArticles.filter((a) => a.status === "nháp");
  const scheduled = marketingArticles.filter((a) => a.status === "đã lên lịch");
  const activeCampaigns = activeMissions.filter((m) => m.status === "Đang làm" || m.status === "Có thể nhận thưởng");
  const runningCoupons = activeCoupons.filter((c) => c.status === "Đang hoạt động");
  const totalCouponUses = activeCoupons.reduce((sum, c) => sum + c.usedCount, 0);

  const topContent = useMemo(() => [...viewStats].sort((a, b) => b.totalViews - a.totalViews).slice(0, 6), [viewStats]);

  const cards = [
    { label: "Bài nháp", value: drafts.length, icon: FileText },
    { label: "Chờ xuất bản", value: scheduled.length, icon: Calendar },
    { label: "Campaign hoạt động", value: activeCampaigns.length, icon: Megaphone },
    { label: "Coupon đang chạy", value: runningCoupons.length, icon: Ticket },
    { label: "Lượt dùng coupon", value: totalCouponUses, icon: Ticket }
  ];

  return (
    <div className="space-y-8 text-left">
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Dashboard marketing</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Quản lý nội dung và Marketing</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white p-5 rounded-2xl border border-[#E8DDD1] shadow-sm space-y-1.5">
              <span className="text-[10px] text-[#75645A] uppercase font-bold">{c.label}</span>
              <div className="flex items-center justify-between">
                <strong className="text-lg font-mono font-black text-[#412C20]">{c.value}</strong>
                <Icon className="text-[#CEAF75]" size={17} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#E8DDD1] pb-3">
            <TrendingUp size={15} className="text-[#CEAF75]" />
            <h4 className="font-serif font-bold text-xs uppercase">Nội dung hiệu quả nhất (theo lượt xem)</h4>
          </div>
          <div className="space-y-2">
            {topContent.map((c) => (
              <div key={c.productId} className="flex justify-between items-center text-xs bg-[#FAF6F0] p-2.5 rounded-lg">
                <span className="font-semibold">{c.productName}</span>
                <span className="font-mono font-bold text-[#CEAF75]">{c.totalViews} lượt xem</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#E8DDD1] pb-3">
            <ImageIcon size={15} className="text-[#CEAF75]" />
            <h4 className="font-serif font-bold text-xs uppercase">Banner đang hoạt động</h4>
          </div>
          <p className="text-xs text-[#75645A] italic py-4 text-center">
            Chưa có collection banners kết nối thực tế — module quản lý banner đang chờ tích hợp Firestore (banners/{"{"}id{"}"}).
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
        <h4 className="font-serif font-bold text-xs uppercase border-b border-[#E8DDD1] pb-3">Coupon đang chạy</h4>
        {runningCoupons.length === 0 ? (
          <p className="text-xs text-[#75645A] italic py-4 text-center">Không có coupon nào đang chạy.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {runningCoupons.map((c) => (
              <div key={c.code} className="p-3.5 bg-[#FAF6F0] rounded-xl text-xs space-y-1">
                <strong className="font-mono text-[#CEAF75]">{c.code}</strong>
                <p className="text-[#75645A]">{c.name}</p>
                <p className="font-mono font-bold">{c.usedCount}/{c.usageLimit} đã dùng</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
