import { Heart, MessageCircle, ShoppingBag, ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { useState } from "react";
import { Product } from "../types";
import SafeImage from "./SafeImage";
import YarnFireworks from "./YarnFireworks";

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onOpen: () => void;
  onToggleWishlist: (event: MouseEvent) => void;
  onAddToCart?: (event: MouseEvent) => void;
  onBuyNow?: (event: MouseEvent) => void;
  onRequestQuote: (event: MouseEvent) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onOpen,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onRequestQuote,
}: ProductCardProps) {
  const priceText = product.priceLabel || `${product.price.toLocaleString("vi-VN")}đ`;
  const [showFireworks, setShowFireworks] = useState(false);

  const handleWishlistClick = (event: MouseEvent) => {
    onToggleWishlist(event);
    // Only show fireworks when adding to wishlist (not removing)
    if (!isWishlisted) {
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 100);
    }
  };

  const cardImage = product.images?.[0] || product.image;

  return (
    <article
      onClick={onOpen}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-brand-primary/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F3EC]">
        <SafeImage
          src={cardImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-brand-bg/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary shadow-sm">
          {product.category}
        </span>
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2.5 text-brand-fb shadow-sm transition hover:text-[#B96E73] hover:scale-110 active:scale-95"
        >
          <Heart size={16} className={isWishlisted ? "fill-[#DDB8B0] text-[#B96E73]" : ""} />
          <YarnFireworks trigger={showFireworks} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-base lg:text-lg font-bold leading-snug text-brand-fb">{product.name}</h3>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-brand-fb/65">
          {product.caption || product.description}
        </p>
        <div className="mt-4 text-base lg:text-lg font-black text-brand-primary">{priceText}</div>

        <div className="mt-auto pt-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (product.requiresQuote) {
                  onRequestQuote(event);
                } else {
                  onAddToCart?.(event);
                }
              }}
              className="group relative rounded-xl border-2 border-gold/30 bg-ivory/60 px-4 py-3 text-xs font-bold text-cocoa transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:shadow-md flex items-center justify-center gap-1.5 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <ShoppingBag size={14} className="relative" />
              <span className="relative font-sans">Thêm giỏ</span>
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-brand-fb px-2.5 py-1 text-[10px] font-sans font-bold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 z-10">
                {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"}
              </span>
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpen();
              }}
              className="group relative rounded-xl bg-gradient-to-r from-gold to-gold/90 px-4 py-3 text-xs font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-1.5 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative font-label-italic text-sm">Xem chi tiết</span>
              <ArrowRight size={14} className="relative group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
