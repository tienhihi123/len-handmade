# 🧾 PAYMENT FLOW — BÁO CÁO XÁC MINH (2026-07-12)

## 1. Trạng thái tổng quan
**HOÀN THÀNH MỘT PHẦN** — toàn bộ kiểm tra code/tsc/build PASS thật; các bài test end-to-end trên trình duyệt và deploy rules **chưa chạy được từ môi trường Cowork** (sandbox Linux, không truy cập được PowerShell/trình duyệt máy người dùng, Firebase CLI cần OAuth tương tác). Xem mục 11 — chỉ còn 3 thao tác thủ công.

## 2. Môi trường
- Thư mục dự án Cowork được cấp: `C:\TIEN\len_-premium-artisan-yarn-boutique (1)\len_-premium-artisan-yarn-boutique (1)` (xác minh đủ markers: package.json, src/, firestore.rules, .claude/, MD/, vite.config.ts). Lưu ý: khác đường dẫn `D:\ĐỒ ÁN TỐT NGHIỆP\...` trong đề bài — đây là thư mục thật được mount.
- Branch: `feature/payment-flow-production` ✅
- Backup: `.claude/backups/payment-flow-20260712-004829/` (kèm `firestore.rules.diff`) ✅
- Node v22.22.3 · npm 10.9.8 · @emailjs/browser 4.4.1
- Firebase project trong config: `lenhandemade`

## 3. Code đã kiểm tra (audit trực tiếp, không tin báo cáo cũ)
| Hạng mục | Kết quả xác minh |
|---|---|
| B1 Types | `paymentStatus` union 4 giá trị + 4 timestamp ISO trong `LoggedOrder`; 12 điểm dùng `?? "unpaid"`; không `any`/`as any`/`@ts-ignore` trong Scope |
| B2 Transaction tạo đơn | `createOrderInFirestore`: đọc hết variant trước → check stock (không âm) → `tx.set` cả `orders/{id}` và `users/{uid}/orders/{id}` → trừ stock + log — 1 transaction duy nhất; email nằm NGOÀI transaction; fail → không xóa giỏ (CheckoutPage return sớm) |
| B3 Double submit | `isSubmitting \|\| orderPlaced` guard + nút `disabled` |
| B4 Báo chuyển khoản | batch cập nhật 2 docs; `pending_confirmation` + `paymentReportedAt` + `updatedAt`; notification ID xác định `payment_reported_{orderId}`; email shop sau khi batch commit |
| B5 Admin xác nhận | 2 nút chỉ hiện khi `pending_confirmation`, có loading + chống click lặp (`busyAction`); "Đã nhận tiền" → paid + paidAt 2 docs + email khách; "Chưa nhận được" → unpaid, giữ paymentReportedAt, không paidAt, không hoàn kho |
| B6 Hủy + hoàn kho | `cancelOrderAndRestock`: transaction, đọc lại trạng thái, `if status === "Đã hủy" return` (idempotent), cộng kho + log return, 2 docs đồng bộ |
| B7 COD | "Hoàn tất" + cod → `paymentStatus=paid` + `paidAt` trên 2 docs |
| B8 Real-time | `subscribeToUserOrders` (AppContext), `subscribeToShopNotifications` (AdminShell + AdminNotificationsPage), đều có unsubscribe cleanup; SAMPLE_ORDERS chỉ còn sau guard `!isFirebaseConfigured` (TrackOrderPage + AppContext) |
| B9 Revenue | `isCountableOrder`: paid hoặc COD hoàn tất; loại hủy/unpaid/pending/refunded; chart + top products từ đơn thật; FinanceDashboard cùng logic |
| Email | 5 hàm export đúng tên; queue tuần tự MIN_GAP_MS=1100, queue sống sau lỗi (`queueTail = task.catch`); escapeHtml dữ liệu khách; thiếu env → no-op + warn; không log key |

## 4. Command thực tế (chạy trong phiên này)
| Command | Kết quả | Ghi chú |
|---|---|---|
| Validate `package.json` + `package-lock.json` (JSON.parse) | ✅ PASS | Cả hai hợp lệ (đã khôi phục từ sự cố phiên trước) |
| `npm install` | ⚠️ SKIPPED | node_modules đã đầy đủ (`npm ls` sạch); sandbox từng làm npm bị kill giữa chừng gây hỏng JSON — tránh lặp lại rủi ro. Chạy trên máy bạn nếu cần. |
| `npx tsc --noEmit` | ✅ PASS (exit 0) | Lệnh chuẩn, KHÔNG lọc lỗi. Đã sửa `tsconfig.json` exclude thêm `_skill_repos` (thư mục ví dụ skill ngoài source — lý do hợp lệ theo đề bài D1) |
| `npm run build` | ✅ PASS (exit 0, ✓ built in 30.31s) | Script chuẩn, minify mặc định. Chạy trên bản sao chính xác của dự án tại VM kiểm tra (node_modules trên máy Windows chứa binary không chạy được trên Linux; riêng `lightningcss-linux-x64-gnu` trong node_modules của bạn bị hỏng — không ảnh hưởng Windows) |
| `npm ls @emailjs/browser` | ✅ 4.4.1 | Dependency mới duy nhất |
| `git diff --check` (file trong Scope) | ✅ PASS | Cảnh báo whitespace chỉ ở file NGOÀI scope có sẵn từ trước (AdminCustomersPage, .claude/settings.json...) — không đụng |
| `npx firebase-tools --version` | ❌ FAIL (môi trường) | Gói quá lớn so với giới hạn 45s/lệnh của sandbox; login cần OAuth tương tác |
| `firebase deploy --only firestore:rules` | ⏸️ SKIPPED | Chờ bạn chạy trên máy (mục 11) |

