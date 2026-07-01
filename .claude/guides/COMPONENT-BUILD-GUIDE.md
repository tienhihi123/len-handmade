# 🧩 Skill: Component Builder

> Tạo React components mới theo patterns chuẩn của dự án

---

## Mô Tả

Generate component boilerplate theo conventions của Len Handmade project — TypeScript, Motion animations, responsive design.

---

## Templates

### Standard Component Template

```tsx
// Template: src/components/{Name}.tsx
import { motion } from "motion/react";
import { SomeIcon } from "lucide-react";

interface {Name}Props {
  // props here
  title: string;
  variant?: "default" | "featured";
}

export default function {Name}({ title, variant = "default" }: {Name}Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="..."
    >
      {/* Content */}
    </motion.section>
  );
}
```

### Page Component Template

```tsx
// Template: src/pages/{Name}Page.tsx
import { usePageSeo } from "../hooks/usePageSeo";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

export default function {Name}Page() {
  usePageSeo({
    title: "{Page Title} — Len Handmade",
    description: "{SEO description tiếng Việt}"
  });
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-brand-bg"
    >
      {/* Page content */}
    </motion.div>
  );
}
```

---

## Checklist Tạo Component

- [ ] TypeScript interface cho props
- [ ] Default values cho optional props
- [ ] Motion animations (entrance, hover, press)
- [ ] Responsive classes (mobile-first)
- [ ] Sử dụng design tokens (không hardcode)
- [ ] Lucide icons (không SVG inline trừ Logo)
- [ ] SEO hook cho pages (`usePageSeo`)
- [ ] Error boundaries cho data-dependent components

---

## React Patterns Khuyến Khích

1. **Composition over Inheritance** — Dùng children, render props
2. **Custom Hooks** — Extract logic vào hooks (useCart, useAuth, useDragScroll)
3. **Context + Reducer** — Global state management (AppContext)
4. **Lazy Loading** — React.lazy cho admin pages
5. **Error Boundaries** — Wrap data-dependent sections
6. **Optimistic Updates** — Cart, favorites cập nhật UI trước server
7. **Memoization** — useMemo/useCallback cho expensive computations
8. **Portal** — Modals, tooltips render outside DOM hierarchy

### Anti-patterns Tránh
- ❌ Prop drilling quá 3 levels → dùng Context
- ❌ useEffect cho derived state → dùng useMemo
- ❌ Multiple useState cho related state → dùng useReducer
- ❌ Inline function trong JSX loops → extract và memoize

---

## 🔗 Related Documentation

- **Component Patterns**: See [../components/patterns.md](../components/patterns.md)
- **Code Standards**: See [../rules/CODE-STANDARDS.md](../rules/CODE-STANDARDS.md)
- **Tech Defaults**: See [../rules/tech-defaults.md](../rules/tech-defaults.md)
