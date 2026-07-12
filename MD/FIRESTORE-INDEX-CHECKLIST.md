# Firestore Query/Index Checklist

> Bắt buộc tuân thủ mỗi khi tạo hoặc sửa Firestore query hay `firestore.indexes.json`.
> Được viết ra sau một sự cố thật: xem [Sự cố tham khảo](#sự-cố-tham-khảo) bên dưới.

---

## 1. Trước khi sửa index

- [ ] Xác định query là `collection()` (Collection scope) hay `collectionGroup()` (Collection Group scope).
- [ ] Liệt kê đầy đủ `where`, `orderBy`, `array-contains` của query.
- [ ] Kiểm tra field đó có đang được query ở **scope khác** bởi chỗ khác trong code không (vd cùng field `userId` vừa dùng trong `collection()` ở một nơi, vừa trong `collectionGroup()` ở nơi khác).

## 2. Khi sửa `fieldOverrides`

- [ ] **Không chỉ thêm `COLLECTION_GROUP` rồi vô tình làm mất `COLLECTION`.** Khai báo `fieldOverrides` cho một field là khai báo **đầy đủ, thay thế hoàn toàn** — không phải "thêm vào" index mặc định.
- [ ] Phải liệt kê đủ scope cần thiết:
  - `COLLECTION` ASC + DESC
  - `COLLECTION_GROUP` ASC + DESC
- [ ] Không tắt index mặc định nếu chưa chứng minh (grep toàn bộ code) không còn query nào dùng field đó ở scope sẽ bị tắt.

## 3. `firebase.json` bắt buộc phải có

```json
"firestore": {
  "rules": "firestore.rules",
  "indexes": "firestore.indexes.json"
}
```

Thiếu dòng `"indexes"` → `firebase deploy --only firestore:indexes` chạy "thành công" (exit code 0) nhưng **không đẩy gì lên cả**, vì CLI không biết đọc file nào.

## 4. Trước khi deploy

- [ ] Chạy `firebase firestore:indexes --project lenhandemade` (read-only, không đổi gì).
- [ ] So sánh index/field-override production thật với `firestore.indexes.json` trong repo.
- [ ] Hiển thị diff cấu hình cho người yêu cầu xem.
- [ ] Báo rõ: index nào **thêm**, index nào **sửa**, index nào **sẽ bị xóa/tắt**.
- [ ] Không deploy nếu có khả năng xóa/tắt một index đang được query thật sử dụng.

## 5. Sau khi deploy

- [ ] Xác nhận log CLI có dòng `reading indexes from firestore.indexes.json...` (không chỉ thấy "Deploy complete!").
- [ ] Chạy lại `firebase firestore:indexes --project lenhandemade`.
- [ ] Xác nhận scope thật (COLLECTION / COLLECTION_GROUP, ASC/DESC) đã xuất hiện đúng như file cấu hình.
- [ ] Kiểm tra trạng thái index là **Enabled**, không chỉ đang **Building** (composite index lớn có thể mất nhiều phút/giờ).
- [ ] **Không báo "hoàn tất" chỉ vì lệnh deploy trả exit code 0** — phải xác minh bằng bước đọc lại ở trên.

## 6. Với query `collectionGroup()`

- [ ] Kiểm tra Firestore Rules có match block phù hợp cho path thật của subcollection (rules áp dụng theo path, không theo cách gọi client là `collection()` hay `collectionGroup()`).
- [ ] Kiểm tra user chỉ đọc được đúng dữ liệu của chính mình (filter theo `uid`/`userId` khớp `request.auth.uid`).
- [ ] **Không mở rộng quyền đọc (vd đổi rule thành cho phép đọc rộng hơn) chỉ để "chữa" lỗi `permission-denied`** — trước tiên phải xác định lỗi có đúng là do rules không, hay do thiếu index/do query không khớp rule (`list` query bị Firestore chặn toàn bộ nếu không tự giới hạn để chứng minh an toàn với rule).

## 7. Với code query (client-side)

- [ ] Luôn có `onError` callback trên mọi `onSnapshot`.
- [ ] Log rõ trong console:
  - tên listener/hàm (vd `subscribeToMyReviews`)
  - collection/path đang query
  - `error.code`
  - `error.message`
- [ ] UI chỉ hiển thị thông báo lỗi thân thiện, không để app crash hay để trắng trang.

## 8. Sau mọi thay đổi

```bash
npx tsc --noEmit
npm run build
git diff --check
```

## 9–11. Nguyên tắc chung

- Không sửa index theo suy đoán — phải xác minh bằng `firebase firestore:indexes` (read-only) trước khi kết luận nguyên nhân.
- Không deploy `rules`/`indexes` nếu chưa có xác nhận rõ ràng, cụ thể cho đúng hành động đó (không suy diễn từ một câu đồng ý chung chung).
- Không coi deploy thành công (exit code 0) là index đã hoạt động thật trên production — luôn xác minh lại bằng bước đọc cấu hình sau deploy, và biết rằng index có thể vẫn đang **Building**.

---

## Sự cố tham khảo

**Bối cảnh:** Thêm `subscribeToMyReviews` (collectionGroup theo `userId`) cho tab "Đánh giá của tôi". Query cũ `subscribeToProductReviews` (own) đã dùng `where("userId","==",uid)` ở scope `COLLECTION` (subcollection từng sản phẩm) và vẫn đang chạy tốt.

**Lỗi 1 — thiếu index:** Deploy `firestore.indexes.json` lần đầu nhưng `firebase.json` không có dòng `"indexes": "firestore.indexes.json"` → deploy "thành công" nhưng không có gì được đẩy lên. Xác nhận bằng `firebase firestore:indexes --project lenhandemade` thấy production rỗng hoàn toàn.

**Lỗi 2 — tắt nhầm index đang dùng:** Sau khi sửa `firebase.json` và deploy lại, `fieldOverrides` cho `reviews.userId`/`reviews.createdAt` chỉ khai báo `COLLECTION_GROUP` scope → vô tình **tắt** index `COLLECTION` scope mặc định mà `subscribeToProductReviews` (own) đang phụ thuộc, làm tính năng đang chạy tốt bị hỏng (`failed-precondition: requires a COLLECTION_ASC index`).

**Bài học:** Cả hai lỗi đều lẽ ra tránh được nếu áp dụng đúng mục 3, 4, 5 ở trên trước khi báo "đã xong".
