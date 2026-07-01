import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Clock, BookOpen, Search, Filter, Sparkles, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useDragScroll } from "../hooks/useDragScroll";

export default function BlogPage() {
  const navigate = useNavigate();
  const { blogsList = [], marketingArticles = [] } = useApp();
  const dragScroll = useDragScroll();

  const [searchVal, setSearchVal] = useState("");
  const [selectedTag, setSelectedTag] = useState("Tất cả");

  // Combine static mock details with live marketing_articles written by staffs safely
  const allBlogsCombined = [
    ...(blogsList || []).map(b => ({
      id: b?.id || "",
      title: b?.title || "",
      slug: b?.slug || "",
      category: b?.category || "Cẩm Nang",
      excerpt: b?.description || "Tìm hiểu cẩm nang dệt tay mộc mạc lưu truyền qua đôi mắt lãng mạn.",
      date: b?.date || "09/06/2026",
      readTime: b?.readTime || "5 phút đọc",
      image: b?.image || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400",
      isStaffArticle: false
    })),
    ...(marketingArticles || []).map(m => ({
      id: m?.id || "",
      title: m?.title || "",
      slug: m?.slug || "",
      category: m?.tag || "Xu Hướng",
      excerpt: m?.description || "Tin tức dệt tay chánh niệm độc bản mộc mạc từ đội ngũ của chúng tôi.",
      date: m?.date || "09/06/2026",
      readTime: "4 phút đọc",
      image: m?.image || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400",
      isStaffArticle: true
    }))
  ];

  // Filtering blogs logic safely to avoid crashing on undefined/null fields
  const filteredBlogs = allBlogsCombined.filter(blog => {
    const title = (blog.title || "").toLowerCase();
    const excerpt = (blog.excerpt || "").toLowerCase();
    const category = (blog.category || "").toLowerCase();
    const search = (searchVal || "").toLowerCase();

    const matchSearch = title.includes(search) || 
                        excerpt.includes(search) ||
                        category.includes(search);
    
    if (selectedTag === "Tất cả") return matchSearch;
    return matchSearch && blog.category.toLowerCase() === selectedTag.toLowerCase();
  });

  const categories = ["Tất cả", "Cấu trúc sưởi", "Khen dệt", "Bảo quản", "Cẩm Nang", "Ý Nghĩa Quà", "Xu Hướng", "Khám Phá"];

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-left">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner header title */}
        <div className="mb-12 pb-6 border-b border-brand-primary/10 flex flex-col md:flex-row justify-between items-baseline gap-4">
          <div className="text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary block mb-2">✦ Nhật ký đan len ✦</span>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-fb">Tạp Chí Thơ Sợi Dệt</h1>
            <p className="font-sans text-xs sm:text-sm text-brand-fb/60 mt-1">Nơi nuôi dưỡng tâm hồn, chỉ dạy nàng khâu dệt bông thêu chữ charm bảo quản phom giũ túi và quà.</p>
          </div>

          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Gõ tìm bài viết hoặc tác gia..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full text-xs font-sans pl-10 pr-4 py-2.5 rounded-full border border-brand-primary/15 bg-white text-brand-fb outline-none focus:border-brand-primary"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fb/45" />
          </div>
        </div>

        {/* Categories tags panel select */}
        <div 
          {...dragScroll.props}
          className="flex gap-2.5 overflow-x-auto pb-6 scrollbar-none scroll-smooth cursor-grab active:cursor-grabbing select-none"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={(e) => dragScroll.handleItemClick(e, () => setSelectedTag(cat))}
              className={`px-4 py-2 rounded-full text-xs font-sans font-semibold border transition-all truncate cursor-pointer select-none ${
                selectedTag === cat
                  ? "bg-brand-primary border-brand-primary text-white shadow-sm"
                  : "bg-white border-brand-primary/10 text-brand-fb/80 hover:bg-brand-primary/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="py-24 text-center bg-brand-card rounded-[32px] border border-brand-primary/5 p-8 max-w-md mx-auto space-y-4">
            <BookOpen size={40} className="text-brand-primary/30 mx-auto animate-bounce" />
            <h3 className="font-serif font-bold text-lg text-brand-fb">Không có ấn phẩm dệt trùng khớp</h3>
            <p className="font-sans text-xs text-brand-fb/60">Quận sợi lọc của nàng chưa quấn trúng bài viết mác thêu nào rồi. Nàng thử tìm từ khóa thông dụng hơn nhé!</p>
          </div>
        ) : (
          /* Grid of magazine logs */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <motion.div
                key={blog.id}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/blog/${blog.slug}`)}
                className="bg-brand-card rounded-2xl border border-brand-primary/10 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group text-left"
              >
                <div className="relative h-52 overflow-hidden bg-brand-bg">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {blog.isStaffArticle && (
                    <span className="absolute top-4 left-4 bg-brand-fb text-white text-[9px] font-mono tracking-wider px-2.5 py-1 rounded shadow flex items-center gap-1">
                      <Sparkles size={8} className="text-brand-secondary animate-pulse" />
                      STAFF ARTICLE
                    </span>
                  )}

                  {!blog.isStaffArticle && (
                    <span className="absolute top-4 left-4 bg-brand-primary text-white text-[9px] font-mono px-2.5 py-1 rounded shadow">
                      {blog.category}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-3.5 flex flex-col flex-grow justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[10px] font-sans text-brand-fb/50 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {blog.readTime}
                      </span>
                      <span>•</span>
                      <span>{blog.date}</span>
                    </div>
                    <h3 className="font-serif font-bold text-sm sm:text-md text-brand-fb group-hover:text-brand-primary transition-colors leading-snug">
                      {blog.title}
                    </h3>
                    <p className="font-sans text-xs text-brand-fb/60 line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-primary/5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-bold text-brand-primary">
                      Đột nhịp đọc chữ <Clock size={11} />
                    </span>
                    <ChevronRight size={14} className="text-brand-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
