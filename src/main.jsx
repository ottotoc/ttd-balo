import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import CartPage from './pages/CartPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx'

// Global styles
import 'bootstrap/dist/css/bootstrap.min.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../css/vendor.css'
import '../style.css'

// Bootstrap JS (for offcanvas, dropdowns)
import 'bootstrap'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}


