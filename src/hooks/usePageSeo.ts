import { useEffect } from "react";
import { BRAND_DOMAIN, BRAND_NAME } from "../constants/brand";

export const SITE_URL = `https://${BRAND_DOMAIN}`;

export interface PageSeoOptions {
  /** Đường dẫn canonical, ví dụ "/products/abc" */
  canonicalPath?: string;
  /** Ảnh og:image (đường dẫn tuyệt đối hoặc bắt đầu bằng "/") */
  image?: string;
  /** Loại nội dung cho og:type */
  type?: "website" | "product" | "article";
  /** Các khối JSON-LD structured data (schema.org) */
  jsonLd?: Record<string, unknown>[];
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function usePageSeo(title: string, description: string, options?: PageSeoOptions) {
  const jsonLdKey = options?.jsonLd ? JSON.stringify(options.jsonLd) : "";
  const canonicalPath = options?.canonicalPath;
  const image = options?.image;
  const type = options?.type ?? "website";

  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);

    // Open Graph (share Facebook/Zalo/Messenger)
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", BRAND_NAME);

    if (canonicalPath) {
      const url = `${SITE_URL}${canonicalPath}`;
      upsertMeta("property", "og:url", url);
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = url;
    }

    if (image) {
      const imgUrl = image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;
      upsertMeta("property", "og:image", imgUrl);
    }

    // JSON-LD structured data — xóa khối cũ rồi gắn khối mới
    document.head.querySelectorAll("script[data-page-jsonld]").forEach((s) => s.remove());
    if (jsonLdKey) {
      const blocks = JSON.parse(jsonLdKey) as Record<string, unknown>[];
      blocks.forEach((block) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-page-jsonld", "true");
        script.textContent = JSON.stringify(block);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.head.querySelectorAll("script[data-page-jsonld]").forEach((s) => s.remove());
    };
  }, [title, description, canonicalPath, image, type, jsonLdKey]);
}
