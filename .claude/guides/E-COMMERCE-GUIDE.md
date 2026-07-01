# 🛒 Skill: E-Commerce

> Patterns cho e-commerce features — giỏ hàng, thanh toán, quản lý đơn hàng

---

## Mô Tả

Implement shopping cart, checkout flow, order management, và payment integration theo patterns của Len Handmade.

---

## Data Models

### From `src/types.ts`

```typescript
// Product
interface Product {
  id: string;
  name: string;
  nameVi: string;
  price: number;
  originalPrice: number;
  description: string;
  image: string;
  category: string;
  colors?: string[];
  sizes?: string[];
  material: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
}

// Cart Item
interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

// Order
interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  paymentMethod: "cod" | "bank_transfer" | "momo" | "credit_card";
  createdAt: Date;
  updatedAt: Date;
}

// User
interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "store_owner" | "marketing_staff" | "customer";
  favorites: string[]; // Product IDs
  orders: string[]; // Order IDs
}
```

---

## Price Formatting

```typescript
import { formatPrice } from "../utils/pricing";

// Usage
formatPrice(350000);  // Output: "350.000₫"
formatPrice(1250000); // Output: "1.250.000₫"
```

---

## Cart Operations

### From AppContext

```typescript
const { 
  cart,           // CartItem[]
  addToCart,      // (product: Product, quantity?: number) => void
  removeFromCart, // (productId: string) => void
  updateQuantity, // (productId: string, quantity: number) => void
  clearCart,      // () => void
  cartTotal       // number
} = useAppContext();
```

### Example: Add to Cart

```tsx
<button onClick={() => addToCart(product, 1)}>
  Thêm giỏ hàng
</button>
```

---

## Order Flow

1. **Browse** → Product listing/detail page
2. **Add to Cart** → Cart page with item summary
3. **Checkout** → Shipping address + Payment method selection
4. **Confirm** → Review order → Submit
5. **Success** → Order confirmation page
6. **Track** → Order tracking page with status updates

---

## Payment Methods Supported

| Method | Code | Display Name | Icon |
|--------|------|--------------|------|
| Cash on Delivery | `cod` | Thanh toán khi nhận hàng | 💵 |
| Bank Transfer | `bank_transfer` | Chuyển khoản ngân hàng | 🏦 |
| MoMo Wallet | `momo` | Ví MoMo | 📱 |
| Credit Card | `credit_card` | Thẻ tín dụng/ghi nợ | 💳 |

---

## Order Status Flow

```
pending → processing → shipped → delivered
                      ↓
                  cancelled
```

| Status | Display Name | Color |
|--------|--------------|-------|
| `pending` | Chờ xác nhận | Gold |
| `processing` | Đang xử lý | Blue |
| `shipped` | Đang giao hàng | Purple |
| `delivered` | Đã giao hàng | Sage Green |
| `cancelled` | Đã hủy | Dusty Pink |

---

## Firebase Integration

### Firestore Collections

```
/products/{productId}
/orders/{orderId}
/users/{userId}
/blog/{postId}
/testimonials/{testimonialId}
```

### Example: Fetch Products

```typescript
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const productsRef = collection(db, "products");
const snapshot = await getDocs(productsRef);
const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

---

## 🔗 Related Documentation

- **Types Reference**: See `src/types.ts`
- **App Context**: See `src/context/AppContext.tsx`
- **Firebase Config**: See `src/lib/firebase.ts`
- **Pricing Utils**: See `src/utils/pricing.ts`
