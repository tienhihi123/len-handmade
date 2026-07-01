import { motion } from "motion/react";
import { ArrowRight, ShoppingBag, Heart, Sparkles, Flower } from "lucide-react";

interface HeroProps {
  onNavigateToSection: (sectionId: string) => void;
  onExploreProducts: () => void;
}

export default function Hero({ onNavigateToSection, onExploreProducts }: HeroProps) {
  // Animation delay utility
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: "easeOut" },
  });

  return (
    <section 
      id="hero" 
      className="relative min-h-screen pt-28 pb-16 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-brand-bg to-[#FCF9F3] px-4"
    >
      {/* Dynamic Animated Yarn Strings (Curving elegantly to the center bag) */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block">
        <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Thread from Top-Left Cream Yarn Roll (around x:150, y:200) to Center Bag (x:720, y:400) */}
          <motion.path
            d="M 170 230 C 350 250, 450 300, 620 370"
            stroke="rgba(180, 130, 95, 0.45)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, delay: 0.4, ease: "easeInOut" }}
            strokeDasharray="8, 6"
          />
          {/* Thread from Mid-Left Pink Yarn Roll (around x:120, y:500) to Center Bag (x:720, y:450) */}
          <motion.path
            d="M 160 520 C 300 510, 480 480, 610 440"
            stroke="rgb(244, 184, 194)"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 0.8, ease: "easeInOut" }}
          />

          {/* Thread from Sage Green Yarn Roll (around x:1250, y:480) to Center Bag (x:820, y:450) */}
          <motion.path
            d="M 1250 490 C 1050 480, 980 460, 830 420"
            stroke="rgb(165, 192, 169)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.4, delay: 0.6, ease: "easeInOut" }}
            strokeDasharray="12, 8"
          />

          {/* Glowing Weaving Pulse Point (Top-Left Thread Pulse) */}
          <motion.circle
            r="5"
            fill="hsl(18, 45%, 48%)"
            filter="drop-shadow(0 0 6px rgba(180, 130, 95, 0.8))"
            initial={{ offset: 0 }}
            animate={{
              cx: [170, 350, 450, 620],
              cy: [230, 250, 300, 370],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Glowing Weaving Pulse Point (Bottom-Right Thread Pulse) */}
          <motion.circle
            r="6"
            fill="hsl(105, 22%, 58%)"
            filter="drop-shadow(0 0 6px rgba(105, 200, 120, 0.7))"
            initial={{ offset: 0 }}
            animate={{
              cx: [1250, 1050, 980, 830],
              cy: [490, 480, 460, 420],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </svg>
      </div>

      {/* Hero Content Layer */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
        
        {/* Left/Middle Column: Headings & Copywriting */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
          
          {/* Micro Ribbon Badge */}
          <motion.div
            {...fadeUp(0.1)}
            className="inline-flex self-center lg:self-start items-center gap-2 bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border border-brand-primary/15 shadow-sm"
          >
            <Sparkles size={14} className="animate-spin-slow" />
            <span>Tiêu chuẩn Tốt nghiệp Cao cấp ✦ 100% Khâu Tay</span>
          </motion.div>

          {/* Main Title/Headline with playfair cursive details */}
          <motion.h1
            {...fadeUp(0.25)}
            className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-brand-fb tracking-tight leading-[115%] mb-6"
          >
            Sản phẩm <span className="font-sans text-brand-primary relative inline-block">
              len thủ công
              <svg className="absolute left-0 bottom-0 w-full h-1 text-brand-primary/30" viewBox="0 0 300 10" fill="none">
                <path d="M5 5 C 100 1, 200 8, 295 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span> cho những khoảnh khắc <span className="font-serif italic font-normal text-brand-primary font-hand tracking-wide">ấm áp</span>
          </motion.h1>

          {/* Styled Subtitle */}
          <motion.p
            {...fadeUp(0.4)}
            className="font-sans text-brand-fb/70 text-sm sm:text-base md:text-md max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8"
          >
            Khám phá bộ sưu tập len handmade tinh tế, độc đáo và được tạo nên từ từng sợi len mềm mại, gửi gắm tâm tư tỉ mỉ qua từng đường dệt đan thêu tỉ mẩn.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            {...fadeUp(0.5)}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <button
              onClick={onExploreProducts}
              className="w-full sm:w-auto font-sans font-semibold text-xs uppercase tracking-wider bg-brand-primary hover:bg-brand-primary-light text-white px-7 py-4 rounded-full shadow-md hover:shadow-lg hover:shadow-brand-primary/25 cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <ShoppingBag size={15} />
              Khám phá bộ sưu tập
            </button>
            <button
              onClick={() => onNavigateToSection("products")}
              className="w-full sm:w-auto font-sans font-semibold text-xs uppercase tracking-wider bg-white/80 select-none text-brand-fb hover:bg-white border border-brand-primary/20 hover:border-brand-primary px-7 py-4 rounded-full cursor-pointer flex items-center justify-center gap-2 transition-all hover:shadow-sm"
            >
              Mua ngay
              <ArrowRight size={15} />
            </button>
          </motion.div>

          {/* Extra Mini-Highlights counters */}
          <motion.div
            {...fadeUp(0.65)}
            className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-brand-primary/10 max-w-md mx-auto lg:mx-0 text-brand-fb/80"
          >
            <div>
              <span className="block font-mono text-xl sm:text-2xl font-bold tracking-tight text-brand-primary leading-none">100%</span>
              <span className="text-[10px] sm:text-xs font-sans text-brand-fb/60">Khâu dệt bàn tay Việt</span>
            </div>
            <div>
              <span className="block font-mono text-xl sm:text-2xl font-bold tracking-tight text-brand-primary leading-none">5.0 ★</span>
              <span className="text-[10px] sm:text-xs font-sans text-brand-fb/60">Đánh giá thực tuyệt đối</span>
            </div>
            <div>
              <span className="block font-mono text-xl sm:text-2xl font-bold tracking-tight text-brand-primary leading-none">4.0+</span>
              <span className="text-[10px] sm:text-xs font-sans text-brand-fb/60">Biến thể mẫu tơ sợi</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Hero Visual Stack - Connecting yarn roll resources with central finalized crochet bag */}
        <div className="lg:col-span-5 relative flex items-center justify-center h-[500px] w-full" id="hero-illustrations-panel">
          
          {/* Subtle spinning background element representing spinning spindle */}
          <div className="absolute w-[380px] h-[380px] rounded-full border border-dashed border-brand-primary/10 animate-spin-slow pointer-events-none" />

          {/* Floating Object 1: Cream Yarn Roll (Top Left in panel) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute left-0 top-6 w-24 h-24 sm:w-28 sm:h-28 z-20 animate-float"
            title="Sợi len Cotton Kem chuẩn chất lượng dệt"
          >
            <div className="p-1 rounded-2xl bg-white shadow-md border border-brand-primary/10 relative group">
              <img
                src="/src/assets/images/yarn_roll_cream_1779458843846.png"
                alt="Yarn roll cream"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-2 -right-1 bg-brand-primary text-white text-[9px] px-2 py-0.5 rounded-full font-sans shadow-sm whitespace-nowrap">
                Bông Cúc Kem
              </span>
            </div>
          </motion.div>

          {/* Floating Object 2: Pink Yarn Roll (Middle Left / Bottom Left) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="absolute left-4 bottom-14 w-24 h-24 sm:w-28 sm:h-28 z-20 animate-float-slow"
            title="Len merino tơ nhạt siêu mịn màng"
          >
            <div className="p-1 rounded-2xl bg-white shadow-md border border-brand-primary/10 relative group">
              <img
                src="/src/assets/images/yarn_roll_pink_1779458868052.png"
                alt="Yarn roll pink"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-2 -right-1 bg-brand-primary text-white text-[9px] px-2 py-0.5 rounded-full font-sans shadow-sm whitespace-nowrap">
                Merino Hồng Đào
              </span>
            </div>
          </motion.div>

          {/* Floating Object 3: Sage Green Yarn Roll (Middle Right in panel) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="absolute right-0 top-1/2 -translate-y-12 w-24 h-24 sm:w-28 sm:h-28 z-20 animate-float"
            title="Len Milk Cotton Sage dịu mát lành"
          >
            <div className="p-1 rounded-2xl bg-white shadow-md border border-brand-primary/10 relative group">
              <img
                src="/src/assets/images/yarn_roll_sage_1779458887275.png"
                alt="Yarn roll sage"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-2 -right-1 bg-brand-primary text-white text-[9px] px-2 py-0.5 rounded-full font-sans shadow-sm whitespace-nowrap">
                Milk Sage Green
              </span>
            </div>
          </motion.div>

          {/* MAJOR Showcase: Central Finished Handcrafted Bag (Inspired by Image 4) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.2 }}
            className="w-56 h-56 sm:w-68 sm:h-68 z-30 relative"
          >
            {/* Spinning decorative ring with flower petals style */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-secondary/30 to-brand-primary/15 rounded-full blur-2xl animate-pulse" />
            
            {/* Elegant glass card frame hold the main hero product */}
            <div className="w-full h-full p-2.5 rounded-[36px] bg-white shadow-xl border border-brand-border flex items-center justify-center relative overflow-hidden group">
              <img
                src="/src/assets/images/crochet_bag_1779458906901.png"
                alt="Signature Handmade Bag"
                className="w-full h-full object-cover rounded-[28px] group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlapping small info badge on hero product */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 soft-glass px-4 py-2 font-serif text-center font-bold text-xs text-brand-fb border border-brand-primary/20 shadow-md whitespace-nowrap flex items-center gap-1.5 z-40">
                <Flower className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
                <span>Mẫu Tế Bản Sợi Hồng Pastel Hoa Nổi</span>
              </div>
            </div>
          </motion.div>

          {/* Decorative floating balls of yarn threads */}
          <div className="absolute right-12 bottom-6 w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-[8px] animate-bounce pointer-events-none select-none text-brand-fb font-bold">
            🧶
          </div>
          <div className="absolute left-1/3 top-2 w-6 h-6 rounded-full bg-brand-muted flex items-center justify-center text-[6px] animate-pulse pointer-events-none select-none text-brand-fb font-bold">
            🌸
          </div>
        </div>

      </div>
    </section>
  );
}
