# memory.md — Bộ Nhớ Cá Nhân của Claude

> File này Claude tự cập nhật sau mỗi phiên làm việc.
> Lưu context, quyết định đã đưa ra, và những thứ cần nhớ giữa các cuộc trò chuyện.

---

## 🧠 Quyết Định Thiết Kế Đã Chốt

- **Light theme only** — Không triển khai dark mode. Tông warm artisan là bản sắc thương hiệu.
- **Arch card** (border-top 120px) — Đặc trưng riêng của trang category, không thay đổi.
- **Gold accent `#CEAF75`** — Chỉ dùng cho CTA, highlights, không làm background lớn.
- **Footer background `#2B221B`** — Nâu đậm cố định, không dùng Obsidian/Graphite Night.
- **Font pairing đã chốt:** Playfair Display (heading) + DM Sans (body) + EB Garamond (label italic).

---

## 🔧 Vấn Đề Đã Gặp & Cách Giải Quyết

| Vấn đề | Giải pháp | Ngày |
|--------|-----------|------|
| Mock data chưa kết nối Firestore | Dùng `src/data/sampleData.ts` tạm thời | 2026-06 |
| Auth đang là mock | `authAndTracking.mock.ts` — chưa Firebase Auth thật | 2026-06 |
| Tailwind v4 `@theme` directive | Dùng `@theme {}` thay `extend` trong config | 2026-06 |

---

## 📋 Context Quan Trọng Giữa Các Phiên

- Dev đang chạy: `npm run dev` → `http://localhost:3000`
- Package manager: `npm` (không dùng yarn/pnpm)
- OS: Windows — dùng PowerShell cho terminal commands
- Tất cả text UI: **Tiếng Việt**
- Admin role list: `admin`, `store_owner`, `marketing_staff`, `inventory_staff`, `order_staff`, `content_staff`

---

## 🗒️ Ghi Chú Tạm (Claude tự cập nhật)

<!-- Claude ghi vào đây sau mỗi task lớn -->
- Đã tạo cấu trúc `.claude/` đầy đủ theo chuẩn: 2026-06-26
- Đã tạo `MD/` docs: CLAUDE.md, SKILLS.md, COMPONENT-PATTERNS.md, MARKETING-GUIDE.md
- Cấu trúc `rules/`, `agents/`, `skills/` đã thiết lập

---

## 📌 Việc Đang Dở (Chưa Hoàn Thành)

- [ ] Kết nối Firebase Firestore thật thay mock data
- [ ] Firebase Auth thật thay mock
- [ ] Upload ảnh sản phẩm lên Firebase Storage
- [ ] SEO meta cho tất cả pages
- [ ] Lazy loading cho Admin pages
