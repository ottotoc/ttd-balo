# ⚡ Cart - Quick Guide

## 🎯 Tính Năng Mới

**Trang giỏ hàng** - Quản lý sản phẩm đã thêm, chỉnh sửa số lượng, và thanh toán!

---

## 🚀 Test Ngay (30 giây)

1. **Thêm sản phẩm vào giỏ**
   - Click vào bất kỳ sản phẩm nào
   - Click "Thêm vào giỏ hàng"

2. **Xem giỏ hàng**
   - Click "Giỏ hàng" ở header (góc phải)
   - Hoặc truy cập: `http://localhost:5173/cart`

3. **Thử các tính năng**
   - ✅ Tăng/giảm số lượng
   - ✅ Xóa sản phẩm
   - ✅ Xem tổng tiền
   - ✅ Free shipping alert

---

## 📸 Layout

```
┌─────────────────────────────────────────────────────┐
│  Giỏ hàng của bạn                                   │
│  Trang chủ > Giỏ hàng                               │
├──────────────────────────────┬──────────────────────┤
│  Sản phẩm (3) | [Xóa tất cả] │  Tổng đơn hàng       │
│                               │                      │
│  [Img] Product Name           │  Tạm tính: 450,000đ  │
│        SKU: ABC123            │  Phí ship:  30,000đ  │
│        100,000đ | [-] 2 [+]  │  ⓘ Mua thêm 50k →    │
│        200,000đ       [X]     │     Free ship!       │
│  ──────────────────────────── │  ──────────────────  │
│  [Img] Product Name           │  Tổng:    480,000đ   │
│        ...                    │                      │
│                               │  [🛒 Thanh toán]     │
│  [← Tiếp tục mua sắm]        │                      │
│                               │  ✓ Thanh toán an toàn│
│                               │  ✓ Đổi trả 7 ngày    │
│                               │  ✓ Hỗ trợ 24/7       │
└──────────────────────────────┴──────────────────────┘
```

---

## 🎯 Features

### 1. Xem Giỏ Hàng
- Danh sách tất cả sản phẩm
- Ảnh + tên + SKU
- Giá đơn vị + tổng giá
- Badge số lượng items ở header

### 2. Chỉnh Sửa
- **Tăng/giảm**: Click +/- 
- **Input**: Nhập số lượng trực tiếp
- **Xóa**: Click icon thùng rác
- **Xóa tất cả**: Button ở header

### 3. Tính Toán
- **Tạm tính**: Tổng giá sản phẩm
- **Phí ship**: 30k (miễn phí nếu ≥500k)
- **Tổng cộng**: Số tiền cuối

### 4. Free Shipping
- Alert hiển thị còn thiếu bao nhiêu
- Tự động miễn phí khi đủ 500k

---

## 📁 Files Mới

```
src/
├── pages/
│   └── CartPage.jsx        (NEW - Trang giỏ hàng)
└── main.jsx                (UPDATED - route /cart)

components/layout/
└── Header.jsx              (UPDATED - cart link + badge)

style.css                   (UPDATED - +300 lines)
```

---

## 🔗 Routes

```
/cart → CartPage
```

**URLs:**
- `http://localhost:5173/cart`

---

## 💻 Code Example

### Update Quantity
```javascript
await cartAPI.updateItem(itemId, { quantity: newQty })
```

### Remove Item
```javascript
await cartAPI.removeItem(itemId)
```

### Clear Cart
```javascript
await cartAPI.clear()
```

---

## 🎨 Styling

- Background: Light gray
- Cards: White với shadow
- Primary: Yellow (#FFC43F)
- Sticky summary (desktop)
- Responsive: Desktop → Mobile

---

## 📱 Responsive

| Device | Columns |
|--------|---------|
| Desktop | Items (8) \| Summary (4) |
| Tablet | Items (8) \| Summary (4) |
| Mobile | 1 column (stacked) |

---

## ✅ Checklist

- [ ] Giỏ hàng hiển thị đúng
- [ ] Số lượng chỉnh được
- [ ] Xóa được sản phẩm
- [ ] Tổng tiền tính đúng
- [ ] Free ship logic đúng
- [ ] Header badge hiển thị
- [ ] Link hoạt động
- [ ] Responsive tốt

---

## 💰 Pricing

### Free Shipping
```
< 500,000đ  → Phí: 30,000đ
≥ 500,000đ  → Phí: 0đ (MIỄN PHÍ)
```

### Alert
```
Hiện tại: 450,000đ
Alert: "Mua thêm 50,000đ để được miễn phí vận chuyển"
```

---

## 🐛 Common Issues

### Cart không load
**Solution:** Check backend đang chạy

### Số lượng không update
**Solution:** Check console errors, refresh page

### Header badge không hiển thị
**Solution:** Thêm sản phẩm vào giỏ trước

---

## 📚 Full Guide

Xem chi tiết: **`CART_FEATURE.md`**

---

## 🎉 Summary

| Feature | Status |
|---------|--------|
| Cart Page | ✅ |
| View Items | ✅ |
| Edit Quantity | ✅ |
| Remove Items | ✅ |
| Price Calc | ✅ |
| Free Shipping | ✅ |
| Header Badge | ✅ |
| Responsive | ✅ |

---

**Version**: 2.4.0  
**Status**: ✅ Ready  
**Click "Giỏ hàng" ở header và thử ngay! 🛒**

