# 📚 .claude/ Documentation Structure

> **Optimized for token efficiency** — Skills (~335 tokens), Guides (lazy-loaded)

---

## 📂 Directory Structure

```
.claude/
├─ CLAUDE.md                     # Navigation hub — read this first
├─ README.md                     # This file — structure explanation
├─ RESTRUCTURE-SUMMARY.md        # Restructure changelog (June 30, 2026)
│
├─ skills/                       # ⚡ Lightweight invocation instructions (auto-load)
│  ├─ design-review.md           ~60 tokens — Audit UI code
│  ├─ component-gen.md           ~65 tokens — Generate components
│  ├─ seo-content.md             ~75 tokens — Create SEO content
│  ├─ cart-checkout.md           ~65 tokens — E-commerce features
│  └─ design-system.md           ~70 tokens — Design validation
│  Total: ~335 tokens
│
├─ guides/                       # 📖 Reference documentation (lazy-load)
│  ├─ PROJECT-OVERVIEW.md        ~1,500 tokens
│  ├─ DESIGN-TOKENS.md           ~1,200 tokens — Quick color/spacing lookup
│  ├─ DESIGN-LANGUAGE.md         ~7,500 tokens — Complete design system
│  ├─ TECH-STACK.md              ~700 tokens
│  ├─ SEO-CHECKLIST.md           ~900 tokens
│  ├─ CONTENT-STRATEGY.md        ~1,400 tokens — Brand voice
│  ├─ CONTENT-STRATEGY-EXTENDED.md ~1,200 tokens — Templates
│  ├─ E-COMMERCE-GUIDE.md        ~1,000 tokens — Cart/checkout patterns
│  └─ COMPONENT-BUILD-GUIDE.md   ~800 tokens — Component templates
│  Total: ~16,200 tokens (load on-demand)
│
├─ rules/                        # 📏 Core rules (small, auto-load)
│  ├─ design.md                  ~600 tokens — Design principles
│  ├─ CODE-STANDARDS.md          ~1,500 tokens — Coding conventions
│  ├─ tech-defaults.md           ~700 tokens — Technical standards
│  └─ workflow.md                ~500 tokens — Development workflow
│  Total: ~3,300 tokens
│
├─ components/                   # 🧩 Component reference
│  └─ patterns.md                ~1,800 tokens — Component patterns
│
└─ agents/                       # 🤖 Agent profiles
   └─ researcher.md              Agent configuration
```

---

## 🎯 Design Philosophy

### Skills (⚡ Always Loaded)
**Purpose:** Invocation instructions — tell AI WHEN and HOW to do tasks

**Format:**
- Short (50-80 tokens each)
- Clear trigger conditions
- Step-by-step process
- Reference guides (lazy load)

**Example:**
```markdown
# component-gen

Generate React components.

## When to invoke
- "Create [Name] component"

## Process
1. Gather requirements
2. Read guides/DESIGN-LANGUAGE.md (on-demand)
3. Generate .tsx file with TypeScript + Motion
```

---

### Guides (📖 Lazy Loaded)
**Purpose:** Full reference documentation — actual rules, patterns, code examples

**When loaded:** Only when skill references it OR when explicitly needed

**Examples:**
- `DESIGN-LANGUAGE.md` — 7,500 tokens, loaded for complex UI work
- `DESIGN-TOKENS.md` — 1,200 tokens, loaded for quick color lookup
- `E-COMMERCE-GUIDE.md` — 1,000 tokens, loaded when building cart

---

## 🚀 Quick Start

### For AI Assistants:
1. **Read first:** `CLAUDE.md` — Navigation hub
2. **Skills auto-loaded** — minimal cost (~335 tokens)
3. **Guides on-demand** — read when skill references it

### For Humans:
1. **Start here:** `CLAUDE.md`
2. **Design work:** `guides/DESIGN-TOKENS.md` → `guides/DESIGN-LANGUAGE.md`
3. **Coding:** `rules/CODE-STANDARDS.md` → `rules/tech-defaults.md`
4. **Content:** `guides/CONTENT-STRATEGY.md` → `guides/SEO-CHECKLIST.md`

---

