import { useMemo } from "react";
import { Star, Clock, AlertTriangle, ThumbsDown, ImageOff, ShieldOff, History } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function ReviewsDashboardPage() {
  const { reviewsList, logs } = useApp();

  const pending = reviewsList.filter((r) => r.status === "pending" || !r.status);
  const hidden = reviewsList.filter((r) => r.status === "hidden");
  const lowRating = reviewsList.filter((r) => r.rating <= 2);
  const moderationActivity = useMemo(
    () => logs.filter((l) => l.action.toLowerCase().includes("review") || l.action.toLowerCase().includes("đánh giá")).slice(0, 10),
    [logs]
  );

  const cards = [
    { label: "Review mới", value: reviewsList.length, icon: Star },
    { label: "Review pending", value: pending.length, icon: Clock },
    { label: "Review bị báo cáo", value: 0, icon: AlertTriangle, note: "Chưa có field report — cần bổ sung khi nối Firestore" },
    { label: "Rating thấp (≤2★)", value: lowRating.length, icon: ThumbsDown },
    { label: "Review có ảnh", value: 0, icon: ImageOff, note: "Model Review hiện chưa lưu ảnh đính kèm" },
    { label: "Đã ẩn / spam", value: hidden.length, icon: ShieldOff }
  ];

  return (
    <div className="space-y-8 text-left">
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Dashboard kiểm duyệt</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Kiểm duyệt đánh giá</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white p-5 rounded-2xl border border-[#E8DDD1] shadow-sm space-y-1.5">
              <span className="text-[10px] text-[#75645A] uppercase font-bold">{c.label}</span>
              <div className="flex items-center justify-between">
                <strong className="text-lg font-mono font-black text-[#412C20]">{c.value}</strong>
                <Icon className="text-[#CEAF75]" size={17} />
              </div>
              {c.note && <p className="text-[9px] text-[#75645A]/70 italic">{c.note}</p>}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
          <h4 className="font-serif font-bold text-xs uppercase border-b border-[#E8DDD1] pb-3">Review đang chờ duyệt</h4>
          {pending.length === 0 ? (
            <p className="text-xs text-[#75645A] italic py-6 text-center">Không có review nào đang chờ.</p>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {pending.map((r) => (
                <div key={r.id} className="p-3.5 bg-[#FAF6F0] rounded-xl text-xs space-y-1">
                  <div className="flex justify-between">
                    <strong>{r.author}</strong>
                    <span className="font-mono text-amber-600">{r.rating}★</span>
                  </div>
                  <p className="text-[#75645A]">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#E8DDD1] pb-3">
            <History size={15} className="text-[#CEAF75]" />
            <h4 className="font-serif font-bold text-xs uppercase">Hoạt động kiểm duyệt gần đây</h4>
          </div>
          {moderationActivity.length === 0 ? (
            <p className="text-xs text-[#75645A] italic py-6 text-center">Chưa có hoạt động kiểm duyệt.</p>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {moderationActivity.map((l) => (
                <div key={l.id} className="text-xs bg-[#FAF6F0] p-2.5 rounded-lg">
                  <strong>{l.userName}</strong> — {l.action}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
