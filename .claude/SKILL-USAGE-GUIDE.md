# 🎯 Skill Usage Guide — How to Invoke & Use Each Skill

> **Complete guide** với examples thực tế cho mỗi skill

---

## 📖 How Skills Work

### Concept
```
User request → AI identifies matching skill → AI reads skill file → 
AI follows skill instructions → AI may read referenced guides → AI executes task
```

### Token Flow
```
Base: ~335 tokens (all skills loaded)
+ Guide cost (only if skill references it)
+ Execution work

Example: "Check my design"
→ Matches design-review skill (~60 tokens)
→ Quick check using inline rules (0 additional tokens)
→ Total: ~60 tokens

Example: "Create ProductCard component"
→ Matches component-gen skill (~65 tokens)
→ Reads DESIGN-LANGUAGE.md (~7,500 tokens)
→ Total: ~7,565 tokens
```

---

## 🛠️ Skill #1: design-review

### Purpose
Audit UI code against Len Handmade design system

### How to Invoke

**Triggers:**
```
✅ "Check my design"
✅ "Validate this UI code"
✅ "Review design consistency"
✅ "Does this follow our design system?"
✅ "Audit these components"
```

**Not triggered by:**
```
❌ "Create a design" (this is component-gen)
❌ "What colors should I use?" (this is question, not audit)
❌ "Build a component" (this is component-gen)
```

### Input
1. **Automatic:** AI will check recently modified .tsx/.css files via git diff
2. **Manual:** You can specify files:
   ```
   "Check design in src/components/Hero.tsx"
   "Review src/pages/ProductPage.tsx and src/components/ProductCard.tsx"
   ```

### What It Checks

**Quick inline validation (no guide read needed):**
- ✅ Colors use design tokens (`bg-gold`, `text-cocoa`) vs ❌ hardcoded hex
- ✅ Spacing on 4px grid (`gap-4`, `py-16`) vs ❌ arbitrary values
- ✅ Correct fonts (`font-serif`, `font-sans`) vs ❌ wrong fonts
- ✅ Standard border radius (`rounded-xl`) vs ❌ custom values
- ✅ Animation timing (0.5-0.8s UI) vs ❌ too long

**Deep validation (reads DESIGN-LANGUAGE.md if needed):**
- Glass effect usage (`.glass-nav`, `.soft-glass`)
- Component pattern compliance
- Responsive design adherence

### Output Format

**Pass:**
```
✅ DESIGN REVIEW PASSED

Checked files:
- src/components/Hero.tsx
- src/pages/ProductPage.tsx

No violations found. Design system compliance: 100%
```

**Violations:**
```
❌ DESIGN VIOLATIONS FOUND:

src/components/Hero.tsx:
  Line 42: Hardcoded color #CEAF75
    Fix: Use bg-gold instead of bg-[#CEAF75]
  
  Line 56: Spacing gap-[23px] not on 4px grid
    Fix: Use gap-6 (24px) or gap-5 (20px)

src/pages/ProductPage.tsx:
  Line 128: Animation duration-1000 too long for UI interaction
    Fix: Use duration-500 or duration-700 max

─────────────────────────────────────
3 violations found
Estimated fix time: 5 minutes
```

### Examples

**Example 1: Quick check after editing**
```
User: "Check my design changes"

AI: [Runs git diff → Finds Hero.tsx changed]
    [Reads design-review skill]
    [Quick inline validation — no guide needed]
    
    Result: ✅ No violations
    Token cost: ~60 tokens
```

**Example 2: Specific file audit**
```
User: "Review design in src/components/ProductCard.tsx"

AI: [Reads design-review skill]
    [Checks ProductCard.tsx]
    [Finds hardcoded color on line 45]
    
    Result: ❌ 1 violation found (hardcoded #CEAF75)
    Token cost: ~60 tokens
```

