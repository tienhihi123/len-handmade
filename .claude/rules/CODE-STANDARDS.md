# 📐 Code Standards — Len Handmade

> Coding conventions, naming patterns, và component structure standards

---

## 🎯 Nguyên Tắc Chung

1. **TypeScript bắt buộc** — Sử dụng type inference khi có thể, explicit types cho props/interfaces
2. **React 19** — Dùng functional components, hooks, không class components
3. **Tailwind CSS v4** — Ưu tiên utility classes, dùng `@theme` directive cho custom tokens
4. **Motion (Framer Motion)** — Animation library cho page transitions, micro-interactions
5. **Lucide React** — Icon library chính

---

## 📛 Naming Conventions

| Loại | Format | Ví dụ |
|------|--------|-------|
| **Components** | PascalCase | `ProductCard.tsx`, `Hero.tsx` |
| **Hooks** | camelCase bắt đầu bằng `use` | `useDragScroll.ts`, `usePageSeo.ts` |
| **Utils** | camelCase | `pricing.ts`, `userStorage.ts` |
| **CSS tokens** | kebab-case với prefix | `--color-gold`, `--font-serif`, `--spacing-16` |
| **Tailwind classes** | Utility classes | Sử dụng custom tokens đã định nghĩa trong `@theme` |

---

## 🧩 Component Pattern

### Standard Component Template

```tsx
import { motion } from "motion/react";
import { SomeIcon } from "lucide-react";

interface ComponentProps {
  title: string;
  variant?: "default" | "featured";
}

export default function Component({ title, variant = "default" }: ComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-brand-bg rounded-[var(--radius-card)] p-[var(--card-padding)]"
    >
      {/* Content */}
    </motion.div>
  );
}
```

---

## 🎨 Styling Rules

### DO ✅
1. **Dùng Tailwind utilities** — Tất cả styling qua Tailwind classes hoặc CSS classes trong `index.css`
2. **Sử dụng design tokens** — `--color-gold`, `--spacing-16`, không hardcode values
3. **Custom classes** cho patterns lặp lại: `.glass-nav`, `.soft-glass`, `.frosted-hero-card`, `.arch-card`
4. **Responsive first** — Mobile-first approach, breakpoints: `sm:`, `md:`, `lg:`, `xl:`
5. **Motion animations** — Dùng `motion` components cho page transitions và interactions

### DON'T ❌
1. **KHÔNG dùng inline styles** — Không `style={{...}}`
2. **KHÔNG dùng `!important`** — Giải quyết specificity bằng cấu trúc CSS hợp lý
3. **KHÔNG hardcode colors/spacing** — Luôn dùng design tokens
4. **KHÔNG tạo components quá phức tạp** — Giữ focused và reusable
5. **KHÔNG hardcode strings tiếng Việt** — Giữ nội dung nhất quán, có thể extract constants nếu cần

---

## 📥 Import Order

```tsx
// 1. React/Router
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// 2. Third-party
import { motion, AnimatePresence } from "motion/react";
import { Heart, ShoppingCart } from "lucide-react";

// 3. Internal — Context/Hooks
import { useAppContext } from "../context/AppContext";
import { usePageSeo } from "../hooks/usePageSeo";

// 4. Internal — Components
import ProductCard from "../components/ProductCard";

// 5. Internal — Utils/Data
import { formatPrice } from "../utils/pricing";
```

---

## 🎭 Design Principles

### DO ✅
- Dùng **Playfair Display** cho tất cả heading lớn — tạo cảm giác editorial luxury
- Dùng **DM Sans** cho body text, UI, buttons — clean và hiện đại
- Sử dụng **EB Garamond italic** cho nhãn danh mục, quote — tạo điểm nhấn tinh tế
- Dùng tông **ivory/cream** (#FBF6F0, #FFFDF9) làm nền chính
- Accent **gold** (#CEAF75) dùng tiết chế — chỉ cho CTA, highlights, brand elements
- **Frosted glass** effects cho navigation, hero overlays, floating panels
- **Arch cards** (bo tròn đỉnh 120px) cho category cards — tạo nét riêng thương hiệu
- **Animations nhẹ nhàng** — float, sway cho decorative elements; fade-in cho content
- **Hình ảnh chất lượng cao** — sản phẩm len, cuộn sợi, không gian craft
- Dùng `motion` cho page transitions và scroll-triggered animations
- **Scrollbar custom** — nâu ấm (#8B5E3C trên #F5EEE6) đồng bộ brand

### DON'T ❌
- KHÔNG dùng màu nguyên (red, blue, green) — chỉ dùng palette đã định nghĩa
- KHÔNG dùng font system default — luôn dùng Google Fonts đã import
- KHÔNG tạo layout dạng grid cứng nhắc — ưu tiên editorial flow, breathing space
- KHÔNG dùng stock photos generic — chỉ dùng hình liên quan handmade, yarn, craft
- KHÔNG quá tải animation — subtle và purposeful
- KHÔNG dùng dark mode mặc định — trang này luôn light theme (warm tone)

---

## 🤖 AI Assistant Guidelines

### Khi viết code mới:
1. **Đọc `src/index.css`** trước — nắm rõ design tokens
2. **Đọc `src/types.ts`** — hiểu data structures
3. **Kiểm tra `src/context/AppContext.tsx`** — global state sẵn có
4. **Sử dụng components có sẵn** — ProductCard, SafeImage, Logo...
5. **Giữ phong cách nhất quán** — ấm, editorial, premium

### Khi sửa design:
1. **Tuân thủ bảng màu** — KHÔNG thêm màu mới ngoài palette
2. **Dùng font đã import** — Playfair Display, DM Sans, EB Garamond, Inter
3. **Giữ spacing từ design tokens** — 4px increments
4. **Animations phải subtle** — max 0.5s cho UI, 2-8s cho decorative
5. **Test responsive** — Mobile → Tablet → Desktop

---

## 🔗 Related Documentation

- **Design Tokens**: See [../guides/DESIGN-TOKENS.md](../guides/DESIGN-TOKENS.md)
- **Design Rules**: See [design.md](design.md)
- **Tech Defaults**: See [tech-defaults.md](tech-defaults.md)
- **Component Patterns**: See [../components/patterns.md](../components/patterns.md)
