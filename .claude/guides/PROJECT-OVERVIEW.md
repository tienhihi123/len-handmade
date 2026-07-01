# 📋 Project Overview — Len Handmade Premium Artisan Yarn Boutique

> Tổng quan dự án, thương hiệu, và kiến trúc code

---

## 🎯 Về Dự Án

**Len Handmade — Artisan Studio** là website e-commerce bán len handmade, phụ kiện thủ công (nơ, túi gỗ Boho, quà tốt nghiệp) với tông ấm, sang trọng kiểu "artisan studio". 

### Tính năng chính
- **Bán hàng trực tuyến**: Product catalog, shopping cart, checkout, order tracking
- **Content Marketing**: Blog/tạp chí sợi len với editorial articles về yarn craft
- **AI Chatbot**: Tích hợp Google GenAI cho customer support
- **Admin Dashboard**: Quản lý sản phẩm, đơn hàng, khách hàng, blog, doanh thu
- **Xác thực**: Firebase Auth với phân quyền theo roles

---

## 🏷️ Thương Hiệu

| Thuộc tính | Giá trị |
|------------|---------|
| **Tên** | Len Handmade — Artisan Studio |
| **Slogan** | "Trao gửi hạnh phúc thông qua từng thớ vải tơ dệt mộc dã" |
| **Đối tượng** | Người yêu handmade, thợ len, khách mua quà tốt nghiệp cao cấp tại Việt Nam |
| **Giọng điệu** | Ấm áp, chuyên nghiệp, editorial, gần gũi nhưng tinh tế |
| **Phong cách** | Editorial luxury, warm artisan aesthetic, modern e-commerce |
| **Ngôn ngữ** | Tiếng Việt (Vietnamese) |

---

## 🏗️ Kiến Trúc Code

```
src/
├── App.tsx                    # Root layout: Header + Routes + Footer + Chatbot
├── main.tsx                   # Entry point — BrowserRouter + AppProvider
├── index.css                  # Global styles, Tailwind config, design tokens
├── types.ts                   # TypeScript interfaces (Product, Order, User...)
├── data.ts                    # Legacy product data
├── components/
│   ├── Header.tsx             # Responsive sticky nav (mobile drawer + desktop)
│   ├── Hero.tsx               # Homepage hero section
│   ├── Logo.tsx               # SVG brand logo (inline)
│   ├── BrandLogo.tsx          # Alternative logo variant
│   ├── BrandStory.tsx         # About/story section
│   ├── Categories.tsx         # Product category cards
│   ├── Testimonials.tsx       # Customer reviews carousel
│   ├── ProductCard.tsx        # Reusable product card
│   ├── Chatbot.tsx            # AI chatbot widget (Google GenAI)
│   ├── Customizer.tsx         # Product customization tool
│   ├── Dashboard.tsx          # Overview dashboard widget
│   ├── AdminLayout.tsx        # Admin panel sidebar layout
│   ├── SafeImage.tsx          # Image component with fallback
│   ├── ProtectedRoute.tsx     # Auth guard HOC
│   ├── AuthIntroOverlay.tsx   # Welcome overlay animation
│   └── FacebookReelEmbed.tsx  # Facebook reel embed
├── pages/
│   ├── HomePage.tsx           # Landing page
│   ├── ProductsPage.tsx       # Product listing + filters
│   ├── ProductDetailPage.tsx  # Single product view
│   ├── CartPage.tsx           # Shopping cart
│   ├── CheckoutPage.tsx       # Checkout flow
│   ├── OrdersPage.tsx         # Order history
│   ├── OrderSuccessPage.tsx   # Order confirmation
│   ├── TrackOrderPage.tsx     # Order tracking
│   ├── FavoritesPage.tsx      # Wishlist
│   ├── BlogPage.tsx           # Blog listing
│   ├── BlogDetailPage.tsx     # Blog post detail
│   ├── ContactPage.tsx        # Contact form
│   ├── AccountPage.tsx        # User profile
│   ├── LoginPage.tsx          # Authentication
│   ├── ReturnsPage.tsx        # Return policy
│   ├── UnauthorizedPage.tsx   # 403 page
│   └── Admin*.tsx             # Admin panel pages (Dashboard, Products, Inventory, Orders, Revenue, Customers, Blog, Docs, Notifications, Settings)
├── context/
│   └── AppContext.tsx         # Global state (auth, cart, favorites, orders, notifications)
├── data/
│   ├── sampleData.ts          # Product, blog, testimonial mock data
│   └── authAndTracking.mock.ts # Mock auth & tracking data
├── hooks/
│   ├── useDragScroll.ts       # Horizontal drag-scroll hook
│   └── usePageSeo.ts          # Dynamic SEO meta tags
├── lib/
│   └── firebase.ts            # Firebase configuration
└── utils/
    ├── pricing.ts             # Price formatting utilities
    └── userStorage.ts         # Local storage user management
```

---

## 🔐 Authentication & Authorization

### User Roles
- `admin` — Toàn quyền
- `store_owner` — Quản lý cửa hàng
- `marketing_staff` — Marketing, blog
- `inventory_staff` — Kho hàng
- `order_staff` — Đơn hàng
- `content_staff` — Nội dung

### Protected Routes
- `/favorites`, `/checkout`, `/orders`, `/returns`, `/account` — Yêu cầu đăng nhập
- `/admin/*` — Yêu cầu role trong `ADMIN_ACCESS_ROLES`

---

## 📦 Component Guidelines Overview

### Product Card
- Hiển thị: ảnh sản phẩm, tên, giá, badge (new/sale), nút yêu thích, nút thêm giỏ hàng
- Hover: scale nhẹ, shadow sâu hơn, hiện nút action
- Badge gold cho sản phẩm mới, dusty pink cho sale

### Header/Navigation
- Sticky responsive — pill nav trên desktop, drawer trên mobile
- Glass effect: `glass-nav` class
- Logo + nav items + auth/cart icons
- Mobile: hamburger → side drawer animation

### Hero Section
- Full-width hero với frosted glass text overlay
- Playfair Display display size cho headline
- CTA button với gold accent

### Footer
- Dark background (#2B221B)
- 4 columns: Brand info, Explore links, Contact, Policies
- Gold accent (#A47E5C) cho highlights
- SSL badge

---

## 🔗 Related Documentation

- **Design Tokens**: See [DESIGN-TOKENS.md](DESIGN-TOKENS.md)
- **Tech Stack**: See [TECH-STACK.md](TECH-STACK.md)
- **Code Standards**: See [../rules/CODE-STANDARDS.md](../rules/CODE-STANDARDS.md)
- **Component Patterns**: See [../components/patterns.md](../components/patterns.md)
- **SEO Strategy**: See [SEO-CHECKLIST.md](SEO-CHECKLIST.md)
