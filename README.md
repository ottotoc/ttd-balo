# 🎒 TTD Balo - E-Commerce Platform

Hệ thống thương mại điện tử chuyên bán **Balo, Túi xách, Túi chéo, Vali** với React frontend và Node.js backend.

## ✨ Tính năng

### Frontend (Khách hàng)
- 🎒 Xem danh sách sản phẩm (Balo, Túi, Vali) với filter và search
- 🛒 Giỏ hàng (hỗ trợ guest và user đăng nhập)
- 💳 Checkout với COD hoặc chuyển khoản ngân hàng
- ⭐ Đánh giá sản phẩm
- 📱 Responsive design
- 🔔 Cập nhật realtime (tồn kho, trạng thái đơn hàng)

### Backend API
- 🔐 Authentication & Authorization (JWT)
- 📦 Quản lý sản phẩm theo categories: Balo, Túi xách, Túi chéo, Vali, Balo Laptop, Túi Du lịch
- 🏷️ Quản lý brands: Mikkor, Tomtoc, Sakos, The North Face, JanSport, Adidas, Nike
- 🎨 Quản lý variants: Màu sắc, Size cho mỗi sản phẩm
- 🛒 Giỏ hàng (guest + authenticated)
- 📋 Quản lý đơn hàng
- 💰 Mã giảm giá (percent/fixed, scope theo product/category)
- ⭐ Đánh giá & rating
- 📊 Tính VAT tự động
- 📷 Upload ảnh lên Google Cloud Storage
- 🔄 Socket.IO realtime updates

### Admin Panel
- 📊 Dashboard với thống kê
- 📦 Quản lý sản phẩm Balo/Túi/Vali (CRUD)
- 📋 Quản lý đơn hàng & xác nhận thanh toán
- 📁 Quản lý categories, brands, tags
- 💰 Quản lý mã giảm giá
- ⭐ Duyệt đánh giá

## 🚀 Quick Start

### 1. Setup Database
```sql
CREATE DATABASE ttdbalo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend
```bash
cd backend
npm install
# Tạo file .env với DATABASE_URL="mysql://root:@localhost:3306/ttdbalo"
npx prisma generate
npx prisma migrate dev
npm run seed  # Tạo dữ liệu mẫu: 8 sản phẩm, 6 categories, 7 brands
npm run dev   # Port 3000
```

### 3. Frontend
```bash
npm install
echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev   # Port 5173
```

### 4. Access
- **Customer**: http://localhost:5173
- **Admin**: http://localhost:5173/admin.html
  - Email: `admin@ttdbalo.com`
  - Password: `admin123`

## 📦 Sản phẩm mẫu

Hệ thống đã seed sẵn 8 sản phẩm:
1. **Balo Laptop The North Face Recon** - 2,890,000đ (Đen, Xám)
2. **Balo Adidas Classic** - 650,000đ (Đen, Navy, Đỏ)
3. **Túi Xách Nữ Thời Trang** - 450,000đ (Đen, Nâu, Hồng)
4. **Túi Chéo Nam Da Bò Thật** - 890,000đ (Nâu Đậm, Đen)
5. **Vali Sakos Titan 24 inch** - 3,200,000đ (Bạc, Đen, Navy)
6. **Túi Du Lịch Mikkor** - 1,250,000đ (Đen, Xám)
7. **Balo JanSport Superbreak Plus** - 890,000đ (Đen, Navy, Đỏ)
8. **Balo Tomtoc Laptop 16 inch** - 1,890,000đ (Đen, Xám)

## 📁 Cấu trúc

```
ttdBalo/
├── FoodMart-1.0.0/         # Root (tên folder cũ, nội dung đã update)
│   ├── backend/             # Node.js Backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # 14 models
│   │   │   └── seed.js          # Dữ liệu mẫu cho TTD Balo
│   │   └── src/
│   │       ├── modules/         # 8 modules
│   │       └── app.js
│   │
│   ├── src/                 # React Frontend
│   │   ├── admin/           # Admin Panel
│   │   ├── components/      # UI Components
│   │   ├── hooks/           # useAuth, useCart, useProducts
│   │   └── lib/             # api.js, socket.js
│   │
│   └── admin.html
```

## 🔧 Categories & Brands

### Categories
- **Balo** - Balo thường, balo học sinh
- **Túi Xách** - Túi xách nữ, túi công sở
- **Túi Chéo** - Túi đeo chéo nam/nữ
- **Vali** - Vali du lịch các size
- **Balo Laptop** - Balo chuyên dụng laptop
- **Túi Du Lịch** - Túi xách du lịch, thể thao

### Brands
Mikkor | Tomtoc | Sakos | The North Face | JanSport | Adidas | Nike

## 💳 Luồng thanh toán

1. Khách đặt hàng → Order `PENDING`
2. **COD**: Admin xác nhận
3. **Bank Transfer**: Khách chuyển khoản → Admin `/confirm-payment` → Trừ tồn kho
4. Cập nhật: `PROCESSING` → `SHIPPED` → `COMPLETED`

## 🔐 Bảo mật

- JWT trong HttpOnly cookie
- Password hash bcryptjs
- CORS protection
- Input validation
- Admin routes protected

## 📝 API Endpoints

### Products
- `GET /api/products?category=balo&brand=mikkor&minPrice=500000`
- `GET /api/products/:slug`

### Cart & Orders
- `GET /api/cart`
- `POST /api/cart/items`
- `POST /api/orders`

### Public
- `GET /api/categories`
- `GET /api/brands`
- `GET /api/banners`

Xem `backend/README.md` cho API docs đầy đủ.

## 📖 Documentation

- `SETUP_GUIDE.md` - Hướng dẫn cài đặt chi tiết
- `INTEGRATION.md` - Hướng dẫn tích hợp API
- `backend/README.md` - API documentation

## 🚢 Deployment

```bash
# Backend
cd backend
npm start

# Frontend
npm run build
# Deploy dist/ folder
```

## 💰 Mã giảm giá mẫu

- `CHAOBAN2024` - Giảm 10% cho đơn từ 500k
- `FREESHIP` - Giảm 30k ship cho đơn từ 1tr

## 📞 Support

Email: admin@ttdbalo.com

---

**Tech Stack**: React 19 | Node.js | Express | MySQL | Prisma | Socket.IO | JWT | Bootstrap 5
