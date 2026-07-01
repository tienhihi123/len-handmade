# rules/tech-defaults.md — Mặc Định Kỹ Thuật

> Tiêu chuẩn kỹ thuật bắt buộc cho mọi code trong dự án.

---

## ⚛️ React 19

```tsx
// ✅ Functional components + hooks
export default function Component({ prop }: Props) { ... }

// ✅ useEffect cleanup
useEffect(() => {
  const sub = subscribe();
  return () => sub.unsubscribe(); // cleanup bắt buộc
}, [dep]);

// ❌ Class components — không dùng
// ❌ forwardRef trừ khi thực sự cần
```

---

## 📘 TypeScript — Strict Mode

```typescript
// ✅ Interface cho object shapes
interface ProductProps { id: string; name: string; price: number; }

// ✅ Type cho unions/primitives
type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

// ❌ Không dùng `any`
const data: any = ...   // ❌
const data: unknown = ... // ✅

// ✅ Optional chaining + nullish coalescing
const name = user?.profile?.name ?? "Khách";

// ✅ as const cho literals
const ROLES = ["admin", "store_owner"] as const;
```

---

## 🎨 TailwindCSS v4

```css
/* ✅ Dùng @theme directive — không dùng tailwind.config.js */
@theme {
  --color-brand-new: #...;
}

/* ✅ Arbitrary values chỉ khi token không có */
className="w-[342px]"  /* ✅ nếu cần */
className="bg-[#CEAF75]"  /* ❌ — dùng bg-gold thay thế */
```

---

## 🎬 Motion (Framer Motion v12)

```tsx
import { motion, AnimatePresence } from "motion/react";
// ✅ Đúng — import từ "motion/react" không phải "framer-motion"

// ✅ Standard entrance animation
<motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
/>

// ✅ Viewport trigger (scroll animation)
<motion.section
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.6 }}
/>

// ✅ AnimatePresence cho conditional render
<AnimatePresence mode="wait">
  {show && <motion.div key="modal" exit={{ opacity: 0 }}>...</motion.div>}
</AnimatePresence>
```

---

## 🔥 Firebase

```typescript
// ✅ Import từ firebase/*, không import toàn bộ
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// ✅ Config trong src/lib/firebase.ts
import { db, auth } from "../lib/firebase";
```

---

## 🏗️ Import Order (Bắt Buộc)

```tsx
// 1. React + Router
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// 2. Third-party
import { motion } from "motion/react";
import { Heart, ShoppingCart } from "lucide-react";

// 3. Context + Hooks
import { useAppContext } from "../context/AppContext";
import { usePageSeo } from "../hooks/usePageSeo";

// 4. Components
import ProductCard from "../components/ProductCard";
import SafeImage from "../components/SafeImage";

// 5. Utils + Data + Types
import { formatPrice } from "../utils/pricing";
import type { Product } from "../types";
```

---

## 📦 Icons — Lucide React Only

```tsx
import { Heart, ShoppingCart, ArrowRight, Star, X } from "lucide-react";
// ✅ Size nhất quán: w-4 h-4 (16px), w-5 h-5 (20px), w-6 h-6 (24px)
// ❌ Không dùng Heroicons, React Icons, hay SVG inline (trừ Logo.tsx)
```

---

## 🛡️ Error Handling

```tsx
// ✅ SafeImage cho mọi ảnh product
<SafeImage src={product.image} alt={product.nameVi} className="..." />

// ✅ Optional chaining cho data từ API/Firebase
const price = product?.price ?? 0;

// ✅ Loading state cho async operations
const [loading, setLoading] = useState(false);
```

---

## 🔑 Biến Môi Trường

```typescript
// ✅ Đọc từ import.meta.env (Vite)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// ❌ Không hardcode API keys trong source code
```