**Example 3: Complex validation**
```
User: "Deep design audit on all components"

AI: [Reads design-review skill]
    [Sees "deep validation" needed]
    [Reads DESIGN-LANGUAGE.md for full patterns]
    [Checks all .tsx files]
    
    Result: Report with pattern compliance details
    Token cost: ~60 + 7,500 = 7,560 tokens
```

---

## 🛠️ Skill #2: component-gen

### Purpose
Generate React components following Len Handmade patterns

### How to Invoke

**Triggers:**
```
✅ "Create a ProductCard component"
✅ "Generate Newsletter component"
✅ "Build a PriceTag component"
✅ "Make a CategoryCard variant"
✅ "I need a new Button component"
```

**Not triggered by:**
```
❌ "How do I create a component?" (question, not request)
❌ "Show me component examples" (this is reference, read guide directly)
❌ "What's the pattern for cards?" (question about pattern)
```

### Input Required

**Minimum:**
```
Component name: "ProductCard"
```

**Better (AI will ask if missing):**
```
Component name: ProductCard
Purpose: Display product with image, title, price, add-to-cart
Props needed: product (Product type), onAddToCart (function)
Variant: Featured style with gradient background
```

### Process Flow

1. **AI asks for requirements** (if not provided):
   ```
   "What should this component do?"
   "What props does it need?"
   "Any specific design variant?"
   ```

2. **AI reads references:**
   ```
   - guides/DESIGN-LANGUAGE.md (for patterns & code examples)
   - components/patterns.md (for quick templates)
   - rules/CODE-STANDARDS.md (for naming/structure)
   ```

3. **AI generates:**
   - Complete .tsx file
   - TypeScript interface
   - Motion animations
   - Design tokens (no hardcoded colors)
   - Responsive classes

4. **AI writes file:**
   ```
   src/components/{ComponentName}.tsx
   ```

### Output

**Generated file structure:**
```tsx
import { motion } from "motion/react";
import { IconName } from "lucide-react";

interface ComponentNameProps {
  title: string;
  onClick?: () => void;
  variant?: "default" | "featured";
}

export default function ComponentName({ 
  title, 
  onClick,
  variant = "default" 
}: ComponentNameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
    >
      <h3 className="font-serif text-xl text-cocoa">{title}</h3>
      {/* Component content */}
    </motion.div>
  );
}
```

**Plus usage example:**
```tsx
// Usage in parent component:
import ComponentName from "../components/ComponentName";

<ComponentName 
  title="Example Title" 
  variant="featured" 
  onClick={handleClick} 
/>
```

### Examples

**Example 1: Simple component**
```
User: "Create a PriceTag component"

AI: "What props does PriceTag need?"
User: "Just price and currency"

AI: [Reads component-gen skill]
    [Reads DESIGN-LANGUAGE.md for patterns]
    [Generates PriceTag.tsx with price, currency props]
    [Writes to src/components/PriceTag.tsx]
    
Output: 
- File created: src/components/PriceTag.tsx
- Props: price (number), currency (string)
- Styling: Gold text, DM Sans font
Token cost: ~7,565 tokens
```

**Example 2: Complex component with variants**
```
User: "Build a CategoryCard component with arch style and featured variant"

AI: [Reads component-gen skill]
    [Reads DESIGN-LANGUAGE.md — sees arch-card pattern]
    [Generates CategoryCard with:
      - Default variant (standard arch)
      - Featured variant (gradient + glow)
      - Hover animations
      - Image + title + description
    ]
    
Output: src/components/CategoryCard.tsx
Props: category (Category), variant ("default" | "featured")
Styling: .arch-card class, motion animations
Token cost: ~7,565 tokens
```

**Example 3: Form input component**
```
User: "Create a TextInput component for forms"

AI: [Reads component-gen skill]
    [Reads DESIGN-LANGUAGE.md — sees form input pattern]
    [Generates TextInput with:
      - Label + input + error message
      - Focus states (gold ring)
      - TypeScript props
      - Validation support
    ]

Output: src/components/TextInput.tsx
Token cost: ~7,565 tokens
```

