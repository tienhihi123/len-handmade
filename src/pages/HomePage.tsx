import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight, ShoppingBag, Heart,
  ChevronRight,
  Package, Award, Leaf
} from "lucide-react";
import { useApp } from "../context/AppContext";
import BrandStory from "../components/BrandStory";
import Testimonials from "../components/Testimonials";
import { usePageSeo } from "../hooks/usePageSeo";
import ImageCoGai from "../assets/images/imagecogai.png";
import ImageGocPhong from "../assets/images/TừMộtGócPhòngNhỏ.png";
import { BRAND_NAME } from "../constants/brand";

// ──────────────── Scroll reveal hook ────────────────
function useScrollReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ──────────────── Static assets ────────────────
const YARN_PINK =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBnf0vzTZlpGlzn4TRHJ5PkuF1HuIa5dj42cQbZ0F7l0LPneC9r_iPw4BR5MQhE9NxEZmLT47J_HamB1qHBPm2Znv9V2lghRLKJQZxbbI0sUiO_EadbOU7ajq01F54eknD1NCHq62NiQBtxOrguO8dxj8buFX3vfh5mKaZe6u5QHuYaNsJOfYM9Isdv-oHBjFTM4U-kL3RtsKxepVNRdbTiqqZREFXQQn4ZfzjIR2wwEHYWa3Tdp2c7yLNVfzLnbtI9b8op_hnwzT4";
const YARN_CREAM =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBnf0vzTZlpGlzn4TRHJ5PkuF1HuIa5dj42cQbZ0F7l0LPneC9r_iPw4BR5MQhE9NxEZmLT47J_HamB1qHBPm2Znv9V2lghRLKJQZxbbI0sUiO_EadbOU7ajq01F54eknD1NCHq62NiQBtxOrguO8dxj8buFX3vfh5mKaZe6u5QHuYaNsJOfYM9Isdv-oHBjFTM4U-kL3RtsKxepVNRdbTiqqZREFXQQn4ZfzjIR2wwEHYWa3Tdp2c7yLNVfzLnbtI9b8op_hnwzT4";
const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDkm3ojKbdvTIPYhKtG761BlP9_8uGjZbZiljoHqW2jTN0ewuuTd06B7Zh7hQhkB0Ccgj8xhJ95BGf9gLY9Z9r8zUGE6b6X9AvvEX-K5NAvMpytLNcZHC7bvljwzuxUa5kHVZYjstPgygQSoJHokUxKK03yMf0rLfmjk9WEtxJpWmy_s_WLcuyhztrRtcmA_RwL3fr2Xp_irI3uhFjEVnSMEb6mc0wsCxMn0ZcXZ_t9637zORx3oJZve_cSEnUeO_HOAun1XkvxSHA";
const TEXTURE_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBxqS01Wu-7Dr8xSE_a5HRivr0ieFzGxkdPPJ0dkeo1WpUYCcoFfRSGHYnw12I9O7PownXSbl98WijFmVt37m3DAPXC1_tAlezBiMMzoBgFYxJEXiLlFzGtThLSDxo2IUT1bqEG6Pu08GxkJXeRf84j6nfF5UToJ7rpasyO9RM1y8qi9IkWgnjohKL14hfQ2Vx4m0HQG2cUUn1BiDw7FJbchdIwhIHaZBFqLqU7_lfwzX_yAgp4ViV1m_lpaZtuGZzP-mjOOM88_aE";
const STORY_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCU3vVTAM3dgaaLYCDG2tqZFKGNjzOa2UYk6VN9KuzbGmI_RRSfxzrZkjuY8ZAKVLjLw-MMAvRTuPsiRfTSrhUtc0FWw1ytz_gPjC_QzaMT9Z1DUul1G263x5KBTt_c7Qs_x08mOq2avSTvKczMhXlmPkFdxoD9wRD9tRHltLarBfOjgGG1ptgJiXXD-qAd80yo3AuarOfVRRX0ABD-_fx1lgcDyByP4nl5nltmDdjA3ALRdQAYYz-JGtX-IWuKUlBJKGPd3ZmiaJ4";

const CATEGORY_ITEMS = [
  { title: "Túi Len Handmade", img: HERO_IMAGE, category: "Túi len handmade" },
  { title: "Hoa Len", img: YARN_PINK, category: "Hoa len" },
  { title: "Thú Bông", img: YARN_CREAM, category: "Thú bông / Amigurumi" },
  { title: "Phụ Kiện", img: STORY_IMG, category: "Phụ kiện len" },
];

const BENEFITS = [
  { icon: Heart, label: "100% Thủ Công" },
  { icon: Leaf, label: "Chất Liệu Cao Cấp" },
  { icon: Award, label: "Tỉ Mỉ Từng Mũi Đan" },
  { icon: Package, label: "Giao Hàng Tận Tâm" },
];




