# 🎨 UI Components

## ProductCard Component

### Overview
Modern, professional product card component with badges, hover effects, and smooth animations.

### Quick Usage
```jsx
import ProductCard from './ProductCard'

<ProductCard product={product} />
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| product | Object | ✅ | - | Product data with id, name, price, etc. |
| showBadge | Boolean | ❌ | false | Show special badge (HOT, NEW, etc.) |
| badgeText | String | ❌ | '' | Text to display on badge |

### Features
- ✨ Modern card design with smooth transitions
- 🏷️ Smart badge system (discount, special, stock status)
- 🖼️ Lazy loading images with skeleton
- 🎯 Hover effects (elevation, zoom, overlay)
- 📱 Fully responsive (mobile/tablet/desktop)
- 🔔 Toast notifications for cart actions
- ⚡ Performance optimized

### Badge Types
1. **Discount Badge** (auto): Shows when `product.originalPrice > product.price`
2. **Special Badge**: Custom badge via `badgeText` prop
3. **Stock Badges** (auto): "Hết hàng", "Sắp hết"

### Example Product Object
```javascript
{
  id: 1,
  name: "Organic Avocado",
  slug: "organic-avocado",
  price: 50000,
  originalPrice: 70000,  // Optional (shows -29% badge)
  stock: 10,
  shortDesc: "Fresh organic avocado from local farms",
  rating: 4.5,
  reviewCount: 24,
  images: [
    { url: "https://...", isPrimary: true }
  ],
  category: { name: "Fruits" }
}
```

### Variants

#### Basic (no badge)
```jsx
<ProductCard product={product} />
```

#### With HOT badge
```jsx
<ProductCard 
  product={product} 
  showBadge={true} 
  badgeText="HOT" 
/>
```

#### With NEW badge
```jsx
<ProductCard 
  product={product} 
  showBadge={true} 
  badgeText="NEW" 
/>
```

### Styling
All styles are in main `style.css`:
- `.modern-product-card` - Main container
- `.product-image-wrapper` - Image section
- `.product-info` - Content section
- `.btn-add-to-cart` - Action button
- More classes in documentation

### Customization
See `QUICK_REFERENCE_CARDS.md` for CSS customization examples.

### Full Documentation
- 📘 `PRODUCT_CARD_IMPROVEMENTS.md` - Complete guide
- 🧪 `TEST_PRODUCT_CARDS.md` - Testing guide
- 📊 `SUMMARY_CARD_IMPROVEMENTS.md` - Overview
- ⚡ `QUICK_REFERENCE_CARDS.md` - Quick reference

---

## CategoryCard Component

Simple category card with icon and name.

### Usage
```jsx
import CategoryCard from './CategoryCard'

<CategoryCard category={category} />
```

---

## ProductsCarousel Component

Swiper-based carousel for product listings.

### Usage
```jsx
import ProductsCarousel from './ProductsCarousel'

<ProductsCarousel items={products} />
```

---

**Note:** All UI components are styled with consistent design system. Check main documentation for complete guidelines.

