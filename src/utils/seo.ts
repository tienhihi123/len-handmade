import { Product } from "../types";
import { BRAND_NAME, BRAND_DOMAIN, BRAND_FANPAGE } from "../constants/brand";

export const SITE_URL = `https://${BRAND_DOMAIN}`;

export function absUrl(path: string): string {
  if (!path) return SITE_URL;
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Title pattern kiểu Shopee: "Mua {tên} Giá Tốt..." */
export function productSeoTitle(product: Product): string {
  return `Mua ${product.name} Giá Tốt, Chuẩn Handmade | ${BRAND_NAME}`;
}

export function productSeoDescription(product: Product): string {
  const price = product.price ? `Giá chỉ ${product.price.toLocaleString("vi-VN")}đ. ` : "";
  const material = product.material ? `Chất liệu ${product.material}. ` : "";
  const base = product.description?.slice(0, 110) ?? "";
  return `${price}${material}${base} Đan móc thủ công 100%, đổi trả dễ dàng tại ${BRAND_NAME}.`.trim();
}

const AVAILABILITY_MAP: Record<string, string> = {
  "in-stock": "https://schema.org/InStock",
  "made-to-order": "https://schema.org/PreOrder",
  "out-of-stock": "https://schema.org/OutOfStock",
};

/** JSON-LD Product + Offer + AggregateRating → rich snippet giá và sao trên Google */
export function buildProductJsonLd(product: Product): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [absUrl(product.image), ...(product.images ?? []).map(absUrl)],
    description: product.description,
    sku: product.id,
    material: product.material,
    brand: { "@type": "Brand", name: BRAND_NAME },
    offers: {
      "@type": "Offer",
      url: absUrl(`/products/${product.id}`),
      priceCurrency: "VND",
      price: product.price,
      availability:
        AVAILABILITY_MAP[product.stockStatus ?? ""] ??
        (product.stock > 0 ? AVAILABILITY_MAP["in-stock"] : AVAILABILITY_MAP["out-of-stock"]),
      itemCondition: "https://schema.org/NewCondition",
    },
  };
  if (product.reviewsCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    };
  }
  return jsonLd;
}

/** JSON-LD BreadcrumbList */
export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absUrl(item.path),
    })),
  };
}

/** JSON-LD Organization cho trang chủ */
export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: BRAND_NAME,
    url: SITE_URL,
    sameAs: [`https://${BRAND_FANPAGE}`],
  };
}
