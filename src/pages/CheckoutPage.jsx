import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { orders, discounts } from '../lib/api'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import OffcanvasCart from '../components/layout/OffcanvasCart'
import OffcanvasSearch from '../components/layout/OffcanvasSearch'
import IconsSprite from '../components/layout/IconsSprite'
import AddressSelector from '../components/ui/AddressSelector'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, loading: cartLoading } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    shippingAddress: {
      name: '',
      phone: '',
      address: '',
      city: '',
      cityCode: '',
      district: '',
      districtCode: '',
      ward: '',
      wardCode: '',
    },
    paymentMethod: 'BANK_TRANSFER',
    discountCode: '',
    notes: '',
  })

  const [discountInfo, setDiscountInfo] = useState(null)
  const [validatingDiscount, setValidatingDiscount] = useState(false)

  // Check if cart is empty
  useEffect(() => {
    if (!cartLoading && (!cart?.items || cart.items.length === 0)) {
      navigate('/cart')
    }
  }, [cart, cartLoading, navigate])

  // Calculate totals
  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
  const shippingFee = subtotal >= 500000 ? 0 : 30000
  const discountTotal = discountInfo?.discountAmount || 0
  const vatPercent = 10
  const vatAmount = Math.floor((subtotal - discountTotal + shippingFee) * vatPercent / 100)
  const total = subtotal - discountTotal + shippingFee + vatAmount

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('shippingAddress.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value,
        },
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle province change
  const handleProvinceChange = (code, name) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        cityCode: code,
        city: name,
        districtCode: '',
        district: '',
        wardCode: '',
        ward: '',
      },
    }))
  }

  // Handle district change
  const handleDistrictChange = (code, name) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        districtCode: code,
        district: name,
        wardCode: '',
        ward: '',
      },
    }))
  }

  // Handle ward change
  const handleWardChange = (code, name) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        wardCode: code,
        ward: name,
      },
    }))
  }

  // Validate discount code
  const handleValidateDiscount = async () => {
    if (!formData.discountCode.trim()) {
      setDiscountInfo(null)
      return
    }

    try {
      setValidatingDiscount(true)
      const result = await discounts.validate(formData.discountCode, subtotal)
      const discount = result.data?.discount
      
      if (discount) {
        // Calculate discount amount based on type
        let discountAmount = 0
        if (discount.type === 'PERCENT') {
          discountAmount = Math.floor(subtotal * discount.value / 100)
        } else {
          discountAmount = discount.value
        }
        
        setDiscountInfo({
          valid: true,
          discountAmount,
          message: `Mã giảm giá hợp lệ! Giảm ${discountAmount.toLocaleString('vi-VN')} ₫`,
        })
      } else {
        setDiscountInfo({
          valid: false,
          discountAmount: 0,
          message: 'Mã giảm giá không hợp lệ',
        })
      }
    } catch (err) {
      setDiscountInfo({
        valid: false,
        discountAmount: 0,
        message: err.message || 'Mã giảm giá không hợp lệ',
      })
    } finally {
      setValidatingDiscount(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    if (!formData.shippingAddress.name.trim()) {
      setError('Vui lòng nhập tên người nhận')
      return
    }
    if (!formData.shippingAddress.phone.trim()) {
      setError('Vui lòng nhập số điện thoại')
      return
    }
    if (!formData.shippingAddress.address.trim()) {
      setError('Vui lòng nhập địa chỉ')
      return
    }
    if (!formData.shippingAddress.cityCode || !formData.shippingAddress.city.trim()) {
      setError('Vui lòng chọn tỉnh/thành phố')
      return
    }
    if (!formData.shippingAddress.districtCode || !formData.shippingAddress.district.trim()) {
      setError('Vui lòng chọn quận/huyện')
      return
    }
    if (!formData.shippingAddress.wardCode || !formData.shippingAddress.ward.trim()) {
      setError('Vui lòng chọn phường/xã')
      return
    }

    try {
      setSubmitting(true)
      const orderData = {
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        discountCode: formData.discountCode || null,
        notes: formData.notes || null,
        shippingFee,
        vatPercent,
      }

      const result = await orders.create(orderData)
      
      // Redirect to order confirmation page
      navigate(`/order-confirmation/${result.data.id}`)
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tạo đơn hàng')
      console.error('Error creating order:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (cartLoading) {
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
            <p className="mt-3">Đang tải...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!cart?.items || cart.items.length === 0) {
    return null
  }

  return (
    <>
      <IconsSprite />
      <OffcanvasCart />
      <OffcanvasSearch />
      <Header />

      <section className="checkout-section py-5">
        <div className="container">
          {/* Page Title */}
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="page-title">Thanh toán</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                  <li className="breadcrumb-item"><Link to="/cart">Giỏ hàng</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Thanh toán</li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Left Column - Form */}
              <div className="col-lg-8">
                {/* Shipping Address */}
                <div className="checkout-section-card mb-4">
                  <h5 className="mb-4">Thông tin giao hàng</h5>
                  
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label">
                        Họ và tên <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="shippingAddress.name"
                        value={formData.shippingAddress.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label">
                        Số điện thoại <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="shippingAddress.phone"
                        value={formData.shippingAddress.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="address" className="form-label">
                        Địa chỉ <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="shippingAddress.address"
                        value={formData.shippingAddress.address}
                        onChange={handleInputChange}
                        placeholder="Số nhà, tên đường"
                        required
                      />
                    </div>
                    <AddressSelector
                      wardCode={formData.shippingAddress.wardCode}
                      onChange={handleWardChange}
                      provinceCode={formData.shippingAddress.cityCode}
                      districtCode={formData.shippingAddress.districtCode}
                      onProvinceChange={handleProvinceChange}
                      onDistrictChange={handleDistrictChange}
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="checkout-section-card mb-4">
                  <h5 className="mb-4">Phương thức thanh toán</h5>
                  
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="bankTransfer"
                      value="BANK_TRANSFER"
                      checked={formData.paymentMethod === 'BANK_TRANSFER'}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="bankTransfer">
                      <strong>Chuyển khoản ngân hàng</strong>
                      <p className="text-muted small mb-0 mt-1">
                        Quý khách vui lòng chuyển khoản theo thông tin bên dưới. Sau khi chuyển khoản, quản trị viên sẽ gọi điện xác nhận đơn hàng.
                      </p>
                    </label>
                  </div>

                  {formData.paymentMethod === 'BANK_TRANSFER' && (
                    <div className="bank-transfer-info p-4 bg-light rounded mb-3">
                      <h6 className="mb-3">Thông tin chuyển khoản:</h6>
                      <div className="row mb-2">
                        <div className="col-md-4"><strong>Số tài khoản:</strong></div>
                        <div className="col-md-8"><code>1234567890</code></div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4"><strong>Chủ tài khoản:</strong></div>
                        <div className="col-md-8">CÔNG TY TNHH ABC</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4"><strong>Ngân hàng:</strong></div>
                        <div className="col-md-8">Vietcombank</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4"><strong>Số tiền:</strong></div>
                        <div className="col-md-8"><strong className="text-primary">{total.toLocaleString('vi-VN')} ₫</strong></div>
                      </div>
                      <div className="row">
                        <div className="col-md-4"><strong>Nội dung:</strong></div>
                        <div className="col-md-8"><code>Thanh toan don hang</code></div>
                      </div>
                      <div className="alert alert-info mt-3 mb-0">
                        <strong>Lưu ý:</strong> Sau khi chuyển khoản, vui lòng chờ quản trị viên gọi điện xác nhận đơn hàng. 
                        Không cần nhập mã tham chiếu.
                      </div>
                    </div>
                  )}
                </div>

                {/* Discount Code */}
                <div className="checkout-section-card mb-4">
                  <h5 className="mb-4">Mã giảm giá (nếu có)</h5>
                  
                  <div className="row g-2">
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        id="discountCode"
                        name="discountCode"
                        value={formData.discountCode}
                        onChange={handleInputChange}
                        placeholder="Nhập mã giảm giá"
                      />
                    </div>
                    <div className="col-md-4">
                      <button
                        type="button"
                        className="btn btn-outline-primary w-100"
                        onClick={handleValidateDiscount}
                        disabled={validatingDiscount || !formData.discountCode.trim()}
                      >
                        {validatingDiscount ? 'Đang kiểm tra...' : 'Áp dụng'}
                      </button>
                    </div>
                  </div>
                  
                  {discountInfo && (
                    <div className={`mt-2 alert ${discountInfo.valid ? 'alert-success' : 'alert-danger'}`}>
                      {discountInfo.message}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="checkout-section-card mb-4">
                  <h5 className="mb-4">Ghi chú đơn hàng</h5>
                  
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                  ></textarea>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="col-lg-4">
                <div className="checkout-order-summary sticky-top" style={{ top: '20px' }}>
                  <h5 className="mb-4">Đơn hàng của bạn</h5>

                  {/* Order Items */}
                  <div className="order-items mb-3">
                    {cart.items.map((item) => {
                      const imageUrl = item.product?.images?.find(img => img.isPrimary)?.url || 
                                     item.product?.images?.[0]?.url || 
                                     '/images/product-thumb-1.png'
                      return (
                        <div key={item.id} className="d-flex mb-3 pb-3 border-bottom">
                          <div className="flex-shrink-0">
                            <img
                              src={imageUrl}
                              alt={item.product?.name}
                              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1 small">{item.product?.name}</h6>
                            {/* Variant Info */}
                            {(item.variant?.color || item.variant?.size) && (
                              <p className="mb-1 small text-muted" style={{ fontSize: '0.75rem' }}>
                                {item.variant.color && <span>Màu: {item.variant.color}</span>}
                                {item.variant.color && item.variant.size && <span> • </span>}
                                {item.variant.size && <span>Size: {item.variant.size}</span>}
                              </p>
                            )}
                            <p className="mb-1 small text-muted">
                              SL: {item.quantity} × {Number(item.price).toLocaleString('vi-VN')} ₫
                            </p>
                            <p className="mb-0 fw-bold">
                              {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Order Summary */}
                  <div className="summary-details">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tạm tính</span>
                      <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
                    </div>
                    
                    {discountTotal > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Giảm giá</span>
                        <span>-{discountTotal.toLocaleString('vi-VN')} ₫</span>
                      </div>
                    )}
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Phí vận chuyển</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="text-success">Miễn phí</span>
                        ) : (
                          `${shippingFee.toLocaleString('vi-VN')} ₫`
                        )}
                      </span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>VAT ({vatPercent}%)</span>
                      <span>{vatAmount.toLocaleString('vi-VN')} ₫</span>
                    </div>
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between mb-4">
                      <span className="fw-bold">Tổng cộng</span>
                      <span className="fw-bold fs-5 text-primary">
                        {total.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                        Đặt hàng
                      </>
                    )}
                  </button>

                  <p className="text-muted small text-center mt-3 mb-0">
                    Bằng việc đặt hàng, bạn đồng ý với{' '}
                    <Link to="/terms">Điều khoản và Điều kiện</Link> của chúng tôi
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  )
}

