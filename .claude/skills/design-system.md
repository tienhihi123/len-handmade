# 🎨 Skill: Design System

> Đảm bảo mọi thay đổi UI đều tuân thủ design system của Len Handmade

---

## Mô Tả

Validate màu sắc, typography, spacing, và design patterns trước khi apply code changes.

---

## Khả Năng

- Validate màu sắc trước khi sử dụng — chỉ chấp nhận palette đã định nghĩa
- Suggest font pairing phù hợp với brand
- Kiểm tra spacing tuân thủ 4px grid
- Generate CSS utility classes mới từ design tokens
- Audit component để phát hiện vi phạm design rules

---

## Quy Tắc

### Trigger
Khi tạo hoặc sửa bất kỳ component UI nào

### Validation Rules

```yaml
colors:
  - Chỉ dùng tokens: --color-brand-*, --color-ivory, --color-cream, --color-gold, --color-cocoa
  - Không hardcode hex values mới
  - Exceptions: rgba() variations của tokens hiện có

typography:
  - Heading: font-serif (Playfair Display)
  - Body: font-sans (DM Sans)
  - Label italic: font-label-italic (EB Garamond)
  - UI small: font-af (Inter)

spacing:
  - Chỉ dùng multiples of 4px
  - Ưu tiên design tokens: --spacing-4 → --spacing-80

border-radius:
  - Cards: 12px (--radius-card)
  - Buttons: 4px (--radius-button)
  - Nav: 50px (--radius-nav)
  - Hero cards: 24px (--radius-hero-card)
  - Arch cards: 120px top, 24px bottom
```

---

## Examples

### ✅ Correct Usage

```tsx
// Good — Uses design tokens
<button className="bg-gold text-white rounded-[var(--radius-button)] px-6 py-3">
  Mua ngay
</button>
```

### ❌ Incorrect Usage

```tsx
// Bad — Hardcoded color
<button style={{ backgroundColor: "#D4AF37" }}>
  Mua ngay
</button>
```

---

## 🔗 Related Documentation

- **Design Tokens**: See [../guides/DESIGN-TOKENS.md](../guides/DESIGN-TOKENS.md)
- **Design Rules**: See [../rules/design.md](../rules/design.md)
- **Code Standards**: See [../rules/CODE-STANDARDS.md](../rules/CODE-STANDARDS.md)
