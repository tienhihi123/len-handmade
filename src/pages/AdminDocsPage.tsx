import { useApp } from "../context/AppContext";
import { BookOpen, ShieldCheck, SearchCode } from "lucide-react";
import { BRAND_NAME } from "../constants/brand";

const seoGuides = [
  { title: "Tối ưu title và description", description: `Sử dụng từ khoá ${BRAND_NAME}, thủ công và dệt len để tăng khả năng hiển thị tìm kiếm.` },
  { title: "Kết cấu nội dung blog", description: "Những bài viết hướng dẫn sử dụng, chăm sóc sản phẩm và quà tặng len được tìm kiếm nhiều." },
  { title: "Meta Open Graph", description: "Sử dụng hình ảnh nghệ thuật, trích đoạn ấm áp và thẻ gg-rich để tăng tỉ lệ chia sẻ." }
];

export default function AdminDocsPage() {
  const { marketingArticles } = useApp();

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Tài liệu kỹ thuật</span>
        <h1 className="font-serif text-3xl font-black text-brand-fb">Hướng dẫn SEO & kỹ thuật thương hiệu</h1>
        <p className="text-sm text-brand-fb/70 max-w-2xl">Tập hợp các quy chuẩn nội dung, tối ưu tìm kiếm, và hướng dẫn vận hành thương hiệu {BRAND_NAME}.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-brand-primary mb-4"><BookOpen size={18} /><span className="text-xs uppercase tracking-[0.25em] font-semibold">Bài viết</span></div>
          <p className="text-4xl font-bold text-brand-fb">{marketingArticles.length}</p>
          <p className="mt-3 text-sm text-brand-fb/60">Số bài viết nội dung hiện có trong hệ thống.</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-brand-primary mb-4"><SearchCode size={18} /><span className="text-xs uppercase tracking-[0.25em] font-semibold">SEO</span></div>
          <p className="text-4xl font-bold text-brand-fb">Cập nhật</p>
          <p className="mt-3 text-sm text-brand-fb/60">Luôn cập nhật chuẩn tối ưu nội dung, thẻ meta và mô tả truyền thông.</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-brand-primary mb-4"><ShieldCheck size={18} /><span className="text-xs uppercase tracking-[0.25em] font-semibold">Quy chuẩn</span></div>
          <p className="text-4xl font-bold text-brand-fb">3</p>
          <p className="mt-3 text-sm text-brand-fb/60">Các nguyên tắc nội dung chính cần tuân thủ.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {seoGuides.map((guide) => (
          <div key={guide.title} className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
            <h2 className="font-serif text-lg font-black text-brand-fb mb-3">{guide.title}</h2>
            <p className="text-sm text-brand-fb/70">{guide.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
        <h2 className="font-serif text-2xl font-black text-brand-fb mb-4">Checklist nội dung SEO</h2>
        <ul className="space-y-3 text-sm text-brand-fb/70">
          <li className="rounded-3xl bg-white border border-brand-primary/10 p-4">• Sử dụng từ khoá “{BRAND_NAME}”, “đồ len thủ công”, “túi len”, “quà handmade”</li>
          <li className="rounded-3xl bg-white border border-brand-primary/10 p-4">• Đảm bảo tất cả bài blog có meta description tối thiểu 140 ký tự</li>
          <li className="rounded-3xl bg-white border border-brand-primary/10 p-4">• Cập nhật hình ảnh sản phẩm thật ấm áp cho thẻ Open Graph</li>
        </ul>
      </div>
    </div>
  );
}
