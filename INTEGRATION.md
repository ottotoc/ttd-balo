# Hướng dẫn tích hợp API vào Frontend

## Cấu hình

1. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

2. Cập nhật `VITE_API_URL` nếu backend chạy ở port khác.

## Sử dụng API

### 1. Sử dụng hooks (Khuyến nghị)

```jsx
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { useAuth } from './hooks/useAuth';

function ProductList() {
  const { products, loading, error } = useProducts({ 
    page: 1, 
    limit: 12,
    category: 'vegetables'  
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 2. Sử dụng API trực tiếp

```jsx
import { products, cart } from './lib/api';

async function handleAddToCart(productId) {
  try {
    await cart.addItem({ productId, quantity: 1 });
    alert('Added to cart!');
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function loadProducts() {
  const result = await products.getAll({ page: 1, limit: 20 });
  console.log(result.data.items);
}
```

### 3. Authentication

Wrap app với AuthProvider:

```jsx
// main.jsx
import { AuthProvider } from './hooks/useAuth';

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

Sử dụng trong components:

```jsx
import { useAuth } from './hooks/useAuth';

function Header() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div>
        Hello, {user.name}
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <button onClick={() => login('user@example.com', 'password')}>Login</button>;
}
```

### 4. Real-time với Socket.IO

```jsx
import { useEffect } from 'react';
import socketClient from './lib/socket';

function ProductPage({ productId }) {
  useEffect(() => {
    // Connect to socket
    socketClient.connect();

    // Join product room
    socketClient.joinProduct(productId);

    // Listen for stock updates
    const unsubscribe = socketClient.onStockUpdate((data) => {
      if (data.productId === productId) {
        console.log('Stock updated:', data.stock);
        // Update UI
      }
    });

    return () => {
      socketClient.leaveProduct(productId);
      unsubscribe();
    };
  }, [productId]);

  return <div>Product details...</div>;
}
```

## Ví dụ cập nhật components hiện tại

### BestSelling.jsx

```jsx
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../ui/ProductCard';

export default function BestSelling() {
  const { products, loading } = useProducts({ 
    featured: true, 
    limit: 8,
    sort: 'createdAt',
    order: 'desc'
  });

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <section className="best-selling py-5">
      <div className="container">
        <h2>Best Selling Products</h2>
        <div className="row">
          {products.map(product => (
            <div key={product.id} className="col-md-3 mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### ProductCard.jsx

```jsx
import { useCart } from '../../hooks/useCart';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addItem(product.id, null, 1);
      alert('Added to cart!');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setAdding(false);
    }
  };

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];

  return (
    <div className="product-card">
      <img src={primaryImage?.url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.shortDesc}</p>
      <div className="price">{Number(product.price).toLocaleString('vi-VN')} ₫</div>
      <button 
        onClick={handleAddToCart} 
        disabled={adding || product.stock === 0}
      >
        {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

### OffcanvasCart.jsx

```jsx
import { useCart } from '../../hooks/useCart';

export default function OffcanvasCart() {
  const { cart, loading, updateItem, removeItem } = useCart();

  if (loading) return <div>Loading cart...</div>;

  const total = cart?.subtotal || 0;

  return (
    <div className="offcanvas offcanvas-end" id="offcanvasCart">
      <div className="offcanvas-header">
        <h5>Your Cart</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div className="offcanvas-body">
        {cart?.items?.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cart?.items?.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.product.images[0]?.url} alt={item.product.name} />
                <div>
                  <h6>{item.product.name}</h6>
                  <div>{Number(item.price).toLocaleString('vi-VN')} ₫</div>
                  <input 
                    type="number" 
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateItem(item.id, parseInt(e.target.value))}
                  />
                  <button onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <strong>Total: {total.toLocaleString('vi-VN')} ₫</strong>
            </div>
            <a href="/checkout" className="btn btn-primary w-100">Checkout</a>
          </>
        )}
      </div>
    </div>
  );
}
```

## Các API endpoints chính

### Products
- `products.getAll({ page, limit, q, category, brand, minPrice, maxPrice })`
- `products.getBySlug(slug)`

### Cart
- `cart.get()`
- `cart.addItem({ productId, variantId?, quantity })`
- `cart.updateItem(id, { quantity })`
- `cart.removeItem(id)`

### Orders
- `orders.create({ shippingAddress, paymentMethod, ... })`
- `orders.getAll({ page, limit, status })`
- `orders.getById(id)`

### Catalog
- `catalog.getCategories()`
- `catalog.getBrands()`
- `catalog.getBanners(position?)`

### Blog
- `blog.getAll({ page, limit })`
- `blog.getBySlug(slug)`

Xem `src/lib/api.js` để biết đầy đủ API methods.

