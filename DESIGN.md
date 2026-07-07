# DESIGN.md — Reference-Driven Design Integration
## Thiết kế Blog — Tiệm Len Nhỏ (Desktop, nguồn: Stitch)

> File này chốt lại bản thiết kế **Stitch** (HTML/Tailwind CDN) do người dùng
> cung cấp cho trang Blog Desktop, làm **nguồn tham chiếu chính thức** cho mọi
> trang khác trong dự án — bắt đầu với trang Giới thiệu. Toàn bộ token màu và
> font trong bản Stitch **đã khớp 1:1** với hệ token đang có sẵn trong
> [src/index.css](src/index.css) — không cần thêm màu/font mới, chỉ cần map
> đúng tên class Tailwind của dự án.

---

## 1. Mapping token: Stitch → Project (index.css)

| Stitch token | Hex | Token thật trong dự án | Class Tailwind dùng |
|---|---|---|---|
| `background-main` | `#FAF6F0` | `--color-brand-bg` | `bg-brand-bg` |
| `surface-ivory` | `#FBF6F0` | `--color-ivory` | `bg-ivory` |
| `canvas-cream` | `#FFFDF9` | `--color-cream` | `bg-cream` |
| `cocoa` (custom class) | `#412C20` | `--color-cocoa` / `--color-brand-fb` | `text-brand-fb`, `bg-brand-fb` |
| `primary` / `gold` (custom class) | `#CEAF75` | `--color-gold` / `--color-brand-primary` | `text-brand-primary`, `bg-brand-primary` |
| `primary-container` | `#CEAF75` | = gold | `bg-brand-primary` (dùng cho nút CTA) |
| `text-body` | `#75645A` | `--color-body-text` | `text-brand-fb/60` (đồng bộ cách dùng alpha đã có) |
| `badge-pink` | `#D9A7A7` | `--color-dusty-pink` | `text-dusty-pink` |
| `divider-beige` | `#E8DDD1` | `--color-divider-beige` | `border-divider-beige` / `border-brand-primary/10` |
| `outline` | `#7f7669` | `--color-outline` (đã có trong tokens phụ) | `text-outline` |
| `outline-variant` | `#d0c5b6` | `--color-outline-variant` | `border-outline-variant` |
| `footer-dark` | `#2B221B` | gần nhất `--color-brand-ink` (`#241811`) | `bg-brand-ink` (đã dùng cho footer toàn site) |
| `error` | `#ba1a1a` | `--color-error` | — |
| `success-sage` | `#A8B59A` | `--color-sage-accent` | — |

**Kết luận:** bản Stitch không mang màu lạ vào dự án — nó chính là bản mở
rộng trực quan của design system đã tồn tại. Khi build lại bằng React, dùng
đúng class hiện có (`bg-brand-bg`, `text-brand-fb`, `bg-brand-primary`,
`text-dusty-pink`, `border-divider-beige`, `bg-brand-ink`...), tuyệt đối
không hardcode hex mới.

## 2. Typography (khớp `--font-serif` / `--font-sans` / `--font-label-italic` / `--font-af`)

| Stitch font role | Font | Class dự án |
|---|---|---|
| `display-lg` (48/56, 700) — H1 hero | Playfair Display | `font-serif font-bold text-5xl` |
| `headline-md` (32/40, 600) — H2 section | Playfair Display | `font-serif font-semibold text-3xl` |
| `headline-sm` (24/32, 600) — H3 card title | Playfair Display | `font-serif font-semibold text-xl` |
| `label-italic` (18/24) — nhãn danh mục, quote | EB Garamond italic | `font-label-italic italic` |
| `body-lg` / `body-md` — mô tả, đoạn văn | DM Sans | `font-sans` |
| `ui-small` (12/16, tracking 0.02em) — meta, caption | Inter | `font-af text-xs tracking-wide` |

