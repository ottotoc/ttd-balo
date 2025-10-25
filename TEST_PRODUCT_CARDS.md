# 🧪 Test Product Cards - Hướng Dẫn Kiểm Tra

## 🚀 Khởi Động Ứng Dụng

### 1. Khởi động Backend
```bash
cd backend
npm start
```

Backend sẽ chạy ở: `http://localhost:3000`

### 2. Khởi động Frontend
```bash
# Ở thư mục gốc (FoodMart-1.0.0)
npm run dev
```

Frontend sẽ chạy ở: `http://localhost:5173`

## 📍 Các Trang Để Test

### 1. Trang Chủ (index.html hoặc React App)
Xem các section:
- **Sản phẩm bán chạy** - Badge HOT (đỏ)
- **Sản phẩm phổ biến** - Badge PHỔ BIẾN (vàng)
- **Sản phẩm mới về** - Badge NEW (xanh)

### 2. Trang Danh Sách Sản Phẩm
- URL: `/products` hoặc `/shop`
- Xem tất cả sản phẩm với card mới

## ✅ Checklist Test

### Desktop View (> 768px)
- [ ] Card hiển thị đẹp với border radius 20px
- [ ] Hover vào card: nổi lên + shadow tăng
- [ ] Hover vào ảnh: zoom nhẹ + overlay "Xem nhanh"
- [ ] Badges hiển thị đúng cho từng section
- [ ] Badge giảm giá hiển thị nếu có originalPrice
- [ ] Tên sản phẩm đổi màu vàng khi hover
- [ ] Nút "Thêm vào giỏ" có gradient vàng
- [ ] Hover nút: màu đậm hơn + nổi lên
- [ ] Click nút: Toast notification xuất hiện
- [ ] Toast tự động biến mất sau 2 giây
- [ ] Sản phẩm hết hàng: badge đen + button disabled
- [ ] Sản phẩm sắp hết (≤5): badge cam "Sắp hết"
- [ ] Loading skeleton hiện khi tải hình
- [ ] Hình ảnh fade in mượt mà khi load xong
- [ ] Animation stagger khi load nhiều cards

### Mobile View (< 576px)
- [ ] Card responsive tốt
- [ ] Không có overlay (ẩn cho mobile)
- [ ] Mô tả sản phẩm ẩn (tiết kiệm không gian)
- [ ] Buttons và text còn đọc được
- [ ] Toast notification full width
- [ ] Scroll mượt mà

### Tablet View (577-768px)
- [ ] Hình ảnh height = 220px
- [ ] Padding giảm nhẹ
- [ ] Overlay ẩn
- [ ] Layout cân đối

## 🎯 Test Cases Cụ Thể

### Test 1: Hover Effects
1. Di chuột vào card
2. Kiểm tra: Card nổi lên ~8px
3. Kiểm tra: Shadow tăng lên
4. Kiểm tra: Ảnh zoom nhẹ
5. Kiểm tra: Overlay "Xem nhanh" hiện ra
6. Kiểm tra: Tên sản phẩm đổi màu vàng

### Test 2: Badges
1. **Sản phẩm bán chạy**
   - Badge "HOT" màu đỏ ở góc trên trái
   
2. **Sản phẩm phổ biến**
   - Badge "PHỔ BIẾN" màu vàng ở góc trên trái
   
3. **Sản phẩm mới về**
   - Badge "NEW" màu xanh ở góc trên trái
   
4. **Sản phẩm giảm giá**
   - Badge "-X%" màu đỏ nếu có originalPrice
   
5. **Sản phẩm hết hàng**
   - Badge "Hết hàng" màu đen
   
6. **Sản phẩm sắp hết**
   - Badge "Sắp hết" màu cam nếu stock ≤ 5

### Test 3: Add to Cart
1. Click "Thêm vào giỏ"
2. Button hiển thị spinner + text "Đang thêm..."
3. Toast notification xuất hiện từ bên phải
4. Toast có icon check màu xanh
5. Toast tự động biến mất sau 2s
6. Kiểm tra giỏ hàng đã thêm sản phẩm

### Test 4: Out of Stock
1. Tìm sản phẩm hết hàng (stock = 0)
2. Badge "Hết hàng" hiển thị
3. Button disabled với màu xám
4. Text button: "Hết hàng" + icon
5. Click không làm gì