## 5. Kết quả từng bài test end-to-end
| Bài test | Kết quả | Ghi chú |
|---|---|---|
| Chuyển khoản | ⏸️ CHƯA CHẠY | Cần dev server + rules đã deploy + EmailJS env |
| Báo chuyển khoản | ⏸️ CHƯA CHẠY | — |
| Admin nhận tiền | ⏸️ CHƯA CHẠY | — |
| Chưa nhận được | ⏸️ CHƯA CHẠY | — |
| COD | ⏸️ CHƯA CHẠY | — |
| Hủy hoàn kho | ⏸️ CHƯA CHẠY | — |
| Vượt tồn kho | ⏸️ CHƯA CHẠY | — |
| Double submit | ⏸️ CHƯA CHẠY | Logic đã xác minh ở mức code |
| Realtime | ⏸️ CHƯA CHẠY | — |
| Revenue | ⏸️ CHƯA CHẠY | Logic đã xác minh ở mức code |
| Security | ⏸️ CHƯA CHẠY | Rules đã review thủ công, chưa test runtime |
KHÔNG ghi PASS cho test chưa chạy. Sau khi bạn bật `npm run dev`, tôi có thể chạy các bài test này qua trình duyệt (Claude in Chrome).

## 6. Firestore
- Rules: đã cập nhật local, **CHƯA deploy** (thiếu CLI + login trong sandbox).
- Hai order documents: mọi đường ghi (tạo/báo CK/xác nhận/hủy/đổi trạng thái) đều dùng transaction/batch cập nhật đồng thời — xác minh trong code.
- Notification: ID xác định `payment_reported_{orderId}` — không trùng.
- Inventory: trừ trong transaction tạo đơn; hoàn đúng 1 lần khi hủy (idempotent check).

## 7. EmailJS
- Service/Template: **chưa tạo** (việc của bạn — hướng dẫn ở mục 11).
- `.env` hiện CHƯA có 4 biến `VITE_EMAILJS_*` (chỉ kiểm tra tên biến, không đọc giá trị). `.env` được git ignore ✅, không staged ✅.
- Thiếu env đã xác minh: no-op + `console.warn`, không throw, không chặn đặt hàng.

## 8. File sửa thêm trong phiên Cowork này
- `tsconfig.json` — thêm `"_skill_repos"` vào `exclude` (diff 1 dòng; lý do: tsc quét nhầm thư mục ví dụ skill ngoài source, đề bài cho phép khi có giải trình).
- `MD/PAYMENT-FLOW-VERIFICATION-REPORT.md` — báo cáo này.
(Toàn bộ file còn lại do phiên Claude Code trước sửa — liệt kê trong MD/FEATURE-AUDIT.md + git status.)

## 9. Rủi ro còn lại
- EmailJS phía trình duyệt là best-effort — khách đóng tab sớm có thể mất email; quota free 200 email/tháng.
- QR tĩnh: shop vẫn xác nhận tiền thủ công; chưa có VNPay/MoMo IPN (cần Blaze — ngoài phạm vi task).
- Trừ stock từ client: rules chỉ cho khách GIẢM stock trong 3 field, nhưng **không thể ràng buộc nguyên tử "giảm stock phải kèm order" bằng Security Rules thuần** — khách kỹ thuật cao có thể gọi Firestore trừ kho không tạo đơn. Đây là giới hạn kiến trúc client-side đã biết; xử lý triệt để cần Cloud Functions.
- Rules mới dùng `Map.get(default)` + string concat — cú pháp hợp lệ rules v2 nhưng chưa qua validator CLI; nếu deploy báo lỗi cú pháp, gửi lỗi cho tôi để sửa.
- Hai order documents phải tiếp tục được cập nhật đồng bộ ở mọi code viết sau này.
- `node_modules/lightningcss-linux-x64-gnu` trong dự án bị hỏng (chỉ ảnh hưởng build trên Linux, không ảnh hưởng Windows).

## 10. Kết luận production
**ĐỦ ĐIỀU KIỆN TEST NỘI BỘ** — code hoàn chỉnh, tsc + build PASS thật, không secret trong git. CHƯA đủ điều kiện production vì: rules chưa deploy, EmailJS chưa cấu hình, 11 bài test end-to-end chưa chạy. **Chưa commit** theo đúng điều kiện gating (commit chỉ khi test chuyển khoản/COD/hoàn kho/vượt tồn kho đạt).

## 11. Ba thao tác thủ công còn lại (làm theo thứ tự)
1. **EmailJS** (~10 phút): tạo tài khoản emailjs.com → 1 service (kết nối Gmail shop) + 2 template theo đúng nội dung trong prompt (template khách: `To Email = {{to_email}}`; template shop: To = email shop cố định; Subject đều là `{{subject}}`) → tự điền 4 biến vào `.env` (không gửi giá trị vào chat):
   `VITE_EMAILJS_SERVICE_ID= / VITE_EMAILJS_PUBLIC_KEY= / VITE_EMAILJS_TEMPLATE_ORDER= / VITE_EMAILJS_TEMPLATE_SHOP=`
2. **Deploy rules** (PowerShell tại thư mục dự án):
   `npx firebase-tools login` → `npx firebase-tools use lenhandemade` → `npx firebase-tools deploy --only firestore:rules`
3. **Bật dev server**: `npm run dev` rồi báo tôi URL (thường http://localhost:3000) — tôi sẽ chạy toàn bộ Phase H→S (test chuyển khoản, admin xác nhận, COD, hoàn kho, vượt tồn kho, double submit, realtime, revenue, security) qua trình duyệt và cập nhật bảng ở mục 5, sau đó mới commit.
