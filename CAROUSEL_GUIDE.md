# 🎠 Carousel Navigation Guide

## ✨ Tính năng Carousel

### BrandCarousel & CategoryCarousel

Cả hai component đều có carousel navigation với:

#### 📊 Hiển thị
- **Desktop (≥992px)**: 6 items/hàng
- **Small Desktop (768-991px)**: 4 items/hàng
- **Tablet (576-767px)**: 3 items/hàng
- **Mobile (<576px)**: 2 items/hàng

#### 🎯 Navigation Buttons
- Chỉ hiển thị khi số items > itemsPerView
- Ví dụ: 7 brands → hiện buttons, 5 brands → không hiện

#### ♾️ Infinite Loop Logic

**Khi bấm Previous (←):**
```
Đang ở đầu (index = 0) → Quay về cuối
[1, 2, 3, 4, 5, 6] → Hiện [2, 3, 4, 5, 6, 7]
```

**Khi bấm Next (→):**
```
Đang ở cuối → Quay về đầu
[2, 3, 4, 5, 6, 7] → Hiện [1, 2, 3, 4, 5, 6]
```

**Wrap around:**
```
Nếu ở cuối và không đủ items:
Items: [1, 2, 3, 4, 5, 6, 7]
Index: 5, ItemsPerView: 6
Hiển thị: [6, 7, 1, 2, 3, 4] (lấy thêm từ đầu)
```

## 🎨 UI/UX

### Navigation Buttons
- Vị trí: Góc phải header, cạnh link "Xem tất cả"
- Style: Rounded circle, outline secondary
- Hover: Background primary, text white
- Size: 40x40px
- Icons: ← và →

### Responsive Behavior
```js
useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth
    if (width < 576) setItemsPerView(2)
    else if (width < 768) setItemsPerView(3)
    else if (width < 992) setItemsPerView(4)
    else setItemsPerView(6)
  }
  // ...
}, [])
```

## 💻 Implementation

### State Management
```jsx
const [currentIndex, setCurrentIndex] = useState(0)
const [itemsPerView, setItemsPerView] = useState(6)
```

### Navigation Functions
```jsx
const handlePrev = () => {
  setCurrentIndex((prev) => 
    prev === 0 ? items.length - itemsPerView : prev - 1
  )
}

const handleNext = () => {
  setCurrentIndex((prev) => 
    prev >= items.length - itemsPerView ? 0 : prev + 1
  )
}
```

### Visible Items
```jsx
const visibleItems = items.slice(currentIndex, currentIndex + itemsPerView)

// Wrap around if needed
if (visibleItems.length < itemsPerView && items.length >= itemsPerView) {
  const remaining = itemsPerView - visibleItems.length
  visibleItems.push(...items.slice(0, remaining))
}
```

## 🎯 Use Cases

### CategoryCarousel
- 6 categories: Balo, Túi Xách, Túi Chéo, Vali, Balo Laptop, Túi Du Lịch
- Navigation: Hiện khi có ≥7 categories

### BrandCarousel
- 7 brands: Mikkor, Tomtoc, Sakos, TNF, JanSport, Adidas, Nike
- Navigation: Hiện luôn (7 > 6)

## 📱 Responsive Examples

### Desktop (6 items)
```
Visible: [1] [2] [3] [4] [5] [6]
Next →:  [2] [3] [4] [5] [6] [7]
Next →:  [3] [4] [5] [6] [7] [1] (wrap)
```

### Mobile (2 items)
```
Visible: [1] [2]
Next →:  [2] [3]
Next →:  [3] [4]
...
Next →:  [7] [1] (wrap)
```

## 🔧 Customization

### Thay đổi số items per view
```jsx
// Desktop: 6 → 8 items
else {
  setItemsPerView(8)
}
```

### Thêm auto-play
```jsx
useEffect(() => {
  const interval = setInterval(() => {
    handleNext()
  }, 3000) // 3 seconds
  
  return () => clearInterval(interval)
}, [currentIndex])
```

### Thêm dots indicator
```jsx
<div className="carousel-dots">
  {Array.from({ length: Math.ceil(items.length / itemsPerView) }).map((_, i) => (
    <button
      key={i}
      className={currentIndex === i * itemsPerView ? 'active' : ''}
      onClick={() => setCurrentIndex(i * itemsPerView)}
    />
  ))}
</div>
```

## ⚠️ Lưu ý

1. **Key prop**: Dùng `${item.id}-${index}` để tránh duplicate keys khi wrap around
2. **Responsive**: Tự động điều chỉnh itemsPerView theo screen size
3. **Performance**: Chỉ render visible items, không render tất cả
4. **Accessibility**: Thêm aria-label cho navigation buttons

## 🐛 Troubleshooting

### Items bị duplicate?
- Check key prop: `key={${item.id}-${index}}`

### Navigation không smooth?
- Thêm CSS transition vào container

### Responsive không hoạt động?
- Check window.addEventListener('resize')
- Verify breakpoints

---

**Version**: 1.0.0  
**Last updated**: 2024-10-24

