# 🔧 Fix CORS Error khi Upload lên Google Cloud Storage

## ❌ Lỗi bạn đang gặp:

```
Access to fetch at 'https://storage.googleapis.com/...' has been blocked by CORS policy
```

## 📝 Nguyên nhân:

Google Cloud Storage bucket chưa được cấu hình CORS để cho phép upload từ `http://localhost:5173`.

---

## ✅ Cách fix (2 phương án)

### **Phương án 1: Dùng gsutil (Nhanh nhất - Khuyến nghị)**

#### Bước 1: Cài đặt Google Cloud SDK

**Windows:**
1. Download: https://cloud.google.com/sdk/docs/install#windows
2. Chạy installer `GoogleCloudSDKInstaller.exe`
3. Follow setup wizard
4. Restart terminal/PowerShell

**macOS:**
```bash
brew install --cask google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

#### Bước 2: Login vào Google Cloud

```bash
gcloud auth login
```

Browser sẽ mở → Chọn tài khoản Google → Cho phép

#### Bước 3: Set project

```bash
# Thay YOUR_PROJECT_ID bằng project ID thực tế
gcloud config set project essential-haiku-475709-j6
```

#### Bước 4: Apply CORS config

```bash
cd backend
gsutil cors set cors.json gs://ttdbalo-images
```

✅ **Xong!** CORS đã được config.

#### Bước 5: Verify

```bash
gsutil cors get gs://ttdbalo-images
```

Bạn sẽ thấy config CORS hiển thị.

---

### **Phương án 2: Dùng Google Cloud Console (Không cần cài gì)**

#### Bước 1: Mở Google Cloud Console

https://console.cloud.google.com/storage/browser

#### Bước 2: Chọn bucket

Click vào bucket `ttdbalo-images`

#### Bước 3: Edit CORS

1. Tab **PERMISSIONS**
2. Scroll xuống phần **CORS**
3. Click **EDIT CORS CONFIGURATION**

#### Bước 4: Paste config

Copy nội dung file `backend/cors.json` và paste vào:

```json
[
  {
    "origin": ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "responseHeader": ["Content-Type", "Content-Length"],
    "maxAgeSeconds": 3600
  }
]
```

#### Bước 5: Save

Click **SAVE**

✅ **Xong!**

---

## 🧪 Test lại

1. Refresh browser (Ctrl + F5)
2. Admin Panel → Products → Add Product
3. Upload ảnh
4. ✅ Thành công!

---

## 🌐 Nếu deploy production

Thêm domain thật vào CORS config:

```json
[
  {
    "origin": [
      "http://localhost:5173",
      "https://your-domain.com",
      "https://admin.your-domain.com"
    ],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "responseHeader": ["Content-Type", "Content-Length"],
    "maxAgeSeconds": 3600
  }
]
```

Apply lại:
```bash
gsutil cors set cors.json gs://ttdbalo-images
```

---

## 📋 Troubleshooting

### ❌ "gsutil: command not found"

→ Chưa cài Google Cloud SDK. Xem **Phương án 1 - Bước 1**

### ❌ "ServiceException: 401 Anonymous caller does not have storage.objects.list access"

→ Chưa login. Chạy:
```bash
gcloud auth login
```

### ❌ "BucketNotFoundException: 404 gs://ttdbalo-images bucket does not exist"

→ Sai tên bucket. Kiểm tra lại tên bucket trong `.env`

---

## ✅ Xong!

Sau khi config CORS, upload ảnh sẽ hoạt động bình thường! 🎉

