import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import OffcanvasCart from '../components/layout/OffcanvasCart'
import OffcanvasSearch from '../components/layout/OffcanvasSearch'
import IconsSprite from '../components/layout/IconsSprite'

export default function CartPage() {
  const { cart, loading, error, updateItem, removeItem, clearCart: clearCartAPI } = useCart()
  const [updating, setUpdating] = useState({})
  const [removing, setRemoving] = useState({})
  const [clearing, setClearing] = useState(false)

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

  // Clear cart
  const handleClearCart = async () => {
    if (!confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) return

    try {
      setClearing(true)
      await clearCartAPI()
    } catch (error) {
      console.error('Error clearing cart:', error)
      alert('Lỗi: ' + error.message)
    } finally {
      setClearing(false)
    }
  }

  // Calculate totals
  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
  const shipping = subtotal > 0 ? (subtotal >= 500000 ? 0 : 30000) : 0
  const total = subtotal + shipping

  if (loading) {
    return (
      <>
        <IconsSprite />
        <OffcanvasCart />
        <OffcanvasSearch />
        <Header />
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải giỏ hàng...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <IconsSprite />
        <OffcanvasCart />
        <OffcanvasSearch />
        <Header />
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4>Lỗi</h4>
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <IconsSprite />
      <OffcanvasCart />
      <OffcanvasSearch />
      <Header />

      <section className="cart-section py-5">
        <div className="container">
          {/* Page Title */}
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="page-title">Giỏ hàng của bạn</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Giỏ hàng</li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Empty Cart */}
          {!cart?.items || cart.items.length === 0 ? (
            <div className="empty-cart text-center py-5">
              <div className="empty-cart-icon mb-4">
                <svg width="120" height="120" fill="#dee2e6" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
              </div>
              <h3 className="mb-3">Giỏ hàng trống</h3>
              <p className="text-muted mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
              <Link to="/" className="btn btn-primary btn-lg">
                <svg width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {/* Cart Items */}
              <div className="col-lg-8">
                <div className="cart-items">
                  <div className="cart-header d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Sản phẩm ({cart.items.length})</h5>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleClearCart}
                      disabled={clearing}
                    >
                      {clearing ? 'Đang xóa...' : 'Xóa tất cả'}
                    </button>
                  </div>

                  {/* Items List */}
                  {cart.items.map((item) => {
                    const imageUrl = item.product?.images?.find(img => img.isPrimary)?.url || 
                                   item.product?.images?.[0]?.url || 
                                   '/images/product-thumb-1.png'
                    const formattedPrice = Number(item.price).toLocaleString('vi-VN') + ' ₫'
                    const itemTotal = (item.price * item.quantity).toLocaleString('vi-VN') + ' ₫'
                    const isUpdating = updating[item.id]
                    const isRemoving = removing[item.id]

                    return (
                      <div key={item.id} className="cart-item-wrapper">
                        <div className="cart-item-content">
                          {/* Product Image */}
                          <div className="cart-item-image">
                            <Link to={`/product/${item.product?.slug}`}>
                              <img 
                                src={imageUrl} 
                                alt={item.product?.name}
                              />
                            </Link>
                          </div>

                          {/* Product Info */}
                          <div className="cart-item-info">
                            <Link 
                              to={`/product/${item.product?.slug}`}
                              className="cart-item-title"
                            >
                              {item.product?.name}
                            </Link>
                            <div className="cart-item-sku">
                              SKU: {item.product?.sku}
                            </div>
                            <div className="cart-item-price-mobile">
                              {formattedPrice}
                            </div>
                          </div>

                          {/* Price (Desktop) */}
                          <div className="cart-item-price">
                            {formattedPrice}
                          </div>

                          {/* Quantity */}
                          <div className="cart-item-quantity">
                            <div className="quantity-selector-small">
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isUpdating}
                              >
                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                </svg>
                              </button>
                              <input 
                                type="number" 
                                className="form-control form-control-sm text-center" 
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 1
                                  if (val >= 1 && val <= (item.product?.stock || 999)) {
                                    handleUpdateQuantity(item.id, val)
                                  }
                                }}
                                min="1"
                                max={item.product?.stock || 999}
                                disabled={isUpdating}
                                style={{ width: '60px' }}
                              />
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= (item.product?.stock || 999) || isUpdating}
                              >
                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                </svg>
                              </button>
                            </div>
                            {isUpdating && (
                              <div className="text-center mt-1">
                                <small className="text-muted">Đang cập nhật...</small>
                              </div>
                            )}
                          </div>

                          {/* Total */}
                          <div className="cart-item-total">
                            {itemTotal}
                          </div>

                          {/* Remove Button */}
                          <div className="cart-item-remove">
                            <button 
                              className="btn-remove"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isRemoving}
                              title="Xóa"
                            >
                              {isRemoving ? (
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                              ) : (
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Continue Shopping */}
                  <div className="mt-4">
                    <Link to="/" className="btn btn-outline-primary">
                      <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                      </svg>
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="col-lg-4">
                <div className="order-summary">
                  <h5 className="mb-4">Tổng đơn hàng</h5>

                  <div className="summary-row">
                    <span>Tạm tính</span>
                    <span className="fw-bold">{subtotal.toLocaleString('vi-VN')} ₫</span>
                  </div>

                  <div className="summary-row">
                    <span>Phí vận chuyển</span>
                    <span className="fw-bold">
                      {shipping === 0 ? (
                        <span className="text-success">Miễn phí</span>
                      ) : (
                        `${shipping.toLocaleString('vi-VN')} ₫`
                      )}
                    </span>
                  </div>

                  {subtotal < 500000 && subtotal > 0 && (
                    <div className="alert alert-info mt-3 mb-3 small">
                      Mua thêm {(500000 - subtotal).toLocaleString('vi-VN')} ₫ để được miễn phí vận chuyển
                    </div>
                  )}

                  <hr />

                  <div className="summary-row total-row">
                    <span>Tổng cộng</span>
                    <span className="total-amount">{total.toLocaleString('vi-VN')} ₫</span>
                  </div>

                  <Link to="/checkout" className="btn btn-primary btn-lg w-100 mt-4">
                    <svg width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    Tiến hành thanh toán
                  </Link>

                  {/* Trust Badges */}
                  <div className="trust-badges mt-4">
                    <div className="trust-item">
                      <svg width="20" height="20" fill="#198754" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                      </svg>
                      <span>Thanh toán an toàn</span>
                    </div>
                    <div className="trust-item">
                      <svg width="20" height="20" fill="#198754" viewBox="0 0 16 16">
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z"/>
                      </svg>
                      <span>Đổi trả trong 7 ngày</span>
                    </div>
                    <div className="trust-item">
                      <svg width="20" height="20" fill="#198754" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/>
                      </svg>
                      <span>Hỗ trợ 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}

