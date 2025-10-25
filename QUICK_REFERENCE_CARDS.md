# ⚡ Quick Reference - Product Cards

## 🚀 1-Minute Setup

### Import & Use
```jsx
import ProductCard from './components/ui/ProductCard'

// Basic
<ProductCard product={product} />

// With badge
<ProductCard product={product} showBadge={true} badgeText="HOT" />
```

## 🎯 Props Quick Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `product` | Object | ✅ Yes | - | Product data |
| `showBadge` | Boolean | ❌ No | false | Show special badge |
| `badgeText` | String | ❌ No | '' | Badge text |

## 📦 Product Object Structure

```javascript
{
  id: Number,              // Required
  name: String,            // Required
  slug: String,            // Required (for URL)
  price: Number,           // Required
  stock: Number,           // Required (0 = out of stock)
  originalPrice: Number,   // Optional (for discount)
  shortDesc: String,       // Optional
  rating: Number,          // Optional (0-5)
  reviewCount: Number,     // Optional
  images: [                // Optional
    { url: String, isPrimary: Boolean }
  ],
  category: {              // Optional
    name: String
  }
}
```

## 🏷️ Badge Types & Colors

| Type | Text | Color | When to Use |
|------|------|-------|-------------|
| Discount | `-X%` | 🔴 Red | Auto if originalPrice exists |
| HOT | `HOT` | 🔴 Red | Best selling products |
| NEW | `NEW` | 🔵 Blue | Just arrived products |
| Popular | `PHỔ BIẾN` | 🟡 Yellow | Most popular products |
| Out of Stock | `Hết hàng` | ⚫ Black | Auto if stock = 0 |
| Low Stock | `Sắp hết` | 🟠 Orange | Auto if stock ≤ 5 |

## 🎨 CSS Classes (for customization)

```css
.modern-product-card          /* Main container */
.product-image-wrapper        /* Image section */
.product-image                /* Image itself */
.product-badges               /* Badge container */
.badge-discount               /* Discount badge */
.badge-special                /* General badge */
.badge-special.hot            /* HOT badge */
.badge-special.new            /* NEW badge */
.product-overlay              /* Hover overlay */
.product-info                 /* Info section */
.product-category             /* Category tag */
.product-title                /* Product name */
.product-price                /* Current price */
.original-price               /* Original price (strikethrough) */
.btn-add-to-cart              /* Add button */
.toast-notification           /* Toast message */
```

## 🔧 Common Customizations

### Change Badge Color
```css
.badge-special.mybadge {
  background: linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%);
  color: white;
}
```

### Change Hover Elevation
```css
.modern-product-card:hover {
  transform: translateY(-12px); /* Default: -8px */
}
```

### Change Border Radius
```css
.modern-product-card {
  border-radius: 16px; /* Default: 20px */
}
```

### Disable Overlay on Desktop
```css
.product-overlay {
  display: none;
}
```

## 📱 Responsive Breakpoints

| Device | Min Width | Image Height | Features |
|--------|-----------|--------------|----------|
| Mobile | 0px | 180px | No overlay, no description |
| Tablet | 577px | 220px | No overlay, reduced padding |
| Desktop | 769px | 260px | Full features |

## ⚡ Common Use Cases

### 1. Product Grid (4 columns)
```jsx
<div className="row g-4">
  {products.map(product => (
    <div key={product.id} className="col-6 col-md-3">
      <ProductCard product={product} />
    </div>
  ))}
</div>
```

### 2. Featured Products (with badge)
```jsx
<div className="row g-4">
  {products.map(product => (
    <div key={product.id} className="col-6 col-md-4">
      <ProductCard 
        product={product} 
        showBadge={true} 
        badgeText="FEATURED" 
      />
    </div>
  ))}
</div>
```

### 3. Sale Products (auto discount badge)
```jsx
// Just ensure product has originalPrice > price
const product = {
  price: 80000,
  originalPrice: 100000, // Will show -20% badge automatically
  ...
}

<ProductCard product={product} />
```

## 🐛 Troubleshooting Cheat Sheet

| Problem | Solution |
|---------|----------|
| Card not showing | Check product object has required fields |
| Image not loading | Check image URL, backend running, CORS |
| Badge not appearing | Check `showBadge={true}` and `badgeText` |
| Hover not working | Clear cache, check CSS loaded |
| Toast not showing | Check cart API, console errors |
| Layout broken | Check Bootstrap grid classes |

## 📊 Performance Tips

- ✅ Images lazy load automatically
- ✅ Use WebP format for images
- ✅ Optimize image size (600x600px recommended)
- ✅ Limit products per page (12-24 optimal)
- ✅ Use CDN for images if possible

## 🎯 Best Practices

### ✅ DO
- Use descriptive badge text (2-10 chars)
- Provide all product fields for best display
- Use consistent image aspect ratios
- Test on mobile devices
- Compress images before upload

### ❌ DON'T
- Don't use more than 2 badges per product
- Don't use very long product names (>60 chars)
- Don't forget alt text for images
- Don't use low-quality images
- Don't nest cards inside each other

## 🔍 Debug Commands

```bash
# Check if CSS loaded
document.querySelector('.modern-product-card')

# Check if images loaded
document.querySelectorAll('.product-image.loaded').length

# Check for errors
console.error

# Force reload CSS
location.reload(true)
```

## 📞 Quick Links

- Full Documentation: `PRODUCT_CARD_IMPROVEMENTS.md`
- Test Guide: `TEST_PRODUCT_CARDS.md`
- Summary: `SUMMARY_CARD_IMPROVEMENTS.md`

## 💡 Quick Tips

1. **New Section**: Copy from BestSelling.jsx, change badge
2. **Custom Badge**: Use `badgeText` prop with custom CSS class
3. **No Badge**: Just omit `showBadge` prop or set to false
4. **Discount Badge**: Auto-shows if `originalPrice > price`
5. **Mobile Test**: Use Chrome DevTools device mode

## 🎨 Color Palette Reference

```css
Primary Yellow:     #FFC43F
Success Green:      #10B981
Danger Red:         #FF6B6B
Info Blue:          #4ECDC4
Warning Orange:     #FFB74D
Text Dark:          #1a1a1a
Text Muted:         #999999
Border:             #f0f0f0
Background:         #ffffff
```

## 📐 Spacing Reference

```css
Card Padding:       20px (desktop), 16px (tablet), 12px (mobile)
Gap Between:        16px (g-4 in Bootstrap)
Border Radius:      20px (card), 12px (button), 8px (badge)
Shadow:             subtle → prominent on hover
Image Height:       260px (desktop), 220px (tablet), 180px (mobile)
```

## ⌨️ Keyboard Shortcuts (DevTools)

- `Ctrl + Shift + C`: Inspect element
- `Ctrl + Shift + M`: Toggle device toolbar
- `Ctrl + Shift + R`: Hard refresh
- `F12`: Open DevTools

---

## 🚀 Quick Start Checklist

- [ ] Import ProductCard component
- [ ] Prepare product data object
- [ ] Wrap in Bootstrap grid
- [ ] Add badge if needed
- [ ] Test on desktop
- [ ] Test on mobile
- [ ] Check console for errors
- [ ] Verify images load
- [ ] Test add to cart
- [ ] Deploy! 🎉

---

**Need more help?** Check the full documentation files! 📚

