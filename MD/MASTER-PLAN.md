# 🗺️ MASTER PLAN — Nâng cấp Tiệm Len Nhỏ lên chuẩn $10,000

> Bổ sung cho `FEATURE-AUDIT.md`. Ngày: 2026-07-11.

---

## 1. Phân tích SEO kiểu Shopee → áp dụng cho dự án

| # | Shopee làm gì | Áp dụng vào dự án | Trạng thái |
|---|---------------|-------------------|-----------|
| 1 | Cho khách xem tự do, chỉ bắt login khi mua | Gỡ ProtectedRoute khỏi trang duyệt (home, products, blog, about, contact, track-order). **Đây là điều kiện tiên quyết — hiện Googlebot bị đá về /login nên site không index được gì** | 🔨 Batch 1 |
| 2 | Structured data JSON-LD (Product, Offer, AggregateRating, BreadcrumbList) → rich snippets giá + sao trên Google | `src/utils/seo.ts` + nâng cấp `usePageSeo` để inject JSON-LD | 🔨 Batch 1 |
| 3 | Title pattern "Mua [Tên SP] Giá Tốt... | Shopee" | Title SP: "Mua {tên} Giá Tốt, Chuẩn Handmade \| Tiệm Len Nhỏ" | 🔨 Batch 1 |
| 4 | Canonical URL + OG tags (share đẹp lên Facebook/Zalo) | usePageSeo hỗ trợ canonical + og:image/url/type; OG mặc định trong index.html | 🔨 Batch 1 |
| 5 | sitemap.xml + robots.txt | `scripts/generate-sitemap.mjs` sinh sitemap từ data + robots.txt chặn /admin, /checkout | 🔨 Batch 1 |
| 6 | URL chứa slug từ khóa (ten-san-pham-i.shop.id) | Route `/products/:id` thêm biến thể slug `/san-pham/:slug` + redirect | 📅 Phase sau |
| 7 | Từ khóa hot + gợi ý tìm kiếm | Hot keywords + recent searches trong Header search | 📅 Phase sau |
| 8 | Category landing page giàu nội dung + internal linking | Thêm đoạn mô tả SEO đầu mỗi trang danh mục | 📅 Phase sau |
| 9 | Server-side render (SPA của ta chỉ render client) | Prerender (vite-plugin-prerender hoặc Vercel prerendering) — quan trọng nhất về kỹ thuật SEO dài hạn | 📅 Phase sau |

## 2. Tiện ích người dùng (chuẩn website $10k)

**Batch 2 (làm ngay):** Guest browsing; Sản phẩm đã xem gần đây (localStorage strip trên trang chi tiết).
**Kế tiếp (theo FEATURE-AUDIT Phase 3-4):** Voucher center, flash-sale countdown, real-time stock counter, exit-intent cart recovery, quick-view modal, order timeline kiểu Shopee, AI chatbot Gemini, yarn calculator, price-drop alerts, loyalty, GHN/GHTK, GA4.

**Lưu ý:** Ship đang miễn phí toàn bộ (CartPage) nên bỏ ý tưởng "thanh tiến độ freeship".

## 3. Thứ tự tổng (gộp với FEATURE-AUDIT)

1. ✅ Batch 1 SEO core + guest browsing (hôm nay)
2. ✅ Batch 2 tiện ích nhanh (hôm nay)
3. Phase 1 dữ liệu thật (orders 2 chiều, trừ kho, coupons→Firestore, gỡ demo login)
4. Phase 2 thanh toán + email (Blaze, IPN, transactional email)
5. Phase 3 trải nghiệm (guest checkout đầy đủ, stock counter, GHN, code-splitting, prerender SEO)
6. Phase 4 tăng trưởng (AI chatbot, calculator, loyalty, analytics, UGC)