export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reviewsList } = useApp();

  // Scroll to collections
  useEffect(() => {
    if (location.state?.scrollToCollections) {
      setTimeout(() => {
        document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  usePageSeo(
    `${BRAND_NAME} | Áo Len, Túi Len, Móc Khóa Và Phụ Kiện Handmade Cao Cấp`,
    "Khám phá áo len bướm, túi len đi biển, bóp len mini, móc khóa và phụ kiện len handmade được làm thủ công tỉ mỉ theo sở thích của bạn."
  );

  return (
    <div className="bg-background text-cocoa font-sans antialiased min-h-screen selection:bg-gold selection:text-white">

      {/* ═══════════ 1. HERO SECTION ═══════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-ivory pt-24 sm:pt-28">
        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: `url(${TEXTURE_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />

        {/* Hero grid */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 w-full relative z-10 grid grid-cols-1 md:grid-cols-[55%_45%] gap-8 lg:gap-14 items-center py-12 md:py-0">
          {/* Left: text */}
          <div className="text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="font-label-italic text-base md:text-lg text-gold mb-3 md:mb-5 tracking-wide drop-shadow-[0_2px_8px_rgba(250,246,240,0.9)]"
            >
              Artisan Crochet Studio
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
              className="font-serif font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cocoa mb-5 md:mb-7 leading-[1.15]"
            >
              Dệt Trọn Yêu Thương
              <br />
              <span className="font-serif italic font-normal text-secondary text-[0.85em]">
                Trong Từng Sợi Len
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base md:text-lg text-body-text max-w-md mx-auto md:mx-0 mb-8 md:mb-10 leading-relaxed"
            >
              Khám phá những tác phẩm thủ công tỉ mỉ, mang đậm dấu ấn cá nhân
              và tình yêu nghệ thuật đan móc.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
            >
              <button
                onClick={() => navigate("/products")}
                className="group bg-gold text-white font-sans tracking-widest uppercase px-8 py-4 rounded-full border-2 border-gold hover:bg-transparent hover:text-cocoa transition-all duration-500 shadow-md hover:shadow-xl flex items-center gap-3 text-sm font-bold"
              >
                <ShoppingBag size={16} />
                <span>Khám Phá Bộ Sưu Tập</span>
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="text-sm tracking-widest uppercase text-cocoa/70 hover:text-cocoa transition-colors flex items-center gap-1.5 border-b border-cocoa/20 hover:border-cocoa pb-0.5 font-sans font-medium"
              >
                Liên Hệ <ChevronRight size={14} />
              </button>
            </motion.div>
          </div>

          {/* Right: hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-3xl overflow-hidden shadow-soft-deep border-[6px] border-white/60">
              <img src={HERO_IMAGE} alt="Túi Len Handmade" className="w-full h-full object-cover" />
              <div className="absolute inset-3 border border-divider-beige/40 rounded-2xl pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-cocoa/40 text-[10px] tracking-[0.2em] uppercase font-sans flex flex-col items-center gap-1.5"
        >
          <span>Khám phá</span>
          <span className="w-px h-6 bg-cocoa/20" />
        </motion.div>
      </section>

      {/* ═══════════ 2. BENEFITS STRIP ═══════════ */}
      <section className="bg-divider-beige/30 py-6 md:py-8 border-y border-divider-beige">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 lg:gap-16">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="contents">
                  <FadeUp delay={i * 0.08} className="flex items-center gap-2.5">
                    <Icon size={22} className="text-gold shrink-0" />
                    <span className="text-sm md:text-base text-cocoa" style={{ fontFamily: "'EB Garamond', serif" }}>
                      {b.label}
                    </span>
                  </FadeUp>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ 3. CATEGORIES – BENTO GRID ═══════════ */}
      <section className="py-16 md:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16" id="collections">
        <FadeUp className="text-center mb-12 md:mb-16">
          <p className="text-base md:text-lg text-gold mb-2" style={{ fontFamily: "'EB Garamond', serif" }}>
            ✦ Vân Sợi Thơ Thêu ✦
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-cocoa mb-3 font-black">
            Danh Mục Nổi Bật
          </h2>
          <div className="w-14 h-px bg-gold mx-auto" />
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CATEGORY_ITEMS.map((cat, idx) => (
            <motion.a
              key={idx}
              onClick={() =>
                cat.category
                  ? navigate("/products", { state: { initialCategory: cat.category } })
                  : navigate("/products")
              }
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative aspect-square rounded-3xl overflow-hidden bg-cream shadow-sm hover:shadow-soft-deep transition-all duration-500 cursor-pointer col-span-1"
            >
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-cocoa/15 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                <h3 className="font-serif text-lg md:text-xl text-white mb-1 font-bold">{cat.title}</h3>
                <p className="text-sm text-white/70 group-hover:text-gold transition-colors" style={{ fontFamily: "'EB Garamond', serif" }}>
                  Khám phá →
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ═══════════ 4. BRAND STORY ═══════════ */}
      <section className="py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left: image */}
            <FadeUp className="lg:col-span-6 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[500px] aspect-square transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={ImageGocPhong}
                  alt={`Từ Một Góc Phòng Nhỏ - ${BRAND_NAME}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </FadeUp>

            {/* Right: content */}
            <FadeUp delay={0.15} className="md:col-span-6 lg:pl-8">
              <p className="text-gold text-lg mb-3 font-label-italic">
                Câu Chuyện Của Sợi Chỉ Nhỏ
              </p>
              <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl text-cocoa mb-5 leading-tight font-black">
                Từ Một Góc Phòng Nhỏ
              </h2>
              <p className="text-body-text mb-8 leading-relaxed text-base md:text-lg">
                Bắt đầu từ một góc phòng nhỏ với cuộn len và cây kim móc, Len
                Handmade ra đời từ niềm đam mê tạo ra những món đồ mang hơi ấm
                của đôi bàn tay. Chúng tôi tin rằng, mỗi mũi đan không chỉ tạo
                nên hình hài sản phẩm, mà còn gửi gắm những câu chuyện, những
                hy vọng và sự bình yên.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm">
                <div className="bg-cream p-5 rounded-2xl shadow-sm border border-divider-beige/30 text-center">
                  <span className="block text-3xl text-gold mb-1 font-bold">5+</span>
                  <span className="text-sm text-cocoa font-label-italic">Năm Kinh Nghiệm</span>
                </div>
                <div className="bg-cream p-5 rounded-2xl shadow-sm border border-divider-beige/30 text-center">
                  <span className="block text-3xl text-gold mb-1 font-bold">100%</span>
                  <span className="text-sm text-cocoa font-label-italic">Sợi Tự Nhiên</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/about"
                  className="inline-flex items-center text-sm font-medium text-body-text hover:text-cocoa transition-colors group"
                >
                  ĐỌC THÊM VỀ CHÚNG TÔI
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">➔</span>
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══════════ 5. VIDEO / SUMMER REEL ═══════════ */}
      <section className="bg-cream px-4 sm:px-6 lg:px-16 py-16 md:py-20 border-y border-divider-beige">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <FadeUp className="space-y-5 text-left">
            <p className="text-gold text-base tracking-wide font-label-italic">
              ✦ Summer crochet diary ✦
            </p>
            <h2 className="font-sans text-3xl text-cocoa font-black">Góc Đi Biển Mùa Hè</h2>
            <p className="text-body-text leading-relaxed">
              Một chiếc đầm lưới nhẹ nhàng cho mùa hè, vừa nổi bật khi đi biển
              vừa giữ được nét mềm mại của đồ handmade.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigate("/products", { state: { initialCategory: "Áo len thủ công" } })}
                className="bg-gold text-white font-sans text-xs tracking-widest uppercase px-6 py-3.5 rounded-full hover:bg-cocoa transition-colors font-bold"
              >
                Xem bộ sưu tập
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="border border-gold/40 text-cocoa font-sans text-xs tracking-widest uppercase px-6 py-3.5 rounded-full hover:bg-ivory transition-colors font-bold"
              >
                Đặt mẫu theo màu
              </button>
            </div>
          </FadeUp>
          <FadeUp delay={0.15} className="flex justify-center lg:justify-end pr-16 pb-16 pt-4">
            {/* LỚP 1: Shadow đổ + shadow đè viền (bo tròn để shadow kem theo cong), KHÔNG overflow-hidden */}
            <div className="relative w-full max-w-[400px] aspect-[3/4] bg-transparent rounded-2xl shadow-[15px_15px_30px_rgba(43,34,27,0.18),_40px_40px_70px_rgba(43,34,27,0.14),0_0_0_3px_#F6F3EE] transition-transform duration-500 hover:scale-[1.015]">
              {/* LỚP 2: Bo góc + xén viền trắng */}
              <div className="w-full h-full rounded-2xl overflow-hidden bg-transparent">
                {/* LỚP 3: Ảnh phóng 4% đẩy viền trắng ra ngoài */}
                <img
                  src={ImageCoGai}
                  alt="Góc Đi Biển Mùa Hè Art Layout"
                  className="w-full h-full object-cover scale-[1.04] origin-center"
                />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════ 6. TESTIMONIALS — overlapping cards with slider ═══════════ */}
      <Testimonials />

      {/* ═══════════ 8. BRAND STORY COMPONENT ═══════════ */}
      <BrandStory />

      {/* ═══════════ 8. FINAL CTA ═══════════ */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden pt-24 pb-0">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${TEXTURE_BG})` }} />
        <div className="absolute inset-0 z-10 bg-brand-ink/85" />

        <FadeUp className="relative z-20 mx-auto max-w-2xl px-4 text-center">
          <p className="mb-4 text-xl text-gold" style={{ fontFamily: "'EB Garamond', serif" }}>
            Bắt đầu câu chuyện của bạn
          </p>
          <h2 className="font-serif text-3xl font-black leading-tight text-ivory md:text-4xl lg:text-[44px] mb-10">
            Tìm Kiếm Món Quà Ý Nghĩa<br />Từ Đôi Bàn Tay
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="group relative border border-gold px-8 py-3 text-gold transition-all duration-300 hover:bg-gold hover:text-white"
          >
            MUA SẮM NGAY
          </button>
        </FadeUp>
      </section>

    </div>
  );
}
