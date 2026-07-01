# 🧩 Component Patterns — Quick Reference

> Core component patterns for Len Handmade project. Full patterns available in actual components.

---

## 1. Product Card Pattern

**Key Features:**
- Motion animations with staggered entrance
- Hover overlay with quick actions
- Badge system (new/sale)
- Favorite heart toggle
- Star rating display
- Price formatting with original price strikethrough

**Usage:**
```tsx
import ProductCard from "../components/ProductCard";

<ProductCard product={product} index={0} />
```

**See:** `src/components/ProductCard.tsx`

---

## 2. Hero Section Pattern

**Key Features:**
- Full-width background image
- Frosted glass text overlay (`.frosted-hero-card`)
- Playfair Display headline at display size
- Gold accent CTA button
- Mobile-responsive layout

**Template:**
```tsx
<section className="relative min-h-[600px] flex items-center">
  <div className="absolute inset-0">
    <img src={heroImage} alt="" className="w-full h-full object-cover" />
  </div>
  <div className="relative z-10 frosted-hero-card max-w-2xl mx-auto p-8">
    <h1 className="font-serif text-4xl md:text-6xl text-cocoa">
      {headline}
    </h1>
    <p className="text-body-text mt-4">{description}</p>
    <button className="mt-6 bg-gold text-white px-8 py-3 rounded-[var(--radius-button)]">
      {ctaText}
    </button>
  </div>
</section>
```

---

## 3. Glass / Frosted Effects

**Available Classes:**
- `.glass-nav` — Navigation frosted background
- `.soft-glass` — Subtle glass panels
- `.frosted-hero-card` — Hero text overlays
- `.floating-pill-nav` — Floating navigation pill

**Usage:**
```tsx
<div className="soft-glass rounded-xl p-6">
  {/* Content with frosted background */}
</div>
```

---

## 4. Section Header Pattern

**Standard Layout:**
```tsx
<div className="text-center max-w-2xl mx-auto mb-12">
  <p className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-3">
    {subtitle}
  </p>
  <h2 className="font-serif text-3xl md:text-4xl text-cocoa">
    {title}
  </h2>
  <p className="text-body-text/70 mt-4">
    {description}
  </p>
</div>
```

---

## 5. CTA Button Variants

### Primary (Gold)
```tsx
<button className="bg-gold hover:bg-gold/90 text-white px-6 py-3 rounded-[var(--radius-button)] font-sans font-medium transition-colors">
  {text}
</button>
```

### Secondary (Outline)
```tsx
<button className="border-2 border-gold text-gold hover:bg-gold hover:text-white px-6 py-3 rounded-[var(--radius-button)] transition-all">
  {text}
</button>
```

### Tertiary (Ghost)
```tsx
<button className="text-cocoa hover:text-gold px-6 py-3 font-medium transition-colors">
  {text}
</button>
```

---

## 6. Arch Category Card

**Unique Design:**
- Border radius: top 120px, bottom 24px
- Creates signature arch shape
- Used for category cards

**Template:**
```tsx
<div className="arch-card bg-white overflow-hidden hover:shadow-xl transition-shadow">
  <img src={categoryImage} alt={name} className="w-full aspect-square object-cover" />
  <div className="p-6">
    <h3 className="font-serif text-xl text-cocoa">{name}</h3>
    <p className="text-body-text/70 mt-2">{description}</p>
  </div>
</div>
```

**CSS:**
```css
.arch-card {
  border-radius: 120px 120px 24px 24px;
}
```

---

## 7. Navigation Pattern

**Desktop:** Floating pill nav with glass effect

**Mobile:** Hamburger → side drawer with `motion` animations

**Key Classes:**
- `glass-nav` or `floating-pill-nav`
- Sticky positioning
- Lucide icons for menu/close

**See:** `src/components/Header.tsx`

---

## 8. Footer Pattern

**Layout:**
- 4 columns: Brand info, Explore links, Contact, Policies
- Dark background: `#2B221B` (inverse-surface)
- Gold accent: `#A47E5C` for highlights
- SSL badge and trust signals

**See:** `src/App.tsx` footer section

---

## 9. Motion Animation Patterns

### Entrance Animation
```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
  {children}
</motion.div>
```

### Staggered List
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
  >
    {item}
  </motion.div>
))}
```

### Button Tap
```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.02 }}
>
  {text}
</motion.button>
```

---

## 10. Form Input Pattern

**Standard Input:**
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-cocoa">
    {label}
  </label>
  <input
    type="text"
    className="w-full px-4 py-3 border border-outline-variant rounded-lg
               focus:border-gold focus:ring-2 focus:ring-gold/20 
               outline-none transition-all"
    placeholder={placeholder}
  />
</div>
```

**Textarea:**
```tsx
<textarea
  className="w-full px-4 py-3 border border-outline-variant rounded-lg
             focus:border-gold focus:ring-2 focus:ring-gold/20 
             outline-none transition-all min-h-[120px]"
  placeholder={placeholder}
/>
```

---

## 🔗 Related Documentation

- **Code Standards**: See [../rules/CODE-STANDARDS.md](../rules/CODE-STANDARDS.md)
- **Design Tokens**: See [../guides/DESIGN-TOKENS.md](../guides/DESIGN-TOKENS.md)
- **Component Builder Skill**: See [../skills/component-builder.md](../skills/component-builder.md)

---

**For full component implementations, refer to:**
- `src/components/ProductCard.tsx`
- `src/components/Hero.tsx`
- `src/components/Header.tsx`
- `src/components/Categories.tsx`
- `src/components/Testimonials.tsx`
