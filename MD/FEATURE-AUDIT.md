# 🔍 FEATURE AUDIT — Len Handmade (2026-07-11)

> Kết quả rà soát toàn bộ chức năng: hoạt động / không hoạt động / còn thiếu.
> Kiểm tra thực tế: `npx tsc --noEmit` PASS (src/), `npm run build` PASS (bundle 1.07MB ⚠️).

---

## 1. ✅ Chức năng HOẠT ĐỘNG THẬT (có backend Firestore)

| Chức năng | File chính | Ghi chú |
|-----------|-----------|---------|
| Auth khách (email + Google/Facebook/Apple popup) | `LoginPage.tsx`, `lib/firebase.ts` | Firebase config đầy đủ, đã init |
| Admin auth + RBAC 9 roles | `AdminLoginPage.tsx`, `staffService.ts`, `firestore.rules` | Staff doc trên Firestore, rules deploy được ngay |
| CRUD sản phẩm (admin) | `AdminProductsPage.tsx` → `firestoreProducts.ts` | Sync Firestore |
| CRUD danh mục | `AdminCategoriesPage.tsx` → `firestoreCategories.ts` | Sync Firestore |
| Reviews (khách gửi + admin duyệt) | `ProductDetailPage.tsx`, `AdminReviewsFeedbackPage.tsx` → `firestoreReviews.ts` | Sync Firestore |
| Tickets / Contact / Feedback | `ContactPage.tsx`, `AdminTicketsPage.tsx` → `firestoreTickets.ts`, `firestoreFeedback.ts` | Sync Firestore |
| Admin xem đơn hàng | `AdminOrdersPage.tsx` → `firestoreOrdersAdmin.ts` | Subscribe Firestore, fallback local |
| Staff management + role assignment + audit log | `StaffManagementPage.tsx`, `RoleAssignmentPage.tsx` | Firestore |
| Giỏ hàng, wishlist, tìm kiếm, blog, SEO, gamification UI | nhiều file | Hoạt động (client-side) |

---

## 2. ❌ Chức năng KHÔNG HOẠT ĐỘNG / CHỈ LÀ MOCK

### 2.1 Thanh toán online — NGHIÊM TRỌNG NHẤT
- VNPay/MoMo API/Stripe gateway đều trả `status: "unavailable"` (`src/lib/payments/*.ts`). Cloud Functions (`functions/src/index.ts`) toàn stub trả HTTP 501, **chưa deploy**.
- **VietQR/MoMo QR** chỉ là ảnh QR tĩnh — **không có cách xác minh khách đã chuyển tiền**. Đơn "banking/vietqr/momo" vẫn tạo như COD.
- Nguyên nhân: Firebase chưa lên Blaze plan + chưa có merchant credentials.

### 2.2 Đơn hàng phía KHÁCH không đồng bộ
- `OrdersPage.tsx`, `TrackOrderPage.tsx` chỉ đọc `ordersList` từ **localStorage** + trộn `SAMPLE_ORDERS` (dữ liệu giả).
- Checkout chỉ `mirrorOrderToFirestore` (ghi 1 chiều, lỗi nuốt im lặng) — **không có hàm đọc ngược** từ Firestore.
- Hệ quả: khách đổi thiết bị/xóa cache → mất lịch sử đơn; admin cập nhật trạng thái trên Firestore → khách **không thấy**; `sendNotification` chỉ bắn vào state local, khách không nhận được.

### 2.3 Checkout KHÔNG trừ tồn kho
- `CheckoutPage.tsx` không gọi `adjustVariantStock` — đặt hàng xong tồn kho giữ nguyên.
- `firestoreInventory.ts` tồn tại nhưng **không page nào import** — inventory thực tế chạy localStorage qua AppContext.

### 2.4 Dữ liệu admin chạy trên localStorage / sample data
- Coupons (`len_coupons`), customers, notifications, inventory logs, return requests: chỉ localStorage — mỗi máy admin thấy dữ liệu khác nhau.
- `revenueData`, `topProducts`: **dữ liệu mẫu**, không tính từ đơn thật → dashboard Finance/Revenue là số giả.

### 2.5 Demo login bypass
- Cả `LoginPage` và `AdminLoginPage` còn fallback `loginDemoUser` (`data/authAndTracking.mock.ts`, `staff.mock.ts`) → rủi ro bảo mật khi production.

### 2.6 Không có email/push thật
- Không có tích hợp gửi email nào trong toàn bộ source. Khách không nhận xác nhận đơn.

### 2.7 Chatbot không phải AI
- `Chatbot.tsx` = FAQ keyword-matching cứng, không gọi Gemini dù CLAUDE.md mô tả "AI chatbot".

### 2.8 Đổi trả không đồng bộ
- `ReturnsPage.tsx` chỉ `setReturnRequests` vào state local → admin máy khác không thấy yêu cầu đổi trả.

