import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { CATEGORIES } from "../data";
import { Category } from "../types";

interface CategoriesProps {
  onSelectCategory: (categoryName: string) => void;
}

export default function Categories({ onSelectCategory }: CategoriesProps) {
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, delay, ease: "easeOut" },
  });

  return (
    <section id="categories" className="py-20 bg-[#FFFDF9] px-4 relative overflow-hidden">
      {/* Decorative floral outline svg on backgrounds */}
      <div className="absolute right-0 top-0 w-80 h-80 opacity-5 pointer-events-none text-brand-primary">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current stroke-1">
          <path d="M50,10 C50,50 10,50 10,50 C10,50 50,50 50,90 C50,50 90,50 90,50 C90,50 50,50 50,10 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto" id="categories-wrapper">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            {...fadeUp(0.1)}
            className="text-xs font-semibold uppercase tracking-widest text-brand-primary block mb-2"
          >
            Chân Dung Nghệ Thuật Sợi
          </motion.span>
          <motion.h2
            {...fadeUp(0.2)}
            className="font-serif font-bold text-3xl sm:text-4xl text-brand-fb mb-5"
          >
            Phân Loại Sản Phẩm Nổi Bật
          </motion.h2>
          <p className="font-sans text-brand-fb/70 text-sm md:text-md">
            Lựa chọn từ các dòng sản phẩm len handmade dệt tỉ mỉ của Tiệm Len Nhỏ để tìm ra mảnh ghép tâm hồn hoàn mỹ của riêng bạn.
          </p>
        </div>

        {/* Dynamic Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.id}
              {...fadeUp(0.15 + (index % 3) * 0.1)}
              whileHover={{ y: -6 }}
              className="group bg-brand-card rounded-[32px] border border-brand-primary/10 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300 flex flex-col h-full"
            >
              {/* Product Category Thumbnail with hover zoom */}
              <div className="relative h-56 sm:h-64 overflow-hidden bg-brand-bg">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-fb/50 via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />
                
                {/* Micro Category Tag */}
                <div className="absolute top-4 left-4 bg-white/90 select-none backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-brand-primary/10 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                  <span className="font-sans text-[10px] uppercase tracking-wider font-semibold text-brand-fb">Khuyên chọn</span>
                </div>
              </div>

              {/* Category info */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-serif font-bold text-md text-brand-fb mb-3 group-hover:text-brand-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="font-sans text-xs text-brand-fb/70 leading-relaxed mb-6 flex-grow">
                  {cat.description}
                </p>
                
                <button
                  onClick={() => onSelectCategory(cat.name)}
                  className="inline-flex items-center gap-1.5 font-sans font-semibold text-xs tracking-wider text-brand-primary group-hover:text-brand-primary-light transition-colors relative self-start cursor-pointer"
                >
                  <span>Xem sản phẩm</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
