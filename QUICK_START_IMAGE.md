# 🚀 Hướng dẫn nhanh: Upload Ảnh Sản Phẩm

## ✅ Đã làm xong gì?

1. ✅ **Products**: Có field upload ảnh (bắt buộc)
2. ✅ **Categories**: Bỏ field imageUrl (không cần nữa)
3. ✅ Upload ảnh lên Google Cloud Storage
4. ✅ Preview ảnh trước khi lưu
5. ✅ Validate file (chỉ JPG, PNG, WEBP, GIF, max 5MB)

---

## 🎯 Setup trong 5 phút

### Bước 1: Setup Google Cloud Storage

**Option A: Theo hướng dẫn chi tiết** (khuyến nghị)
```bash
# Đọc hướng dẫn đầy đủ
cat GCS_SETUP.md
```

**Option B: Tóm tắt nhanh**

1. Vào https://console.cloud.google.com
2. Tạo project mới: **ttdbalo**
3. Tạo bucket: **ttdbalo-images** (region: asia-southeast1)
4. Làm bucket public: Grant access `allUsers` → role "Storage Object Viewer"
5. Tạo Service Account: role "Storage Object Admin"
6. Download JSON key → lưu vào `backend/service-account.json`

### Bước 2: Cấu hình Backend

```bash
cd backend

# Tạo/cập nhật .env
cat >> .env << EOF
GCP_BUCKET="ttdbalo-images"
GCP_KEY_FILE="./service-account.json"
EOF

# Thêm vào .gitignore
echo "service-account.json" >> .gitignore

# Restart server
npm run dev
```

### Bước 3: Test

1. Mở http://localhost:5173/admin.html
2. Login: `admin@ttdbalo.com` / `admin123`
3. Products → Add Product
4. Click vào ô upload ảnh → Chọn ảnh
5. Đợi upload → Thấy preview
6. Điền thông tin → Save
7. ✅ Thành công!

---

## ⚠️ Xử lý lỗi "Failed to fetch"

### Nguyên nhân phổ biến:

1. **Chưa login admin** - Refresh và login lại
2. **Backend chưa restart** - `cd backend && npm run dev`
3. **GCS chưa config** - Kiểm tra `.env` và file JSON

### Fix nhanh:

```bash
# Kiểm tra backend
node test-upload-api.js

# Nếu thấy ✅ Backend is running → Backend OK!
# Giờ chỉ cần login admin lại trong browser
```

---

## 💰 Chi phí

**Free tier:** 5GB storage + 1GB transfer mỗi tháng → **MIỄN PHÍ** cho shop nhỏ

---

## 📚 Đọc thêm

- `GCS_SETUP.md` - Hướng dẫn setup chi tiết từng bước
- `TROUBLESHOOT_UPLOAD.md` - Debug các lỗi upload
- Google Cloud Storage docs: https://cloud.google.com/storage/docs

---

## 🎉 Xong!

Giờ bạn có thể upload ảnh sản phẩm dễ dàng từ Admin Panel!

