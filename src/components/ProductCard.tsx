import { Heart, MessageCircle, ShoppingBag } from "lucide-react";
import type { MouseEvent } from "react";
import { Product } from "../types";
import SafeImage from "./SafeImage";

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

  return (
    <article
      onClick={onOpen}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-brand-primary/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F3EC]">
        <SafeImage
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-brand-bg/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary shadow-sm">
          {product.category}
        </span>
        <button
          type="button"
          onClick={onToggleWishlist}
          aria-label={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          className="absolute right-4 top-4 rounded-full bg-white/90 p-2.5 text-brand-fb shadow-sm transition hover:text-[#B96E73]"
        >
          <Heart size={16} className={isWishlisted ? "fill-[#DDB8B0] text-[#B96E73]" : ""} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-base lg:text-lg font-bold leading-snug text-brand-fb">{product.name}</h3>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-brand-fb/65">
          {product.caption || product.description}
        </p>
        <div className="mt-4 text-base lg:text-lg font-black text-brand-primary">{priceText}</div>

        <div className="mt-auto pt-5">
          <div className="grid grid-cols-2 gap-2">
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
              className="rounded-full border border-brand-primary/25 bg-white px-3 py-2.5 text-xs font-bold text-brand-fb transition hover:bg-brand-bg"
            >
              Thêm vào giỏ
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpen();
              }}
              className="rounded-full bg-brand-primary px-3 py-2.5 text-xs font-bold text-white transition hover:bg-brand-primary/90"
            >
              Xem thêm
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
