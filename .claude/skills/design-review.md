# design-review

Audit UI code against Len Handmade design system.

## When to invoke
- Before committing component/page changes
- User asks "check design", "validate UI", "review design consistency"
- After building new components

## Process
1. Identify changed .tsx/.css files (git diff or user-specified)
2. Read `guides/DESIGN-LANGUAGE.md` (on-demand, only if needed for deep validation)
3. Check violations:
   - **Colors:** Must use design tokens from `src/index.css` — no hardcoded hex
   - **Spacing:** 4px grid only (gap-4, p-4, py-16, etc.)
   - **Typography:** Playfair Display (headings), DM Sans (body), EB Garamond (labels)
   - **Glass effects:** Use predefined classes (`.glass-nav`, `.soft-glass`, `.frosted-hero-card`)
   - **Animations:** Motion with `whileInView`, duration 0.5-0.8s for UI, 2-8s for decorative
   - **Border radius:** Standard values only (rounded, rounded-xl, rounded-3xl, rounded-full)
4. Report violations with file:line references

## Quick validation rules (no file read needed)
- Colors: `bg-brand-bg`, `text-cocoa`, `text-gold` ✅ | `bg-[#CEAF75]` ❌
- Spacing: `gap-4`, `py-16` ✅ | `gap-[23px]`, `py-[37px]` ❌
- Fonts: `font-serif`, `font-sans` ✅ | `font-mono` for headings ❌
- Animations: `duration-500`, `duration-700` ✅ | `duration-1000` for UI ❌

## References (read only when deep validation needed)
- `guides/DESIGN-LANGUAGE.md` — Complete design system
- `rules/design.md` — Core design principles
- `src/index.css` — Design tokens

## Output format
```
✅ PASS — No violations found

OR

❌ VIOLATIONS FOUND:
- src/components/Hero.tsx:42 — Hardcoded color #CEAF75, use bg-gold
- src/pages/ProductPage.tsx:128 — Spacing gap-[23px] not on 4px grid
- src/components/Card.tsx:56 — Animation duration 1200ms too long for UI
```
