import { useState, useCallback, type ChangeEvent } from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";

// ──────────────── Data ────────────────
interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  initials: string;
  bgColor: string;
  text: string;
  /** Card 0 is the "peek" card — partially obscured, shows a garment edge */
  isPeek?: boolean;
  garmentImage?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "peek",
    name: "",
    role: "",
    avatar: "",
    initials: "",
    bgColor: "#412C20",
    text: "",
    isPeek: true,
    garmentImage:
      "https://images.unsplash.com/photo-1602810316693-3667c854239a?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "t1",
    name: "Nguyễn Khánh Linh",
    role: "Sinh viên trường ĐH Mỹ Thuật",
    initials: "NL",
    bgColor: "#D9A7A7",
    text: "Mình mua một chiếc áo len tặng mẹ nhân dịp tốt nghiệp. Chất len siêu mềm, màu sắc chuẩn như hình. Mẹ mình mặc lên khen suốt vì kiểu dáng trẻ trung mà vẫn thanh lịch. Shop tư vấn rất nhiệt tình và giao hàng nhanh nữa.",
  },
  {
    id: "t2",
    name: "Lê Minh Thảo",
    role: "Khách mua quà tốt nghiệp",
    initials: "MT",
    bgColor: "#A8B59A",
    text: "Mình đặt quà tốt nghiệp cho đứa em thân — một bộ túi len và móc khóa handmade. Nhận được hàng mà cảm động luôn vì được gói quà siêu xinh, có cả hoa len nhỏ kèm theo. Em mình thích mê, nói đây là món quà ý nghĩa nhất nhận được.",
  },
  {
    id: "t3",
    name: "Phan Anh Thư",
    role: "Fashion Blogger",
    initials: "AT",
    bgColor: "#CEAF75",
    text: "Là một fashion blogger, mình khá khó tính trong việc chọn phụ kiện. Nhưng các sản phẩm len ở đây thực sự làm mình bất ngờ — từ chất liệu cao cấp đến đường kim mũi chỉ tỉ mỉ. Đặc biệt là các mẫu túi len boho rất ăn ảnh và phối đồ cực xinh.",
  },
];

// ──────────────── Helpers ────────────────
function StarRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className="fill-gold text-gold drop-shadow-[0_1px_2px_rgba(206,175,117,0.15)]"
        />
      ))}
    </div>
  );
}

