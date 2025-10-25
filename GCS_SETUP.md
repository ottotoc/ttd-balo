# 📷 Hướng dẫn cấu hình Google Cloud Storage

## Tại sao cần Google Cloud Storage?

Khi bạn upload ảnh sản phẩm trong Admin Panel, ảnh sẽ được lưu trữ trên Google Cloud Storage thay vì lưu trên server. Điều này giúp:

- ✅ Lưu trữ ảnh an toàn, ổn định
- ✅ Tải ảnh nhanh với CDN toàn cầu
- ✅ Không lo server hết dung lượng
- ✅ Dễ quản lý và backup

---

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập bằng tài khoản Google
3. Click "Select a project" → "NEW PROJECT"
4. Đặt tên project: **ttdbalo** (hoặc tên bạn muốn)
5. Click **CREATE**

---

## Bước 2: Tạo Storage Bucket

1. Trong Google Cloud Console, mở menu (☰) → **Cloud Storage** → **Buckets**
2. Click **CREATE BUCKET**

### Cấu hình Bucket:

**Step 1: Name your bucket**
- Name: `ttdbalo-images` (phải unique toàn cầu)
- Click **CONTINUE**

**Step 2: Choose where to store your data**
- Location type: **Region**
- Location: **asia-southeast1** (Singapore) - gần Việt Nam nhất
- Click **CONTINUE**

**Step 3: Choose a storage class**
- Default storage class: **Standard**
- Click **CONTINUE**

**Step 4: Choose how to control access**
- **BỎ TÍCH** "Enforce public access prevention on this bucket"
- Access control: **Fine-grained** (mặc định)
- Click **CONTINUE**

**Step 5: Choose how to protect object data**
- Giữ mặc định
- Click **CREATE**

### Làm Bucket Public (để ảnh hiển thị được):

1. Click vào bucket vừa tạo
2. Tab **PERMISSIONS**
3. Click **GRANT ACCESS**
4. New principals: `allUsers`
5. Role: **Cloud Storage** → **Storage Object Viewer**
6. Click **SAVE**
7. Confirm "Allow public access"

✅ Giờ bucket của bạn đã public, mọi người có thể xem ảnh qua URL

---

## Bước 3: Tạo Service Account

1. Menu (☰) → **IAM & Admin** → **Service Accounts**
2. Click **CREATE SERVICE ACCOUNT**

### Thông tin Service Account:

**Step 1: Service account details**
- Service account name: `ttdbalo-storage`
- Service account ID: `ttdbalo-storage` (tự động)
- Description: `Upload images to Cloud Storage`
- Click **CREATE AND CONTINUE**

**Step 2: Grant this service account access**
- Role: **Cloud Storage** → **Storage Object Admin**
- Click **CONTINUE**

**Step 3: Grant users access (optional)**
- Bỏ qua, click **DONE**

---

## Bước 4: Tạo và Download JSON Key

1. Click vào service account vừa tạo (`ttdbalo-storage`)
2. Tab **KEYS**
3. Click **ADD KEY** → **Create new key**
4. Key type: **JSON**
5. Click **CREATE**

→ File JSON sẽ được download về máy (ví dụ: `ttdbalo-xxxxx.json`)

⚠️ **BẢO MẬT:** Không commit file này lên Git!

---

## Bước 5: Cấu hình Backend

### 1. Copy file JSON key vào thư mục backend

```bash
cd backend
# Copy file JSON vào thư mục backend và đổi tên
cp ~/Downloads/ttdbalo-xxxxx.json ./service-account.json
```

### 2. Thêm vào `.gitignore`

```bash
# Mở backend/.gitignore và thêm
service-account.json
*.json  # Để chắc chắn
```

### 3. Cấu hình `.env`

Mở file `backend/.env` và thêm/cập nhật:

```env
# Google Cloud Storage
GCP_BUCKET="ttdbalo-images"
GCP_KEY_FILE="./service-account.json"
```

### 4. Restart Backend Server

```bash
# Ctrl+C để dừng server
npm run dev
```

Kiểm tra terminal, nếu không có lỗi "GCS not configured" là thành công!

---

## Bước 6: Test Upload

