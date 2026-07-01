# 🧶 CLAUDE.md — Len Handmade Premium Artisan Yarn Boutique

> **Navigation hub** cho tất cả tài liệu dự án

**🚀 Quick links:**
- [Quick Start](QUICK-START.md) — 30-second onboarding
- [Skill Cheatsheet](SKILL-CHEATSHEET.md) — Copy-paste commands
- [Skill Usage Guide](SKILL-USAGE-GUIDE.md) — Detailed skill instructions
- [Token Analysis](TOKEN-ANALYSIS.md) — Token efficiency report

---

## 🎯 Về Dự Án

**Len Handmade — Artisan Studio** là website e-commerce bán len handmade, phụ kiện thủ công với tông ấm, sang trọng. Kết hợp bán hàng trực tuyến, content marketing, AI chatbot, và admin dashboard.

| Thuộc tính | Giá trị |
|------------|---------|
| **Stack** | React 19 + Vite + TailwindCSS v4 + Firebase + Motion + TypeScript |
| **Ngôn ngữ** | Tiếng Việt (Vietnamese) |
| **Phong cách** | Editorial luxury, warm artisan aesthetic |
| **Thương hiệu** | Ấm áp, chuyên nghiệp, editorial, gần gũi nhưng tinh tế |

---

## 📚 Documentation Structure

### 📖 Guides (Reference Documentation — Đọc khi cần)
- **[Project Overview](guides/PROJECT-OVERVIEW.md)** — Tổng quan dự án, thương hiệu, kiến trúc
- **[Design Tokens](guides/DESIGN-TOKENS.md)** — Bảng màu, typography, spacing, shadows, animations
- **[Design Language](guides/DESIGN-LANGUAGE.md)** — Complete design system với component patterns & code examples
- **[Tech Stack](guides/TECH-STACK.md)** — Dependencies, build tools, dev commands
- **[SEO Checklist](guides/SEO-CHECKLIST.md)** — Quick reference cho SEO implementation
- **[Content Strategy](guides/CONTENT-STRATEGY.md)** — Brand voice, content calendar, visual guidelines
- **[E-Commerce Guide](guides/E-COMMERCE-GUIDE.md)** — Cart logic, checkout patterns, order management
- **[Component Build Guide](guides/COMPONENT-BUILD-GUIDE.md)** — Component templates & generation patterns

### 📏 Rules (Quy Tắc — AI áp dụng khi code)
- **[Design Rules](rules/design.md)** — Design principles và visual rules
- **[Code Standards](rules/CODE-STANDARDS.md)** — Coding conventions, naming, patterns
- **[Tech Defaults](rules/tech-defaults.md)** — Technical standards và best practices
- **[Workflow](rules/workflow.md)** — Development workflow

### 🧩 Components (Reference)
- **[Component Patterns](components/patterns.md)** — Core component patterns (condensed)

### 🛠️ Skills (Invocation Instructions — ~50-80 tokens each)
- **[design-review](skills/design-review.md)** — Audit UI code against design system
- **[component-gen](skills/component-gen.md)** — Generate React components with proper patterns
- **[seo-content](skills/seo-content.md)** — Create SEO-optimized Vietnamese content
- **[cart-checkout](skills/cart-checkout.md)** — Implement shopping cart & checkout features
- **[design-system](skills/design-system.md)** — Validate design consistency
- **[frontend-design](skills/frontend-design/SKILL.md)** — Distinctive visual design direction (Anthropic)
- **[ui-ux-pro-max](skills/ui-ux-pro-max/SKILL.md)** — UI/UX design intelligence: styles, color palettes, font pairing, UX guidelines

### 🤖 Agents
- **[Researcher](agents/researcher.md)** — Research agent profile

---

## 🚀 Quick Start cho AI

### First-Time Onboard (đọc theo thứ tự):
1. [Project Overview](guides/PROJECT-OVERVIEW.md) — Hiểu dự án
2. [Design Tokens](guides/DESIGN-TOKENS.md) — Nắm design system
3. [Code Standards](rules/CODE-STANDARDS.md) — Học conventions
4. [Component Patterns](components/patterns.md) — Xem patterns cốt lõi

