// Sinh public/sitemap.xml từ src/data.ts (chạy: node scripts/generate-sitemap.mjs)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = "https://tiemlennho.vn";

const src = readFileSync(join(root, "src/data.ts"), "utf8");

// Product ids: chỉ lấy trong đoạn PRODUCTS
const prodStart = src.indexOf("export const PRODUCTS");
const prodEnd = src.indexOf("export const REVIEWS");
const productsSection = src.slice(prodStart, prodEnd > prodStart ? prodEnd : undefined);
const productIds = [...productsSection.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]);

// Blog slugs: trong đoạn BLOGS
const blogsSection = src.slice(src.indexOf("export const BLOGS"));
const blogSlugs = [...blogsSection.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

const staticRoutes = ["/", "/products", "/blog", "/about", "/contact", "/track-order"];

const urls = [
  ...staticRoutes.map((path) => ({ loc: `${SITE_URL}${path}`, priority: path === "/" ? "1.0" : "0.8" })),
  ...productIds.map((id) => ({ loc: `${SITE_URL}/products/${id}`, priority: "0.9" })),
  ...blogSlugs.map((slug) => ({ loc: `${SITE_URL}/blog/${slug}`, priority: "0.6" })),
];

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`sitemap.xml: ${urls.length} URLs (${productIds.length} sản phẩm, ${blogSlugs.length} blog)`);
