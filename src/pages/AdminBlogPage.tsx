import { Fragment, useEffect, useMemo, useState, FormEvent } from "react";
import { Plus, Pencil, Trash2, Search, X, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { BlogPost } from "../types";
import { subscribeToBlogCategories, saveBlogCategoriesToFirestore } from "../lib/firestoreBlogCategories";

const DEFAULT_CATEGORIES = ["Cẩm Nang", "Ý Nghĩa Quà", "Xu Hướng", "Quà Tặng", "Chữa Lành"];
const BLOG_CATEGORIES_KEY = "len_blog_categories";

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function todayVietnameseDate() {
  const now = new Date();
  return `${now.getDate()} Tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;
}

export default function AdminBlogPage() {
  const { blogsList, setBlogsList } = useApp();
  const [search, setSearch] = useState("");
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [title, setTitle] = useState("");
  const [blogCategories, setBlogCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem(BLOG_CATEGORIES_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  const [category, setCategory] = useState(blogCategories[0]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Firestore keeps blog categories shared across admins/devices — this
  // browser's localStorage copy is only the offline fallback.
  useEffect(() => subscribeToBlogCategories((remote) => {
    if (remote.length > 0) {
      setBlogCategories(remote);
      localStorage.setItem(BLOG_CATEGORIES_KEY, JSON.stringify(remote));
    }
  }), []);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const handleAddCategory = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed || blogCategories.includes(trimmed)) return;
    const updated = [...blogCategories, trimmed];
    setBlogCategories(updated);
    localStorage.setItem(BLOG_CATEGORIES_KEY, JSON.stringify(updated));
    saveBlogCategoriesToFirestore(updated);
    setCategory(trimmed);
    setNewCategoryName("");
    setShowAddCategory(false);
  };

  // Row-level edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return blogsList.filter((post) =>
      post.title.toLowerCase().includes(q) ||
      (post.category || "").toLowerCase().includes(q) ||
      post.description.toLowerCase().includes(q)
    );
  }, [blogsList, search]);

  const handlePublish = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const wordCount = content.trim().split(/\s+/).length;
    const newPost: BlogPost = {
      id: `blog_${Date.now()}`,
      title,
      slug: slugify(title),
      category,
      description: description || `${content.slice(0, 140)}...`,
      readTime: `${Math.max(2, Math.round(wordCount / 180))} phút đọc`,
      date: todayVietnameseDate(),
      image: image.trim() || "https://images.unsplash.com/photo-1517242046021-82ee19d4a410?auto=format&fit=crop&q=80&w=400",
      content
    };
    setBlogsList((prev) => [newPost, ...prev]);
    setShowDraftForm(false);
    setTitle("");
    setDescription("");
    setContent("");
    setImage("");
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Xóa bài viết này khỏi trang Tạp chí? Bài viết sẽ biến mất khỏi /blog ngay lập tức.")) return;
    setBlogsList((prev) => prev.filter((post) => post.id !== id));
  };

  const handleStartEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditCategory(post.category);
    setEditDescription(post.description);
    setEditImage(post.image);
  };

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingId || !editTitle.trim()) return;
    setBlogsList((prev) =>
      prev.map((post) =>
        post.id === editingId
          ? { ...post, title: editTitle, category: editCategory, description: editDescription, image: editImage.trim() || post.image }
          : post
      )
    );
    setEditingId(null);
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Quản lý Blog</span>
        <h1 className="font-serif text-3xl font-black text-brand-fb">Quản trị nội dung tạp chí và PR</h1>
        <p className="text-sm text-brand-fb/70 max-w-2xl">Dữ liệu bên dưới là các bài viết thật đang hiển thị trên trang Tạp chí (/blog) — sửa/xóa tại đây sẽ cập nhật trực tiếp cho khách hàng.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.27em] text-brand-primary font-semibold">Bộ lọc bài viết</p>
              <p className="text-sm text-brand-fb/60">Tìm theo tiêu đề, thể loại hoặc mô tả.</p>
            </div>
            <button
              onClick={() => setShowDraftForm((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#8c4a3f]"
            >
              <Plus size={14} /> Viết bài mới
            </button>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fb/50" />
            <input
              className="w-full rounded-3xl border border-brand-primary/15 bg-white pl-10 pr-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              placeholder="Tìm bài viết..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.27em] text-brand-primary font-semibold">Tổng bài viết</p>
          <p className="mt-4 text-5xl font-mono font-black text-brand-fb">{blogsList.length}</p>
          <p className="mt-3 text-sm text-brand-fb/60">Đang hiển thị trực tiếp trên /blog.</p>
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn"
                className="w-full rounded-3xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              />
            </div>
            <div className="lg:col-span-1 space-y-2">
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 min-w-0 rounded-3xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
                >
                  {blogCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddCategory((prev) => !prev)}
                  title="Thêm danh mục mới"
                  className="shrink-0 w-11 h-11 rounded-full border border-brand-primary/15 bg-white text-brand-primary flex items-center justify-center hover:bg-brand-primary/5 transition cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>
              {showAddCategory && (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleAddCategory(e); }
                    }}
                    placeholder="Tên danh mục mới"
                    className="flex-1 min-w-0 rounded-3xl border border-brand-primary/15 bg-white px-4 py-2.5 text-sm text-brand-fb outline-none focus:border-brand-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="shrink-0 rounded-full bg-brand-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#8c4a3f] transition cursor-pointer"
                  >
                    Thêm
                  </button>
                </div>
              )}
            </div>
            <div className="lg:col-span-3 flex gap-4 items-center">
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Đường dẫn ảnh bìa (URL)..."
                className="flex-1 rounded-3xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              />
              {image.trim() && (
                <img src={image} alt="Xem trước ảnh bìa" className="w-14 h-14 rounded-2xl object-cover border border-brand-primary/10 shrink-0" referrerPolicy="no-referrer" />
              )}
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

      <div className="overflow-x-auto rounded-3xl border border-brand-primary/10 bg-brand-card shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#F4EFE6] text-[10px] uppercase tracking-[0.24em] text-brand-fb/60">
            <tr>
              <th className="px-4 py-4 first:pl-6">Tiêu đề</th>
              <th className="px-4 py-4">Thể loại</th>
              <th className="px-4 py-4">Ngày</th>
              <th className="px-4 py-4">Thời gian đọc</th>
              <th className="px-4 py-4 last:pr-6">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/10">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-brand-fb/50 italic">Không tìm thấy bài viết phù hợp.</td>
              </tr>
            ) : (
              filtered.map((post) => (
                <Fragment key={post.id}>
                  <tr className="hover:bg-white transition-colors">
                    <td className="px-4 py-4 pl-6 text-brand-fb font-semibold max-w-[320px]">{post.title}</td>
                    <td className="px-4 py-4 text-brand-fb/70">
                      {post.category ? (
                        post.category
                      ) : (
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!value) return;
                            setBlogsList((prev) =>
                              prev.map((p) => (p.id === post.id ? { ...p, category: value } : p))
                            );
                          }}
                          className="rounded-full border border-brand-primary/20 bg-white px-2.5 py-1 text-[11px] text-brand-fb/70 outline-none focus:border-brand-primary cursor-pointer"
                        >
                          <option value="" disabled>+ Thêm thể loại</option>
                          {blogCategories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-4 text-brand-fb/70">{post.date}</td>
                    <td className="px-4 py-4 text-brand-fb/70">{post.readTime}</td>
                    <td className="px-4 py-4 pr-6 flex gap-2">
                      <button onClick={() => handleStartEdit(post)} className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-primary/15 px-3 py-2 text-[11px] font-semibold text-brand-fb hover:bg-brand-primary/5 transition cursor-pointer"><Pencil size={14} /> Sửa</button>
                      <button onClick={() => handleDelete(post.id)} className="inline-flex items-center gap-2 rounded-full bg-white border border-red-100 px-3 py-2 text-[11px] font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"><Trash2 size={14} /> Xóa</button>
                    </td>
                  </tr>
                  {editingId === post.id && (
                    <tr>
                      <td colSpan={5} className="px-4 py-5 bg-[#F9F4EC]">
                        <form onSubmit={handleSaveEdit} className="grid gap-3 lg:grid-cols-4 items-end">
                          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="lg:col-span-2 rounded-xl border border-brand-primary/15 bg-white px-3.5 py-2.5 text-sm text-brand-fb outline-none focus:border-brand-primary" placeholder="Tiêu đề" />
                          <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="rounded-xl border border-brand-primary/15 bg-white px-3.5 py-2.5 text-sm text-brand-fb outline-none focus:border-brand-primary">
                            {blogCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="rounded-xl border border-brand-primary/15 bg-white px-3.5 py-2.5 text-sm text-brand-fb outline-none focus:border-brand-primary" placeholder="Mô tả" />
                          <div className="lg:col-span-3 flex gap-3 items-center">
                            <input value={editImage} onChange={(e) => setEditImage(e.target.value)} className="flex-1 rounded-xl border border-brand-primary/15 bg-white px-3.5 py-2.5 text-sm text-brand-fb outline-none focus:border-brand-primary" placeholder="Đường dẫn ảnh bìa (URL)" />
                            {editImage.trim() && (
                              <img src={editImage} alt="Xem trước ảnh bìa" className="w-11 h-11 rounded-xl object-cover border border-brand-primary/10 shrink-0" referrerPolicy="no-referrer" />
                            )}
                          </div>
                          <div className="lg:col-span-4 flex justify-end gap-2">
                            <button type="button" onClick={() => setEditingId(null)} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-primary/15 px-4 py-2.5 text-xs font-semibold text-brand-fb hover:bg-brand-primary/5 transition cursor-pointer"><X size={14} /> Hủy</button>
                            <button type="submit" className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#8c4a3f] transition cursor-pointer"><Check size={14} /> Lưu thay đổi</button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
