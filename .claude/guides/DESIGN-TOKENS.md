# 🎨 Design Tokens Reference — Len Handmade Brand System

> Bảng tra cứu nhanh màu sắc, typography, spacing, shadows, animations cho dự án

---

## 🎨 Bảng Màu Chính (Warm Artisan Palette)

| Tên | Hex | Token | Vai trò |
|-----|-----|-------|---------|
| **Ivory** | `#FBF6F0` | `--color-ivory` | Nền chính trang — tông kem ấm |
| **Cream** | `#FFFDF9` | `--color-cream` | Nền trang phụ, surface nhẹ |
| **Gold** | `#CEAF75` | `--color-gold` / `--color-brand-primary` | Accent chính — vàng đồng sang trọng |
| **Cocoa** | `#412C20` | `--color-cocoa` / `--color-brand-fb` | Chữ chính — nâu sô-cô-la đậm |
| **Body Text** | `#75645A` | `--color-body-text` | Văn bản phụ, mô tả |
| **Dusty Pink** | `#D9A7A7` | `--color-dusty-pink` | Accent phụ — hồng bụi cho tag, badge |
| **Divider Beige** | `#E8DDD1` | `--color-divider-beige` | Đường kẻ, border nhẹ |
| **Brand BG** | `#FAF6F0` | `--color-brand-bg` | Canvas nền toàn trang |
| **Sage Accent** | `#A8B59A` | `--color-sage-accent` | Điểm nhấn xanh lá nhẹ — thể hiện tự nhiên |

---

## 🌓 Bảng Màu Phụ (Material Design 3 Extended)

| Tên | Hex | Token | Vai trò |
|-----|-----|-------|---------|
| Surface Low | `#f8f3ed` | `--color-surface-container-low` | Surface phân tầng |
| Surface Container | `#f2ede7` | `--color-surface-container` | Card container |
| Surface High | `#ece7e2` | `--color-surface-container-high` | Surface nổi |
| Surface Highest | `#e6e2dc` | `--color-surface-container-highest` | Surface cao nhất |
| Outline | `#7f7669` | `--color-outline` | Border đậm |
| Outline Variant | `#d0c5b6` | `--color-outline-variant` | Border nhẹ |
| Error | `#ba1a1a` | `--color-error` | Lỗi, cảnh báo |
| Inverse Surface | `#32302c` | `--color-inverse-surface` | Nền tối (footer, dark sections) |

---

## 📝 Typography — Hệ Thống Font

| Font | Token | Vai trò |
|------|-------|---------|
| **Playfair Display** | `--font-serif`, `--font-headline-lg/md`, `--font-display-hero` | Heading sang trọng — display, hero |
| **DM Sans** | `--font-sans`, `--font-button-text`, `--font-body-lg/md` | Body text, UI, button — sạch, hiện đại |
| **EB Garamond** | `--font-label-italic` | Label italic cao cấp — nhãn danh mục |
| **Inter** | `--font-af` | UI functional nhỏ — caption, metadata |
| **Source Serif 4** | `--font-ppmondwest` (substitute) | Heading editorial phụ |
| **Lora** | fallback | Fallback serif |

### Type Scale

| Vai trò | Size | Line Height | Letter Spacing | Token |
|---------|------|-------------|----------------|-------|
| Caption | 13px | 1.4 | -0.156px | `--text-caption` |
| Body Small | 15px | 1.5 | -0.15px | `--text-body-sm` |
| Subheading | 18px | 1.3 | -0.18px | `--text-subheading` |
| Heading | 40px | 1.1 | -0.8px | `--text-heading` |
| Heading Large | 48px | 1.1 | -0.96px | `--text-heading-lg` |
| Display | 54px | 1.1 | -1.08px | `--text-display` |

---

## 📏 Spacing & Layout

- **Base unit:** 4px
- **Spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px
- **Page max-width:** `1200px` (standard) / `min(95vw, 1650px)` (XL)
- **Section gap:** `48px`
- **Card padding:** `16px`

---

## 🔲 Border Radius

| Element | Value | Token |
|---------|-------|-------|
| Navigation | 50px | `--radius-nav` |
| Cards | 12px | `--radius-card` |
| Hero Cards | 24px | `--radius-hero-card` |
| Buttons | 4px | `--radius-button` |
| Arch Cards | top 120px, bottom 24px | `.arch-card` class |

---

## 🌑 Shadows

| Tên | Token | Khi nào dùng |
|-----|-------|-------------|
| Small | `--shadow-sm` | Nav floating, elevated elements |
| Subtle | `--shadow-subtle` | Card borders nhẹ |
| Subtle 2 | `--shadow-subtle-2` | Card layers |
| Subtle 3 | `--shadow-subtle-3` | Frosted elements |
| Soft Deep | `--shadow-soft-deep` | Hero cards, featured sections |
| XL | `--shadow-xl` | Modal, overlay panels |

---

## ❄️ Glass / Frosted Effects

```css
.glass-nav         /* Navigation — rgba(251,246,240,0.85) blur(12px) */
.soft-glass        /* Panels — rgba(255,255,255,0.78) blur(18px) sage border */
.soft-glass-dark   /* Dark overlays — rgba(40,40,52,0.72) blur(18px) */
.soft-glass-light  /* Light panels — rgba(255,255,255,0.92) blur(12px) */
.frosted-hero-card /* Hero cards — rgba(255,255,255,0.78) blur(24px) */
.floating-pill-nav /* Nav pill — rgba(253,251,247,0.85) gold tint border */
```

---

## 🎬 Animations

| Animation | Token | Mô tả |
|-----------|-------|-------|
| Float | `--animate-float` | Trôi nổi nhẹ 6s — decor elements |
| Float Slow | `--animate-float-slow` | Trôi chậm 8s — background yarn |
| Spin Slow | `--animate-spin-slow` | Xoay chậm 20s — decorative mandala |
| Yarn Sway | `--animate-yarn-sway` | Lắc nhẹ 2s — yarn ball icons |
| Yarn Sway Soft | `--animate-yarn-sway-soft` | Lắc rất nhẹ 3s — soft decor |

---

## 🚀 Quick Color Cheat Sheet

```
Nền:     #FAF6F0 (Brand BG) / #FBF6F0 (Ivory) / #FFFDF9 (Cream)
Chữ:     #412C20 (Cocoa - heading) / #75645A (Body text)
Gold:    #CEAF75 (Primary accent)
Pink:    #D9A7A7 (Secondary accent)
Border:  #E8DDD1 (Divider) / #d0c5b6 (Outline variant)
Dark:    #2B221B (Footer) / #32302c (Inverse surface)
Success: #A8B59A (Sage green)
Error:   #ba1a1a (Error red)
```

---

## 🔗 Related Documentation

- **Design Rules**: See [../rules/design.md](../rules/design.md)
- **Code Standards**: See [../rules/CODE-STANDARDS.md](../rules/CODE-STANDARDS.md)
- **Component Patterns**: See [../components/patterns.md](../components/patterns.md)
