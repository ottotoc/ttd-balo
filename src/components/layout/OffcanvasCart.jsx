import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { getImageUrl } from '../../lib/imageUtils'

export default function OffcanvasCart() {
  const { cart, loading, updateItem, removeItem } = useCart()
  const [updating, setUpdating] = useState({})
  const [removing, setRemoving] = useState({})

  // Update quantity
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      setUpdating({ ...updating, [itemId]: true })
      await updateItem(itemId, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Lỗi: ' + error.message)
    } finally {
      setUpdating({ ...updating, [itemId]: false })
    }
  }

  // Remove item
  const handleRemoveItem = async (itemId) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return

    try {
      setRemoving({ ...removing, [itemId]: true })
      await removeItem(itemId)
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Lỗi: ' + error.message)
    } finally {
      setRemoving({ ...removing, [itemId]: false })
    }
  }

  // Calculate totals
  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div 
      className="offcanvas offcanvas-end" 
      data-bs-scroll="true" 
      tabIndex="-1" 
      id="offcanvasCart" 
      aria-labelledby="My Cart"
      style={{ zIndex: 1110 }}
    >
      <div className="offcanvas-header justify-content-between align-items-center">
        <h5 className="offcanvas-title">Giỏ hàng của bạn</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : !cart?.items || cart.items.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-3">
              <svg width="80" height="80" fill="#dee2e6" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
            </div>
            <p className="text-muted mb-3">Giỏ hàng trống</p>
            <Link 
              to="/" 
              className="btn btn-outline-primary btn-sm"
              data-bs-dismiss="offcanvas"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="order-md-last">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary fw-bold">Sản phẩm ({itemCount})</span>
            </div>
            
            <ul className="list-group mb-3">
              {cart.items.map((item) => {
                const primaryImage = item.product?.images?.find(img => img.isPrimary) || item.product?.images?.[0]
                const imageUrl = getImageUrl(primaryImage?.url, 'web') || '/images/product-thumb-1.png'
                const formattedPrice = Number(item.price).toLocaleString('vi-VN') + ' ₫'
                const itemTotal = (item.price * item.quantity).toLocaleString('vi-VN') + ' ₫'
                const isUpdating = updating[item.id]
                const isRemoving = removing[item.id]

                return (
                  <li key={item.id} className="list-group-item">
                    <div className="d-flex gap-2">
                      {/* Product Image */}
                      <div className="flex-shrink-0" style={{ width: '60px', height: '60px' }}>
                        <Link 
                          to={`/product/${item.product?.slug}`}
                          onClick={() => {
                            // Close offcanvas when clicking product
                            const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(document.getElementById('offcanvasCart'))
                            if (bsOffcanvas) bsOffcanvas.hide()
                          }}
                        >
                          <img 
                            src={imageUrl}
                            alt={item.product?.name}
                            className="w-100 h-100"
                            style={{ 
                              objectFit: 'cover', 
                              borderRadius: '6px',
                              border: '1px solid #dee2e6'
                            }}
                            onError={(e) => {
                              e.target.src = '/images/product-thumb-1.png'
                            }}
                          />
                        </Link>
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <div className="flex-grow-1" style={{ minWidth: 0 }}>
                            <Link 
                              to={`/product/${item.product?.slug}`}
                              className="text-decoration-none text-dark fw-semibold"
                              style={{ fontSize: '0.9rem' }}
                              onClick={() => {
                                const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(document.getElementById('offcanvasCart'))
                                if (bsOffcanvas) bsOffcanvas.hide()
                              }}
                            >
                              {item.product?.name}
                            </Link>
                            {/* Variant Info */}
                            {(item.variant?.size || item.variant?.color) && (
                              <div className="small text-muted mt-1">
                                {item.variant?.size && <span>Size: {item.variant.size}</span>}
                                {item.variant?.size && item.variant?.color && <span> • </span>}
                                {item.variant?.color && <span>Color: {item.variant.color}</span>}
                              </div>
                            )}
                            {!item.variant?.size && !item.variant?.color && item.variant?.sku && (
                              <div className="small text-muted mt-1">
                                SKU: {item.variant.sku}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-danger p-0 ms-2"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isRemoving}
                            style={{ fontSize: '0.875rem', lineHeight: '1' }}
                            title="Xóa sản phẩm"
                          >
                            {isRemoving ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                              </svg>
                            )}
                          </button>
                        </div>

                        {/* Quantity and Price */}
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="d-flex align-items-center gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary p-1"
                              style={{ width: '28px', height: '28px', lineHeight: '1', padding: '0' }}
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={isUpdating || item.quantity <= 1}
                            >
                              <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                              </svg>
                            </button>
                            <span className="small" style={{ minWidth: '30px', textAlign: 'center' }}>
                              {isUpdating ? (
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary p-1"
                              style={{ width: '28px', height: '28px', lineHeight: '1', padding: '0' }}
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={isUpdating}
                            >
                              <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                              </svg>
                            </button>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold text-primary">{itemTotal}</div>
                            <div className="small text-muted">Đơn giá: {formattedPrice}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* Total */}
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <span className="fw-bold">Tổng cộng</span>
              <strong className="text-primary" style={{ fontSize: '1.1rem' }}>
                {subtotal.toLocaleString('vi-VN')} ₫
              </strong>
            </div>

            {/* Checkout Button */}
            <Link 
              to="/checkout" 
              className="w-100 btn btn-primary btn-lg mt-3"
              data-bs-dismiss="offcanvas"
            >
              Thanh toán
            </Link>
            
            {/* View Cart Link */}
            <Link 
              to="/cart" 
              className="w-100 btn btn-outline-secondary mt-2"
              data-bs-dismiss="offcanvas"
            >
              Xem chi tiết giỏ hàng
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
