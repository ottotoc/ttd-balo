# 📖 Hướng dẫn cài đặt và chạy TTD Balo E-Commerce

## Bước 1: Chuẩn bị môi trường

### Yêu cầu hệ thống
- ✅ Node.js 16+ ([Download](https://nodejs.org/))
- ✅ MySQL 8+ ([Download](https://dev.mysql.com/downloads/mysql/))
- ✅ npm (đi kèm với Node.js)

### Kiểm tra cài đặt
```bash
node --version   # Should be v16+
npm --version    # Should be 7+
mysql --version  # Should be 8+
```

## Bước 2: Tạo database MySQL

```sql
-- Mở MySQL command line hoặc phpMyAdmin
CREATE DATABASE ttdbalo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user (optional, có thể dùng root)
CREATE USER 'ttdbalo_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ttdbalo.* TO 'ttdbalo_user'@'localhost';
FLUSH PRIVILEGES;
```

## Bước 3: Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env từ example
cp .env.example .env

# Chỉnh sửa .env với thông tin MySQL của bạn
# DATABASE_URL="mysql://ttdbalo_user:your_password@localhost:3306/ttdbalo"
# hoặc nếu dùng root:
# DATABASE_URL="mysql://root:@localhost:3306/ttdbalo"
```

**Nội dung file .env:**
```env
DATABASE_URL="mysql://root:@localhost:3306/ttdbalo"
JWT_SECRET="ttdbalo_jwt_secret_key_2024"
REFRESH_SECRET="ttdbalo_refresh_secret_key_2024"
CORS_ORIGIN="http://localhost:5173"
PORT=3000

# Google Cloud Storage (optional - để sau)
GCP_BUCKET="ttdbalo-bucket"
GCP_KEY_FILE="./service-account.json"
```

```bash
# Generate Prisma Client
npx prisma generate

# Chạy database migration
npx prisma migrate dev --name init

# Seed dữ liệu mẫu (Balo, Túi xách, Vali)
npm run seed

# Khởi động backend server
npm run dev
```

✅ Backend đang chạy tại: `http://localhost:3000`

Kiểm tra: Mở `http://localhost:3000/health` - nên thấy `{"status":"ok"}`

## Bước 4: Cài đặt Frontend

Mở terminal mới (giữ backend đang chạy):

```bash
# Quay về thư mục root (FoodMart-1.0.0)
cd ..

# Cài đặt dependencies
npm install

# Tạo file .env (nếu chưa có)
echo VITE_API_URL=http://localhost:3000 > .env

# Khởi động frontend
npm run dev
```

✅ Frontend đang chạy tại: `http://localhost:5173`

## Bước 5: Truy cập ứng dụng

### 🎒 Customer Frontend
Mở trình duyệt: `http://localhost:5173`

### 🔐 Admin Panel
Mở trình duyệt: `http://localhost:5173/admin.html`

**Đăng nhập admin:**
- Email: `admin@ttdbalo.com`
- Password: `admin123`

## Dữ liệu mẫu đã tạo

### 📁 Categories
- Balo
- Túi Xách
- Túi Chéo
- Vali
- Balo Laptop
- Túi Du Lịch

### 🏷️ Brands
- Mikkor
- Tomtoc
- Sakos
- The North Face
- JanSport
- Adidas
- Nike

### 📦 Products (8 sản phẩm mẫu)
1. Balo Laptop The North Face Recon - 2,890,000đ
2. Balo Adidas Classic - 650,000đ
3. Túi Xách Nữ Thời Trang - 450,000đ
4. Túi Chéo Nam Da Bò Thật - 890,000đ
5. Vali Sakos Titan 24 inch - 3,200,000đ
6. Túi Du Lịch Mikkor The Norris - 1,250,000đ
7. Balo JanSport Superbreak Plus - 890,000đ
8. Balo Tomtoc Laptop 16 inch - 1,890,000đ

### 💰 Discount Codes
- `CHAOBAN2024`: Giảm 10% cho đơn hàng từ 500,000đ
- `FREESHIP`: Giảm 30,000đ ship cho đơn từ 1,000,000đ

## Kiểm tra hoạt động

### Test Backend API
```bash
# Health check
curl http://localhost:3000/health

# Get categories
curl http://localhost:3000/api/categories

# Get products
curl http://localhost:3000/api/products
```

### Test Database
```bash
# Mở Prisma Studio để xem database
cd backend
npx prisma studio
```

Bạn sẽ thấy database với đầy đủ:
- 1 Admin user
- 6 Categories
- 7 Brands
- 8 Products (với variants theo màu sắc, size)
- 2 Banners
- 2 Discount codes

## Xử lý lỗi thường gặp

### ❌ "Can't connect to MySQL server"
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra DATABASE_URL trong .env
- Windows: Mở Services và start MySQL service

### ❌ "Port 3000 already in use"
- Đổi PORT trong backend/.env thành 3001
- Nhớ cập nhật VITE_API_URL trong frontend/.env

### ❌ "Prisma Client not generated"
```bash
cd backend
npx prisma generate
```

### ❌ "CORS error" trên frontend
- Kiểm tra backend đang chạy
- Kiểm tra CORS_ORIGIN trong backend/.env
- Clear browser cache và reload

## Tùy chỉnh sản phẩm

Sau khi setup xong, bạn có thể:

1. **Thêm sản phẩm mới** qua Admin Panel
2. **Upload ảnh thật** cho sản phẩm (tạm thời dùng URL placeholder)
3. **Tạo thêm categories/brands** phù hợp với cửa hàng
4. **Điều chỉnh giá, variants** (màu sắc, size)

## Tiếp theo

1. ✅ Tích hợp API vào frontend components (xem INTEGRATION.md)
2. ✅ Setup Google Cloud Storage để upload ảnh thật
3. ✅ Customize giao diện phù hợp với thương hiệu
4. ✅ Thêm sản phẩm thật vào database qua Admin Panel

Chúc bạn thành công với TTD Balo! 🎒🎉
