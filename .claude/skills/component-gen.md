# component-gen

Generate React components following Len Handmade project patterns.

## When to invoke
- User asks "create [ComponentName] component"
- "Generate product card variant"
- "Build new form component"
- "Make a button/card/section component"

## Process
1. **Gather requirements:**
   - Component name
   - Purpose/functionality
   - Props needed
   - Design variant (if any)

2. **Read references (on-demand):**
   - `guides/DESIGN-LANGUAGE.md` — For design patterns & code examples
   - `components/patterns.md` — For component templates
   - `rules/CODE-STANDARDS.md` — For naming/structure conventions

3. **Generate component with:**
   - TypeScript interface for props (PascalCase)
   - Motion animations: `initial`, `whileInView`, `transition`
   - Design tokens: `bg-brand-bg`, `text-cocoa`, etc. (NO hardcoded colors)
   - Responsive classes: mobile-first (`text-sm md:text-base lg:text-lg`)
   - Lucide React icons (if needed)
   - Default export

4. **Write to:** `src/components/{ComponentName}.tsx`

## Standard component template
```tsx
import { motion } from "motion/react";
import { IconName } from "lucide-react";

interface ComponentNameProps {
  title: string;
  variant?: "default" | "featured";
}

export default function ComponentName({ 
  title, 
  variant = "default" 
}: ComponentNameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl p-6"
    >
      {/* Component content */}
    </motion.div>
  );
}
```

## References
- `guides/DESIGN-LANGUAGE.md` — Component patterns with full code
- `components/patterns.md` — Quick pattern reference
- `rules/CODE-STANDARDS.md` — Naming conventions

## Output
- Complete `.tsx` file
- Import statement for parent
- Basic usage example
