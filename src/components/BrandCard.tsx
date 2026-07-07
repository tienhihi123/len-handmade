import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Facebook, ArrowRight, QrCode, Heart, Leaf } from "lucide-react";
import Logo from "./Logo";
import { BRAND_NAME, BRAND_TAGLINE, BRAND_EMAIL, BRAND_FANPAGE } from "../constants/brand";

const CONTACT_PHONE = "0966 092 483";
const CONTACT_ADDRESS = "252 Lý Tự Trọng, P. Bến Thành, Quận 1, TP. Hồ Chí Minh";

interface BrandCardProps {
  /** "full" — dùng cho trang chủ, 2 cột lớn. "compact" — dùng cho sidebar trang liên hệ. */
  variant?: "full" | "compact";
  className?: string;
}

export default function BrandCard({ variant = "full", className = "" }: BrandCardProps) {
  const navigate = useNavigate();
  const contactUrl =
    typeof window !== "undefined" ? `${window.location.origin}/contact` : "https://tiemlennho.vn/contact";
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(
    contactUrl
  )}`;

  const contactItems = [
    { icon: Phone, label: "Hotline / Zalo", value: CONTACT_PHONE },
    { icon: Mail, label: "Email", value: BRAND_EMAIL },
    { icon: Facebook, label: "Fanpage", value: BRAND_FANPAGE },
    { icon: MapPin, label: "Địa chỉ", value: CONTACT_ADDRESS },
  ];

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative bg-cream rounded-[28px] border-2 border-dashed border-dusty-pink/50 p-6 flex flex-col items-center gap-4 text-center overflow-hidden ${className}`}
      >
        {/* Decorative corner accents */}
        <Leaf size={16} className="absolute top-5 left-5 text-sage-accent/60 -rotate-12" aria-hidden />
        <Heart size={12} className="absolute top-7 right-7 text-dusty-pink/60" aria-hidden />
        <Leaf size={16} className="absolute bottom-6 right-6 text-sage-accent/60 rotate-[100deg]" aria-hidden />
        <Heart size={12} className="absolute bottom-24 left-6 text-dusty-pink/60" aria-hidden />

        <div className="w-14 h-14 rounded-full bg-brand-bg border border-divider-beige flex items-center justify-center overflow-hidden p-1 shrink-0 relative z-10">
          <Logo className="w-full h-full" size="100%" animate={false} />
        </div>
        <div className="relative z-10">
          <h3 className="font-serif font-semibold text-lg text-cocoa leading-tight">{BRAND_NAME}</h3>
          <span className="font-label-italic italic text-dusty-pink text-sm">{BRAND_TAGLINE}</span>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold text-sage-accent uppercase tracking-widest border border-sage-accent/40 rounded-full px-3 py-1 relative z-10">
          Handmade With Love <Heart size={10} className="fill-sage-accent" />
        </span>

        <div className="p-2 bg-white rounded-2xl border-2 border-dashed border-divider-beige relative z-10">
          <img src={qrSrc} alt="Mã QR liên hệ Tiệm Len Nhỏ" width={140} height={140} />
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-brand-primary uppercase tracking-widest relative z-10">
          <QrCode size={13} /> Quét để xem cửa hàng
        </span>

        <ul className="w-full space-y-3 text-sm font-sans text-body-text text-left relative z-10 pt-2 border-t border-divider-beige">
          {contactItems.map((c) => (
            <li key={c.label} className="flex items-start gap-2.5 pt-1">
              <c.icon size={15} className="text-brand-primary mt-0.5 shrink-0" />
              <span className="leading-snug break-words">{c.value}</span>
            </li>
          ))}
        </ul>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/contact")}
          className="inline-flex items-center justify-center gap-1.5 text-sm font-sans font-semibold px-5 py-2.5 rounded-full bg-brand-primary text-white hover:shadow-lg transition-shadow relative z-10"
        >
          Liên hệ với Tiệm <ArrowRight size={14} />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`bg-cream rounded-[24px] border border-divider-beige overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-[0_10px_30px_rgba(65,44,32,0.05)] ${className}`}
    >
      {/* Cột trái — Danh thiếp thương hiệu */}
      <div className="p-8 sm:p-12 flex flex-col items-center text-center gap-4 border-b md:border-b-0 md:border-r border-divider-beige relative overflow-hidden">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-10 -left-10 w-32 h-32 rounded-full bg-brand-primary/10 blur-2xl"
          animate={{ y: [0, -14, 0], x: [0, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="w-20 h-20 rounded-full bg-brand-bg border border-divider-beige flex items-center justify-center overflow-hidden p-1.5 relative z-10">
          <Logo className="w-full h-full" size="100%" />
        </div>
        <div className="relative z-10">
          <h3 className="font-serif font-bold text-2xl text-cocoa">{BRAND_NAME}</h3>
          <span className="font-label-italic italic text-dusty-pink text-base">{BRAND_TAGLINE}</span>
        </div>
        <p className="font-sans text-sm text-body-text max-w-xs relative z-10">
          Mỗi sản phẩm là một lời chào ấm áp — quét mã để ghé thăm gian hàng của Tiệm.
        </p>
        <div className="p-2 bg-white rounded-xl border border-divider-beige relative z-10">
          <img src={qrSrc} alt="Mã QR liên hệ Tiệm Len Nhỏ" width={140} height={140} />
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-brand-primary uppercase tracking-widest relative z-10">
          <QrCode size={13} /> Quét để xem cửa hàng
        </span>
      </div>

      {/* Cột phải — Thông tin liên hệ */}
      <div className="p-8 sm:p-12 flex flex-col justify-center gap-6 text-left">
        <div>
          <span className="font-label-italic italic text-dusty-pink text-lg block mb-2">
            Kết Nối Cùng Chúng Tôi
          </span>
          <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-cocoa">
            Thông Tin Liên Hệ
          </h2>
        </div>

        <ul className="space-y-4">
          {contactItems.map((c) => (
            <li key={c.label} className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                <c.icon size={16} className="text-brand-primary" />
              </div>
              <div>
                <span className="block text-xs font-sans font-semibold uppercase tracking-wide text-body-text/70">
                  {c.label}
                </span>
                <span className="font-sans text-sm text-cocoa">{c.value}</span>
              </div>
            </li>
          ))}
        </ul>

        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/contact")}
          className="inline-flex items-center justify-center gap-1.5 text-sm font-sans font-semibold px-6 py-3 rounded-full bg-brand-primary text-white w-fit hover:shadow-lg transition-shadow"
        >
          Liên hệ với Tiệm <ArrowRight size={14} />
        </motion.button>
      </div>
    </motion.section>
  );
}
