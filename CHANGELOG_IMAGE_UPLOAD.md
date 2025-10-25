# 📝 Changelog: Upload Ảnh Sản Phẩm với Google Cloud Storage

## 🎯 Những thay đổi đã hoàn thành

### ✅ 1. Tạo component ImageUpload
📁 `src/admin/components/ImageUpload.jsx`

**Tính năng:**
- Upload ảnh lên Google Cloud Storage
- Preview ảnh real-time
- Validate file type (JPG, PNG, WEBP, GIF)
- Validate file size (max 5MB)
- Error handling chi tiết với hướng dẫn fix
- UI đẹp với icon và loading state
- Responsive design

---

### ✅ 2. Cập nhật ProductsPage
📁 `src/admin/pages/ProductsPage.jsx`

**Thay đổi:**
- ✅ Import component ImageUpload
- ✅ Thêm field `imageUrl` vào form state
- ✅ Hiển thị ImageUpload component trong modal Create/Edit
- ✅ Load ảnh đầu tiên khi edit product
- ✅ Validate ảnh bắt buộc trước khi submit
- ✅ Gửi images array lên backend khi create/update

**Kết quả:**
- Admin bắt buộc phải upload ảnh khi tạo sản phẩm
- Có thể đổi ảnh khi edit
- Preview ảnh trước khi lưu

---

### ✅ 3. Cập nhật CategoriesPage
📁 `src/admin/pages/CategoriesPage.jsx`

**Thay đổi:**
- ❌ Bỏ field `imageUrl` khỏi form state
- ❌ Bỏ field "Image URL" khỏi modal Create/Edit
- ❌ Bỏ cột "Image" khỏi table
- ✅ Thêm hint cho field Position

**Kết quả:**
- Form gọn gàng hơn: chỉ Name, Slug, Position
- Table sạch sẽ hơn
- Danh mục không cần ảnh nữa

---

### ✅ 4. Cập nhật Backend Products Controller
📁 `backend/src/modules/products/products.controller.js`

**Thay đổi:**
- ✅ Xử lý images array trong `updateProduct`
- ✅ Xóa ảnh cũ và tạo ảnh mới khi update
- ✅ Đánh dấu ảnh đầu tiên là primary
- ✅ Hỗ trợ multiple images (cho tương lai)

**Kết quả:**
- Backend xử lý ảnh chính xác
- Không bị duplicate images khi update

---

### ✅ 5. Backend Uploads Module (đã có sẵn)
📁 `backend/src/modules/uploads/uploads.controller.js`

**Endpoint:**
- `POST /api/uploads/signed-url` - Lấy signed URL để upload
- `DELETE /api/uploads/file` - Xóa file (optional)

**Tính năng:**
- Upload trực tiếp lên Google Cloud Storage
- Signed URL (security tốt hơn)
- Validate content type
- Generate unique filename

---

### ✅ 6. Documentation đầy đủ

**Files:**
1. `QUICK_START_IMAGE.md` - Quick start 5 phút
2. `TROUBLESHOOT_UPLOAD.md` - Debug các lỗi upload chi tiết
3. `GCS_SETUP.md` - Hướng dẫn setup Google Cloud Storage từng bước
4. `test-upload-api.js` - Script test backend API

---

## 🚀 Cách sử dụng

### Cho Admin:

1. **Thêm sản phẩm mới:**
   ```
   Admin Panel → Products → Add Product
   → Click ô upload ảnh
   → Chọn file (JPG/PNG/WEBP/GIF, max 5MB)
   → Đợi upload (spinner hiển thị)
   → Preview ảnh xuất hiện
   → Điền thông tin khác
   → Click Save
   ```

2. **Sửa sản phẩm:**
   ```
   Click Edit trên sản phẩm
   → Ảnh hiện tại hiển thị
   → Click "Đổi ảnh" để upload ảnh mới
   → Hoặc "Xóa" để xóa (nhưng phải upload lại)
   ```

3. **Thêm/sửa danh mục:**
   ```
   Không cần upload ảnh
   Chỉ điền: Name, Slug, Position
   ```

