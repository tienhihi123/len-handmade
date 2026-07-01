# cart-checkout

Implement shopping cart and checkout features for Len Handmade.

## When to invoke
- User asks to implement cart functionality
- "Build checkout flow"
- "Add to cart feature"
- E-commerce payment integration

## Process
1. **Understand scope:**
   - Feature type (cart display, add to cart, checkout form, payment)
   - Integration points (context, Firebase, external APIs)

2. **Read references (on-demand):**
   - `guides/E-COMMERCE-GUIDE.md` — Cart logic, checkout patterns
   - `src/context/AppContext.tsx` — Existing cart state management

3. **Implement following patterns:**
   - **Cart state:** Use AppContext (addToCart, removeFromCart, updateQuantity)
   - **Price formatting:** Use `utils/pricing.ts` helpers
   - **Validation:** Check stock, min/max quantities
   - **Checkout flow:** Multi-step (Cart → Shipping → Payment → Confirmation)
   - **Persistence:** localStorage for cart, Firebase for orders

4. **Components to consider:**
   - Cart sidebar/drawer (motion slide-in)
   - Cart item card (quantity controls, remove button)
   - Checkout form (shipping, payment)
   - Order summary
   - Success/confirmation page

## Standard cart patterns
- **Add to cart:** Toast notification + cart count badge update
- **Cart drawer:** Slide-in from right, glass effect overlay
- **Quantity controls:** -/+ buttons, input field (1-99 range)
- **Price display:** `formatPrice()` utility, show subtotal/total
- **Empty state:** Friendly message + "Khám phá sản phẩm" CTA

## References
- `guides/E-COMMERCE-GUIDE.md` — Full e-commerce patterns
- `src/context/AppContext.tsx` — Cart state management
- `src/utils/pricing.ts` — Price utilities

## Output
- Component files (CartDrawer.tsx, CheckoutForm.tsx, etc.)
- Updated context if needed
- Usage instructions
