# 🐛 Xử lý lỗi Upload Image

## ❌ Lỗi: "TypeError: Failed to fetch"

### Nguyên nhân & Cách fix

#### 1. **Chưa Login Admin** (Nguyên nhân #1)

Upload API yêu cầu **admin authentication**. 

**FIX:**
1. Mở http://localhost:5173/admin.html
2. Login: `admin@ttdbalo.com` / `admin123`
3. Đợi redirect vào dashboard
4. Products → Add Product → Upload ảnh
5. ✅ Thành công!

**Nếu vẫn lỗi:**
- Đóng tất cả tab browser
- Mở lại và login fresh
- Thử upload lại

---

#### 2. **Backend chưa chạy hoặc chưa restart**

```bash
# Kiểm tra backend có chạy không
node test-upload-api.js

# Expected output:
# ✅ Backend is running: { status: 'ok', ... }
# ✅ Upload endpoint exists (401 = cần login, đúng rồi!)
```

**Nếu backend không chạy:**
```bash
cd backend
npm run dev
```

**Nếu vừa config GCS, restart backend:**
```bash
# Ctrl+C để dừng
npm run dev
```

---

#### 3. **Google Cloud Storage chưa config**

Kiểm tra file `.env`:
```bash
cd backend
cat .env | grep GCP
```

Expected:
```
GCP_BUCKET="ttdbalo-images"
GCP_KEY_FILE="./service-account.json"
```

Kiểm tra file JSON tồn tại:
```bash
ls service-account.json
# Nếu không có → Download lại từ GCP Console
```

**Fix:** Xem `GCS_SETUP.md` để setup đầy đủ

---

#### 4. **CORS Issue** (Hiếm gặp)

Backend `.env`:
```env
CORS_ORIGIN="http://localhost:5173"
```

Frontend phải chạy ở cùng port này.

---

## 🧪 Debug Step-by-Step

### Step 1: Test Backend

```bash
node test-upload-api.js
```

✅ Nếu thấy "Backend is running" → Backend OK!

---

### Step 2: Kiểm tra Login Admin

1. Mở Chrome DevTools (F12)
2. Tab **Network**
3. Login admin → Xem request `/api/auth/login`
4. Response có `success: true`? ✅
5. Tab **Application** → **Cookies** → `http://localhost:5173`
6. Có cookie `token`? ✅

---

### Step 3: Test Upload với DevTools

1. Products → Add Product → Upload ảnh
2. Tab **Network** → Xem request `/api/uploads/signed-url`
3. **Request Headers** có `Cookie: token=...`?
   - ✅ Có → Backend sẽ nhận
   - ❌ Không → Frontend không gửi cookie

4. **Response:**
   - Status 200 → ✅ Success
   - Status 401 → Chưa login
   - Status 400 → GCS chưa config
   - Status 500 → Backend error (xem backend console)
   - **Failed to fetch** → Backend không chạy

---

## 💡 Quick Fix

**Cách nhanh nhất (90% case sẽ fix):**

1. Đóng tất cả tab browser
2. Mở lại http://localhost:5173/admin.html
3. Login fresh: `admin@ttdbalo.com` / `admin123`
4. Products → Add Product → Upload ảnh
5. ✅ Thành công!

---

## 🔧 Checklist

- [ ] Backend đang chạy (`npm run dev`)
- [ ] Backend không có error GCS trong console
- [ ] Đã login admin trong browser
- [ ] Cookie `token` tồn tại (xem DevTools)
- [ ] CORS_ORIGIN đúng trong backend/.env
- [ ] Hard refresh browser (Ctrl + F5)
- [ ] File `service-account.json` tồn tại

---

## ❓ Vẫn không được?

### Tạm thời dùng URL thay vì upload:

Vào `ProductsPage.jsx` line 127-130, comment validation:
```jsx
// if (!form.imageUrl) {
//   alert('⚠️ Vui lòng upload ảnh sản phẩm')
//   return
// }
```

Dùng URL từ internet:
- Unsplash: https://unsplash.com
- Lorem Picsum: https://picsum.photos/800/600
- Imgur: https://imgur.com

---

## 📝 Gửi screenshot nếu cần help:

1. Browser DevTools → Network tab (request upload)
2. Backend console (terminal)
3. Cookie trong DevTools → Application

Hoặc liên hệ support! 🚀

