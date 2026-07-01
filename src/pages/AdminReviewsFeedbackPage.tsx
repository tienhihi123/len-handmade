import { useEffect, useMemo, useState } from "react";
import { Star, MessageSquareText, CheckCircle2, EyeOff, Inbox, Mail } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Review, Feedback } from "../types";
import { subscribeToAllReviews, setReviewStatus } from "../lib/firestoreReviews";
import { subscribeToAllFeedback, setFeedbackStatus } from "../lib/firestoreFeedback";

export default function AdminReviewsFeedbackPage() {
  const { productsList } = useApp();
  const [tab, setTab] = useState<"reviews" | "feedback">("reviews");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([]);

  useEffect(() => {
    const unsubReviews = subscribeToAllReviews(setReviews);
    const unsubFeedback = subscribeToAllFeedback(setFeedbackItems);
    return () => {
      unsubReviews();
      unsubFeedback();
    };
  }, []);

  const productNameById = useMemo(
    () => new Map(productsList.map((p) => [p.id, p.name])),
    [productsList]
  );

  const pendingReviewCount = reviews.filter((r) => r.status === "pending").length;
  const newFeedbackCount = feedbackItems.filter((f) => f.status === "new").length;

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Cộng đồng khách hàng</span>
        <h1 className="font-serif text-3xl font-black text-brand-fb">Đánh giá & Phản hồi</h1>
        <p className="text-sm text-brand-fb/70 max-w-2xl">Duyệt đánh giá sản phẩm và theo dõi phản hồi chung do khách hàng gửi qua tài khoản.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-brand-primary mb-4"><Star size={18} /><span className="text-xs uppercase tracking-[0.25em] font-semibold">Tổng đánh giá</span></div>
          <p className="text-4xl font-mono font-black text-brand-fb">{reviews.length}</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-brand-primary mb-4"><EyeOff size={18} /><span className="text-xs uppercase tracking-[0.25em] font-semibold">Chờ duyệt</span></div>
          <p className="text-4xl font-mono font-black text-brand-fb">{pendingReviewCount}</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-brand-primary mb-4"><Inbox size={18} /><span className="text-xs uppercase tracking-[0.25em] font-semibold">Tổng phản hồi</span></div>
          <p className="text-4xl font-mono font-black text-brand-fb">{feedbackItems.length}</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-brand-primary mb-4"><Mail size={18} /><span className="text-xs uppercase tracking-[0.25em] font-semibold">Phản hồi mới</span></div>
          <p className="text-4xl font-mono font-black text-brand-fb">{newFeedbackCount}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("reviews")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${tab === "reviews" ? "bg-brand-primary text-white" : "bg-brand-card border border-brand-primary/10 text-brand-fb/70 hover:bg-white"}`}
        >
          Đánh giá sản phẩm
        </button>
        <button
          onClick={() => setTab("feedback")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${tab === "feedback" ? "bg-brand-primary text-white" : "bg-brand-card border border-brand-primary/10 text-brand-fb/70 hover:bg-white"}`}
        >
          Phản hồi chung
        </button>
      </div>

      {tab === "reviews" ? (
        <div className="overflow-x-auto rounded-[32px] border border-brand-primary/10 bg-brand-card shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#F4EFE6] text-[10px] uppercase tracking-[0.24em] text-brand-fb/60">
              <tr>
                <th className="px-4 py-4">Sản phẩm</th>
                <th className="px-4 py-4">Người viết</th>
                <th className="px-4 py-4">Sao</th>
                <th className="px-4 py-4">Nội dung</th>
                <th className="px-4 py-4">Trạng thái</th>
                <th className="px-4 py-4">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-primary/10">
              {reviews.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-brand-fb/50">Chưa có đánh giá nào.</td></tr>
              )}
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-white transition-colors align-top">
                  <td className="px-4 py-4 text-brand-fb font-semibold">{productNameById.get(rev.productId || "") || rev.productId}</td>
                  <td className="px-4 py-4 text-brand-fb/70">{rev.author}</td>
                  <td className="px-4 py-4 text-yellow-500 whitespace-nowrap">{"★".repeat(rev.rating)}</td>
                  <td className="px-4 py-4 text-brand-fb/70 max-w-[320px]">{rev.text}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${
                      rev.status === "approved" ? "bg-green-50 text-green-700"
                        : rev.status === "hidden" ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {rev.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {rev.status !== "approved" && (
                        <button
                          onClick={() => rev.productId && setReviewStatus(rev.productId, rev.id, "approved")}
                          className="p-1.5 rounded-full bg-green-50 text-green-700 hover:bg-green-100"
                          title="Duyệt"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                      {rev.status !== "hidden" && (
                        <button
                          onClick={() => rev.productId && setReviewStatus(rev.productId, rev.id, "hidden")}
                          className="p-1.5 rounded-full bg-red-50 text-red-700 hover:bg-red-100"
                          title="Ẩn"
                        >
                          <EyeOff size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[32px] border border-brand-primary/10 bg-brand-card shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#F4EFE6] text-[10px] uppercase tracking-[0.24em] text-brand-fb/60">
              <tr>
                <th className="px-4 py-4">Khách hàng</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Nội dung</th>
                <th className="px-4 py-4">Trạng thái</th>
                <th className="px-4 py-4">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-primary/10">
              {feedbackItems.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-brand-fb/50">Chưa có phản hồi nào.</td></tr>
              )}
              {feedbackItems.map((item) => (
                <tr key={item.id} className="hover:bg-white transition-colors align-top">
                  <td className="px-4 py-4 text-brand-fb font-semibold">{item.userName}</td>
                  <td className="px-4 py-4 text-brand-fb/70">{item.userEmail}</td>
                  <td className="px-4 py-4 text-brand-fb/70 max-w-[360px] flex items-start gap-2">
                    <MessageSquareText size={14} className="text-brand-primary mt-0.5 shrink-0" />
                    {item.message}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${
                      item.status === "resolved" ? "bg-green-50 text-green-700"
                        : item.status === "read" ? "bg-blue-50 text-blue-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {item.status === "new" && (
                        <button
                          onClick={() => setFeedbackStatus(item.id, "read")}
                          className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-semibold"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                      {item.status !== "resolved" && (
                        <button
                          onClick={() => setFeedbackStatus(item.id, "resolved")}
                          className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 hover:bg-green-100 text-[11px] font-semibold"
                        >
                          Đã xử lý
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
