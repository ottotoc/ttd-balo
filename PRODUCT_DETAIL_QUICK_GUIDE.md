# ⚡ Product Detail - Quick Guide

## 🎯 Tính Năng Mới

**Trang chi tiết sản phẩm** - Click vào sản phẩm để xem đầy đủ thông tin!

---

## 🚀 Test Ngay (30 giây)

1. **Khởi động app**
   ```bash
   npm run dev
   ```

2. **Mở browser**: `http://localhost:5173`

3. **Click vào bất kỳ sản phẩm nào** trên trang chủ

4. **Xem trang chi tiết** với:
   - ✅ Ảnh lớn + thumbnails
   - ✅ Thông tin đầy đủ
   - ✅ Chọn số lượng
   - ✅ Thêm vào giỏ

---

## 📸 Layout

```
┌────────────────────────────────────────┐
│  Home > Category > Product Name        │ ← Breadcrumb
├──────────────────┬─────────────────────┤
│                  │                     │
│  [Main Image]    │  Product Name       │
│                  │  ⭐⭐⭐⭐⭐ (10)      │
│  [Thumb] [Thumb] │                     │
│                  │  Price: 100,000 ₫   │
│                  │  Was: 150,000 ₫     │
│                  │                     │
│                  │  Short description  │
│                  │                     │
│                  │  ✓ Còn hàng (50)    │
│                  │                     │
│                  │  Qty: [-] 1 [+]     │
│                  │  [🛒 Thêm vào giỏ]  │
└──────────────────┴─────────────────────┘
│                                        │
│  Mô tả chi tiết                        │
│  ...full description text...           │
└────────────────────────────────────────┘
```

---

## 🎯 Features

### 1. Image Gallery
- Main image lớn
- Click thumbnails để đổi ảnh
- Discount badge nếu có

### 2. Product Info
- Name, SKU, Category, Brand
- Price (và giá gốc nếu giảm)
- Rating với số đánh giá
- Mô tả ngắn & chi tiết

### 3. Add to Cart
- Chọn số lượng (1 - stock)
- Button thêm vào giỏ
- Alert khi thành công

### 4. Stock Status
- ✅ "Còn hàng" (xanh)
- ❌ "Hết hàng" (đỏ)
- Validate số lượng

---

## 📁 Files Mới

```
src/
├── hooks/
│   └── useProduct.js           (NEW)
├── pages/
│   ├── HomePage.jsx            (NEW)
│   └── ProductDetail.jsx       (NEW)
└── main.jsx                    (UPDATED - routing)
```

---

## 🔗 Routing

```javascript
"/" → HomePage
"/product/:slug" → ProductDetail
```

**Example URLs:**
- `http://localhost:5173/`
- `http://localhost:5173/product/ca-phe-den-da`

---

## 💻 Code Example

### useProduct Hook
```javascript
const { slug } = useParams()
const { product, loading, error } = useProduct(slug)
```

### Link to Detail
```jsx
<Link to={`/product/${product.slug}`}>
  {product.name}
</Link>
```

---

## 🎨 Styling

- Background: Light gray (`#f8f9fa`)
- Cards: White với shadow
- Primary: Yellow (`#FFC43F`)
- Border radius: 16px (cards), 12px (images)
- Responsive: Desktop → Tablet → Mobile

---

## 📱 Responsive

| Device | Layout |
|--------|--------|
| Desktop | 2 columns (image | info) |
| Tablet | 2 columns (compact) |
| Mobile | 1 column (stacked) |

---

## ✅ Checklist

- [ ] Sản phẩm hiển thị đầy đủ
- [ ] Ảnh load được
- [ ] Thumbnails click được
- [ ] Số lượng chọn được
- [ ] Add to cart hoạt động
- [ ] Breadcrumb link đúng
- [ ] Responsive tốt

---

## 🐛 Common Issues

### "Cannot GET /product/..."
**Solution:** Đảm bảo dev server đang chạy với `npm run dev`

### Product không load
**Solution:** Check backend đang chạy (`cd backend && npm start`)

### Image không hiển thị
**Solution:** Check product có images trong database

---

## 📚 Full Guide

Xem chi tiết: **`PRODUCT_DETAIL_FEATURE.md`**

---

## 🎉 Summary

| Feature | Status |
|---------|--------|
| Routing | ✅ |
| Detail Page | ✅ |
| Image Gallery | ✅ |
| Add to Cart | ✅ |
| Responsive | ✅ |
| Documentation | ✅ |

---

**Version**: 2.3.0  
**Status**: ✅ Ready  
**Click vào sản phẩm và thử ngay! 🛍️**

