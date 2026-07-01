# Tiệm Len Nhỏ

Website thương mại điện tử bán len handmade cao cấp — React 19 + Vite + TailwindCSS v4 + Firebase.

## Chạy local

**Yêu cầu:** Node.js 18+

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production vào dist/
npm run lint     # kiểm tra TypeScript (tsc --noEmit)
```

## Biến môi trường

Sao chép `.env.example` thành `.env` rồi điền:

| Biến | Mô tả |
|------|-------|
| `VITE_FIREBASE_*` | Cấu hình Firebase client (Auth + Firestore) |
| `VITE_BANK_BIN`, `VITE_BANK_ACCOUNT_NO`, `VITE_BANK_ACCOUNT_NAME` | Tài khoản ngân hàng thật để tạo QR VietQR khi checkout |
| `VITE_MOMO_PHONE` | Số điện thoại MoMo thật để tạo QR chuyển khoản MoMo |
| `VITE_VNPAY_TMN_CODE`, `VITE_MOMO_PARTNER_CODE`, `VITE_STRIPE_PUBLIC_KEY` | Chưa dùng — để trống cho tới khi có merchant key + Cloud Function ký giao dịch (xem `functions/`) |

`.env` **không** được commit lên Git (đã có trong `.gitignore`).

## Đưa code lên GitHub

Repo đã được `git init` và gắn remote `origin` trỏ tới:
`https://github.com/tamgaming018-sudo/len-handmade.git`

Các bước còn lại cần tự thực hiện (máy chưa cài `gh` CLI / chưa có credential helper):

```bash
git push -u origin main
```

Lần đầu push sẽ yêu cầu đăng nhập GitHub — dùng Personal Access Token (PAT) làm mật khẩu qua HTTPS, hoặc cấu hình SSH key.

## Deploy lên Firebase Hosting (miễn phí)

Project Firebase đã có sẵn: `lenhandemade` (đã cấu hình trong `.firebaserc`).

```bash
npx firebase-tools login          # đăng nhập qua trình duyệt (chỉ cần 1 lần)
npm run build
npx firebase-tools deploy --only hosting
npx firebase-tools deploy --only firestore:rules   # cập nhật quy tắc Firestore mới (reviews/feedback)
```

Sau khi deploy, site sẽ chạy tại `https://lenhandemade.web.app`.

### Cloud Functions cho VNPay/MoMo/Stripe (chưa deploy)

Thư mục `functions/` đã có sẵn khung Cloud Functions (stub) cho việc xác thực thanh toán VNPay/MoMo/Stripe. Để deploy thật:

1. Nâng project `lenhandemade` lên gói **Blaze** (pay-as-you-go, vẫn miễn phí trong hạn mức) tại [Firebase Console](https://console.firebase.google.com/project/lenhandemade/usage/details) — bước này cần bạn tự làm vì liên quan tới thẻ thanh toán.
2. `cd functions && npm install`
3. Điền merchant key thật (VNPay/MoMo/Stripe) vào cấu hình Function, hoàn thiện logic ký/xác thực trong `functions/src/index.ts`.
4. `npm run deploy` (trong thư mục `functions/`).

Cho tới lúc đó, checkout vẫn hoạt động đầy đủ qua COD, VietQR và MoMo (QR thật, không cần Cloud Functions) — VNPay/MoMo Payment API/Stripe hiển thị rõ là "Sắp ra mắt".