**Icon:** bản Stitch dùng Material Symbols Outlined — dự án chỉ dùng
**Lucide React** (theo `rules/CODE-STANDARDS.md`), nên khi build lại phải đổi
`shopping_bag` → `ShoppingBag`, `favorite` → `Heart`, `search` → `Search`,
`format_quote` → dấu ngoặc kép kiểu chữ hoặc icon `Quote`, `chevron_left/right`
→ `ChevronLeft/ChevronRight`, `styler` → `Sparkles`.

## 3. Bo góc & Spacing

| Stitch | Giá trị | Khớp token dự án |
|---|---|---|
| Nút bấm | `rounded` (4px) | `--radius-button` |
| Card ảnh nhỏ | `rounded-[12px]` | `--radius-card` |
| Hero / featured / quote card lớn | `rounded-[24px]` | `--radius-hero-card` |
| Nav pill, category pill, avatar | `rounded-full` | `--radius-nav` |
| Grid gutter | `24px` | spacing scale sẵn có (`gap-6`) |
| Margin desktop hai bên | `64px` | `px-16` |

## 4. Bố cục Blog Desktop (theo đúng thứ tự Stitch)

1. **Header pill nổi**: `fixed` trên cùng, glass nền `bg-surface/70 backdrop-blur-xl`, bo `rounded-full`, căn giữa `max-w-4xl mx-auto`, logo chữ nghiêng ở giữa, nav trái, icon giỏ hàng/yêu thích phải.
2. **Hero**: grid 12 cột — trái (5 cột): nhãn italic nhỏ → H1 display lớn → mô tả → 2 nút (fill gold + outline cocoa); phải (7 cột): ảnh lớn `h-[600px] rounded-[24px]`.
3. **Featured Article**: card ngang bo `rounded-[24px]`, ảnh chiếm 55% trái, nội dung 45% phải (nhãn hồng, H2, mô tả, link "Đọc tiếp" gạch chân).
4. **Category & Search**: hàng ngang `border-b divider-beige`, pill category (active = nền cocoa/chữ cream), ô tìm kiếm bo tròn bên phải.
5. **Nội dung chính 8/4**: trái (8 cột) grid 3 cột card bài viết (ảnh 16:9 bo 12px zoom hover, nhãn danh mục italic hồng, H3, meta ngày + thời gian đọc); phải (4 cột, có `border-l divider-beige`) gồm 3 khối: Danh mục (list + badge số lượng), Bài viết nổi bật (thumbnail nhỏ 80×80 + tiêu đề + ngày), Newsletter card (icon tròn, input, nút gold).
6. **Editorial Quote**: nền hồng nhạt `#F2E3E3` (≈ `dusty-pink/20` trên nền cream) bo `rounded-[24px]`, có 2 khối blur trang trí, icon quote mờ, trích dẫn `label-italic` lớn giữa trang, tên tác giả uppercase nhỏ.
7. **Pagination**: nút tròn, trang active = nền gold.
8. **Footer**: nền tối (`bg-brand-ink`), 4 cột (logo + tagline, 2 cột link, copyright).

## 5. Nguyên tắc áp dụng sang trang Giới thiệu (và các trang khác)

- Dùng lại đúng **hero 2 cột lệch (5/7 hoặc 7/5)** với ảnh lớn bo `rounded-[24px]` làm mở đầu trang.
- Dùng lại **card ngang "featured"** (ảnh 55% / chữ 45%) cho phần kể chuyện thương hiệu.
- Dùng lại **khối trích dẫn editorial** (nền hồng nhạt, chữ label-italic lớn giữa trang) để nhấn tinh thần thương hiệu — rất hợp cho câu slogan/tôn chỉ của Tiệm Len Nhỏ.
- Dùng lại **card nhỏ 3-4 cột bo 12px** cho phần giá trị cốt lõi / quy trình, đồng bộ với card bài viết blog.
- Kết trang bằng khối CTA nền tối hoặc nền ivory viền `divider-beige`, giống tinh thần Newsletter card.
- Toàn bộ icon dùng Lucide, toàn bộ màu/font dùng đúng bảng mapping ở mục 1–2 — không tự thêm mới.
