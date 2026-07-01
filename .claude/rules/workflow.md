# rules/workflow.md — Quy Trình Làm Việc

> Áp dụng cho mọi task code trong dự án Len Handmade.

---

## 📋 Trước Khi Bắt Đầu

1. **Đọc** `CLAUDE.md` để nắm context
2. **Kiểm tra** `memory.md` xem có quyết định liên quan nào không
3. **Xác nhận** dev server đang chạy (`npm run dev`)
4. **Hiểu rõ** yêu cầu trước khi viết code — hỏi lại nếu mơ hồ

---

## ✍️ Khi Viết Code

### Thứ tự ưu tiên
1. Dùng **component có sẵn** trước (ProductCard, SafeImage, Logo...)
2. Dùng **design tokens** trong `src/index.css` — không hardcode values
3. Dùng **patterns** từ `MD/COMPONENT-PATTERNS.md`
4. Mới tạo component khi không có gì phù hợp

### Checklist mỗi component mới
- [ ] TypeScript interface cho props
- [ ] Default values cho optional props
- [ ] Motion animation (entrance + hover)
- [ ] Responsive (mobile → tablet → desktop)
- [ ] Sử dụng design tokens — không hardcode hex/px
- [ ] Lucide icons (không SVG inline trừ Logo)

### Checklist mỗi page mới
- [ ] `usePageSeo()` hook với title + description tiếng Việt
- [ ] Route thêm vào `App.tsx`
- [ ] Protected route nếu cần auth
- [ ] Loading + error states

---

## 🔍 Sau Khi Viết Code

1. **Kiểm tra TypeScript** — `npm run lint` (tsc --noEmit)
2. **Test responsive** — 375px (mobile), 768px (tablet), 1280px (desktop)
3. **Kiểm tra màu sắc** — đúng palette chưa?
4. **Kiểm tra font** — đúng font family chưa?
5. **Cập nhật `memory.md`** nếu có quyết định mới

---

## 🚫 Không Làm

- Không commit `.env`, `CLAUDE.local.md`, `settings.local.json`
- Không `rm -rf` — dùng xoá cụ thể từng file
- Không push trực tiếp lên `main` branch
- Không sửa `package.json` dependencies mà không báo trước
- Không thêm màu mới ngoài design palette

---

## 📁 Cấu Trúc File

```
Tạo component → src/components/{Name}.tsx
Tạo page     → src/pages/{Name}Page.tsx
Tạo hook     → src/hooks/use{Name}.ts
Tạo util     → src/utils/{name}.ts
Tạo type mới → src/types.ts (thêm vào file hiện có)
Tài liệu     → MD/{NAME}.md
```
