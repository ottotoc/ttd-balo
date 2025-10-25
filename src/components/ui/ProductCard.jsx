import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'

export default function ProductCard({ product, showBadge = false, badgeText = '' }) {
  const { addItem } = useCart()
  const [adding, setAdding] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  // Get primary image or first image
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
  const imageUrl = primaryImage?.url || '/images/product-thumb-1.png'
  
  // Format price to VND
  const formattedPrice = Number(product.price).toLocaleString('vi-VN') + ' ₫'
  
  // Calculate discount percentage if original price exists
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
  
  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      setAdding(true)
      await addItem(product.id, null, 1)
      
      // Show success toast instead of alert
      const toastEl = document.createElement('div')
      toastEl.className = 'toast-notification'
      toastEl.innerHTML = `
        <div class="toast-content">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
          <span>Đã thêm vào giỏ hàng!</span>
        </div>
      `
      document.body.appendChild(toastEl)
      setTimeout(() => toastEl.classList.add('show'), 10)
      setTimeout(() => {
        toastEl.classList.remove('show')
        setTimeout(() => document.body.removeChild(toastEl), 300)
      }, 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Lỗi: ' + error.message)
    } finally {
      setAdding(false)
    }
  }
  
  return (
    <div className="modern-product-card">
      <Link to={`/product/${product.slug}`} className="product-card-link">
        <div className="product-image-wrapper">
          {!imageLoaded && (
            <div className="image-skeleton">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <img 
            src={imageUrl} 
            className={`product-image ${imageLoaded ? 'loaded' : ''}`}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="product-badges">
            {hasDiscount && (
              <span className="badge badge-discount">-{discountPercent}%</span>
            )}
            {showBadge && badgeText && (
              <span className={`badge badge-special ${badgeText.toLowerCase()}`}>
                {badgeText}
              </span>
            )}
            {product.stock === 0 && (
              <span className="badge badge-out-of-stock">Hết hàng</span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="badge badge-low-stock">Sắp hết</span>
            )}
          </div>
          
          {/* Quick view overlay */}
          <div className="product-overlay">
            <div className="overlay-content">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
              </svg>
              <span>Xem nhanh</span>
            </div>
          </div>
        </div>
        
        <div className="product-info">
          {/* Category tag */}
          {product.category?.name && (
            <span className="product-category">{product.category.name}</span>
          )}
          
          {/* Product name */}
          <h3 className="product-title">{product.name}</h3>
          
          {/* Rating (if available) */}
          {product.rating && (
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    width="14" 
                    height="14" 
                    fill={i < Math.floor(product.rating) ? '#FFC43F' : '#E0E0E0'}
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  </svg>
                ))}
              </div>
              <span className="rating-text">({product.reviewCount || 0})</span>
            </div>
          )}
          
          {/* Short description */}
          {product.shortDesc && (
            <p className="product-description">
              {product.shortDesc.substring(0, 60)}...
            </p>
          )}
          
          {/* Price section */}
          <div className="product-price-section">
            <div className="price-wrapper">
              <span className="product-price">{formattedPrice}</span>
              {hasDiscount && (
                <span className="original-price">
                  {Number(product.originalPrice).toLocaleString('vi-VN')} ₫
                </span>
              )}
            </div>
            <div className="stock-status">
              {product.stock > 5 ? (
                <span className="status-badge in-stock">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                  Còn hàng
                </span>
              ) : product.stock > 0 ? (
                <span className="status-badge low-stock">Còn {product.stock}</span>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
      
      {/* Add to cart button */}
      <div className="product-actions">
        <button 
          className="btn-add-to-cart"
          onClick={handleAddToCart}
          disabled={adding || product.stock === 0}
        >
          {adding ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Đang thêm...
            </>
          ) : product.stock === 0 ? (
            <>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z"/>
              </svg>
              Hết hàng
            </>
          ) : (
            <>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              Thêm vào giỏ
            </>
          )}
        </button>
      </div>
    </div>
  )
}


