import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, animate } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Heart, Scissors, Leaf, Sparkles, Quote, ChevronRight, ArrowDown } from "lucide-react";
import SafeImage from "../components/SafeImage";
import { usePageSeo } from "../hooks/usePageSeo";
import { BRAND_NAME } from "../constants/brand";
import ImageAnhTiemLenNho from "../assets/images/anhtiemlennho.png";
import ImageGocLenNho from "../assets/images/goclenho.png";

const values = [
  {
    icon: Scissors,
    title: "Thủ công trọn vẹn",
    desc: "Mỗi mũi đan, mũi móc đều qua tay nghệ nhân — không dây chuyền, không hàng loạt.",
  },
  {
    icon: Heart,
    title: "Chọn sợi bằng cả tấm lòng",
    desc: "Chỉ chọn len tự nhiên, mềm, bền màu — để món quà giữ được hơi ấm lâu dài.",
  },
  {
    icon: Leaf,
    title: "Bền vững & gần gũi",
    desc: "Ưu tiên nguồn sợi thân thiện môi trường, hạn chế dư thừa trong từng công đoạn.",
  },
  {
    icon: Sparkles,
    title: "Tinh tế trong từng chi tiết",
    desc: "Từ hoạ tiết đến cách đóng gói, mỗi sản phẩm đều mang dấu ấn riêng của Tiệm.",
  },
];

const steps = [
  { n: "01", title: "Chọn sợi", desc: "Tuyển chọn len tự nhiên chất lượng cao từ các nguồn uy tín." },
  { n: "02", title: "Lên form dáng", desc: "Phác thảo và tính toán kích thước phù hợp với từng thiết kế." },
  { n: "03", title: "Đan móc thủ công", desc: "Nghệ nhân thực hiện từng mũi đan tỉ mỉ, không rập khuôn." },
  { n: "04", title: "Kiểm định & đóng gói", desc: "Kiểm tra chất lượng kỹ lưỡng trước khi đến tay khách hàng." },
];

const highlights = [
  { label: "Năm gắn bó với nghề", value: 8, suffix: "+" },
  { label: "Sản phẩm thủ công đã trao tay", value: 3200, suffix: "+" },
  { label: "Nghệ nhân đồng hành", value: 12, suffix: "" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, motionValue]);

  return (
    <div ref={ref} className="font-serif font-bold text-4xl text-brand-primary tabular-nums">
      {display.toLocaleString("vi-VN")}
      {suffix}
    </div>
  );
}

