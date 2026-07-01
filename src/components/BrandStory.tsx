import { motion } from "motion/react";
import { Sparkles, Heart, Gift, Award, Cloud, Hand } from "lucide-react";
import { BRAND_NAME } from "../constants/brand";

export default function BrandStory() {
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, delay, ease: "easeOut" },
  });

  const milestones = [
    {
      icon: <Hand className="w-6 h-6 text-brand-primary" />,
      title: "Thủ công tỉ mỉ",
      desc: "Từng đường kim dệt hoa, từng dốc mắc sợi đều dệt tay kỳ công bởi nghệ nhân có thâm niên để đảm bảo tuyệt tác bền bỉ khít khao."
    },
    {
      icon: <Cloud className="w-6 h-6 text-brand-primary" />,
      title: "Chất liệu mềm mại",
      desc: "Tuyển chọn sợi bông sữa Milk Cotton Nhật tơ tằm mềm mại hảo hạng, lành tính tuyệt đối cho làn da mẫn cảm nhất."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-brand-primary" />,
      title: "Thiết kế độc đáo",
      desc: "Kiểu dáng Boho phóng khoáng, họa tiết bông phập nổi đan kết cấu phom gỗ tối giản, thời thượng thích nghi nhiều phong cách đa dạng."
    },
    {
      icon: <Gift className="w-6 h-6 text-brand-primary" />,
      title: "Đóng gói yêu thương",
      desc: "Được sấy khô cùng tơ thơm nhài khô hữu cơ tự nhiên, bọc lụa mềm bọc lót gỗ, đóng hộp quà Kraft trang nhã trọn vẹn sự chân quý."
    }
  ];

  return (
    <section id="brand-story" className="py-20 bg-brand-bg/30 px-4 relative overflow-hidden">
      
      {/* Decorative blurry background circles */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-brand-secondary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-brand-accent/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10" id="brand-story-wrapper">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            {...fadeUp(0.1)}
            className="text-xs font-semibold uppercase tracking-widest text-brand-primary block mb-2"
          >
            Câu Chuyện Sợi Chỉ ✦ Trái Tim Dệt Hoa
          </motion.span>
          <motion.h2
            {...fadeUp(0.25)}
            className="font-serif font-bold text-3xl sm:text-4xl text-brand-fb mb-5"
          >
            Được tạo nên từ sự tỉ mỉ
          </motion.h2>
          <p className="font-sans text-brand-fb/70 text-sm md:text-md leading-relaxed">
            Mỗi sản phẩm sợi len dệt tại <strong className="text-brand-primary font-medium">{BRAND_NAME}</strong> không chỉ đơn thuần là phụ kiện thời trang, mà là một tác phẩm mang theo nhịp đập, thời gian, và sự chân thành tuyệt đối. Chúng tôi tin rằng cái chạm nhẹ ấm áp của những dải len mềm sẽ sưởi ấm tâm hồn bạn giữa nhịp sống đô hội tấp nập hối hả.
          </p>
        </div>

        {/* 4 Interactive soft glass cards displaying milestones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((item, index) => (
            <motion.div
              key={index}
              {...fadeUp(0.15 + index * 0.1)}
              whileHover={{ y: -8, scale: 1.02 }}
              className="soft-glass p-7 rounded-[26px] border border-brand-primary/10 hover:border-brand-primary/25 transition-all text-center flex flex-col items-center group shadow-sm hover:shadow-md"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-full bg-brand-primary/5 flex items-center justify-center mb-5 group-hover:bg-brand-primary/10 transition-colors shadow-inner">
                {item.icon}
              </div>
              <h3 className="font-serif font-bold text-sm text-brand-fb mb-3">
                {item.title}
              </h3>
              <p className="font-sans text-xs text-brand-fb/70 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Brand visual layout block - Editorial split text/photo concept */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/60 rounded-[36px] p-6 sm:p-10 border border-brand-primary/5 shadow-inner">
          <div className="lg:col-span-5 flex justify-center items-center select-none relative">
            {/* Background card layer for depth */}
            <div className="absolute -inset-2 rounded-[32px] bg-[#CEAF75]/10 border border-[#CEAF75]/20 shadow-lg" />
            <div className="absolute -inset-1 rounded-[30px] bg-white/80 border border-brand-primary/5 shadow-md" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl z-10" style={{ width: "360px", height: "640px" }}>
              <iframe 
                src="https://www.facebook.com/plugins/video.php?height=640&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2415309152287433%2F&show_text=false&width=360&t=0" 
                width="360" 
                height="640" 
                style={{ border: "none", overflow: "hidden" }} 
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen={true} 
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
            <span className="text-[10px] font-mono font-semibold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full self-start">
              Dành Cho Khóa Luận Tốt Nghiệp Xuất Sắc 🏆
            </span>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-brand-fb">
              Mỗi Kim Dệt Đều Chứa Đựng Bản Ngã Riêng
            </h3>
            <p className="font-sans text-xs sm:text-sm text-brand-fb/70 leading-relaxed">
              Bạn có biết để hoàn thành mẫu túi hoa hồng nổi như <strong>Túi Len Premium</strong>, nghệ nhân dệt độc bản phải thức dệt ròng rã suốt 16 tiếng đồng hồ dệt chéo mệt mỏi? Chúng tôi không mưu cầu sản xuất hàng loạt đại trà, chúng tôi dệt vì nghệ thuật sáng tạo và gìn giữ vẻ đẹp mộc mạc thủ công mỹ nghệ đương đại của phụ nữ Việt.
            </p>
            <div className="flex flex-wrap gap-4 pt-1">
              <span className="flex items-center gap-1.5 text-xs font-sans text-brand-fb/80">
                <Award className="w-4 h-4 text-brand-primary" /> Thiết kế độc bản
              </span>
              <span className="flex items-center gap-1.5 text-xs font-sans text-brand-fb/80">
                <Heart className="w-4 h-4 text-brand-primary" /> Hỗ trợ sinh kế thợ dệt vùng cao
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