---

## 🛠️ Skill #3: seo-content

### Purpose
Generate SEO-optimized Vietnamese marketing content

### How to Invoke

**Triggers:**
```
✅ "Write a product description for this yarn bag"
✅ "Create blog post about knitting techniques"
✅ "Generate meta tags for homepage"
✅ "Write SEO content for category page"
✅ "Need product description in Vietnamese"
```

**Not triggered by:**
```
❌ "How do I write SEO content?" (question)
❌ "What's our brand voice?" (reference question)
❌ "Translate this to Vietnamese" (translation task)
```

### Input Required

**Content Type:**
```
1. Product description
2. Blog post
3. Meta tags
4. Category description
5. Landing page copy
```

**Details (AI will ask if missing):**
```
- Product/topic name
- Target keywords (optional — AI can suggest)
- Key features/selling points
- Target length
```

### Process Flow

1. **AI asks for details:**
   ```
   "What product/topic?"
   "Target keywords?"
   "Any specific features to highlight?"
   ```

2. **AI reads references:**
   ```
   - guides/CONTENT-STRATEGY.md (brand voice, tone)
   - guides/SEO-CHECKLIST.md (SEO best practices)
   ```

3. **AI generates content with:**
   - Natural Vietnamese
   - Warm, editorial tone (ấm áp, tinh tế)
   - Keywords integrated naturally
   - Proper length (150-300 words for products, 800-1500 for blog)
   - Meta tags

### Output Format

**Product Description:**
```markdown
# Túi Len Handmade Pastel Hoa Nổi

**Meta Title (52 chars):** Túi Len Handmade Hoa Nổi | Phụ Kiện Thủ Công Cao Cấp
**Meta Description (148 chars):** Túi len handmade được đan tỉ mỉ với họa tiết hoa nổi pastel. 100% thủ công Việt, chất liệu len cao cấp mềm mại, phong cách vintage sang trọng.

## Mô Tả Sản Phẩm

Túi len handmade hoa nổi pastel là tác phẩm nghệ thuật được tạo nên từ từng mũi đan tỉ mỉ, gửi gắm tâm huyết của nghệ nhân Việt. Với họa tiết hoa nổi độc đáo và bảng màu pastel nhẹ nhàng, chiếc túi không chỉ là phụ kiện thời trang mà còn là người bạn đồng hành mang lại cảm giác ấm áp, gần gũi.

**Điểm nổi bật:**
- ✨ 100% thủ công — Không có chiếc nào giống chiếc nào
- 🧶 Len cao cấp mềm mại, bền đẹp theo thời gian
- 🌸 Họa tiết hoa nổi tinh tế, phong cách vintage
- 💝 Kích thước vừa vặn cho điện thoại, ví, son

Túi len handmade phù hợp cho những bạn yêu thích phong cách vintage, artisan, đề cao giá trị thủ công và sự độc đáo. Đây cũng là món quà tặng ý nghĩa cho người thân, bạn bè trong những dịp đặc biệt.

---
**Keywords used:** túi len handmade, phụ kiện thủ công, len cao cấp, hoa nổi pastel, vintage
**Word count:** 178 words
**SEO score:** ✅ Optimized
```

**Blog Post:**
```markdown
# 5 Kỹ Thuật Đan Len Cơ Bản Cho Người Mới Bắt Đầu

**Meta Title:** 5 Kỹ Thuật Đan Len Cơ Bản | Hướng Dẫn Chi Tiết A-Z
**Meta Description:** Học đan len từ đầu với 5 kỹ thuật cơ bản. Hướng dẫn chi tiết từng bước, phù hợp người mới bắt đầu. Bắt đầu hành trình handmade ngay hôm nay!

## Giới Thiệu

Đan len không chỉ là một kỹ năng thủ công mà còn là hành trình khám phá sự sáng tạo, mang lại cảm giác thư giãn và những tác phẩm độc đáo bằng chính đôi tay bạn...

[Full blog post 800-1500 words]

## Kết Luận

Với 5 kỹ thuật cơ bản này, bạn đã có thể bắt đầu hành trình đan len của mình...

---
**Keywords:** đan len cơ bản, kỹ thuật đan len, hướng dẫn đan len, len handmade
**Word count:** 1,247 words
**Internal links:** [Sản phẩm len], [Nguyên liệu đan len]
```

