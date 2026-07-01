# 🎨 Phong Cách Design — Len Handmade Brand Language

> **Skill document** — Tập hợp toàn bộ phong cách thiết kế website, visual language, và UX patterns

---

## 📐 Tổng Quan Design Philosophy

### Brand Identity
- **Cảm xúc chủ đạo:** Ấm áp, editorial luxury, handcrafted artisan aesthetic
- **Tone:** Gần gũi nhưng tinh tế, chuyên nghiệp nhưng không xa cách
- **Visual DNA:** Warm ivory palette + frosted glass effects + organic floating animations + serif editorial typography

### Design Principles
1. **Warmth First** — Tông kem ấm (#FAF6F0, #FBF6F0, #FFFDF9) làm nền chính, tạo cảm giác thư thái
2. **Editorial Luxury** — Playfair Display serif cho headings, tạo cảm giác cao cấp như tạp chí thời trang
3. **Subtle Elegance** — Glass effects, soft shadows, không dùng màu chói, animation nhẹ nhàng
4. **Handcrafted Touches** — Decorative yarn elements, floating animations mô phỏng sợi len, organic shapes
5. **Breathing Space** — Generous spacing (48-64px sections), không chen chúc, editorial layout

---

## 🎨 Color Language — Quy Tắc Bắt Buộc

### Primary Palette (Core Brand)
| Màu | Hex | Emotion | Khi nào dùng |
|-----|-----|---------|-------------|
| **Ivory** | `#FBF6F0` | Ấm áp, sang trọng | Nền chính toàn trang, section backgrounds |
| **Cream** | `#FFFDF9` | Nhẹ nhàng, tinh tế | Surface, card backgrounds, alternate sections |
| **Brand BG** | `#FAF6F0` | Ổn định, căn bản | Canvas tổng thể |
| **Gold** | `#CEAF75` | Cao cấp, đáng tin | CTA buttons, accent icons, highlights, badges |
| **Cocoa** | `#412C20` | Chuyên nghiệp, vững chãi | Headings chính, important text |
| **Body Text** | `#75645A` | Dễ đọc, thoải mái | Paragraph text, product descriptions |

### Accent Colors (Tiết Chế)
| Màu | Hex | Vai trò |
|-----|-----|---------|
| **Dusty Pink** | `#D9A7A7` | Sale badges, secondary tags, soft feminine touch |
| **Sage Accent** | `#A8B59A` | Success states, natural/eco messaging, subtle highlights |

### Functional Colors
| Màu | Hex | Dùng cho |
|-----|-----|---------|
| **Divider Beige** | `#E8DDD1` | Borders, dividers, subtle separators |
| **Outline Variant** | `#d0c5b6` | Card borders, input borders |
| **Error Red** | `#ba1a1a` | Error messages, validation failures |
| **Inverse Surface** | `#32302c` | Footer dark background, dark overlays |

### Color Usage Rules ❌✅
- ✅ Chỉ dùng palette trên — không thêm màu mới
- ✅ Gold dùng tiết chế — chỉ cho CTAs, brand accents, highlights
- ✅ `rgba()` của màu hiện có được phép: `rgba(206, 175, 117, 0.16)` cho gold tint
- ❌ Không dùng màu nguyên (red, blue, green)
- ❌ Không dùng Tailwind default colors (blue-500, red-400...)
- ❌ Không hardcode hex colors — luôn dùng tokens

---

## ✍️ Typography Language

### Font Families — Vai Trò Rõ Ràng

| Font | Token | Khi nào dùng | Tính cách |
|------|-------|-------------|----------|
| **Playfair Display** | `font-serif` | H1, H2, Hero headlines, display text | Editorial luxury, sang trọng, thu hút |
| **DM Sans** | `font-sans` | Body text, UI, buttons, navigation | Clean, hiện đại, dễ đọc |
| **EB Garamond Italic** | `font-label-italic` | Category labels, subtle captions, quotes | Tinh tế, italic mềm mại |
| **Inter** | `font-af` | Small UI text, metadata, tiny labels | Functional, compact |

### Type Scale & Hierarchy

```tsx
// Hero / Display — Playfair Display
className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-cocoa tracking-tight leading-[115%]"

// Section Heading — Playfair Display
className="font-serif text-3xl md:text-4xl text-cocoa"

// Subheading — DM Sans
className="font-sans text-lg md:text-xl text-body-text font-medium"

// Body Text — DM Sans
className="font-sans text-sm md:text-base text-body-text/70 leading-relaxed"

// Caption / Label — EB Garamond Italic
className="font-label-italic text-gold uppercase tracking-[0.2em] text-xs"

// Tiny UI — Inter
className="font-af text-[10px] sm:text-xs text-body-text/60"
```

### Typography Rules ❌✅
- ✅ Playfair Display cho tất cả headings lớn
- ✅ DM Sans cho body, UI, buttons
- ✅ Letter spacing âm cho display type: `tracking-tight`
- ✅ Wide letter spacing cho uppercase labels: `tracking-[0.2em]`
- ✅ Line height 1.1-1.15 cho headings, 1.5-1.6 cho body
- ❌ Không dùng font system default
- ❌ Không dùng `font-mono` cho headings (chỉ cho code/numbers nếu cần)

---

## 📐 Spacing & Layout Language

### Spacing Scale (4px Grid)
```
4px   → gap-1, p-1
8px   → gap-2, p-2
12px  → gap-3, p-3
16px  → gap-4, p-4 (card padding cơ bản)
20px  → gap-5, p-5
24px  → gap-6, p-6
32px  → gap-8, p-8
40px  → gap-10, p-10
48px  → gap-12, p-12 (section gap nhỏ)
64px  → gap-16, py-16 (section gap tiêu chuẩn)
80px  → gap-20, py-20
96px  → py-24 (section gap lớn desktop)
```

### Layout Patterns

#### Section Spacing
```tsx
// Standard Section
<section className="py-16 md:py-24 px-4">
  {/* Content */}
</section>

// Hero / Large Section
<section className="min-h-screen pt-28 pb-16 px-4">
  {/* Content */}
</section>

// Compact Section
<section className="py-12 md:py-16 px-4">
  {/* Content */}
</section>
```

#### Container Widths
```tsx
// Standard Content Width
<div className="max-w-7xl mx-auto">

// Narrow Content (text-heavy)
<div className="max-w-2xl mx-auto">

// Wide Layout (product grids)
<div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
```

#### Grid Patterns
```tsx
// Product Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">

// Feature Grid (3 columns)
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

// Two Column Layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
```

---

## 🔲 Border Radius & Shapes

### Standard Radius Values
| Element | Radius | Class/Token | Visual Feel |
|---------|--------|-------------|------------|
| Buttons | 4px | `rounded` | Sharp, modern, editorial |
| Small cards | 12px | `rounded-xl` | Soft, approachable |
| Large cards | 16px | `rounded-2xl` | Gentle, premium |
| Hero cards | 24px | `rounded-3xl` or `--radius-hero-card` | Luxurious, spacious |
| Navigation pill | 50px | `rounded-full` or `--radius-nav` | Floating, pill-style |
| Badges | Full | `rounded-full` | Organic, soft |

### Special Shapes

#### Arch Card (Signature Style)
```tsx
// Unique to category cards — top rounded 120px, bottom 24px
<div className="arch-card overflow-hidden">
  <img src={categoryImage} className="aspect-square object-cover" />
  <div className="p-6">
    <h3 className="font-serif text-xl">{name}</h3>
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

## ❄️ Glass & Frosted Effects — Signature Visual

### Available Glass Classes

#### `.glass-nav` — Navigation Bar
```css
background: rgba(251, 246, 240, 0.85);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
```
**Khi dùng:** Sticky navigation, floating header

#### `.soft-glass` — General Panels
```css
background: rgba(255, 255, 255, 0.78);
backdrop-filter: blur(18px);
border: 1px solid rgba(222, 226, 222, 0.75);
box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 2px 0px, rgba(0, 0, 0, 0.04) 0px 0px 0px 5px;
```
**Khi dùng:** Side panels, modal overlays, info cards

#### `.frosted-hero-card` — Hero Overlays
```css
background: rgba(255, 255, 255, 0.78);
backdrop-filter: blur(24px);
border: 1px solid rgba(222, 226, 222, 0.65);
```
**Khi dùng:** Text overlays on hero images, feature callouts

#### `.floating-pill-nav` — Floating Navigation Pills
```css
background: rgba(253, 251, 247, 0.85);
border: 1px solid rgba(206, 175, 117, 0.15);
box-shadow: rgba(65, 44, 32, 0.08) 0px 2px 12px 0px;
border-radius: 50px;
```
**Khi dùng:** Floating action buttons, category pills

### Usage Examples

```tsx
// Hero text overlay
<div className="frosted-hero-card max-w-2xl mx-auto p-8">
  <h1 className="font-serif text-5xl text-cocoa">Headline</h1>
  <p className="text-body-text mt-4">Description</p>
</div>

// Floating nav
<nav className="glass-nav sticky top-0 z-50 px-6 py-4">
  {/* Navigation items */}
</nav>

// Info card panel
<aside className="soft-glass rounded-xl p-6">
  {/* Sidebar content */}
</aside>
```

---

## 🌑 Shadows — Depth & Elevation

### Shadow System

| Token | Value | Khi nào dùng |
|-------|-------|-------------|
| `--shadow-sm` | `rgba(0,0,0,0.15) 0px 2px 6px 0px` | Floating elements, nav |
| `--shadow-subtle` | `rgb(222,226,222) 0px 0px 0px 1px` | Card borders nhẹ |
| `--shadow-subtle-2` | `rgba(0,0,0,0.08) 0px 1px 1px, 0px 4px 5px` | Card layers |
| `--shadow-soft-deep` | `0 30px 60px -15px rgba(65,44,32,0.08)` | Hero cards, featured sections |
| `--shadow-xl` | `0 20px 40px -10px rgba(65,44,32,0.1)` | Modals, drawers |

### Usage Pattern
```tsx
// Subtle card
<div className="bg-white rounded-2xl shadow-[var(--shadow-subtle-2)]">

// Elevated card with hover
<div className="shadow-sm hover:shadow-xl transition-shadow duration-300">

// Hero featured card
<div className="shadow-[var(--shadow-soft-deep)]">
```

---

## 🎬 Animation Language — Subtle & Purposeful

### Motion Principles
1. **Subtle entrance** — Fade-in + translateY, không quá mạnh
2. **Purposeful hover** — Scale 1.02-1.05, không bounce quá
3. **Organic decorations** — Float, sway cho decorative elements
4. **Scroll-triggered** — whileInView với `once: true`, không lặp lại
5. **Timing:** 0.5-0.8s cho UI, 2-8s cho decorative background animations

### Standard Animation Patterns

#### Entrance Animation (Scroll-Triggered)
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

#### Staggered List Items
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

#### Button Interactions
```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.02 }}
  className="bg-gold text-white px-6 py-3 rounded-full"
