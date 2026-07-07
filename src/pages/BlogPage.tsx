import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  BookOpen,
  Search,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Mail,
  Layers,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useDragScroll } from "../hooks/useDragScroll";
import { usePageSeo } from "../hooks/usePageSeo";
import { BRAND_NAME } from "../constants/brand";

const PAGE_SIZE = 6;

export default function BlogPage() {
  const navigate = useNavigate();
  const { blogsList = [], marketingArticles = [] } = useApp();
  const dragScroll = useDragScroll();
  const [searchParams, setSearchParams] = useSearchParams();

  usePageSeo(
    `Tạp Chí Thơ Sợi Dệt — ${BRAND_NAME}`,
    "Cẩm nang đan móc, ý nghĩa quà tặng len thủ công và câu chuyện nghề của Tiệm Len Nhỏ."
  );

  const [searchVal, setSearchVal] = useState("");
  const [selectedTag, setSelectedTag] = useState("Tất cả");
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get("page")) || 1));
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // Combine static mock details with live marketing_articles written by staffs safely
  const allBlogsCombined = useMemo(
    () => [
      ...(blogsList || []).map((b) => ({
        id: b?.id || "",
        title: b?.title || "",
        slug: b?.slug || "",
        category: b?.category || "Cẩm Nang",
        excerpt:
          b?.description ||
          "Tìm hiểu cẩm nang dệt tay mộc mạc lưu truyền qua đôi mắt lãng mạn.",
        date: b?.date || "09/06/2026",
        readTime: b?.readTime || "5 phút đọc",
        image:
          b?.image ||
          "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400",
        isStaffArticle: false,
      })),
      ...(marketingArticles || []).map((m) => ({
        id: m?.id || "",
        title: m?.title || "",
        slug: m?.slug || "",
        category: m?.tag || "Xu Hướng",
        excerpt:
          m?.description ||
          "Tin tức dệt tay chánh niệm độc bản mộc mạc từ đội ngũ của chúng tôi.",
        date: m?.date || "09/06/2026",
        readTime: "4 phút đọc",
        image:
          m?.image ||
          "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400",
        isStaffArticle: true,
      })),
    ],
    [blogsList, marketingArticles]
  );

  const featured = allBlogsCombined[0];
  const rest = allBlogsCombined.slice(1);

  // Filtering blogs logic safely to avoid crashing on undefined/null fields
  const filteredBlogs = rest.filter((blog) => {
    const title = (blog.title || "").toLowerCase();
    const excerpt = (blog.excerpt || "").toLowerCase();
    const category = (blog.category || "").toLowerCase();
    const search = (searchVal || "").toLowerCase();

    const matchSearch =
      title.includes(search) || excerpt.includes(search) || category.includes(search);

    if (selectedTag === "Tất cả") return matchSearch;
    return matchSearch && category === selectedTag.toLowerCase();
  });

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));
  const pagedBlogs = filteredBlogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const categories = [
    "Tất cả",
    "Cẩm Nang",
    "Ý Nghĩa Quà",
    "Xu Hướng",
    "Quà Tặng",
    "Chữa Lành",
  ];

  const categoryCounts = [
    { name: "Tất cả", count: allBlogsCombined.length },
    ...categories
      .filter((c) => c !== "Tất cả")
      .map((cat) => ({
        name: cat,
        count: allBlogsCombined.filter((b) => (b.category || "").toLowerCase() === cat.toLowerCase())
          .length,
      }))
  ];

  const latestThree = [...allBlogsCombined]
    .slice(0)
    .reverse()
    .slice(0, 3);

  const goToPage = (p: number) => {
    const clamped = Math.min(Math.max(1, p), totalPages);
    setPage(clamped);
    setSearchParams(clamped > 1 ? { page: String(clamped) } : {}, { replace: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Search suggestions - show top 5 matching articles
  const searchSuggestions = useMemo(() => {
    if (!searchVal.trim()) return [];
    const search = searchVal.toLowerCase();
    return allBlogsCombined
      .filter((b) => {
        const title = (b.title || "").toLowerCase();
        const excerpt = (b.excerpt || "").toLowerCase();
        return title.includes(search) || excerpt.includes(search);
      })
      .slice(0, 5);
  }, [searchVal, allBlogsCombined]);

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-left">
      <div className="max-w-7xl mx-auto">
        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 pb-6 border-b border-brand-primary/10 flex flex-col md:flex-row justify-between items-baseline gap-4"
        >
          <div className="text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary block mb-2">
              ✦ Nhật ký đan len ✦
            </span>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-fb">
              Tạp Chí Thơ Sợi Dệt
            </h1>
            <p className="font-sans text-xs sm:text-sm text-brand-fb/60 mt-1">
              Nơi nuôi dưỡng tâm hồn, chỉ dạy nàng khâu dệt bông thêu chữ charm bảo quản
              phom giũ túi và quà.
            </p>
          </div>

          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Gõ tìm bài viết hoặc tác giả..."
              value={searchVal}
              onFocus={() => setShowSearchSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
              onChange={(e) => {
                setSearchVal(e.target.value);
                setPage(1);
                setSearchParams({});
                setShowSearchSuggestions(true);
              }}
              className="w-full text-sm font-sans pl-10 pr-4 py-3 rounded-xl border-2 border-divider-beige/60 bg-white text-brand-fb outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
            />
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold"
            />

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {showSearchSuggestions && searchVal.trim() && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-xl border-2 border-gold/20 shadow-soft-deep overflow-hidden z-50"
                >
                  <div className="p-2 bg-gradient-to-r from-ivory/40 to-cream/30 border-b border-divider-beige/40">
                    <span className="text-xs font-label-italic text-gold flex items-center gap-1.5 px-2">
                      <Sparkles size={12} />
                      Gợi ý bài viết
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {searchSuggestions.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => {
                          navigate(`/blog/${article.slug}`);
                          setShowSearchSuggestions(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-ivory/60 transition-colors border-b border-divider-beige/20 last:border-0 group"
                      >
                        <p className="text-sm font-serif font-semibold text-cocoa group-hover:text-gold line-clamp-1 mb-1">
                          {article.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-body-text">
                          <span className="font-label-italic">{article.category}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Featured article */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onClick={() => navigate(`/blog/${featured.slug}`)}
            className="mb-12 bg-brand-card rounded-[24px] overflow-hidden flex flex-col lg:flex-row lg:h-[380px] border border-brand-primary/10 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div className="w-full lg:w-[55%] h-56 lg:h-full overflow-hidden">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-full lg:w-[45%] p-8 sm:p-10 flex flex-col justify-center gap-4">
              <span className="font-label-italic italic text-dusty-pink text-base">
                Bài Viết Nổi Bật
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-brand-fb leading-snug group-hover:text-brand-primary transition-colors">
                {featured.title}
              </h2>
              <p className="font-sans text-sm text-brand-fb/60 leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-3 text-[11px] font-sans text-brand-fb/50">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {featured.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {featured.readTime}
                </span>
              </div>
              <span className="group/cta relative inline-flex items-center gap-2 font-label-italic text-sm text-cocoa group-hover:text-gold transition-colors overflow-hidden">
                <span className="relative z-10">Đọc tiếp câu chuyện</span>
                <ChevronRight size={16} className="relative z-10 group-hover/cta:translate-x-1 transition-transform" />
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gold via-gold/60 to-transparent scale-x-0 group-hover/cta:scale-x-100 origin-left transition-transform duration-500" />
                <span className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent scale-x-0 group-hover/cta:scale-x-100 origin-left transition-transform duration-300" />
              </span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
          {/* Main content — 8 columns */}
          <div className="lg:col-span-8">
            {pagedBlogs.length === 0 ? (
              <div className="py-24 text-center bg-brand-card rounded-[32px] border border-brand-primary/5 p-8 max-w-md mx-auto space-y-4">
                <BookOpen size={40} className="text-brand-primary/30 mx-auto animate-bounce" />
                <h3 className="font-serif font-bold text-lg text-brand-fb">
                  Không có ấn phẩm dệt trùng khớp
                </h3>
                <p className="font-sans text-xs text-brand-fb/60">
                  Bộ lọc của nàng chưa quấn trúng bài viết nào rồi. Nàng thử tìm từ khóa thông
                  dụng hơn nhé!
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={page + selectedTag + searchVal}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                >
                  {pagedBlogs.map((blog, i) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
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
                            Đọc tiếp
                          </span>
                          <ChevronRight
                            size={14}
                            className="text-brand-primary group-hover:translate-x-1 transition-transform"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            {filteredBlogs.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-full border border-brand-primary/15 flex items-center justify-center text-brand-fb/60 hover:bg-brand-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-9 h-9 rounded-full text-xs font-sans font-semibold transition-colors cursor-pointer ${
                      p === page
                        ? "bg-brand-primary text-white shadow-sm"
                        : "border border-brand-primary/15 text-brand-fb/70 hover:bg-brand-primary/5"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-full border border-brand-primary/15 flex items-center justify-center text-brand-fb/60 hover:bg-brand-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar — 4 columns */}
          <aside className="lg:col-span-4 lg:border-l lg:border-divider-beige lg:pl-10 flex flex-col gap-10">
            {/* Categories widget */}
            {categoryCounts.length > 0 && (
              <div>
                <h4 className="font-serif font-semibold text-base text-brand-fb mb-4 flex items-center gap-2">
                  <Layers size={16} className="text-brand-primary" /> Danh Mục
                </h4>
                <ul className="space-y-2">
                  {categoryCounts.map((c) => (
                    <li key={c.name}>
                      <button
                        onClick={() => {
                          setSelectedTag(c.name);
                          setPage(1);
                          setSearchParams({});
                        }}
                        className={`group w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-sans transition-all duration-300 cursor-pointer ${
                          selectedTag === c.name
                            ? "bg-gradient-to-r from-gold/15 to-gold/5 text-gold font-bold border-l-3 border-gold shadow-sm"
                            : "text-cocoa/70 hover:bg-ivory/50 hover:text-cocoa hover:translate-x-1"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {selectedTag === c.name && <span className="text-base">✦</span>}
                          {c.name}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
                          selectedTag === c.name
                            ? "bg-gold text-white"
                            : "bg-ivory/60 text-body-text group-hover:bg-gold/20 group-hover:text-gold"
                        }`}>
                          {c.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Latest posts widget */}
            {latestThree.length > 0 && (
              <div>
                <h4 className="font-serif font-semibold text-base text-brand-fb mb-4">
                  Bài Viết Nổi Bật
                </h4>
                <div className="flex flex-col gap-5">
                  {latestThree.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => navigate(`/blog/${b.slug}`)}
                      className="flex items-start gap-4 text-left group cursor-pointer hover:translate-x-1 transition-transform duration-300"
                    >
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-brand-bg border-2 border-divider-beige/40 group-hover:border-gold/40 transition-all shadow-sm">
                        <img
                          src={b.image}
                          alt={b.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5 space-y-2">
                        <span className="text-[10px] font-label-italic text-dusty-pink/80 uppercase tracking-wider block">
                          {b.category}
                        </span>
                        <p className="font-serif font-bold text-sm text-cocoa group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                          {b.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-sans text-body-text/70">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {b.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {b.readTime}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter widget */}
            <div className="bg-brand-card rounded-2xl border border-brand-primary/10 p-6 flex flex-col items-center text-center gap-3">
              <div className="w-11 h-11 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <Mail size={18} className="text-brand-primary" />
              </div>
              <h4 className="font-serif font-semibold text-base text-brand-fb">
                Nhận cẩm nang dệt mới nhất
              </h4>
              <p className="font-sans text-xs text-brand-fb/60">
                Đăng ký để không bỏ lỡ bài viết và ưu đãi mới từ {BRAND_NAME}.
              </p>
              {subscribed ? (
                <span className="font-sans text-xs font-semibold text-brand-primary">
                  Cảm ơn nàng đã đăng ký! 🌸
                </span>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email.trim()) setSubscribed(true);
                  }}
                  className="w-full flex flex-col gap-2"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email của nàng..."
                    className="w-full text-xs font-sans px-4 py-2.5 rounded-full border border-brand-primary/15 bg-white text-brand-fb outline-none focus:border-brand-primary"
                  />
                  <button
                    type="submit"
                    className="w-full bg-brand-primary text-white text-xs font-sans font-semibold py-2.5 rounded-full hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Đăng Ký Ngay
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