### Khi Làm Việc UI:
**Quick reference (đọc luôn):**
1. [Design Tokens](guides/DESIGN-TOKENS.md) — Color palette, spacing, typography quick lookup
2. [Design Rules](rules/design.md) — Core design principles

**Deep dive (đọc khi cần code examples):**
3. [Design Language](guides/DESIGN-LANGUAGE.md) — Complete design system với full component code

**Skills to invoke:**
- `/design-review` — Validate UI against design system
- `/component-gen` — Generate new components

### Khi Viết Code:
1. [Code Standards](rules/CODE-STANDARDS.md) — Naming, structure
2. [Tech Defaults](rules/tech-defaults.md) — Technical rules

**Skills to invoke:**
- `/component-gen` — Generate components with patterns

### Khi Làm Marketing:
**Quick reference:**
1. [SEO Checklist](guides/SEO-CHECKLIST.md) — On-page SEO rules
2. [Content Strategy](guides/CONTENT-STRATEGY.md) — Brand voice guidelines

**Skills to invoke:**
- `/seo-content` — Generate SEO-optimized Vietnamese content

### Khi Làm E-Commerce:
**Reference:**
1. [E-Commerce Guide](guides/E-COMMERCE-GUIDE.md) — Cart, checkout patterns

**Skills to invoke:**
- `/cart-checkout` — Implement cart/checkout features

---

## 🎨 Quick Design Reference

### Color Cheat Sheet
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

### Typography
- **Heading:** Playfair Display (`font-serif`)
- **Body:** DM Sans (`font-sans`)
- **Label Italic:** EB Garamond (`font-label-italic`)
- **UI Small:** Inter (`font-af`)

### Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px

---

## 📂 Key Project Files

| File | Mô tả |
|------|-------|
| `src/index.css` | Main stylesheet + Tailwind `@theme` tokens |
| `src/types.ts` | TypeScript interfaces |
| `src/context/AppContext.tsx` | Global state (cart, auth, favorites) |
| `src/hooks/usePageSeo.ts` | Dynamic SEO meta tags |
| `src/lib/firebase.ts` | Firebase configuration |
| `src/utils/pricing.ts` | Price formatting utilities |

---

## 🔧 Dev Commands

```bash
npm run dev      # Vite dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # TypeScript check (tsc --noEmit)
```

---

## 🤖 Hướng Dẫn cho AI Assistant

### DO ✅
- Đọc guides trước khi implement features mới
- Sử dụng design tokens đã định nghĩa — không hardcode
- Tuân thủ component patterns có sẵn
- Giữ brand voice nhất quán (ấm, editorial, tinh tế)
- Test responsive trên mobile/tablet/desktop

### DON'T ❌
- KHÔNG thêm màu mới ngoài palette
- KHÔNG dùng inline styles hoặc `!important`
- KHÔNG hardcode strings tiếng Việt — có thể extract constants
- KHÔNG tạo components quá phức tạp
- KHÔNG bỏ qua `usePageSeo` hook trên pages

---

## 🔧 Next Steps (Prioritized)

1. **Real-Time Stock Counter** (1-2 days) — HIGH priority
2. **Exit-Intent Cart Recovery** (2-3 days) — HIGH priority
3. **Yarn Calculator/Project Estimator** (2-3 days)
4. **Enhanced Wishlist + Price Drop Alerts** (1-2 days)
5. **User Project Gallery (UGC)** (1 week)
6. **AI Product Recommendations** (3-5 days simple, 2 weeks advanced)
7. **Loyalty Points Program** (1 week)

_Chi tiết implementation guides: Xem market research documents._

---

## Tiến độ hiện tại

- **Mục tiêu:** Restructure .claude/ documentation theo best practices
- **Hoàn thành:** 
  - ✅ Tạo proper skill files (design-review, component-gen, seo-content, cart-checkout)
  - ✅ Move documentation từ skills/ → guides/
  - ✅ Giảm skill token cost từ ~11,000 → ~1,200 tokens (89% reduction)
- **Chưa xử lý:** Real-Time Stock Counter, Exit-Intent Cart Recovery, Yarn Calculator
- **Lỗi còn lại:** Không có
- **Bước tiếp theo:** Bắt đầu implement stock counter
