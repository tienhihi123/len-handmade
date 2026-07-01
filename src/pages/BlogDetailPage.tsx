import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Bookmark, Share2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { BRAND_NAME } from "../constants/brand";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { blogsList, marketingArticles } = useApp();

  // Mark article as read to achieve "Đọc tạp chí" mission
  useEffect(() => {
    localStorage.setItem("len_blog_read_achievement", "true");
  }, []);

  // Synthesize matching details or fallback safely
  const staticBlog = blogsList.find(b => b.slug === slug);
  const liveBlog = marketingArticles.find(m => m.slug === slug);

  const title = staticBlog ? staticBlog.title : liveBlog ? liveBlog.title : "Tạp chí chữa lành vỡ sợi";
  const category = staticBlog ? staticBlog.category : liveBlog ? liveBlog.tag : "Mỹ Nghệ";
  const date = staticBlog ? staticBlog.date : liveBlog ? liveBlog.date : "Hôm nay";
  const readTime = staticBlog ? staticBlog.readTime || "5 phút đọc" : "4 phút đọc";
  const image = staticBlog ? staticBlog.image : liveBlog ? liveBlog.image : "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800";
  const content = staticBlog ? staticBlog.content : liveBlog ? liveBlog.content : "Sợi dệt lãng mạn lót mộc...";

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-left">
      <div className="max-w-3xl mx-auto space-y-8 bg-brand-card rounded-[36px] border border-brand-primary/10 p-6 sm:p-10 shadow-sm">
        
        {/* Navigation line */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 font-sans text-xs text-brand-fb/60 hover:text-brand-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Trở về rạp bài viết
        </button>

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
              <Bookmark size={13} /> Gợi ý thợ thêu nhài
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

        {/* Article structured markup reading body */}
        <div className="font-sans text-sm text-brand-fb/80 space-y-5 leading-relaxed text-left border-b border-brand-primary/5 pb-8">
          <p className="font-bold text-brand-fb text-base border-l-4 border-brand-primary pl-3 py-1.5 bg-brand-primary/5 rounded-r">
            Nơi sợi len quấn trọn tâm sự trong veo, lưu bảo bền chất dệt bàn tay mộc mạc Việt Nam.
          </p>

          <p>
            Mỗi sợi len hay cái chạm nhạt tơ thực chất là một sợi rung liên cảm chứa đựng thời gian của người nghệ nhân móc khâu tay. Trong bài thêu lăng kính này, ban dệt {BRAND_NAME} gợi mở những bí quyết giữ phom cực chuẩn cho tác phẩm dệt của Nàng.
          </p>

          <h3 className="font-serif font-black text-md text-brand-fb pt-4 flex items-center gap-1.5">
            1. Nguyên lý cấn giũ ấm:
          </h3>
          <p>
            Cần giũ ấm bằng tay nhẹ nhàng bằng xà bông thiên nhiên hoặc nước giặt hữu cơ dịu lạnh. Tuyệt đối không vò nát sợi hay chải mác len bằng cước bàn chải đanh xơ tủy, phá vỡ liên kết tơ tằm mịn màng.
          </p>

          <h3 className="font-serif font-black text-md text-brand-fb pt-4 flex items-center gap-1.5">
            2. Trải nghiệm phơi dã ngoại khói nhài:
          </h3>
          <p>
            Không treo dốc túi gối thêu khi đang ướt nọng tủy nước. Hãy đặt sấy khô nằm ngang trên khăn giấy mộc trải râm mát dịu gió, giữ khung phom túi căng phồng mềm mại lộng lẫy tự nhiên.
          </p>

          <p className="italic text-brand-fb/60 bg-brand-bg p-4 rounded-xl border border-brand-primary/5 mt-4">
            “Nối dệt chữ lộc, lót charm nhãn gỗ dâu tằm thơm bọc mác lụa - Chúng mình chăm sóc túi hộp khảm tay bảo an lộc thêu tặng miễn phí trọn đời cho các Nàng thơ yên len mộc.”
          </p>
        </div>

        {/* Share toolbar controls */}
        <div className="flex items-center justify-between font-sans text-xs pt-2">
          <span className="text-[#A89F95]">Ban biên tập dệt: <strong>{BRAND_NAME} Team</strong> 🌸</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Đã sao chép liên kết bài viết tạp chí lãng mạn!");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary rounded-md border border-brand-primary/10 cursor-pointer text-[11px] font-bold"
          >
            <Share2 size={12} /> Chia sẻ liên kết
          </button>
        </div>

      </div>
    </div>
  );
}
