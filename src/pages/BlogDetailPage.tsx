import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Clock, Calendar, User, Share2, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "../context/AppContext";
import { usePageSeo } from "../hooks/usePageSeo";
import { BRAND_NAME } from "../constants/brand";

const COLLAPSED_HEIGHT = 220;

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { blogsList = [], marketingArticles = [] } = useApp();
  const [expanded, setExpanded] = useState(false);

  // Prefer browser back so the /blog listing restores its previous page/filter state
  // (e.g. page 2) instead of always resetting to page 1 via a fresh "/blog" navigation.
  const handleBackToBlog = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/blog");
    }
  };

  const staticBlog = blogsList.find((b) => b.slug === slug);
  const liveBlog = marketingArticles.find((m) => m.slug === slug);
  const found = Boolean(staticBlog || liveBlog);

  const title = staticBlog?.title || liveBlog?.title || "";
  const category = staticBlog?.category || liveBlog?.tag || "Mỹ Nghệ";
  const date = staticBlog?.date || liveBlog?.date || "";
  const readTime = staticBlog?.readTime || "4 phút đọc";
  const author = liveBlog?.author || `${BRAND_NAME} Team`;
  const image =
    staticBlog?.image ||
    liveBlog?.image ||
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800";
  const rawContent = staticBlog?.content || liveBlog?.content || "";
  const seoDescription =
    liveBlog?.metaDescription || staticBlog?.description || `Bài viết ${title} — ${BRAND_NAME}.`;
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(rawContent);
  const paragraphs = useMemo(
    () => (isHtml ? [] : rawContent.split(/\n\n+/).filter(Boolean)),
    [rawContent, isHtml]
  );
  const isLongArticle = rawContent.length > 480;

  useEffect(() => {
    setExpanded(false);
  }, [slug]);

  usePageSeo(found ? `${title} — ${BRAND_NAME}` : `Không tìm thấy bài viết — ${BRAND_NAME}`, seoDescription);

  useEffect(() => {
    if (found) localStorage.setItem("len_blog_read_achievement", "true");
  }, [found]);

  const allBlogs = [
    ...blogsList.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      category: b.category,
      date: b.date,
      image: b.image,
    })),
    ...marketingArticles.map((m) => ({
      id: m.id,
      title: m.title,
      slug: m.slug,
      category: m.tag,
      date: m.date,
      image: m.image,
    })),
  ];
  const related = allBlogs.filter((b) => b.slug !== slug).slice(0, 3);

  if (!found) {
    return (
      <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h1 className="font-serif font-bold text-2xl text-brand-fb">
            Không tìm thấy bài viết
          </h1>
          <p className="font-sans text-sm text-brand-fb/60">
            Bài viết nàng tìm có thể đã bị gỡ hoặc đường dẫn không chính xác.
          </p>
          <button
            onClick={handleBackToBlog}
            className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold px-6 py-3 rounded-full bg-brand-primary text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            <ArrowLeft size={14} /> Về trang Tạp Chí
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-left">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-3xl mx-auto space-y-8 bg-brand-card rounded-[36px] border border-brand-primary/10 p-6 sm:p-10 shadow-sm"
      >
        {/* Navigation line */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToBlog}
            className="flex items-center gap-1.5 font-sans text-xs text-brand-fb/60 hover:text-brand-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Trở về Tạp Chí
          </button>
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-1.5 font-sans text-xs text-brand-fb/60 hover:text-brand-primary transition-colors cursor-pointer"
          >
            Về Trang Blog
          </button>
        </div>

        {/* Article header meta */}
        <div className="space-y-4">
          <span className="text-[10px] sm:text-xs bg-brand-primary/15 text-brand-primary px-3 py-1 rounded-full font-sans font-bold uppercase w-fit block tracking-wider">
            {category}
          </span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-brand-fb tracking-tight leading-snug">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-brand-fb/50 font-sans text-xs pt-2 border-y border-brand-primary/5 py-3">
            <span className="flex items-center gap-1">
              <Calendar size={13} /> {date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> {readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-brand-primary">
              <User size={13} /> {author}
            </span>
          </div>
        </div>

        {/* Feature banner illustration */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-brand-bg shadow-inner border border-brand-primary/10">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Article body — renders the actual stored content, collapsible like a Facebook post for long articles */}
        <div className="border-b border-brand-primary/5 pb-8">
          <div
            className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out"
            style={{ maxHeight: !isLongArticle || expanded ? 4000 : COLLAPSED_HEIGHT }}
          >
            <div className="font-sans text-sm text-brand-fb/80 space-y-5 leading-relaxed text-left">
              {isHtml ? (
                <div
                  className="space-y-4 [&_h3]:font-serif [&_h3]:font-black [&_h3]:text-md [&_h3]:text-brand-fb [&_h3]:pt-2 [&_p]:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: rawContent }}
                />
              ) : paragraphs.length > 0 ? (
                paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p className="italic text-brand-fb/50">Bài viết đang được cập nhật nội dung.</p>
              )}
            </div>
            {isLongArticle && !expanded && (
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-card to-transparent pointer-events-none" />
            )}
          </div>
          {isLongArticle && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-3 inline-flex items-center gap-1.5 font-sans text-xs font-bold text-brand-primary hover:opacity-80 transition-opacity cursor-pointer"
            >
              {expanded ? (
                <>
                  Thu gọn <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Xem thêm <ChevronDown size={14} />
                </>
              )}
            </button>
          )}
        </div>

        {/* Share toolbar controls */}
        <div className="flex items-center justify-between font-sans text-xs pt-2">
          <span className="text-brand-fb/50">
            Ban biên tập: <strong>{author}</strong> 🌸
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Đã sao chép liên kết bài viết!");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary rounded-md border border-brand-primary/10 cursor-pointer text-[11px] font-bold"
          >
            <Share2 size={12} /> Chia sẻ liên kết
          </button>
        </div>
      </motion.div>

      {/* Related articles */}
      {related.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl mx-auto mt-12"
        >
          <h3 className="font-serif font-bold text-lg text-brand-fb mb-5">Đọc thêm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((b) => (
              <button
                key={b.id}
                onClick={() => navigate(`/blog/${b.slug}`)}
                className="text-left group cursor-pointer bg-brand-card rounded-2xl border border-brand-primary/10 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden bg-brand-bg">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] font-sans font-bold text-brand-primary uppercase">
                    {b.category}
                  </span>
                  <p className="font-serif font-semibold text-sm text-brand-fb line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
                    {b.title}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-brand-fb/50">
                    {b.date} <ChevronRight size={11} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
