import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { orders } from '../lib/api'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import OffcanvasCart from '../components/layout/OffcanvasCart'
import OffcanvasSearch from '../components/layout/OffcanvasSearch'
import IconsSprite from '../components/layout/IconsSprite'

export default function OrderConfirmationPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      loadOrder()
    }
  }, [id])

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await orders.getById(id)
      setOrder(result.data)
    } catch (err) {
      setError(err.message || 'Không tìm thấy đơn hàng')
      console.error('Error loading order:', err)
    } finally {
      setLoading(false)
    }
  }

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
            <p className="mt-3">Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <IconsSprite />
        <OffcanvasCart />
        <OffcanvasSearch />
        <Header />
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4>Lỗi</h4>
            <p>{error || 'Không tìm thấy đơn hàng'}</p>
            <Link to="/" className="btn btn-primary">
              Về trang chủ
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const shippingAddress = typeof order.shippingAddress === 'string' 
    ? JSON.parse(order.shippingAddress) 
    : order.shippingAddress

  const isAwaitingConfirmation = order.status === 'AWAITING_CONFIRMATION' && order.paymentStatus === 'PENDING'

  return (
    <>
      <IconsSprite />
      <OffcanvasCart />
      <OffcanvasSearch />
      <Header />

      <section className="order-confirmation-section py-5">
        <div className="container">
          {/* Success Banner */}
          <div className="text-center mb-5">
            <div className="mb-4">
              <svg width="120" height="120" fill="#28a745" viewBox="0 0 16 16" className="mx-auto">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
            </div>
            <h1 className="display-4 mb-3 text-success">Đặt hàng thành công!</h1>
            <p className="lead text-muted">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận.
            </p>
          </div>

          {/* Status Card */}
          {isAwaitingConfirmation && (
            <div className="alert alert-info text-center mb-4" role="alert">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <svg width="24" height="24" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                </svg>
                <h4 className="mb-0">Đang chờ xác nhận</h4>
              </div>
              <p className="mb-0">
                <strong>Quản trị viên sẽ gọi điện xác nhận đơn hàng với bạn trong thời gian sớm nhất.</strong>
                <br />
                Vui lòng giữ máy để nhận cuộc gọi từ chúng tôi.
              </p>
            </div>
          )}

          <div className="row g-4">
            {/* Order Details */}
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Thông tin đơn hàng</h5>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Mã đơn hàng:</strong>
                      <p className="mb-0 fs-5">#{order.id}</p>
                    </div>
                    <div className="col-md-6">
                      <strong>Ngày đặt hàng:</strong>
                      <p className="mb-0">
                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Trạng thái đơn hàng:</strong>
                      <p className="mb-0">
                        <span className={`badge ${isAwaitingConfirmation ? 'bg-warning' : 'bg-info'} px-3 py-2`}>
                          {isAwaitingConfirmation ? 'Chờ xác nhận' : order.status.replace(/_/g, ' ')}
                        </span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Phương thức thanh toán:</strong>
                      <p className="mb-0">
                        {order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản ngân hàng' : order.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Địa chỉ giao hàng</h5>
                </div>
                <div className="card-body">
                  <p className="mb-1">
                    <strong>{shippingAddress?.name}</strong>
                  </p>
                  <p className="mb-1">
                    <strong>Điện thoại:</strong> {shippingAddress?.phone}
                  </p>
                  <p className="mb-0">
                    {shippingAddress?.address}, {shippingAddress?.ward}, {shippingAddress?.district}, {shippingAddress?.city}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Sản phẩm đã đặt</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Giá</th>
                          <th>Số lượng</th>
                          <th>Tổng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items?.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div>
                                <strong>{item.name}</strong>
                                {item.attributes && (
                                  <div className="text-muted small">
                                    {Object.entries(item.attributes).map(([key, value]) => (
                                      <span key={key} className="me-2">
                                        {key}: {value}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <div className="text-muted small">SKU: {item.sku}</div>
                              </div>
                            </td>
                            <td>{Number(item.price).toLocaleString('vi-VN')} ₫</td>
                            <td>{item.quantity}</td>
                            <td>
                              <strong>
                                {(Number(item.price) * item.quantity).toLocaleString('vi-VN')} ₫
                              </strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">Ghi chú</h5>
                  </div>
                  <div className="card-body">
                    <p className="mb-0">{order.notes}</p>
                  </div>
                </div>
              )}

              {/* Payment Instructions */}
              {isAwaitingConfirmation && order.paymentMethod === 'BANK_TRANSFER' && (
                <div className="card mb-4 border-primary">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Hướng dẫn thanh toán</h5>
                  </div>
                  <div className="card-body">
                    <p className="mb-3">
                      <strong>Vui lòng chuyển khoản theo thông tin sau:</strong>
                    </p>
                    <div className="row mb-3">
                      <div className="col-md-4"><strong>Số tài khoản:</strong></div>
                      <div className="col-md-8"><code>1234567890</code></div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4"><strong>Chủ tài khoản:</strong></div>
                      <div className="col-md-8">CÔNG TY TNHH ABC</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4"><strong>Ngân hàng:</strong></div>
                      <div className="col-md-8">Vietcombank</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4"><strong>Số tiền:</strong></div>
                      <div className="col-md-8"><strong className="text-primary fs-5">{Number(order.total).toLocaleString('vi-VN')} ₫</strong></div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4"><strong>Nội dung:</strong></div>
                      <div className="col-md-8"><code>Thanh toan don hang #{order.id}</code></div>
                    </div>
                    <div className="alert alert-info mb-0">
                      <strong>Lưu ý:</strong> Sau khi chuyển khoản, quản trị viên sẽ gọi điện xác nhận với bạn. 
                      Không cần nhập mã tham chiếu.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="card sticky-top" style={{ top: '20px' }}>
                <div className="card-header">
                  <h5 className="mb-0">Tổng đơn hàng</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tạm tính</span>
                    <span>{Number(order.subtotal).toLocaleString('vi-VN')} ₫</span>
                  </div>
                  
                  {Number(order.discountTotal) > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Giảm giá</span>
                      <span>-{Number(order.discountTotal).toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Phí vận chuyển</span>
                    <span>
                      {Number(order.shippingFee) === 0 ? (
                        <span className="text-success">Miễn phí</span>
                      ) : (
                        `${Number(order.shippingFee).toLocaleString('vi-VN')} ₫`
                      )}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>VAT ({order.vatPercent}%)</span>
                    <span>{Number(order.vatAmount).toLocaleString('vi-VN')} ₫</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold">Tổng cộng</span>
                    <span className="fw-bold fs-5 text-primary">
                      {Number(order.total).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>

                  <div className="d-grid gap-2">
                    <Link to="/" className="btn btn-primary">
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