>
  {text}
</motion.button>
```

#### Floating Decorative Elements
```tsx
<motion.img
  src={yarnImage}
  className="absolute w-28 h-28 pointer-events-none"
  animate={{ y: [0, -18, 0], rotate: [0, 6, -6, 0] }}
  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
/>
```

### CSS Animations (For Simple Cases)

```css
/* Floating yarn balls */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(1deg); }
}

/* Yarn sway */
@keyframes yarn-sway {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
}

/* Usage */
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-yarn-sway { animation: yarn-sway 2s ease-in-out infinite; }
```

---

## 🧩 Component Design Patterns

### Product Card

**Visual DNA:**
- Aspect ratio 4:5 for product image
- Gold badge for category (top-left)
- Heart icon wishlist (top-right)
- Hover: lift up + shadow increase + image scale 1.05
- Two-button action row: "Thêm vào giỏ" (outline) + "Xem thêm" (solid gold)

```tsx
<article className="group flex h-full cursor-pointer flex-col overflow-hidden 
  rounded-2xl border border-brand-primary/10 bg-white shadow-sm 
  transition duration-300 hover:-translate-y-1.5 hover:shadow-md">
  
  {/* Image */}
  <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F3EC]">
    <img className="h-full w-full object-cover transition-transform 
      duration-700 group-hover:scale-105" />
    
    {/* Category badge */}
    <span className="absolute left-4 top-4 rounded-full bg-brand-bg/95 
      px-3 py-1 text-[10px] font-bold uppercase tracking-wider 
      text-brand-primary shadow-sm">
      {category}
    </span>
    
    {/* Wishlist heart */}
    <button className="absolute right-4 top-4 rounded-full bg-white/90 
      p-2.5 text-brand-fb shadow-sm hover:text-[#B96E73]">
      <Heart size={16} />
    </button>
  </div>
  
  {/* Content */}
  <div className="flex flex-1 flex-col p-5">
    <h3 className="font-serif text-base lg:text-lg font-bold text-brand-fb">
      {name}
    </h3>
    <p className="mt-2 line-clamp-2 text-sm text-brand-fb/65">
      {description}
    </p>
    <div className="mt-4 text-lg font-black text-brand-primary">
      {price}
    </div>
    
    {/* Actions */}
    <div className="mt-auto pt-5 grid grid-cols-2 gap-2">
      <button className="rounded-full border border-brand-primary/25 
        bg-white px-3 py-2.5 text-xs font-bold hover:bg-brand-bg">
        Thêm vào giỏ
      </button>
      <button className="rounded-full bg-brand-primary px-3 py-2.5 
        text-xs font-bold text-white hover:bg-brand-primary/90">
        Xem thêm
      </button>
    </div>
  </div>
</article>
```

### Hero Section Pattern

**Visual DNA:**
- Full-width background with texture overlay
- Frosted glass card for text overlay
- Playfair Display hero headline (48-72px)
- Micro badge ribbon at top (Gold, uppercase, tiny)
- Two CTA buttons: Primary (gold solid) + Secondary (white outline)
- Stats counters below CTAs (100%, 5.0★, 4.0+)
- Floating yarn decorations with animations
- SVG animated threads connecting yarn to central product

```tsx
<section className="relative min-h-screen pt-28 pb-16 flex items-center 
  overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-brand-bg to-[#FCF9F3]">
  
  {/* Texture overlay */}
  <div className="absolute inset-0 opacity-[0.08] pointer-events-none 
    mix-blend-multiply" 
    style={{ backgroundImage: `url(${texture})` }} />
  
  {/* Animated SVG threads (optional — advanced) */}
  <svg className="absolute inset-0 pointer-events-none hidden lg:block">
    <motion.path
      d="M 170 230 C 350 250, 450 300, 620 370"
      stroke="rgba(180, 130, 95, 0.45)"
      strokeWidth="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2.2, delay: 0.4 }}
    />
  </svg>
  
  <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
    
    {/* Left: Content */}
    <div className="lg:col-span-7 text-center lg:text-left">
      
      {/* Micro badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 bg-brand-primary/10 
          text-brand-primary px-4 py-1.5 rounded-full text-xs 
          font-semibold uppercase tracking-wider mb-6">
        <Sparkles size={14} />
        <span>100% Khâu Tay</span>
      </motion.div>
      
      {/* Hero headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl 
          text-brand-fb tracking-tight leading-[115%] mb-6">
        Sản phẩm <span className="text-brand-primary">len thủ công</span> 
        cho những khoảnh khắc <span className="italic">ấm áp</span>
      </motion.h1>
      
      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-brand-fb/70 text-base max-w-xl mx-auto lg:mx-0 
          leading-relaxed mb-8">
        {description}
      </motion.p>
      
      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        
        <button className="bg-brand-primary text-white px-7 py-4 
          rounded-full font-semibold text-xs uppercase tracking-wider 
          shadow-md hover:shadow-lg hover:shadow-brand-primary/25 
          flex items-center gap-2 justify-center">
          <ShoppingBag size={15} />
          Khám phá bộ sưu tập
        </button>
        
        <button className="bg-white/80 text-brand-fb border 
          border-brand-primary/20 hover:border-brand-primary px-7 py-4 
          rounded-full font-semibold text-xs uppercase tracking-wider 
          flex items-center gap-2 justify-center">
          Mua ngay
          <ArrowRight size={15} />
        </button>
      </motion.div>
      
      {/* Stats counters */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="grid grid-cols-3 gap-6 pt-10 mt-10 
          border-t border-brand-primary/10 max-w-md mx-auto lg:mx-0">
        <div>
          <span className="block font-mono text-2xl font-bold 
            text-brand-primary">100%</span>
          <span className="text-xs text-brand-fb/60">Khâu tay Việt</span>
        </div>
        <div>
          <span className="block font-mono text-2xl font-bold 
            text-brand-primary">5.0 ★</span>
          <span className="text-xs text-brand-fb/60">Đánh giá</span>
        </div>
        <div>
          <span className="block font-mono text-2xl font-bold 
            text-brand-primary">4.0+</span>
          <span className="text-xs text-brand-fb/60">Mẫu sợi</span>
        </div>
      </motion.div>
    </div>
    
    {/* Right: Hero visual with floating yarn */}
    <div className="lg:col-span-5 relative h-[500px]">
      
      {/* Spinning ring decoration */}
      <div className="absolute w-[380px] h-[380px] rounded-full 
        border border-dashed border-brand-primary/10 animate-spin-slow" />
      
      {/* Floating yarn balls */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute left-0 top-6 w-28 h-28 animate-float">
        <div className="p-1 rounded-2xl bg-white shadow-md 
          border border-brand-primary/10">
          <img src={yarnCream} className="w-full h-full object-cover 
            rounded-xl" />
          <span className="absolute -bottom-2 -right-1 bg-brand-primary 
            text-white text-[9px] px-2 py-0.5 rounded-full">
            Bông Cúc Kem
          </span>
        </div>
      </motion.div>
      
      {/* Central product showcase */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15, delay: 0.2 }}
        className="w-68 h-68 relative">
        
        {/* Glowing background */}
        <div className="absolute inset-0 bg-gradient-to-tr 
          from-brand-secondary/30 to-brand-primary/15 rounded-full 
          blur-2xl animate-pulse" />
        
        {/* Product card */}
        <div className="w-full h-full p-2.5 rounded-[36px] bg-white 
          shadow-xl border border-brand-border flex items-center 
          justify-center overflow-hidden group">
          <img src={heroProduct} 
            className="w-full h-full object-cover rounded-[28px] 
            group-hover:scale-105 transition-transform duration-700" />
          
          {/* Product badge */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 
            soft-glass px-4 py-2 font-serif text-xs font-bold 
            border border-brand-primary/20 flex items-center gap-1.5">
            <Flower className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
            <span>Túi Len Hoa Nổi Pastel</span>
          </div>
        </div>
      </motion.div>
      
    </div>
  </div>
</section>
```

### Section Header Pattern

**Standard layout** cho mọi section:

```tsx
<div className="text-center max-w-2xl mx-auto mb-12">
  {/* Micro label */}
  <p className="text-gold uppercase tracking-[0.2em] text-xs 
    font-semibold mb-3">
    {subtitle}
  </p>
  
  {/* Main heading */}
  <h2 className="font-serif text-3xl md:text-4xl text-cocoa">
    {title}
  </h2>
  
  {/* Description */}
  <p className="text-body-text/70 mt-4 leading-relaxed">
    {description}
  </p>
</div>
```

### CTA Button Variants

#### Primary (Gold Solid)
```tsx
<button className="bg-gold hover:bg-gold/90 text-white px-6 py-3 
  rounded-full font-sans font-medium transition-colors 
  flex items-center gap-2">
  {text}
</button>
```

#### Secondary (Gold Outline)
```tsx
<button className="border-2 border-gold text-gold hover:bg-gold 
  hover:text-white px-6 py-3 rounded-full transition-all">
  {text}
</button>
```

#### Tertiary (Ghost)
```tsx
<button className="text-cocoa hover:text-gold px-6 py-3 
  font-medium transition-colors">
  {text}
</button>
```

### Form Input Pattern

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-cocoa">
    {label}
  </label>
  <input
    type="text"
    className="w-full px-4 py-3 border border-outline-variant 
      rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 
      outline-none transition-all"
    placeholder={placeholder}
  />
</div>
```

---

## 🖼️ Image & Media Patterns

### Product Images
- **Aspect ratio:** 4:5 (portrait) — `aspect-[4/5]`
- **Background:** Subtle warm beige `#F8F3EC` nếu ảnh chưa load
- **Hover:** Scale 1.05, duration 700ms
- **Loading:** `loading="lazy"` cho performance

### Hero / Banner Images
- **Treatment:** Texture overlay (opacity 0.08, mix-blend-multiply)
- **Object fit:** `object-cover` — đảm bảo fill toàn bộ
- **Overlay text:** Frosted glass card (`.frosted-hero-card`)

### Decorative Yarn Elements
- **Style:** Floating animations, organic rotation
- **Opacity:** 0.8 — không che khuất nội dung
- **Drop shadow:** `drop-shadow-xl` hoặc `.yarn-glow` (gold glow)
- **Placement:** Absolute positioned, pointer-events-none

### Icon System
- **Library:** Lucide React only
- **Sizes:** 16px (`w-4 h-4`), 20px (`w-5 h-5`), 24px (`w-6 h-6`)
- **Colors:** Inherit from parent text color, hoặc `text-brand-primary`

---

## 📱 Responsive Design Language

### Breakpoints (Tailwind Default)
```
sm:  640px  — Small tablets
md:  768px  — Tablets
lg:  1024px — Small laptops
xl:  1280px — Desktops
2xl: 1536px — Large screens
```

### Mobile-First Approach

#### Typography Scaling
```tsx
// Hero headline
className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"

// Section heading
className="text-2xl md:text-3xl lg:text-4xl"

// Body text
className="text-sm md:text-base"
```

#### Spacing Scaling
```tsx
// Section padding
className="py-12 md:py-16 lg:py-24"

// Container padding
className="px-4 sm:px-6 lg:px-8"
```

#### Grid Responsiveness
```tsx
// Product grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"

// Two-column layout
className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
```

#### Navigation Responsive
```tsx
// Desktop: Horizontal nav, glass effect
// Mobile: Hamburger → Drawer (motion slide-in from right)

<nav className="glass-nav sticky top-0 z-50">
  <div className="hidden lg:flex items-center gap-8">
    {/* Desktop nav items */}
  </div>
  
  <button className="lg:hidden" onClick={toggleMobileMenu}>
    <Menu size={24} />
  </button>
</nav>

{/* Mobile drawer */}
<AnimatePresence>
  {mobileMenuOpen && (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50">
      {/* Mobile menu content */}
    </motion.aside>
  )}
</AnimatePresence>
```

---

## ♿ Accessibility Patterns

### Focus States
```tsx
// Links
className="focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"

// Buttons
className="focus-visible:outline-none focus-visible:ring-2 
  focus-visible:ring-gold focus-visible:ring-offset-2"
```

### ARIA Labels
```tsx
// Icon buttons
<button aria-label="Thêm vào yêu thích">
  <Heart size={16} />
</button>

// Navigation
<nav aria-label="Main navigation">
  {/* Nav items */}
</nav>
```

### Keyboard Navigation
- Tất cả interactive elements phải focus được
- Tab order hợp lý (từ trái sang phải, trên xuống dưới)
- Escape key đóng modals/drawers

---

## 🎯 Best Practices — DO's & DON'Ts

### ✅ DO

1. **Màu sắc:**
   - Dùng design tokens — `bg-brand-bg`, `text-cocoa`
   - Gold accent tiết chế — chỉ CTAs và highlights
   - Warm palette nhất quán

2. **Typography:**
   - Playfair Display cho headings lớn
   - DM Sans cho body, UI
   - Negative letter spacing cho display type
   - Line height rộng cho body text (1.5-1.6)

3. **Spacing:**
   - 4px grid — gap-4, p-4, py-16
   - Generous section spacing (64-96px)
   - Breathing space around headings

4. **Animations:**
   - Subtle entrance (fade-in + translateY)
   - Scroll-triggered với `once: true`
   - Floating decorations (2-8s)
   - Hover scale 1.02-1.05

5. **Images:**
   - Aspect ratio nhất quán (4:5 cho products)
   - SafeImage component cho error handling
   - Lazy loading
   - Hover scale 1.05

6. **Responsive:**
   - Mobile-first approach
   - Test 375px, 768px, 1280px
   - Typography scaling
   - Grid → Stack trên mobile

### ❌ DON'T

1. **Màu sắc:**
   - ❌ Thêm màu mới ngoài palette
   - ❌ Dùng màu nguyên (red, blue, green)
   - ❌ Hardcode hex — `bg-[#CEAF75]`
   - ❌ Tailwind default colors (blue-500...)

2. **Typography:**
   - ❌ Font system default
   - ❌ `font-mono` cho headings
   - ❌ Uppercase toàn bộ paragraph
   - ❌ Line height quá chật cho body text

3. **Layout:**
   - ❌ Inline styles — `style={{...}}`
   - ❌ `!important` — giải quyết bằng specificity
   - ❌ Spacing không theo 4px grid
   - ❌ Fixed widths — dùng max-width

4. **Animations:**
   - ❌ Quá mạnh — bounce, shake
   - ❌ Animation lặp lại khi scroll
   - ❌ Duration > 1s cho UI interactions
   - ❌ Disable `prefers-reduced-motion`

5. **General:**
   - ❌ Dark mode (trang này light only)
   - ❌ Stock photos generic
   - ❌ Heavy drop shadows
   - ❌ Components quá phức tạp

---

## 📦 Quick Reference Cheatsheet

### Color Palette
```
Nền:     #FAF6F0 (Brand BG) / #FBF6F0 (Ivory) / #FFFDF9 (Cream)
Chữ:     #412C20 (Cocoa heading) / #75645A (Body text)
Gold:    #CEAF75 (Primary accent)
Pink:    #D9A7A7 (Secondary accent)
Border:  #E8DDD1 (Divider) / #d0c5b6 (Outline variant)
Dark:    #32302c (Inverse surface, footer)
Success: #A8B59A (Sage green)
Error:   #ba1a1a
```

### Fonts
```
Heading:      Playfair Display (font-serif)
Body/UI:      DM Sans (font-sans)
Label Italic: EB Garamond (font-label-italic)
Small UI:     Inter (font-af)
```

### Spacing
```
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
Section: py-16 md:py-24
Card: p-4 hoặc p-5
```

### Radius
```
Button:    rounded (4px)
Card:      rounded-xl (12px) hoặc rounded-2xl (16px)
Hero card: rounded-3xl (24px)
Pill:      rounded-full
```

### Glass Effects
```
.glass-nav         → Navigation
.soft-glass        → Panels
.frosted-hero-card → Hero overlays
.floating-pill-nav → Nav pills
```

### Animations
```
Entrance: initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
Hover:    whileHover={{ scale: 1.02 }}
Tap:      whileTap={{ scale: 0.95 }}
Float:    animate-float (6s)
```

---

## 🔗 Related Documentation

- **Design Tokens:** [../guides/DESIGN-TOKENS.md](../guides/DESIGN-TOKENS.md)
- **Design Rules:** [../rules/design.md](../rules/design.md)
- **Code Standards:** [../rules/CODE-STANDARDS.md](../rules/CODE-STANDARDS.md)
- **Component Patterns:** [../components/patterns.md](../components/patterns.md)

---

**Last Updated:** 2026-06-30  
**Version:** 1.0  
**Status:** ✅ Production-ready