1. Mở Admin Panel: `http://localhost:5173/admin.html`
2. Login với `admin@ttdbalo.com` / `admin123`
3. Vào **Products** → **Add Product**
4. Click vào ô upload ảnh
5. Chọn một file ảnh

✅ Nếu upload thành công, bạn sẽ thấy:
- Ảnh preview hiển thị
- URL dạng: `https://storage.googleapis.com/ttdbalo-images/uploads/xxxxx.jpg`

---

## Xử lý lỗi thường gặp

### ❌ "File upload service not configured"

**Nguyên nhân:** Backend không tìm thấy file JSON key hoặc bucket name sai

**Giải pháp:**
```bash
# Kiểm tra file tồn tại
ls backend/service-account.json

# Kiểm tra .env
cat backend/.env | grep GCP
```

### ❌ "403 Forbidden" khi upload

**Nguyên nhân:** Service Account không có quyền

**Giải pháp:**
1. Google Cloud Console → IAM & Admin → Service Accounts
2. Click vào service account
3. Tab PERMISSIONS
4. Đảm bảo có role: **Storage Object Admin**

### ❌ Ảnh upload lên nhưng không hiển thị (403)

**Nguyên nhân:** Bucket không public

**Giải pháp:**
1. Vào bucket → PERMISSIONS
2. Grant access: `allUsers` với role **Storage Object Viewer**

### ❌ "Invalid content type"

**Nguyên nhân:** File không phải ảnh

**Giải pháp:** Chỉ upload file: JPG, PNG, WEBP, GIF

---

## Chi phí Google Cloud Storage

### Free Tier (Luôn miễn phí):

- ✅ **5 GB** storage mỗi tháng
- ✅ **1 GB** network egress (download) mỗi tháng từ North America
- ✅ **5000** Class A operations (upload) mỗi tháng
- ✅ **50000** Class B operations (view) mỗi tháng

→ **Với shop nhỏ (~1000 sản phẩm, ~5000 ảnh), hoàn toàn FREE!**

### Nếu vượt Free Tier:

- Storage: **$0.020/GB/tháng** (khu vực Singapore)
- Network egress: **$0.12/GB** (sau 1GB free)

**Ví dụ:**
- 10 GB ảnh = $(5 free + 5 * $0.020) = **$0.10/tháng**
- 10,000 views/tháng (~50MB download) = **FREE**

→ **Rất rẻ!** Chi phí tháng thường < $1

---

## Cấu hình nâng cao (Optional)

### 1. Bật CDN để tải ảnh nhanh hơn

1. Vào bucket → Configuration
2. Click **SET UP A LOAD BALANCER**
3. Làm theo hướng dẫn để enable Cloud CDN

→ Ảnh sẽ được cache ở nhiều server trên thế giới, tải cực nhanh!

### 2. Tự động resize ảnh khi upload

Dùng Cloud Functions để tự động tạo thumbnail:

```bash
# Cài đặt sharp để resize
npm install sharp

# Tạo Cloud Function trigger khi có file mới upload
# Code mẫu: https://cloud.google.com/functions/docs/tutorials/imagemagick
```

### 3. Lifecycle Policy - Xóa ảnh cũ tự động

```bash
# Tạo lifecycle rule để xóa ảnh sau 365 ngày
gsutil lifecycle set lifecycle.json gs://ttdbalo-images
```

---

## Security Best Practices

1. ✅ **KHÔNG** commit `service-account.json` lên Git
2. ✅ Thêm vào `.gitignore`
3. ✅ Chỉ grant quyền **Storage Object Admin** cho service account
4. ✅ Bucket public nhưng **chỉ READ**, không ai viết được ngoại trừ service account
5. ✅ Nếu deploy production, dùng Secret Manager thay vì file JSON

---

## Hoàn tất! 🎉

Bây giờ bạn có thể:
- ✅ Upload ảnh sản phẩm từ Admin Panel
- ✅ Ảnh được lưu trên Google Cloud Storage
- ✅ Hiển thị ảnh trên website với tốc độ cao
- ✅ Không lo server hết dung lượng

**Lưu ý:** Nếu chưa cần upload ảnh ngay, có thể tạm thời dùng URL ảnh từ internet (Unsplash, Imgur...) rồi setup GCS sau.