### 2.9 Admin privileged operations chưa deploy
- `functions/src/admin.ts` (assignRole, processRefund, adjustInventory, exportSensitiveData...) chưa chạy server-side → phân quyền enforce ở client, bypass được.

### 2.10 Lỗi kỹ thuật nhỏ
- Bundle JS 1.07MB (chưa code-splitting/lazy routes).
- `tsc` báo lỗi trong `_skill_repos/` (file example của skill) → cần exclude trong `tsconfig.json`.
- Ảnh nền 878KB PNG chưa tối ưu (nên chuyển WebP).

---

## 3. 🕳️ Chức năng CÒN THIẾU hoàn toàn

| # | Chức năng | Ưu tiên |
|---|-----------|---------|
| 1 | Đồng bộ 2 chiều đơn hàng khách ↔ Firestore | 🔴 Cao nhất |
| 2 | Xác thực thanh toán (Cloud Functions + IPN VNPay/MoMo) | 🔴 |
| 3 | Email xác nhận đơn + cập nhật trạng thái | 🔴 |
| 4 | Trừ tồn kho khi đặt hàng + Real-Time Stock Counter | 🔴 |
| 5 | Quên mật khẩu / reset password | 🟠 |
| 6 | Guest checkout (hiện mọi route bị ProtectedRoute) | 🟠 |
| 7 | Tích hợp vận chuyển GHN/GHTK (phí ship động, tracking thật) | 🟠 |
| 8 | Exit-Intent Cart Recovery | 🟠 |
| 9 | Analytics (GA4 / Meta Pixel) | 🟠 |
| 10 | AI Chatbot (Gemini) | 🟡 |
| 11 | Yarn Calculator / Project Estimator | 🟡 |
| 12 | Price Drop Alerts cho wishlist | 🟡 |
| 13 | AI Product Recommendations | 🟡 |
| 14 | Loyalty Points Program (coins đã có làm nền) | 🟡 |
| 15 | User Project Gallery (UGC) | 🟢 |

---

## 4. 📋 KẾ HOẠCH TRIỂN KHAI

### Phase 1 — Nền tảng dữ liệu thật (1-2 tuần) 🔴
1. **Orders 2 chiều:** thêm `subscribeToUserOrders(userId)` vào `firestoreOrders.ts`; OrdersPage/TrackOrderPage đọc Firestore; loại SAMPLE_ORDERS khỏi production; notification trạng thái viết vào `users/{uid}/notifications`.
2. **Trừ kho khi checkout:** transaction Firestore trừ stock khi tạo đơn; nối `firestoreInventory.ts` vào AdminInventoryPage.
3. **Chuyển coupons, customers, returns sang Firestore** (theo pattern firestoreProducts).
4. **Revenue tính từ đơn thật** thay sample data.
5. **Gỡ demo login** (đặt sau flag env, tắt ở production).

### Phase 2 — Thanh toán & liên lạc (1-2 tuần) 🔴
1. Nâng Firebase lên **Blaze**, deploy `functions/`.
2. Implement `verifyVnpayReturn` + `verifyMomoIpn` → tự động đánh dấu "đã thanh toán".
3. Email transactional (Firebase Trigger Email extension hoặc Resend/SendGrid): xác nhận đơn, cập nhật trạng thái, đổi trả.
4. Deploy admin privileged functions (refund, assignRole...).

### Phase 3 — Trải nghiệm mua hàng (1-2 tuần) 🟠
1. Guest checkout + quên mật khẩu.
2. Real-Time Stock Counter (onSnapshot variant stock).
3. Exit-Intent Cart Recovery.
4. Tích hợp GHN/GHTK.
5. Code-splitting (React.lazy theo route) + tối ưu ảnh WebP.

### Phase 4 — Tăng trưởng (2-4 tuần) 🟡
1. AI Chatbot (Gemini) thay FAQ tĩnh.
2. Yarn Calculator, Price Drop Alerts, AI Recommendations.
3. Loyalty Program hoàn chỉnh từ coins.
4. Analytics GA4 + Meta Pixel.
5. UGC Gallery.

---

## 5. Kết luận

Website có **UI/admin hoàn thiện ~90%** nhưng **luồng dữ liệu thật chỉ ~40%**: sản phẩm, danh mục, reviews, tickets, staff đã chạy Firestore; còn **đơn hàng phía khách, tồn kho, coupons, doanh thu, thông báo vẫn là localStorage/mock**. Thanh toán online hiện **không xác minh được**. Ưu tiên tuyệt đối: Phase 1 (dữ liệu thật) → Phase 2 (thanh toán + email); trước khi xong hai phase này, mọi tính năng mới chỉ chạy trên dữ liệu giả.