export default function AboutPage() {
  const navigate = useNavigate();
  usePageSeo(
    `Giới thiệu — ${BRAND_NAME}`,
    "Câu chuyện thương hiệu, giá trị cốt lõi và quy trình thủ công của Tiệm Len Nhỏ."
  );

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const processRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: processProgress } = useScroll({
    target: processRef,
    offset: ["start 80%", "end 60%"],
  });
  const lineScale = useTransform(processProgress, [0, 1], [0, 1]);

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 md:px-16 text-left overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-y-24 relative">

        {/* Ambient floating decorations — purely animated, purpose is visual warmth */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-10 left-[8%] w-24 h-24 rounded-full bg-brand-primary/10 blur-2xl"
          animate={{ y: [0, -24, 0], x: [0, 12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-[30%] right-[4%] w-40 h-40 rounded-full bg-dusty-pink/15 blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, -16, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Hero — grid 12 cột, parallax scroll */}
        <section ref={heroRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
          <motion.div
            style={{ y: heroTextY, opacity: heroOpacity }}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 flex flex-col gap-6 lg:pr-8"
          >
            <motion.span
              variants={fadeUp}
              className="font-label-italic italic text-dusty-pink text-lg"
            >
              Câu Chuyện &amp; Tâm Huyết
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="font-serif font-bold text-4xl sm:text-5xl text-cocoa leading-[1.1]"
            >
              Về {BRAND_NAME}
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans text-lg text-body-text leading-relaxed">
              Nơi mỗi cuộn len được chọn lựa bằng cả tấm lòng, và mỗi sản phẩm
              là một câu chuyện ấm áp được kể bằng đôi tay nghệ nhân.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-2">
              <motion.button
                whileHover={{ y: -4, scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/products")}
                className="inline-flex items-center gap-2 bg-brand-primary text-white px-7 py-3.5 rounded-full font-sans font-semibold shadow-sm hover:shadow-lg transition-shadow"
              >
                <Sparkles size={16} />
                Khám phá sản phẩm
              </motion.button>
              <motion.button
                whileHover={{ y: -4, scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/blog")}
                className="inline-flex items-center gap-2 border border-dusty-pink/50 bg-white/60 text-cocoa px-7 py-3.5 rounded-full font-sans font-semibold hover:bg-dusty-pink/10 transition-colors"
              >
                <Heart size={15} className="text-dusty-pink" />
                Đọc câu chuyện
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: heroImgY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-7 h-80 sm:h-[420px] lg:h-[600px] rounded-[24px] overflow-hidden relative"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <SafeImage
                src={ImageAnhTiemLenNho}
                alt={`Bộ sưu tập thú len móc thủ công của ${BRAND_NAME}`}
                className="block w-full h-full object-cover object-center"
              />
            </motion.div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="hidden lg:flex absolute bottom-[-48px] left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-cocoa/40"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-sans text-[10px] uppercase tracking-widest">Cuộn xuống</span>
            <ArrowDown size={16} />
          </motion.div>
        </section>

        {/* Featured story — card ngang 55/45, ảnh có hiệu ứng zoom nhẹ khi vào view */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-cream rounded-[24px] overflow-hidden flex flex-col lg:flex-row lg:h-[480px] shadow-[0_10px_30px_rgba(65,44,32,0.05)] group"
        >
          <div className="w-full lg:w-[55%] h-64 lg:h-full overflow-hidden">
            <motion.div
              className="w-full h-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <SafeImage
                src={ImageGocLenNho}
                alt="Góc làm việc thủ công của Tiệm Len Nhỏ"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
          <div className="w-full lg:w-[45%] p-8 sm:p-12 flex flex-col justify-center gap-6">
            <span className="font-label-italic italic text-dusty-pink text-lg">
              Khởi Nguồn
            </span>
            <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-cocoa">
              Bắt đầu từ một góc nhỏ, đan bằng cả tấm lòng
            </h2>
            <p className="font-sans text-body-text leading-relaxed">
              {BRAND_NAME} ra đời từ tình yêu với những cuộn len và mong muốn giữ lại
              nét thủ công đang dần mai một. Mỗi sản phẩm là một câu chuyện — từ việc
              chọn sợi, phối màu, đến từng mũi đan tỉ mỉ được thực hiện hoàn toàn bằng tay.
            </p>
            <motion.button
              whileHover={{ x: 4 }}
              onClick={() => navigate("/blog")}
              className="font-sans font-medium border-b border-cocoa w-fit pb-1 text-cocoa hover:text-brand-primary transition-colors"
            >
              Đọc tiếp câu chuyện
            </motion.button>
          </div>
        </motion.section>

        {/* Con số nổi bật — đếm số khi cuộn tới */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-divider-beige py-10"
        >
          {highlights.map((h) => (
            <div key={h.label} className="text-center sm:text-left">
              <CountUp value={h.value} suffix={h.suffix} />
              <div className="font-sans text-sm text-body-text mt-1">{h.label}</div>
            </div>
          ))}
        </motion.section>

        {/* Giá trị cốt lõi — stagger reveal + hover tilt */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-left"
          >
            <span className="font-label-italic italic text-dusty-pink text-lg block mb-2">
              Giá Trị Cốt Lõi
            </span>
            <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-cocoa">
              Điều làm nên {BRAND_NAME}
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                whileHover={{ y: -8, rotate: -1, scale: 1.02 }}
                className="bg-cream rounded-xl border border-divider-beige shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col gap-3 text-left"
              >
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center"
                >
                  <v.icon size={18} className="text-brand-primary" />
                </motion.div>
                <h3 className="font-serif font-semibold text-base text-cocoa">{v.title}</h3>
                <p className="font-sans text-sm text-body-text leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Quy trình thủ công — đường nối animate khi cuộn tới */}
        <section ref={processRef}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-left"
          >
            <span className="font-label-italic italic text-dusty-pink text-lg block mb-2">
              Quy Trình
            </span>
            <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-cocoa">
              Từ cuộn len đến sản phẩm hoàn thiện
            </h2>
          </motion.div>

          <div className="relative">
            <motion.div
              style={{ scaleX: lineScale }}
              className="hidden lg:block absolute top-[26px] left-0 right-0 h-[2px] bg-brand-primary/30 origin-left"
            />
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative"
            >
              {steps.map((s) => (
                <motion.div
                  key={s.n}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="bg-cream rounded-xl border border-divider-beige p-6 flex flex-col gap-2 text-left"
                >
                  <span className="font-serif font-bold text-3xl text-brand-primary/40">{s.n}</span>
                  <h3 className="font-serif font-semibold text-base text-cocoa">{s.title}</h3>
                  <p className="font-sans text-sm text-body-text leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Editorial quote — nền hồng nhạt, blob trôi nổi liên tục */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="bg-dusty-pink/15 rounded-[24px] py-16 sm:py-20 px-8 sm:px-12 text-center flex flex-col items-center justify-center relative overflow-hidden"
        >
          <motion.div
            className="absolute top-0 left-0 w-32 h-32 bg-dusty-pink/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
            animate={{ x: [-20, 10, -20], y: [-20, 10, -20] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-48 h-48 bg-cream/50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
            animate={{ x: [10, -15, 10], y: [10, -10, 10] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            whileHover={{ rotate: -8, scale: 1.1 }}
            className="relative z-10 mb-6"
          >
            <Quote size={40} className="text-cocoa/20" />
          </motion.div>
          <p className="font-label-italic italic text-2xl sm:text-3xl leading-tight text-cocoa max-w-3xl relative z-10">
            "Mỗi mũi đan là một chút kiên nhẫn, mỗi cuộn len là một câu chuyện chờ được kể.
            Chúng tôi gửi gắm sự ấm áp vào từng sản phẩm thủ công."
          </p>
          <span className="font-sans text-body-text mt-8 uppercase tracking-widest text-xs font-semibold relative z-10">
            Người sáng lập, {BRAND_NAME}
          </span>
        </motion.section>

        {/* CTA cuối trang — nền tối, đồng bộ footer toàn site */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="bg-brand-ink rounded-[24px] p-10 sm:p-14 text-center space-y-4 relative overflow-hidden"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-brand-primary/10 blur-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-white relative z-10">
            Cùng chúng tôi giữ ấm những điều nhỏ bé
          </h2>
          <p className="font-sans text-sm sm:text-base text-white/60 max-w-lg mx-auto relative z-10">
            Khám phá bộ sưu tập len thủ công hoặc gửi cho chúng tôi một lời nhắn —
            chúng tôi luôn sẵn lòng lắng nghe.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 relative z-10">
            <motion.button
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/products")}
              className="inline-flex items-center justify-center gap-1.5 text-sm font-sans font-semibold px-6 py-3 rounded-full bg-brand-primary text-white shadow-sm hover:shadow-lg transition-shadow"
            >
              Xem sản phẩm <ChevronRight size={14} />
            </motion.button>
            <motion.button
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/contact")}
              className="inline-flex items-center justify-center gap-1.5 text-sm font-sans font-semibold px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Liên hệ chúng tôi
            </motion.button>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