### Test 5: Low Stock
1. Tìm sản phẩm có stock ≤ 5
2. Badge cam "Sắp hết" hiển thị
3. Status badge: "Còn X" (màu cam)
4. Vẫn có thể add to cart

### Test 6: Discount Price
1. Sản phẩm có originalPrice > price
2. Badge giảm giá hiển thị phần trăm đúng
3. Giá gốc bị gạch ngang
4. Giá hiện tại to và đậm

### Test 7: Loading States
1. Refresh trang
2. Skeleton loading hiện trước
3. Hình ảnh fade in mượt khi load xong
4. Cards xuất hiện theo thứ tự (stagger)

### Test 8: Responsive
1. Desktop (1920px)
   - 4 cards/row
   - Full features
   
2. Laptop (1366px)
   - 4 cards/row
   - Full features
   
3. Tablet (768px)
   - 4 cards/row hoặc 3 cards/row
   - No overlay
   
4. Mobile (375px)
   - 2 cards/row
   - Simplified UI

## 🐛 Common Issues & Solutions

### Issue 1: Cards không hover được
**Solution:** Clear browser cache, hard refresh (Ctrl+Shift+R)

### Issue 2: Hình ảnh không hiển thị
**Solution:** 
- Kiểm tra backend đang chạy
- Kiểm tra product có images array
- Kiểm tra CORS settings

### Issue 3: Toast không xuất hiện
**Solution:**
- Check console for errors
- Kiểm tra cart API endpoint
- Kiểm tra authentication nếu cần

### Issue 4: Badges chồng lên nhau
**Solution:**
- Kiểm tra product data
- Có thể có quá nhiều badges active

### Issue 5: Animation giật lag
**Solution:**
- Tắt hardware acceleration
- Giảm số lượng sản phẩm hiển thị
- Kiểm tra CPU usage

## 📊 Browser Support

### ✅ Fully Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### ⚠️ Partially Supported
- IE 11 (no backdrop-filter, no CSS grid)
- Chrome < 90 (some animations may differ)

### ❌ Not Supported
- IE 10 and below

## 🎨 Visual Test

Compare với design:
- [ ] Colors match design system
- [ ] Spacing consistent (padding: 20px)
- [ ] Border radius consistent (20px)
- [ ] Shadows correct (subtle to prominent)
- [ ] Typography hierarchy clear
- [ ] Icons properly sized
- [ ] Badges positioned correctly

## 📱 Device Test

### Test on:
- [ ] iPhone 12/13/14 (390x844)
- [ ] iPhone 8 (375x667)
- [ ] iPad (768x1024)
- [ ] Samsung Galaxy S21 (360x800)
- [ ] Desktop 1920x1080
- [ ] MacBook 1440x900

## ⚡ Performance Test

### Metrics to check:
- [ ] Page load < 3s
- [ ] First Contentful Paint < 1.5s
- [ ] Cards animation smooth (60fps)
- [ ] No layout shift (CLS < 0.1)
- [ ] Images lazy load properly
- [ ] Hover smooth (no jank)

### Tools:
- Chrome DevTools Performance
- Lighthouse
- GTmetrix
- PageSpeed Insights

## 🎯 Acceptance Criteria

### ✅ Ready for Production if:
1. All desktop tests pass
2. All mobile tests pass
3. No console errors
4. Performance metrics good
5. Cross-browser compatible
6. Responsive on all devices
7. Animations smooth
8. Toast notifications work
9. Add to cart functional
10. Images load properly

## 📝 Report Template

```
Test Date: [DATE]
Tester: [NAME]
Browser: [BROWSER + VERSION]
Device: [DEVICE]
Screen Size: [WIDTHxHEIGHT]

✅ Passed Tests:
- [List passed tests]

❌ Failed Tests:
- [List failed tests with details]

🐛 Bugs Found:
1. [Description]
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshot/Video

💡 Suggestions:
- [Improvement ideas]
```

## 🎉 Success Indicators

Product cards are successful if:
- ✅ Users understand product info clearly
- ✅ Hover effects feel responsive
- ✅ Add to cart is easy and obvious
- ✅ Badges communicate status well
- ✅ Mobile experience is smooth
- ✅ Loading feels fast
- ✅ Visual appeal is high
- ✅ Conversion rate increases

---

**Happy Testing! 🚀**

Nếu có vấn đề, check:
1. Console errors
2. Network tab
3. CSS loaded correctly
4. API responses
5. Browser compatibility