### Examples

**Example 1: Product description**
```
User: "Write product description for this crochet bag (shows image)"

AI: [Reads seo-content skill]
    [Asks: "What are key features?"]
User: "Pastel pink, flower pattern, handmade"

AI: [Reads CONTENT-STRATEGY.md for brand voice]
    [Reads SEO-CHECKLIST.md for SEO rules]
    [Generates Vietnamese description with keywords]
    
Output: 200-word description + meta tags
Tone: Ấm áp, tinh tế, editorial
Token cost: ~1,735 tokens
```

**Example 2: Blog post**
```
User: "Create blog post about yarn care tips"

AI: [Reads seo-content skill]
    [Reads CONTENT-STRATEGY.md]
    [Generates 1,200-word Vietnamese blog post with:
      - H1, H2, H3 hierarchy
      - Keywords in first 100 words
      - Internal linking suggestions
      - Meta tags
    ]

Token cost: ~1,735 tokens
```

---

## 🛠️ Skill #4: cart-checkout

### Purpose
Implement shopping cart and checkout features

### How to Invoke

**Triggers:**
```
✅ "Build cart functionality"
✅ "Implement add to cart"
✅ "Create checkout flow"
✅ "Build shopping cart drawer"
✅ "I need payment integration"
```

**Not triggered by:**
```
❌ "How does the cart work?" (question)
❌ "Show me cart code" (reference request)
❌ "What's in my cart?" (user cart query — different)
```

### Input Required

**Scope (AI will ask):**
```
1. Cart display (drawer/sidebar/page)
2. Add to cart functionality
3. Checkout form
4. Payment integration
5. Order confirmation
6. Full flow (all above)
```

### Process Flow

1. **AI clarifies scope:**
   ```
   "What do you need? (cart display, checkout form, payment, or full flow)"
   "Which payment provider? (Stripe, PayPal, VNPay, COD)"
   ```

2. **AI reads references:**
   ```
   - guides/E-COMMERCE-GUIDE.md (cart patterns, checkout flow)
   - src/context/AppContext.tsx (existing cart state)
   - src/utils/pricing.ts (price formatting)
   ```

3. **AI implements following patterns:**
   - Cart state via AppContext
   - Price formatting with utilities
   - Multi-step checkout (Cart → Shipping → Payment → Confirm)
   - Validation (stock, min/max quantities)
   - localStorage persistence

### Output

**Cart Drawer Component:**
```tsx
// src/components/CartDrawer.tsx
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity } = useApp();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 
                       bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 
                            border-b border-divider-beige">
              <h2 className="font-serif text-xl text-cocoa">Giỏ hàng</h2>
              <button onClick={onClose}>
                <X size={24} />
              </button>
            </div>
            
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto mb-4 text-gold" size={48} />
                  <p className="text-body-text">Giỏ hàng trống</p>
                </div>
              ) : (
                cart.map(item => (
                  <CartItem key={item.id} item={item} />
                ))
              )}
            </div>
            
            {/* Footer with total */}
            <div className="p-6 border-t border-divider-beige">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Tổng cộng:</span>
                <span className="font-bold text-gold text-xl">
                  {formatPrice(total)}đ
                </span>
              </div>
              <button className="w-full bg-gold text-white py-3 
                                 rounded-full font-semibold">
                Thanh toán
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Plus:**
- CartItem sub-component
- Quantity controls
- Remove button
- Price calculations
- Empty state
- Integration with AppContext

### Examples

**Example 1: Cart drawer**
```
User: "Build a cart drawer that slides in from right"

