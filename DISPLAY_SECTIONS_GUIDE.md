# 📍 Hướng dẫn quản lý vị trí hiển thị sản phẩm

## 🎯 Tính năng mới

Admin có thể chọn sản phẩm xuất hiện ở các vị trí khác nhau trên trang chủ:

### Các vị trí hiển thị:
1. **Best Selling** (`bestselling`) - Sản phẩm bán chạy
2. **Just Arrived** (`justarrived`) - Sản phẩm mới về
3. **Most Popular** (`mostpopular`) - Sản phẩm phổ biến
4. **Featured** (`featured`) - Sản phẩm nổi bật

## 🔧 Cách sử dụng trong Admin

### 1. Vào trang Products
- Truy cập: `http://localhost:5173/admin.html`
- Click vào menu "Products"

### 2. Chọn vị trí hiển thị
- Click button **"Sections"** ở cột Actions
- Modal sẽ hiện ra với các checkbox
- Tick vào các vị trí bạn muốn sản phẩm xuất hiện
- Click **"Lưu thay đổi"**

### 3. Kết quả
- Sản phẩm sẽ tự động xuất hiện ở các section đã chọn trên trang chủ
- Một sản phẩm có thể xuất hiện ở nhiều vị trí cùng lúc
- Bỏ tick để xóa sản phẩm khỏi vị trí đó

## 📊 Database Schema

```prisma
model Product {
  // ... other fields
  displaySections String? @db.Text // JSON array: ["bestselling", "justarrived"]
}
```

Lưu dạng JSON string: `'["bestselling","mostpopular"]'`

## 🔄 Migration

Sau khi cập nhật schema, chạy:

```bash
cd backend
npx prisma migrate dev --name add_display_sections
npx prisma generate
```

## 💻 API Usage

### Filter products by section
```bash
GET /api/products?section=bestselling
GET /api/products?section=justarrived
GET /api/products?section=mostpopular
```

### Update product sections (Admin)
```bash
PUT /api/products/:id
{
  "displaySections": ["bestselling", "mostpopular"]
}
```

## 🎨 Frontend Components

Các component tự động filter theo section:

```jsx
// BestSelling.jsx
useProducts({ section: 'bestselling', limit: 8 })

// JustArrived.jsx
useProducts({ section: 'justarrived', limit: 4 })

// MostPopular.jsx
useProducts({ section: 'mostpopular', limit: 8 })
```

## 📝 Ví dụ

### Sản phẩm "Balo The North Face Recon"
Admin chọn:
- ✅ Best Selling
- ✅ Featured
- ❌ Just Arrived
- ❌ Most Popular

→ Sản phẩm sẽ xuất hiện ở:
- Mục "Sản phẩm bán chạy"
- Mục "Sản phẩm nổi bật"

### Khi sản phẩm không còn bán chạy
Admin bỏ tick:
- ❌ Best Selling

→ Sản phẩm biến mất khỏi mục "Sản phẩm bán chạy"

## 🎯 Best Practices

1. **Best Selling**: Chọn 8-12 sản phẩm bán chạy nhất
2. **Just Arrived**: Chọn 4-6 sản phẩm mới nhất
3. **Most Popular**: Chọn 8-12 sản phẩm được yêu thích
4. **Featured**: Chọn sản phẩm muốn quảng bá

## ⚠️ Lưu ý

- Nếu không chọn section nào, sản phẩm vẫn hiển thị ở trang danh sách đầy đủ
- Section chỉ ảnh hưởng đến trang chủ
- Có thể chọn nhiều section cho 1 sản phẩm
- Thay đổi có hiệu lực ngay lập tức

## 🔍 Troubleshooting

### Sản phẩm không hiện sau khi chọn section?
1. Kiểm tra `published = true`
2. Kiểm tra `stock > 0`
3. Refresh trang
4. Check console log

### Modal không mở?
- Check browser console
- Đảm bảo đã login admin
- Clear cache và reload

---

**Version**: 1.0.0  
**Last updated**: 2024-10-24

