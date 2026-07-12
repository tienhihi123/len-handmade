# Prompt cho Claude Code — Payment Flow Thực Tế + Email + Nâng Cấp Admin

> Copy toàn bộ khối dưới đây dán vào Claude Code (session mới, chạy từ thư mục gốc dự án).

---

## Objective
Nâng cấp quy trình thanh toán của website e-commerce "Tiệm Len Nhỏ" (React 19 + Vite + TypeScript + TailwindCSS v4 + Firebase) thành quy trình thực tế đầy đủ: đơn hàng đồng bộ 2 chiều với Firestore, có vòng đời trạng thái thanh toán, gửi email tự động cho khách và cho shop, shop nhận thông báo real-time khi có tiền về, và nâng cấp trang admin để vận hành quy trình này.

## Context
- Đọc trước khi code: `.claude/CLAUDE.md`, `MD/FEATURE-AUDIT.md`, `MD/MASTER-PLAN.md`, `src/types.ts`, `src/context/AppContext.tsx`, `src/lib/firestoreOrders.ts`, `src/lib/firestoreOrdersAdmin.ts`, `src/pages/CheckoutPage.tsx`, `src/pages/OrdersPage.tsx`, `src/pages/AdminOrdersPage.tsx`, `src/pages/AdminNotificationsPage.tsx`, `firestore.rules`.
- Hiện trạng: checkout tạo đơn vào state + localStorage, chỉ mirror 1 chiều lên Firestore (`mirrorOrderToFirestore`, lỗi bị nuốt im lặng). OrdersPage/TrackOrderPage đọc localStorage + SAMPLE_ORDERS giả. Thanh toán VietQR/MoMo chỉ hiện ảnh QR tĩnh, không có bước xác nhận tiền về. Không có email nào được gửi. Cloud Functions chỉ là stub 501 chưa deploy (KHÔNG dùng đến trong task này — dự án chưa lên Blaze). Checkout không trừ tồn kho. `sendNotification` trong AppContext chỉ ghi vào state local.
- Firebase đã cấu hình thật (`firebase-applet-config.json`), Firestore rules RBAC đã có trong `firestore.rules`. Email shop: `BRAND_EMAIL` trong `src/constants/brand.ts`.

## Target State — Quy trình thanh toán đầy đủ
Vòng đời đơn hàng mới (thêm field `paymentStatus: "unpaid" | "pending_confirmation" | "paid" | "refunded"` vào type `LoggedOrder`):

1. **Khách checkout** → đơn được ghi TRỰC TIẾP vào Firestore (`orders/{orderId}` collection gốc + `users/{uid}/orders/{orderId}`) với `paymentStatus`:
   - COD → `"unpaid"`, trạng thái đơn "Chờ xác nhận".
   - VietQR/MoMo/chuyển khoản → `"unpaid"`, hiện màn hình QR + nút **"Tôi đã chuyển khoản"**. Khách bấm → `paymentStatus = "pending_confirmation"` + ghi `paymentReportedAt`.
2. **Email tự động khi tạo đơn** (khách + shop):
   - Khách: email xác nhận đơn (mã đơn, danh sách sản phẩm, tổng tiền, phương thức, hướng dẫn chuyển khoản nếu chưa trả).
   - Shop (`BRAND_EMAIL`): email "Đơn hàng mới #mã — tổng tiền — phương thức".
3. **Shop nhận tiền**: khi khách bấm "Tôi đã chuyển khoản" → tạo doc trong collection `shopNotifications` (type: "payment_reported", orderId, amount, createdAt, read: false) + gửi email cho shop "Khách báo đã chuyển khoản đơn #mã — kiểm tra tài khoản".
4. **Admin xác nhận tiền về**: trong AdminOrdersPage, đơn `pending_confirmation` hiện badge nổi bật + nút **"Đã nhận tiền"** / **"Chưa nhận được"**. Bấm "Đã nhận tiền" → `paymentStatus = "paid"` + `paidAt` + email cho khách "Đã nhận thanh toán đơn #mã, đơn đang được chuẩn bị".
5. **Đồng bộ 2 chiều**: OrdersPage + TrackOrderPage subscribe real-time đơn của user từ Firestore (`onSnapshot`); admin đổi trạng thái → khách thấy ngay. Loại SAMPLE_ORDERS khỏi luồng production (chỉ giữ khi `!isFirebaseConfigured`).
6. **Trừ tồn kho**: khi tạo đơn thành công, trừ stock các variant tương ứng bằng Firestore transaction (không cho stock âm); hủy đơn → hoàn kho.