function AvatarCircle({
  initials,
  bgColor,
  size = "md",
}: {
  initials: string;
  bgColor: string;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const fontSize = size === "lg" ? "text-sm" : "text-xs";

  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-sans font-bold text-white shrink-0 shadow-sm`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
}

// ──────────────── Component ────────────────
export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringSlider, setIsHoveringSlider] = useState(false);

  // Map slider value to active card (0–3)
  const handleSliderChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setActiveIndex(Number(e.target.value));
    },
    []
  );

  // Card layout configuration
  const CARD_W = 286;
  const OVERLAP = 100; // how much each card covers the one to its left
  const GAP = CARD_W - OVERLAP; // visual gap between card left edges
  const DECK_W = CARD_W + (TESTIMONIALS.length - 1) * GAP; // total deck width

  // Center the deck so card `activeIndex` is prominent.
  // Deck starts at `left: 50%` so card i's center = 50% + deckX + i*GAP + CARD_W/2.
  // We want this = 50% of container  →  deckX = -(i*GAP + CARD_W/2)
  const offsetToCenter = -(activeIndex * GAP + CARD_W / 2);

  return (
    <section className="py-20 md:py-28 bg-ivory overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
        {/* ── Header ── */}
        <div className="text-center mb-14 md:mb-18">
          <p className="font-label-italic text-base md:text-lg text-gold mb-2 tracking-wide">
            ✦ Cảm nhận chân thật ✦
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[42px] text-cocoa mb-3 font-black leading-tight">
            Khách Hàng Nói Gì
          </h2>
          <div className="w-12 h-0.5 bg-gold/60 mx-auto mb-4 rounded-full" />
          <p className="text-body-text text-base md:text-lg font-label-italic max-w-xl mx-auto">
            Những cảm nhận từ các nàng thơ đã ghé thăm
          </p>
        </div>

        {/* ── Card deck ── */}
        <div
          className="relative mx-auto select-none"
          style={{ maxWidth: DECK_W + 80, height: 380 }}
        >
          <motion.div
            className="absolute flex items-start"
            animate={{ x: offsetToCenter, transition: { type: "spring", stiffness: 260, damping: 32 } }}
            style={{ left: "50%", top: 0 }}
          >
            {TESTIMONIALS.map((t, i) => {
              const dist = Math.abs(i - activeIndex);
              const isActive = i === activeIndex;

              return (
                <motion.div
                  key={t.id}
                  layout
                  animate={{
                    x: i * GAP,
                    scale: isActive ? 1 : dist === 1 ? 0.92 : 0.86,
                    zIndex: 20 - dist * 5,
                    opacity: t.isPeek && i < activeIndex ? 0.65 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.9 }}
                  style={{ width: CARD_W }}
                  className="absolute top-0 shrink-0 overflow-hidden"
                >
                  <div
                    className={`
                      rounded-3xl border border-divider-beige/40
                      ${isActive ? "shadow-soft-deep" : "shadow-sm"}
                      transition-shadow duration-500
                      bg-cream overflow-hidden
                    `}
                  >
                    {t.isPeek ? (
                      /* ── Peek card — dark garment image ── */
                      <div className="relative h-full min-h-[340px] overflow-hidden">
                        <img
                          src={t.garmentImage}
                          alt=""
                          draggable={false}
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-cocoa/10 to-cocoa/40" />
                      </div>
                    ) : (
                      /* ── Full testimonial card ── */
                      <div
                        className="p-6 md:p-7 flex flex-col"
                        style={{ minHeight: 340 }}
                      >
                        {/* Stars */}
                        <StarRow className="mb-4" />

                        {/* Text */}
                        <p className="text-body-text text-sm md:text-[15px] leading-[1.7] flex-grow font-sans">
                          &ldquo;{t.text}&rdquo;
                        </p>

                        {/* Footer: avatar + info */}
                        <div className="flex items-center gap-3 pt-5 mt-auto border-t border-divider-beige/30">
                          {t.avatar ? (
                            <img
                              src={t.avatar}
                              alt={t.name}
                              draggable={false}
                              className="w-10 h-10 rounded-full object-cover border border-divider-beige pointer-events-none select-none shrink-0"
                            />
                          ) : (
                            <AvatarCircle initials={t.initials} bgColor={t.bgColor} />
                          )}
                          <div className="text-left min-w-0">
                            <h4 className="text-sm font-sans font-bold text-cocoa truncate">
                              {t.name}
                            </h4>
                            <span className="text-xs text-body-text font-sans truncate block leading-snug">
                              {t.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Slider control ── */}
        <div className="max-w-lg mx-auto mt-10 md:mt-14">
          {/* Subtle horizontal line above the track */}
          <div className="w-full h-px bg-divider-beige/60 mb-6 rounded-full" />

          <div className="relative flex items-center gap-4">
            {/* Slider label (left) */}
            <span className="text-[11px] text-body-text/50 font-sans tracking-wider uppercase whitespace-nowrap hidden sm:block">
              Xem thêm
            </span>

            {/* Custom range slider */}
            <div
              className="relative flex-1"
              onMouseEnter={() => setIsHoveringSlider(true)}
              onMouseLeave={() => setIsHoveringSlider(false)}
            >
              <input
                type="range"
                min={0}
                max={TESTIMONIALS.length - 1}
                step={1}
                value={activeIndex}
                onChange={handleSliderChange}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                className="
                  relative z-10 w-full h-full appearance-none bg-transparent
                  [&::-webkit-slider-runnable-track]:h-2.5
                  [&::-webkit-slider-runnable-track]:rounded-full
                  [&::-webkit-slider-runnable-track]:bg-divider-beige/60
                  [&::-webkit-slider-runnable-track]:border-0
                  [&::-webkit-slider-runnable-track]:transition-colors
                  [&::-webkit-slider-runnable-track]:duration-300
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-9
                  [&::-webkit-slider-thumb]:h-[18px]
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-cocoa
                  [&::-webkit-slider-thumb]:cursor-grab
                  [&::-webkit-slider-thumb]:active:cursor-grabbing
                  [&::-webkit-slider-thumb]:translate-y-[-1px]
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:transition-shadow
                  [&::-webkit-slider-thumb]:duration-300
                  [&::-moz-range-track]:h-2.5
                  [&::-moz-range-track]:rounded-full
                  [&::-moz-range-track]:bg-divider-beige/60
                  [&::-moz-range-track]:border-0
                  [&::-moz-range-track]:transition-colors
                  [&::-moz-range-track]:duration-300
                  [&::-moz-range-thumb]:w-9
                  [&::-moz-range-thumb]:h-[18px]
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-cocoa
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-grab
                  [&::-moz-range-thumb]:shadow-md
                  [&::-moz-range-thumb]:transition-shadow
                  [&::-moz-range-thumb]:duration-300
                  cursor-pointer
                "
                style={{ height: 24 }}
              />

              {/* Halo/glow behind the thumb — subtle at rest, visible on hover/drag */}
              <div
                className={`
                  absolute top-1/2 -translate-y-1/2 w-[68px] h-[68px] rounded-full pointer-events-none
                  transition-all duration-400 ease-out
                  ${isDragging || isHoveringSlider ? "opacity-100 scale-100" : "opacity-0 scale-50"}
                `}
                style={{
                  left: `${(activeIndex / (TESTIMONIALS.length - 1)) * 100}%`,
                  marginLeft: "-34px",
                  background:
                    isDragging
                      ? "radial-gradient(circle, rgba(206,175,117,0.50) 0%, rgba(206,175,117,0.12) 55%, transparent 75%)"
                      : "radial-gradient(circle, rgba(206,175,117,0.30) 0%, rgba(206,175,117,0.08) 50%, transparent 70%)",
                  filter: "blur(5px)",
                }}
              />
            </div>

            {/* Slider label (right) */}
            <span className="text-[11px] text-body-text/50 font-sans tracking-wider uppercase whitespace-nowrap hidden sm:block">
              {activeIndex + 1}/{TESTIMONIALS.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
