import { useMemo, useState, FormEvent } from "react";
import { Plus, Pencil, Trash2, BookOpen, Search } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AdminBlogPage() {
  const { marketingArticles, setMarketingArticles } = useApp();
  const [search, setSearch] = useState("");
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Cẩm Nang");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return marketingArticles.filter((article) =>
      article.title.toLowerCase().includes(q) ||
      article.category.toLowerCase().includes(q) ||
      article.excerpt.toLowerCase().includes(q)
    );
  }, [marketingArticles, search]);

  const handlePublish = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const newPost = {
      id: `art_${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category,
      excerpt: excerpt || `${content.slice(0, 120)}...`,
      content,
      authorId: "admin",
      authorName: "Tiệm Len Nhỏ Team",
      imageUrl: "https://images.unsplash.com/photo-1517242046021-82ee19d4a410?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString()
    };
    setMarketingArticles((prev) => [newPost, ...prev]);
    setShowDraftForm(false);
    setTitle("");
    setExcerpt("");
    setContent("");
  };

  const handleDelete = (id: string) => {
    setMarketingArticles((prev) => prev.filter((article) => article.id !== id));
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Quản lý Blog</span>
        <h1 className="font-serif text-3xl font-black text-brand-fb">Quản trị nội dung tạp chí và PR</h1>
        <p className="text-sm text-brand-fb/70 max-w-2xl">Tạo nội dung mới, chỉnh sửa bài viết hiện tại và theo dõi các chủ đề truyền thông thương hiệu.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.27em] text-brand-primary font-semibold">Bộ lọc bài viết</p>
              <p className="text-sm text-brand-fb/60">Tìm theo tiêu đề, thể loại hoặc trích dẫn.</p>
            </div>
            <button
              onClick={() => setShowDraftForm((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#8c4a3f]"
            >
              <Plus size={14} /> Viết bài mới
            </button>
          </div>

          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-fb/50" />
            <input
              className="w-full rounded-3xl border border-brand-primary/15 bg-white pl-12 pr-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              placeholder="Tìm bài viết..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.27em] text-brand-primary font-semibold">Tổng bài viết</p>
          <p className="mt-4 text-5xl font-mono font-black text-brand-fb">{marketingArticles.length}</p>
          <p className="mt-3 text-sm text-brand-fb/60">Tổng số nội dung thương hiệu hiện có.</p>
        </div>
      </div>

      {showDraftForm && (
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <form onSubmit={handlePublish} className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề bài viết"
                className="w-full rounded-3xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              />
              <input
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Trích dẫn ngắn"
                className="w-full rounded-3xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              />
            </div>
            <div className="lg:col-span-1">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-3xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              >
                <option value="Cẩm Nang">Cẩm Nang</option>
                <option value="Thủ công">Thủ công</option>
                <option value="Phong cách">Phong cách</option>
                <option value="Tin tức">Tin tức</option>
              </select>
            </div>
            <div className="lg:col-span-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Nội dung bài viết..."
                className="w-full rounded-3xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              />
            </div>
            <div className="lg:col-span-3 flex justify-end gap-3">
              <button type="button" onClick={() => setShowDraftForm(false)} className="rounded-full border border-brand-primary/15 bg-white px-5 py-3 text-sm font-semibold text-brand-fb hover:bg-brand-primary/5 transition">Hủy</button>
              <button type="submit" className="rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white hover:bg-[#8c4a3f] transition">Đăng bài</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-[32px] border border-brand-primary/10 bg-brand-card shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#F4EFE6] text-[10px] uppercase tracking-[0.24em] text-brand-fb/60">
            <tr>
              <th className="px-4 py-4">Tiêu đề</th>
              <th className="px-4 py-4">Thể loại</th>
              <th className="px-4 py-4">Ngày</th>
              <th className="px-4 py-4">Tác giả</th>
              <th className="px-4 py-4">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/10">
            {filtered.map((article) => (
              <tr key={article.id} className="hover:bg-white transition-colors">
                <td className="px-4 py-4 text-brand-fb font-semibold">{article.title}</td>
                <td className="px-4 py-4 text-brand-fb/70">{article.category}</td>
                <td className="px-4 py-4 text-brand-fb/70">{new Date(article.createdAt).toLocaleDateString("vi-VN")}</td>
                <td className="px-4 py-4 text-brand-fb/70">{article.authorName}</td>
                <td className="px-4 py-4 flex gap-2">
                  <button className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-primary/15 px-3 py-2 text-[11px] font-semibold text-brand-fb hover:bg-brand-primary/5 transition"><Pencil size={14} /> Sửa</button>
                  <button onClick={() => handleDelete(article.id)} className="inline-flex items-center gap-2 rounded-full bg-white border border-red-100 px-3 py-2 text-[11px] font-semibold text-red-600 hover:bg-red-50 transition"><Trash2 size={14} /> Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