AI: [Reads cart-checkout skill]
    [Reads E-COMMERCE-GUIDE.md for patterns]
    [Checks src/context/AppContext.tsx for cart state]
    [Generates CartDrawer.tsx with:
      - Slide-in animation (motion)
      - Cart items list
      - Quantity controls
      - Total price
      - Checkout button
    ]

Output: src/components/CartDrawer.tsx
Token cost: ~1,335 tokens
```

**Example 2: Full checkout flow**
```
User: "Implement full checkout: cart → shipping → payment → confirmation"

AI: [Reads cart-checkout skill]
    [Reads E-COMMERCE-GUIDE.md]
    [Generates:
      - CheckoutPage.tsx (multi-step form)
      - ShippingForm.tsx
      - PaymentForm.tsx
      - OrderSummary.tsx
      - OrderConfirmation.tsx
      - Updates AppContext if needed
    ]

Output: Multiple component files + routing
Token cost: ~1,335 tokens
```

---

## 🛠️ Skill #5: design-system

### Purpose
Validate design consistency (legacy skill — already lightweight)

### How to Invoke

**Triggers:**
```
✅ "Validate design system usage"
✅ "Check design token consistency"
✅ "Are we following design standards?"
```

**Note:** This skill overlaps with `design-review`. Use `design-review` for comprehensive audits.

---

## 📊 Skill Comparison Table

| Skill | Token Cost | Guide Reads | Best For | Output |
|-------|-----------|-------------|----------|--------|
| **design-review** | ~60 | DESIGN-LANGUAGE (optional) | Quick UI validation | Violation report |
| **component-gen** | ~7,565 | DESIGN-LANGUAGE + patterns | New components | .tsx file + usage |
| **seo-content** | ~1,735 | CONTENT-STRATEGY + SEO | Marketing copy | Content + meta tags |
| **cart-checkout** | ~1,335 | E-COMMERCE-GUIDE + context | E-commerce features | Component files |
| **design-system** | ~70 | design.md | Token validation | Pass/fail report |

---

## 🎯 Decision Tree: Which Skill to Use?

```
Need to validate UI code?
  └─> design-review

Need to create new component?
  └─> component-gen

Need marketing content?
  └─> seo-content

Need e-commerce features?
  └─> cart-checkout

Just checking design tokens?
  └─> design-system (or design-review)
```

---

## 💡 Pro Tips

### 1. **Be Specific in Requests**
```
❌ "Make something"
✅ "Create a ProductCard component with image, title, price, and add-to-cart button"

❌ "Write content"
✅ "Write product description for handmade crochet bag, 200 words, Vietnamese"
```

### 2. **Provide Context**
```
"Create CategoryCard component — reference the arch-card pattern from design system"
"Write blog post about yarn care — target keyword: 'bảo quản len handmade'"
```

### 3. **Batch Related Requests**
```
Instead of:
  "Create ProductCard"
  "Create ProductGrid" 
  "Create ProductFilter"

Better:
  "Create product listing components: ProductCard, ProductGrid, ProductFilter"
```

### 4. **Leverage Variants**
```
"Create Button component with variants: primary (gold), secondary (outline), tertiary (ghost)"
```

---

## 🚀 Quick Reference

### Most Common Patterns

**Create component:**
```
"Create {ComponentName} component with {props/features}"
→ component-gen skill
```

**Check design:**
```
"Check design in {filename}" or "Validate my changes"
→ design-review skill
```

**Write content:**
```
"Write {content type} for {subject}"
→ seo-content skill
```

**Build e-commerce:**
```
"Build {cart/checkout/payment} feature"
→ cart-checkout skill
```

---

**Last Updated:** June 30, 2026  
**Status:** ✅ Production-ready
