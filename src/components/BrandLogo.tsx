import Logo from "./Logo";
import { BRAND_NAME, BRAND_TAGLINE } from "../constants/brand";

export default function BrandLogo() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
        <Logo size={32} animate={true} />
      </div>
      <div>
        <span className="font-sans font-bold text-base text-[#FFF] tracking-wide block leading-none">
          {BRAND_NAME}
        </span>
        <span className="text-[9px] font-sans text-brand-primary tracking-widest uppercase block mt-1.5 font-semibold">
          {BRAND_TAGLINE}
        </span>
      </div>
    </div>
  );
}
