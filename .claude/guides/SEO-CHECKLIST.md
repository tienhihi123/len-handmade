# 🔍 SEO Checklist — Len Handmade

> Quick reference for implementing SEO across pages

---

## 📋 On-Page SEO Requirements

### Every Page Must Have

```tsx
// 1. SEO Hook at top of page component
import { usePageSeo } from "../hooks/usePageSeo";

usePageSeo({
  title: "[Keyword] — Len Handmade Artisan Studio",  // Max 60 chars
  description: "[Compelling description with keyword]"  // Max 160 chars
});

// 2. Heading structure
<h1>Primary Keyword Here</h1>  // 1 per page only
<h2>Secondary Keywords</h2>     // Section headings
<h3>Sub-sections</h3>           // Nested content

// 3. Image alt text
<img src={url} alt="Mô tả bằng tiếng Việt" />

// 4. Internal linking
<Link to="/products/len-merino-wool">Xem thêm len merino</Link>

// 5. Clean URLs
// ✅ /products/len-merino-wool
// ❌ /products?id=123&type=wool
```

---

## 🎯 Primary Keywords

| Từ khóa | Search Volume | Difficulty | Priority |
|---------|--------------|------------|----------|
| len handmade | Cao | Trung bình | 🔴 Cao |
| móc len thủ công | Cao | Thấp | 🔴 Cao |
| mua len online | Trung bình | Trung bình | 🟡 Trung bình |
| len merino wool | Trung bình | Thấp | 🟡 Trung bình |
| quà tốt nghiệp handmade | Trung bình | Thấp | 🟡 Trung bình |

---

## 📝 Meta Templates

### Homepage
```
Title: Len Handmade — Cửa Hàng Len Thủ Công Cao Cấp | Artisan Yarn Boutique
Description: Khám phá bộ sưu tập len handmade, phụ kiện móc len, quà tốt nghiệp thủ công. 
Len merino, cotton organic, cashmere chính hãng. Giao hàng toàn quốc.
```

### Product Page
```
Title: {Tên SP} — {Category} | Len Handmade
Description: {Tên SP} - {Chất liệu}. {Feature nổi bật}. Giá {Price}₫. 
Cam kết chất lượng, đổi trả 7 ngày. Giao hàng nhanh.
```

### Blog Post
```
Title: {Tiêu đề bài} — Tạp Chí Sợi Len | Len Handmade
Description: {Hook 1 câu}. Đọc ngay hướng dẫn chi tiết từ chuyên gia 
thủ công tại Len Handmade Artisan Studio.
```

### Category Page
```
Title: {Category} Handmade Cao Cấp — Len Handmade
Description: Tuyển chọn {category} handmade chính hiệu. 
Chất liệu cao cấp, thiết kế độc đáo. Giao hàng toàn quốc.
```

---

## 🔑 Long-tail Keywords

Target these in blog posts và product descriptions:

- "mua len merino wool chính hãng tại tp hcm"
- "hướng dẫn móc len cho người mới bắt đầu"
- "quà tốt nghiệp handmade đẹp ý nghĩa"
- "len cotton organic cho em bé"
- "túi đan len boho style"
- "nơ cài áo handmade vintage"

---

## ✅ SEO Checklist (Before Publishing)

- [ ] `usePageSeo()` hook với title và description
- [ ] Title max 60 characters
- [ ] Description max 160 characters
- [ ] H1 tag có primary keyword (1 per page)
- [ ] H2 tags có secondary keywords
- [ ] Image alt text bằng tiếng Việt
- [ ] Internal links tới 2-3 pages liên quan
- [ ] URL structure clean và readable
- [ ] Mobile responsive verified
- [ ] Page load speed < 3s
- [ ] Schema markup (Product, Article) nếu applicable

---

## 🌐 Technical SEO

### Sitemap
- `/sitemap.xml` — auto-generated via Vite plugin
- Include: pages, products, blog posts
- Update frequency: daily for products, weekly for blog

### Robots.txt
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /checkout/
Sitemap: https://lenhandmade.com/sitemap.xml
```

### Performance
- Image lazy loading (native `loading="lazy"`)
- Motion animations: `viewport={{ once: true }}`
- Code splitting for admin pages
- Compress images < 200KB

---

## 🔗 Related Documentation

- **Marketing Content Skill**: See [../skills/marketing-content.md](../skills/marketing-content.md)
- **Content Strategy**: See [CONTENT-STRATEGY.md](CONTENT-STRATEGY.md)
- **usePageSeo Hook**: See `src/hooks/usePageSeo.ts`
