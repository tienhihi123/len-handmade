# rules/design.md — Quy Tắc Thiết Kế

> Quy tắc design bắt buộc. Tham chiếu đầy đủ tại `MD/DESIGN.md`.

---

## 🎨 Màu Sắc — Chỉ Dùng Palette Này

### Brand Core
| Token | Hex | Dùng cho |
|-------|-----|---------|
| `--color-brand-bg` | `#FAF6F0` | Nền toàn trang |
| `--color-gold` | `#CEAF75` | Accent chính, CTA, icon brand |
| `--color-cocoa` | `#412C20` | Heading chính, text đậm |
| `--color-body-text` | `#75645A` | Body text, mô tả sản phẩm |
| `--color-ivory` | `#FBF6F0` | Surface nhẹ, card background |
| `--color-cream` | `#FFFDF9` | Canvas phụ |
| `--color-dusty-pink` | `#D9A7A7` | Badge sale, tag phụ |
| `--color-divider-beige` | `#E8DDD1` | Border, divider |
| `--color-sage-accent` | `#A8B59A` | Success state, natural accent |

### Quy tắc màu
- ✅ Chỉ dùng tokens đã định nghĩa trong `src/index.css`
- ✅ `rgba()` của tokens hiện có được phép
- ❌ Không thêm màu hex mới vào component
- ❌ Không dùng màu nguyên (red, blue, green)
- ❌ Không dùng màu Tailwind mặc định (blue-500, red-400...)

---

## ✍️ Typography — Quy Tắc Bắt Buộc

| Ngữ cảnh | Font | Class Tailwind |
|---------|------|---------------|
| Heading lớn (H1/H2) | Playfair Display | `font-serif` |
| Body text, UI | DM Sans | `font-sans` |
| Label/caption italic | EB Garamond | `font-label-italic` |
| UI nhỏ, meta | Inter | `font-af` |

```
❌ Không: className="font-mono" cho heading
✅ Đúng:  className="font-serif text-3xl text-cocoa"
```

---

## 📐 Spacing — 4px Grid

- Chỉ dùng bội số của 4px
- Ưu tiên Tailwind scale: `p-4` (16px), `gap-6` (24px), `mb-12` (48px)
- Section gap: `py-16 md:py-24` (64-96px)
- Card padding: `p-4` hoặc `p-5` (16-20px)

---

## 🔲 Border Radius

| Element | Value | Class/Token |
|---------|-------|-------------|
| Buttons | 4px | `rounded` |
| Cards thường | 12px | `rounded-xl` |
| Hero cards | 24px | `rounded-3xl` |
| Navigation pill | 50px | `rounded-full` |
| Arch category card | top:120px bottom:24px | `.arch-card` |

---

## ✨ Hiệu Ứng Glass

```css
/* Sử dụng class có sẵn — không tự viết lại */
.glass-nav          → Navigation bar
.soft-glass         → Panels, sidebars nhẹ
.soft-glass-dark    → Dark overlays
.frosted-hero-card  → Hero overlay cards
.floating-pill-nav  → Nav pill floating
```

---

## 🚫 DON'T

- ❌ Dark mode — Light only, warm tone
- ❌ Thêm màu mới ngoài palette
- ❌ Stock photos generic — chỉ hình handmade, yarn, craft
- ❌ Animation quá mạnh — max 0.5s UI, 2-8s decorative
- ❌ Heavy drop shadows — chỉ dùng `--shadow-subtle*` tokens
- ❌ System fonts — luôn dùng Google Fonts đã import