---

## 📋 Setup Requirements

### 1. Google Cloud Storage (BẮT BUỘC)

**Tóm tắt:**
1. Tạo GCP project
2. Tạo bucket public: `ttdbalo-images`
3. Tạo Service Account: role "Storage Object Admin"
4. Download JSON key → `backend/service-account.json`
5. Config `backend/.env`:
   ```env
   GCP_BUCKET="ttdbalo-images"
   GCP_KEY_FILE="./service-account.json"
   ```
6. Restart backend

**Chi tiết:** Xem `GCS_SETUP.md`

---

### 2. Update Dependencies (Nếu thiếu)

```bash
# Backend
cd backend
npm install @google-cloud/storage

# Frontend (không cần thêm gì)
```

---

### 3. Restart Servers

```bash
# Backend
cd backend
npm run dev

# Frontend (terminal mới)
cd ..
npm run dev
```

---

## 🧪 Test

### Test Upload thành công:

1. Login admin: http://localhost:5173/admin.html
2. Products → Add Product
3. Upload ảnh → Kiểm tra:
   - Preview hiển thị
   - URL dạng: `https://storage.googleapis.com/ttdbalo-images/uploads/...`
4. Save sản phẩm
5. Refresh → Ảnh vẫn hiển thị ✅

### Test Categories:

1. Categories → Add Category
2. Không còn field "Image URL"
3. Save thành công ✅

---

## 🐛 Xử lý lỗi

### ❌ "TypeError: Failed to fetch"

**Nguyên nhân #1: Chưa login admin**

Fix:
1. Đóng tất cả tab
2. Mở http://localhost:5173/admin.html
3. Login fresh: `admin@ttdbalo.com` / `admin123`
4. Thử lại

**Nguyên nhân #2: Backend chưa chạy**

```bash
node test-upload-api.js
# Nếu ❌ → cd backend && npm run dev
```

**Nguyên nhân #3: GCS chưa config**

```bash
cd backend
ls service-account.json  # File tồn tại?
cat .env | grep GCP      # Config đúng?
npm run dev              # Restart
```

**Chi tiết:** Xem `TROUBLESHOOT_UPLOAD.md`

---

## 💰 Chi phí Google Cloud Storage

### Free Tier (Luôn miễn phí):
- ✅ 5 GB storage/tháng
- ✅ 1 GB network egress/tháng
- ✅ 5,000 uploads/tháng
- ✅ 50,000 views/tháng

→ **Với shop nhỏ (~1000 sản phẩm): MIỄN PHÍ!**

### Sau free tier:
- Storage: $0.020/GB/tháng
- Network: $0.12/GB

**Ví dụ:** 10 GB ảnh = **$0.10/tháng** (rất rẻ!)

---

## 📊 Kết quả

### Trước:
| Feature | Status |
|---------|--------|
| Products - Upload ảnh | ❌ Không có |
| Categories - Image field | ❌ Có nhưng không cần |
| Lưu ảnh ở đâu? | ❌ Không rõ |
| Validate | ❌ Không có |

### Sau:
| Feature | Status |
|---------|--------|
| Products - Upload ảnh | ✅ Có, dễ dùng |
| Categories - Image field | ✅ Đã bỏ, gọn gàng |
| Lưu ảnh ở đâu? | ✅ Google Cloud Storage |
| Validate | ✅ Type & size |
| Preview | ✅ Real-time |
| Error handling | ✅ Chi tiết |

---

## 🎉 Hoàn tất!

Giờ bạn có thể:
- ✅ Upload ảnh sản phẩm từ Admin Panel
- ✅ Ảnh lưu trên Google Cloud Storage (CDN toàn cầu)
- ✅ Preview ảnh trước khi save
- ✅ Validate file type & size
- ✅ UX tốt với error handling rõ ràng
- ✅ Không lo server hết dung lượng

**Next steps:**
1. Setup Google Cloud Storage (xem `GCS_SETUP.md`)
2. Test upload ảnh
3. Thêm sản phẩm thật vào hệ thống

Chúc bạn thành công! 🚀

