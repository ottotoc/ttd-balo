# FoodMart Backend API

Backend API cho hệ thống e-commerce FoodMart với đầy đủ tính năng quản lý sản phẩm, giỏ hàng, đơn hàng, thanh toán và quản trị.

## Tính năng

- ✅ Authentication & Authorization (JWT)
- ✅ Products Management (CRUD, filters, search)
- ✅ Shopping Cart (guest + authenticated users)
- ✅ Orders & Checkout (COD, Bank Transfer)
- ✅ Discount Codes (percent/fixed, scoped by product/category)
- ✅ Reviews & Ratings
- ✅ Categories, Brands, Tags
- ✅ Banners & Blog Posts
- ✅ File Upload (Google Cloud Storage)
- ✅ Real-time Updates (Socket.IO)
- ✅ VAT Calculation
- ✅ Stock Management

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Prisma
- **Authentication:** JWT (HttpOnly cookies)
- **File Storage:** Google Cloud Storage
- **Real-time:** Socket.IO
- **Password Hashing:** bcryptjs

## Cài đặt

### 1. Clone và cài dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/foodmart"
JWT_SECRET="your_jwt_secret_key"
REFRESH_SECRET="your_refresh_secret_key"
CORS_ORIGIN="http://localhost:5173"
PORT=3000

# Google Cloud Storage (optional)
GCP_BUCKET="your-gcs-bucket-name"
GCP_KEY_FILE="./service-account.json"
```

### 3. Chạy migration database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. (Optional) Seed data mẫu

Tạo file `prisma/seed.js` để thêm dữ liệu mẫu.

### 5. Khởi động server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Thông tin user hiện tại

### Products
- `GET /api/products` - Danh sách sản phẩm (hỗ trợ filter, search, pagination)
- `GET /api/products/:slug` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Cart
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/items` - Thêm vào giỏ
- `PATCH /api/cart/items/:id` - Cập nhật số lượng
- `DELETE /api/cart/items/:id` - Xóa khỏi giỏ
- `DELETE /api/cart` - Xóa toàn bộ giỏ

### Orders
- `POST /api/orders` - Tạo đơn hàng (checkout)
- `GET /api/orders` - Danh sách đơn hàng
- `GET /api/orders/:id` - Chi tiết đơn hàng
- `PATCH /api/orders/:id/status` - Cập nhật trạng thái (Admin)
- `POST /api/orders/:id/confirm-payment` - Xác nhận thanh toán & trừ tồn kho (Admin)

### Discounts
- `POST /api/discounts/validate` - Kiểm tra mã giảm giá
- `GET /api/discounts` - Danh sách mã (Admin)
- `POST /api/discounts` - Tạo mã (Admin)
- `PUT /api/discounts/:id` - Cập nhật (Admin)
- `DELETE /api/discounts/:id` - Xóa (Admin)

### Reviews
- `GET /api/reviews/products/:productId` - Đánh giá của sản phẩm
- `POST /api/reviews/products/:productId` - Tạo đánh giá
- `GET /api/reviews` - Tất cả đánh giá (Admin)
- `PATCH /api/reviews/:id/approve` - Duyệt đánh giá (Admin)
- `DELETE /api/reviews/:id` - Xóa đánh giá (Admin)

### Public Data
- `GET /api/categories` - Danh mục
- `GET /api/brands` - Thương hiệu
- `GET /api/tags` - Tags
- `GET /api/banners` - Banners
- `GET /api/blog` - Blog posts
- `GET /api/blog/:slug` - Chi tiết blog

### Admin
- Categories: `/api/admin/categories`
- Brands: `/api/admin/brands`
- Tags: `/api/admin/tags`
- Banners: `/api/admin/banners`
- Blog: `/api/admin/blog`

### Uploads
- `POST /api/uploads/signed-url` - Lấy URL upload (Admin)
- `DELETE /api/uploads/file` - Xóa file (Admin)

## Socket.IO Events

### Client → Server
- `join:order` - Tham gia room theo dõi đơn hàng
- `join:product` - Tham gia room theo dõi sản phẩm
- `leave:order` - Rời room đơn hàng
- `leave:product` - Rời room sản phẩm

### Server → Client
- `stock.update` - Cập nhật tồn kho
  ```js
  { productId, variantId?, stock }
  ```
- `order.status` - Cập nhật trạng thái đơn hàng
  ```js
  { orderId, status, paymentStatus }
  ```

## Database Schema

Xem file `prisma/schema.prisma` để biết chi tiết schema.

## Luồng thanh toán

1. Khách hàng đặt hàng → Order tạo với `status: PENDING`, `paymentStatus: PENDING`
2. **COD**: Admin xác nhận đơn → chuyển `status: AWAITING_CONFIRMATION`
3. **Bank Transfer**: Khách gửi tiền + `bankRef` → Admin kiểm tra → gọi `/confirm-payment`
4. `/confirm-payment` → Kiểm tra tồn kho → Trừ tồn → `paymentStatus: PAID`, `status: AWAITING_CONFIRMATION`
5. Admin tiếp tục cập nhật: `PROCESSING` → `SHIPPED` → `COMPLETED`

## Lưu ý bảo mật

- JWT lưu trong HttpOnly cookie
- CORS chỉ cho phép origin được cấu hình
- Admin routes được bảo vệ bởi middleware `authorize('ADMIN')`
- Passwords được hash bằng bcryptjs
- Validation đầu vào cho tất cả endpoints

## License

MIT

