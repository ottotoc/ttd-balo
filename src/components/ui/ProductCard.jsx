import React, { useState } from 'react'
import { cart } from '../../lib/api'

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false)
  
  // Get primary image or first image
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
  const imageUrl = primaryImage?.url || '/images/product-thumb-1.png'
  
  // Format price to VND
  const formattedPrice = Number(product.price).toLocaleString('vi-VN') + ' ₫'
  
  const handleAddToCart = async (e) => {
    e.preventDefault()
    try {
      setAdding(true)
      await cart.addItem({ productId: product.id, quantity: 1 })
      alert('Đã thêm vào giỏ hàng!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Lỗi: ' + error.message)
    } finally {
      setAdding(false)
    }
  }
  
  return (
    <div className="card h-100 product-card">
      <a href={`/product/${product.slug}`} className="text-decoration-none">
        <img src={imageUrl} className="card-img-top" alt={product.name} style={{ objectFit: 'cover', height: '200px' }} />
      </a>
      <div className="card-body d-flex flex-column">
        <a href={`/product/${product.slug}`} className="text-decoration-none text-dark">
          <h3 className="h6 flex-grow-1">{product.name}</h3>
        </a>
        {product.shortDesc && (
          <p className="text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
            {product.shortDesc.substring(0, 60)}...
          </p>
        )}
        <div className="d-flex align-items-center justify-content-between mt-2">
          <span className="fw-bold text-primary">{formattedPrice}</span>
          {product.stock > 0 ? (
            <small className="text-success">Còn hàng</small>
          ) : (
            <small className="text-danger">Hết hàng</small>
          )}
        </div>
        <button 
          className="btn btn-primary btn-sm mt-2 w-100"
          onClick={handleAddToCart}
          disabled={adding || product.stock === 0}
        >
          {adding ? 'Đang thêm...' : product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  )
}