### Email — cách triển khai (KHÔNG cần Blaze)
- Dùng **EmailJS** (`@emailjs/browser`) — dependency MỚI DUY NHẤT được phép cài.
- Tạo `src/lib/emailService.ts` với API: `sendOrderConfirmationEmail(order)`, `sendShopNewOrderEmail(order)`, `sendPaymentReportedEmail(order)`, `sendPaymentConfirmedEmail(order)`, `sendOrderStatusEmail(order, newStatus)`.
- Đọc config từ env: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_PUBLIC_KEY`, `VITE_EMAILJS_TEMPLATE_ORDER`, `VITE_EMAILJS_TEMPLATE_SHOP`. Nếu thiếu env → hàm no-op + `console.warn`, KHÔNG crash. Thêm các key này vào `.env.example` (KHÔNG sửa `.env`).
- Mọi lời gọi email phải fire-and-forget với `.catch()` — lỗi email không được chặn luồng đặt hàng.

### Nâng cấp Admin
1. **AdminOrdersPage**: cột/badge `paymentStatus` (màu: unpaid=xám, pending_confirmation=vàng nổi bật + pulse, paid=xanh sage, refunded=hồng); filter theo paymentStatus; nút "Đã nhận tiền"/"Chưa nhận được"; modal chi tiết đơn với timeline trạng thái (đặt → báo chuyển khoản → đã nhận tiền → chuẩn bị → giao → hoàn tất).
2. **AdminNotificationsPage + chuông trên AdminShell**: subscribe real-time `shopNotifications` từ Firestore, đếm chưa đọc, click đánh dấu đã đọc + điều hướng tới đơn liên quan.
3. **AdminRevenuePage / FinanceDashboardPage**: tính doanh thu từ đơn Firestore thật (chỉ tính đơn `paid` hoặc COD "Hoàn tất"), thay thế sample `revenueData`/`topProducts`.
4. **firestore.rules**: thêm rules cho `orders` (khách tạo + đọc đơn của mình, chỉ staff được đổi trạng thái/paymentStatus) và `shopNotifications` (chỉ staff đọc/ghi). Hiển thị diff rules và CHỜ XÁC NHẬN trước khi ghi file.

## Scope
- Được sửa: `src/types.ts`, `src/context/AppContext.tsx`, `src/lib/firestoreOrders.ts`, `src/lib/firestoreOrdersAdmin.ts`, `src/lib/emailService.ts` (mới), `src/lib/inventoryService.ts`, `src/pages/CheckoutPage.tsx`, `src/pages/OrderSuccessPage.tsx`, `src/pages/OrdersPage.tsx`, `src/pages/TrackOrderPage.tsx`, `src/pages/AdminOrdersPage.tsx`, `src/pages/AdminNotificationsPage.tsx`, `src/pages/AdminRevenuePage.tsx`, `src/pages/admin/FinanceDashboardPage.tsx`, `src/components/admin/AdminShell.tsx`, `.env.example`, `firestore.rules` (sau xác nhận).
- KHÔNG đụng: `.env`, `firebase-applet-config.json`, `functions/`, `package-lock.json` (trừ khi cài @emailjs/browser), mọi file admin/pages khác, design tokens trong `src/index.css`.

## Constraints
- TypeScript strict, không `any`. Import theo thứ tự quy định trong `.claude/rules/tech-defaults.md`. Motion import từ `"motion/react"`. Icon chỉ dùng lucide-react. Chỉ dùng màu/token có sẵn trong palette (badge dùng sage/gold/dusty-pink/divider-beige, KHÔNG thêm hex mới).
- Toàn bộ chuỗi UI và nội dung email bằng tiếng Việt, giữ brand voice ấm áp hiện có.
- Chỉ làm đúng những gì được yêu cầu. Không refactor, không thêm feature, không thêm file ngoài danh sách.
- Backward compatible: đơn cũ trong localStorage không có `paymentStatus` phải được hiểu là `"unpaid"` (dùng `??`).

## Acceptance Criteria
- [ ] Checkout ghi đơn vào Firestore collection `orders` + `users/{uid}/orders`, có `paymentStatus`, và trừ tồn kho bằng transaction.
- [ ] Chọn VietQR/MoMo/banking hiện nút "Tôi đã chuyển khoản"; bấm xong đơn chuyển `pending_confirmation` và tạo doc `shopNotifications`.
- [ ] AdminOrdersPage hiện badge thanh toán + nút "Đã nhận tiền" hoạt động; bấm xong khách thấy `paid` real-time trên OrdersPage.
- [ ] 5 hàm email trong `emailService.ts` được gọi đúng thời điểm; thiếu env thì no-op không crash.
- [ ] OrdersPage/TrackOrderPage subscribe Firestore real-time; không còn SAMPLE_ORDERS khi Firebase configured.
- [ ] AdminRevenuePage tính từ đơn thật.
- [ ] `npx tsc --noEmit` PASS và `npm run build` PASS — phải chạy thật, không được báo PASS suông.

## Stop Conditions
Dừng và hỏi trước khi:
- Ghi thay đổi vào `firestore.rules` (hiện diff trước).
- Cài bất kỳ dependency nào ngoài `@emailjs/browser`.
- Xóa bất kỳ file nào hoặc sửa file ngoài Scope.
- Thay đổi cấu trúc dữ liệu Firestore khác với mô tả ở Target State.

## Progress
Sau mỗi bước hoàn thành, output: ✅ [việc đã làm] — [file bị ảnh hưởng]. Kết thúc bằng báo cáo: Nguyên nhân/Nội dung thay đổi/File đã sửa/Kết quả kiểm tra/Rủi ro còn lại/Bước tiếp theo.

## Session Strategy
New session — bắt đầu mới, đọc các file trong Context trước khi viết bất kỳ dòng code nào.
