# 🚀 Quick Start — .claude/ Documentation

> **For AI:** Read this first when entering new session  
> **For Humans:** Your navigation guide to project docs

---

## 📍 You Are Here

```
.claude/
├─ 📖 QUICK-START.md         ← YOU ARE HERE
├─ 📋 CLAUDE.md              ← Full navigation hub
├─ 📊 TOKEN-ANALYSIS.md      ← Token efficiency details
└─ 📂 README.md              ← Directory structure
```

---

## ⚡ 30-Second Onboarding

### For AI Assistants:

1. **Skills are lightweight** (~335 tokens total) — Auto-loaded
2. **Guides are reference docs** (~14,000 tokens total) — Load on-demand only
3. **Rules are always read** (~3,300 tokens) — Core standards

**Token cost this session: ~3,635 tokens (base) + guides as needed**

---

## 🎯 What to Read When

### Backend/Logic Work
```
✅ Read: rules/CODE-STANDARDS.md, rules/tech-defaults.md
❌ Skip: All design guides
Token cost: ~3,635 (base only)
```

### Quick UI Color/Spacing Change
```
✅ Read: guides/DESIGN-TOKENS.md
❌ Skip: DESIGN-LANGUAGE.md (too detailed for quick change)
Token cost: ~3,635 + 1,200 = 4,835
```

### Building New Component
```
✅ Read: guides/DESIGN-LANGUAGE.md (full patterns)
✅ Or invoke: /component-gen skill
Token cost: ~3,635 + 7,500 = 11,135
```

### Marketing Content
```
✅ Read: guides/CONTENT-STRATEGY.md
✅ Or invoke: /seo-content skill
Token cost: ~3,635 + 1,400 = 5,035
```

### Design Review
```
✅ Invoke: /design-review skill
✅ Read guide only if violations found
Token cost: ~3,635 (no guide needed for quick check)
```

---

## 🛠️ Available Skills (Invoke These)

| Skill | Command | When to Use |
|-------|---------|-------------|
| **design-review** | User asks "check design" | Audit UI code vs design system |
| **component-gen** | User asks "create component" | Generate React components |
| **seo-content** | User asks "write content" | Create Vietnamese SEO content |
| **cart-checkout** | User asks "build cart" | E-commerce features |

**Each skill ~60-75 tokens, references guides on-demand**

---

## 📖 Quick Reference Guides

### Always Useful
- [DESIGN-TOKENS.md](guides/DESIGN-TOKENS.md) — Colors, spacing, typography (1,200 tokens)
- [CODE-STANDARDS.md](rules/CODE-STANDARDS.md) — Coding conventions (1,500 tokens)

### When Building UI
- [DESIGN-LANGUAGE.md](guides/DESIGN-LANGUAGE.md) — Complete design system (7,500 tokens)
- [Component Patterns](components/patterns.md) — Quick patterns (1,800 tokens)

### When Writing Content
- [CONTENT-STRATEGY.md](guides/CONTENT-STRATEGY.md) — Brand voice (1,400 tokens)
- [SEO-CHECKLIST.md](guides/SEO-CHECKLIST.md) — SEO rules (900 tokens)

### When Building E-Commerce
- [E-COMMERCE-GUIDE.md](guides/E-COMMERCE-GUIDE.md) — Cart/checkout (1,000 tokens)

---

## 🎨 Quick Design Cheat Sheet

**Colors:**
```
Gold:   #CEAF75 (bg-gold) — Primary accent
Cocoa:  #412C20 (text-cocoa) — Headings
Ivory:  #FBF6F0 (bg-ivory) — Background
```

**Fonts:**
```
Headings: font-serif (Playfair Display)
Body:     font-sans (DM Sans)
Labels:   font-label-italic (EB Garamond)
```

**Spacing:**
```
4px grid: gap-4, p-4, py-16
Sections: py-16 md:py-24
```

**Animations:**
```tsx
initial={{ opacity: 0, y: 24 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

Full reference: [guides/DESIGN-TOKENS.md](guides/DESIGN-TOKENS.md)

---

## 🚫 What NOT to Do

### ❌ DON'T:
- Read all guides at once (waste ~14,000 tokens)
- Read DESIGN-LANGUAGE.md for simple color changes (use DESIGN-TOKENS.md)
- Skip skills and jump to guides (skills have quick inline rules)

### ✅ DO:
- Start with skills for tasks
- Read DESIGN-TOKENS.md for quick lookups
- Read full guides only when building complex features
- Check CLAUDE.md for detailed workflows

---

## 📊 Token Budget

```
Base load (rules + skills):    ~3,635 tokens
+ DESIGN-TOKENS (quick ref):   ~1,200 tokens
+ DESIGN-LANGUAGE (full):      ~7,500 tokens
+ CONTENT-STRATEGY:            ~1,400 tokens
+ E-COMMERCE-GUIDE:            ~1,000 tokens

Budget: 200,000 tokens total
Typical session: 5,000-15,000 tokens
```

**Strategy:** Load only what you need for current task

---

## 🔗 Entry Points by Role

### Frontend Developer
1. [DESIGN-TOKENS.md](guides/DESIGN-TOKENS.md)
2. [CODE-STANDARDS.md](rules/CODE-STANDARDS.md)
3. Invoke `/component-gen` when needed

### Content Writer
1. [CONTENT-STRATEGY.md](guides/CONTENT-STRATEGY.md)
2. [SEO-CHECKLIST.md](guides/SEO-CHECKLIST.md)
3. Invoke `/seo-content` when needed

### Backend Developer
1. [CODE-STANDARDS.md](rules/CODE-STANDARDS.md)
2. [tech-defaults.md](rules/tech-defaults.md)
3. Skip all design guides

### Full-Stack (Everything)
1. [CLAUDE.md](CLAUDE.md) — Read full navigation
2. Load guides as needed per task

---

## 📝 TL;DR

1. **Skills** (~335 tokens) — Auto-loaded, lightweight invocation instructions
2. **Guides** (~14,000 tokens) — Reference docs, load on-demand only
3. **Rules** (~3,300 tokens) — Auto-loaded, core standards

**Total base load: ~3,635 tokens (98% lighter than before!)**

**Next step:** Open [CLAUDE.md](CLAUDE.md) for full navigation.

---

**Updated:** June 30, 2026  
**Status:** ✅ Production-ready
