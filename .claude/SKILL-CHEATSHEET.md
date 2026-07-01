# 🚀 Skill Cheatsheet — Quick Reference

> Copy-paste commands để invoke skills nhanh nhất

---

## 📋 Skill Command Templates

### 🎨 design-review

**Quick check:**
```
Check my design
```

**Specific file:**
```
Check design in src/components/Hero.tsx
```

**Multiple files:**
```
Review design in src/pages/ProductPage.tsx and src/components/ProductCard.tsx
```

**Deep audit:**
```
Deep design audit on all components
```

---

### 🧩 component-gen

**Basic component:**
```
Create {ComponentName} component
```

**With details:**
```
Create {ComponentName} component with {props}, {features}
```

**Examples:**
```
Create ProductCard component
Create PriceTag component with price and currency props
Create CategoryCard component with arch style
Create TextInput component for forms with label and validation
Create Button component with variants: primary, secondary, ghost
```

---

### ✍️ seo-content

**Product description:**
```
Write product description for {product name}
```

**Blog post:**
```
Create blog post about {topic}
```

**Meta tags:**
```
Generate meta tags for {page name}
```

**Examples:**
```
Write product description for handmade crochet bag
Create blog post about yarn care tips
Write SEO content for category page: Túi Len Handmade
Generate meta tags for homepage
Need product description in Vietnamese for wool scarf
```

---

### 🛒 cart-checkout

**Cart UI:**
```
Build cart drawer
Create shopping cart sidebar
```

**Checkout:**
```
Implement checkout flow
Build checkout form with shipping and payment
```

**Full flow:**
```
Implement full cart-to-checkout flow
```

**Examples:**
```
Build cart drawer that slides in from right
Create checkout page with multi-step form
Implement add to cart functionality
Build shopping cart with quantity controls
Create order confirmation page
```

---

## 🎯 Common Scenarios

### Scenario 1: Building New Page with Components
```
1. Create Hero component with background image and CTA
2. Create ProductGrid component with filtering
3. Create Newsletter component for footer
4. Check design consistency
```

### Scenario 2: Product Launch Content
```
1. Write product description for {new product}
2. Create blog post about {product story}
3. Generate meta tags for product page
```

### Scenario 3: E-Commerce Setup
```
1. Build cart drawer
2. Implement checkout flow
3. Create order confirmation page
```

### Scenario 4: Design Audit Before Merge
```
1. Check my design changes
2. [Fix violations if any]
3. Deep design audit on all components
```

---

## 💬 Conversation Patterns

### Pattern A: Component → Review
```
You: Create ProductCard component with image, price, favorite button
AI: [Generates ProductCard.tsx]

You: Check design in src/components/ProductCard.tsx
AI: [Reviews design]
```

### Pattern B: Content Batch
```
You: Write product descriptions for:
     1. Crochet bag - pastel colors
     2. Wool scarf - winter collection
     3. Knit hat - beanie style
     
AI: [Generates 3 descriptions]
```

### Pattern C: Feature Implementation
```
You: Build cart drawer
AI: [Generates CartDrawer.tsx]

You: Now implement checkout flow
AI: [Generates CheckoutPage.tsx, forms, etc.]

You: Check design across all new files
AI: [Reviews cart + checkout components]
```

---

## ⚡ Speed Commands

### Ultra-fast Requests

**Design:**
```
✅ "Check design" (auto-detects changed files)
✅ "Fix design violations" (after review found issues)
```

**Component:**
```
✅ "Make ProductCard" (AI asks for details)
✅ "Duplicate Hero as Hero2 with gradient variant"
```

**Content:**
```
✅ "Describe this product" (with image/details in context)
✅ "Blog about handmade crafts"
```

**Cart:**
```
✅ "Add cart drawer"
✅ "Checkout page"
```

---

## 🔄 Multi-Step Workflows

### Workflow 1: New Feature (UI → Content)
```
Step 1: Create FeatureSection component
Step 2: Write marketing copy for feature
Step 3: Generate meta description
Step 4: Check design consistency
```

### Workflow 2: Product Page Setup
```
Step 1: Create ProductDetail component
Step 2: Create AddToCart component
Step 3: Write product description template
Step 4: Implement cart drawer
Step 5: Review all designs
```

### Workflow 3: Content Campaign
```
Step 1: Create blog post about {topic}
Step 2: Write 5 product descriptions
Step 3: Generate social media captions
Step 4: SEO meta tags for all pages
```

---

## 🎨 Design Tokens Quick Access

### When to Use Which Skill

**Need color/spacing values?**
```
Don't invoke skill → Just ask:
"What's the gold color code?"
"What spacing should I use for section gaps?"

AI will reference DESIGN-TOKENS.md directly
Token cost: ~1,200 tokens (guide only)
```

**Need to validate usage?**
```
"Check design" → design-review skill
Token cost: ~60 tokens (quick check)
```

**Need full component with patterns?**
```
"Create Component" → component-gen skill
Token cost: ~7,565 tokens (with full guide)
```

---

## 📊 Token Cost Estimator

| Request | Skill Used | Token Cost |
|---------|-----------|-----------|
| "Check design" | design-review | ~60 |
| "Check design (deep)" | design-review | ~7,560 |
| "Create component" | component-gen | ~7,565 |
| "Write product description" | seo-content | ~1,735 |
| "Build cart" | cart-checkout | ~1,335 |
| "What's the gold color?" | (no skill, direct) | ~1,200 |

---

## 🚫 Common Mistakes

### ❌ Don't Say:
```
"Show me how to use design-review skill"
→ This is meta-question, not task request

"Read the design guide for me"
→ This is reference request, not skill invocation

"What does component-gen do?"
→ This is documentation question
```

### ✅ Instead Say:
```
"Check my design"
"Create ProductCard component"
"Write product description"
```

---

## 💡 Pro Tips

### Tip 1: Chain Requests
```
"Create Hero component, then check its design"
→ AI does both in sequence
```

### Tip 2: Provide Examples
```
"Create CategoryCard similar to ProductCard but with arch style"
→ AI references existing pattern
```

### Tip 3: Specify Variants Upfront
```
"Create Button with primary (gold), secondary (outline), ghost variants"
→ AI generates all variants at once
```

### Tip 4: Batch Similar Tasks
```
"Write product descriptions for items 1-5 in this list"
→ More efficient than 5 separate requests
```

---

## 📖 Full Guide Reference

**Need detailed explanations?**
→ Read [SKILL-USAGE-GUIDE.md](SKILL-USAGE-GUIDE.md)

**Need examples?**
→ See examples section in each skill in SKILL-USAGE-GUIDE.md

**Need token analysis?**
→ Read [TOKEN-ANALYSIS.md](TOKEN-ANALYSIS.md)

---

## 🔗 Quick Navigation

- [CLAUDE.md](CLAUDE.md) — Main navigation hub
- [QUICK-START.md](QUICK-START.md) — 30-second onboarding
- [SKILL-USAGE-GUIDE.md](SKILL-USAGE-GUIDE.md) — Complete skill guide
- [TOKEN-ANALYSIS.md](TOKEN-ANALYSIS.md) — Token costs

---

**Last Updated:** June 30, 2026  
**Print this for quick reference!** 📄