## 📊 Token Cost Comparison

| Action | Old Structure | New Structure | Savings |
|--------|---------------|---------------|---------|
| **Quick UI tweak** | 11,000 tokens | 1,535 tokens | **86%** |
| **New component** | 11,000 tokens | 7,835 tokens | **29%** |
| **Marketing content** | 11,000 tokens | 1,735 tokens | **84%** |
| **Backend work** | 11,000 tokens | 335 tokens | **97%** |

**Average savings: ~77%**

---

## 🛠️ Available Skills

### design-review
**Trigger:** "Check design", "validate UI"  
**Does:** Audits UI code against design system  
**Reads:** `guides/DESIGN-LANGUAGE.md` (if deep validation needed)

### component-gen
**Trigger:** "Create [Name] component"  
**Does:** Generates React component with patterns  
**Reads:** `guides/DESIGN-LANGUAGE.md`, `guides/COMPONENT-BUILD-GUIDE.md`

### seo-content
**Trigger:** "Write product description", "create blog post"  
**Does:** Generates SEO-optimized Vietnamese content  
**Reads:** `guides/CONTENT-STRATEGY.md`, `guides/SEO-CHECKLIST.md`

### cart-checkout
**Trigger:** "Build cart", "implement checkout"  
**Does:** Creates e-commerce cart/checkout components  
**Reads:** `guides/E-COMMERCE-GUIDE.md`, `src/context/AppContext.tsx`

### design-system
**Trigger:** "Validate design consistency"  
**Does:** Checks design token usage  
**Reads:** `rules/design.md`

---

## 📖 Key Guides

### DESIGN-LANGUAGE.md (7,500 tokens)
**Complete design system:**
- Color palette with usage rules
- Typography hierarchy
- Component patterns with full code
- Animation examples
- Responsive design patterns

**When to read:**
- Building complex UI components
- Need code examples
- First-time design onboarding

### DESIGN-TOKENS.md (1,200 tokens)
**Quick reference:**
- Color palette (hex codes)
- Typography scale
- Spacing values
- Shadow/radius tokens

**When to read:**
- Quick color/spacing lookup
- Daily UI work
- Don't need full code examples

### E-COMMERCE-GUIDE.md (1,000 tokens)
**E-commerce patterns:**
- Cart state management
- Checkout flow
- Order processing
- Payment integration

**When to read:**
- Building cart/checkout features
- Order management

### CONTENT-STRATEGY.md (1,400 tokens)
**Brand voice:**
- Tone guidelines
- Content calendar
- Writing style
- Vietnamese language rules

**When to read:**
- Writing marketing copy
- Creating product descriptions
- Blog posts

---

## ✅ Best Practices

### DO:
- ✅ Read `CLAUDE.md` first
- ✅ Use skills for tasks (design-review, component-gen, etc.)
- ✅ Load guides only when needed
- ✅ Check `DESIGN-TOKENS.md` for quick lookups

### DON'T:
- ❌ Read all guides at once (waste tokens)
- ❌ Skip skills and jump to guides
- ❌ Duplicate content across files

---

## 🔗 Entry Points

| Task | Start Here |
|------|------------|
| **First time** | `CLAUDE.md` |
| **UI design** | `guides/DESIGN-TOKENS.md` |
| **Build component** | Invoke `/component-gen` skill |
| **Design review** | Invoke `/design-review` skill |
| **SEO content** | Invoke `/seo-content` skill |
| **E-commerce** | Invoke `/cart-checkout` skill |
| **Coding rules** | `rules/CODE-STANDARDS.md` |

---

## 📝 Changelog

### June 30, 2026 — Major Restructure
- ✅ Created proper skill files (design-review, component-gen, seo-content, cart-checkout)
- ✅ Moved documentation from `skills/` → `guides/`
- ✅ Reduced skill token cost from ~11,000 → ~335 tokens (97% reduction)
- ✅ Updated `CLAUDE.md` with new structure
- ✅ Created `RESTRUCTURE-SUMMARY.md` for detailed analysis

See `RESTRUCTURE-SUMMARY.md` for full details.

---

**Result:** Token-efficient, best-practice documentation! 🎉
