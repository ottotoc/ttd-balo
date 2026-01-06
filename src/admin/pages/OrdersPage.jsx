import React, { useState, useEffect } from 'react'
import { orders } from '../../lib/api'

export default function OrdersPage() {
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [page])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const result = await orders.getAll({ page, limit: 20 })
      setOrderList(result.data?.items || [])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmPayment = async (id, orderNumber, customerPhone) => {
    if (!confirm(`Xác nhận thanh toán cho đơn hàng #${orderNumber}?\n\nHành động này sẽ:\n- Xác nhận thanh toán\n- Trừ tồn kho sản phẩm\n- Chuyển đơn hàng sang trạng thái "Đang xử lý"\n\nLưu ý: Đảm bảo bạn đã gọi điện xác nhận với khách hàng (${customerPhone}) trước khi xác nhận.`)) return

    try {
      await orders.confirmPayment(id)
      alert('Đã xác nhận thanh toán thành công!')
      loadOrders()
    } catch (error) {
      alert('Lỗi: ' + error.message)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'badge-warning',
      AWAITING_CONFIRMATION: 'badge-warning',
      PAID: 'badge-success',
      PROCESSING: 'badge-info',
      SHIPPED: 'badge-primary',
      COMPLETED: 'badge-success',
      CANCELLED: 'badge-danger',
    }
    return badges[status] || 'badge-secondary'
  }

  const getStatusText = (status) => {
    const texts = {
      PENDING: 'Chờ xử lý',
      AWAITING_CONFIRMATION: 'Chờ xác nhận thanh toán',
      PROCESSING: 'Đang xử lý',
      SHIPPED: 'Đã giao hàng',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
    }
    return texts[status] || status
  }

  const getShippingPhone = (order) => {
    if (!order.shippingAddress) return null
    try {
      const address = typeof order.shippingAddress === 'string' 
        ? JSON.parse(order.shippingAddress) 
        : order.shippingAddress
      return address?.phone || null
    } catch {
      return null
    }
  }

  if (loading) {
    return <div className="text-center py-5">Đang tải danh sách đơn hàng...</div>
  }

  return (
    <div>
      <div className="data-table">
        <div className="data-table-header">
          <h2>Quản lý đơn hàng</h2>
          <p className="text-muted mb-0">Quản lý và xác nhận đơn hàng từ khách hàng</p>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Điện thoại</th>
                <th>Tổng tiền</th>
                <th>Phương thức</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((order) => {
                const phone = getShippingPhone(order)
                const isAwaitingConfirmation = order.status === 'AWAITING_CONFIRMATION' && order.paymentStatus === 'PENDING'
                
                return (
                  <tr key={order.id} className={isAwaitingConfirmation ? 'table-warning' : ''}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>
                    <td>
                      <div>
                        <div>{order.user?.name || 'Khách'}</div>
                        {order.user?.email && (
                          <small className="text-muted">{order.user.email}</small>
                        )}
                      </div>
                    </td>
                    <td>
                      {phone ? (
                        <div>
                          <a href={`tel:${phone}`} className="text-primary text-decoration-none">
                            <svg width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122L9.65 11.908a.678.678 0 0 1-.646-.464L7.5 8.207a.678.678 0 0 1 .464-.646l2.184-.606a.678.678 0 0 0 .122-.58L9.565 2.907a.678.678 0 0 0-1.015-.063L7.293 4.006z"/>
                            </svg>
                            {phone}
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <strong>{Number(order.total).toLocaleString('vi-VN')} ₫</strong>
                    </td>
                    <td>
                      {order.paymentMethod === 'BANK_TRANSFER' ? (
                        <span className="badge bg-primary">Chuyển khoản</span>
                      ) : (
                        <span className="badge bg-secondary">COD</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${order.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning'}`}>
                        {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.status)} text-white`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td>
                      <div>
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        <br />
                        <small className="text-muted">
                          {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={async () => {
                            try {
                              const result = await orders.getById(order.id)
                              setSelectedOrder(result.data)
                              setShowOrderModal(true)
                            } catch (error) {
                              alert('Lỗi: ' + error.message)
                            }
                          }}
                        >
                          Xem
                        </button>
                        {isAwaitingConfirmation && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleConfirmPayment(order.id, order.id, phone || 'N/A')}
                            title="Xác nhận thanh toán sau khi đã gọi điện cho khách hàng"
                          >
                            Xác nhận
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div 
          className="modal show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowOrderModal(false)
              setSelectedOrder(null)
            }
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết đơn hàng #{selectedOrder.id}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowOrderModal(false)
                    setSelectedOrder(null)
                  }}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Order Info */}
                <div className="mb-4">
                  <h6>Thông tin đơn hàng</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Trạng thái:</strong> <span className={`badge ${getStatusBadge(selectedOrder.status)} text-white`}>{getStatusText(selectedOrder.status)}</span></p>
                      <p><strong>Thanh toán:</strong> <span className={`badge ${selectedOrder.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning'}`}>{selectedOrder.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}</span></p>
                      <p><strong>Phương thức:</strong> {selectedOrder.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'COD'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Tổng tiền:</strong> <span className="text-danger fw-bold">{Number(selectedOrder.total).toLocaleString('vi-VN')} ₫</span></p>
                      <p><strong>Ngày tạo:</strong> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div className="mb-4">
                    <h6>Địa chỉ giao hàng</h6>
                    {(() => {
                      try {
                        const address = typeof selectedOrder.shippingAddress === 'string' 
                          ? JSON.parse(selectedOrder.shippingAddress) 
                          : selectedOrder.shippingAddress
                        return (
                          <div>
                            <p><strong>Họ tên:</strong> {address.name}</p>
                            <p><strong>Điện thoại:</strong> {address.phone}</p>
                            <p><strong>Địa chỉ:</strong> {address.address}, {address.ward}, {address.district}, {address.province}</p>
                          </div>
                        )
                      } catch {
                        return <p className="text-muted">{selectedOrder.shippingAddress}</p>
                      }
                    })()}
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h6>Sản phẩm</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Giá</th>
                          <th>SL</th>
                          <th>Tổng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div>
                                <strong>{item.name}</strong>
                                {/* Variant Info */}
                                {item.attributes && (
                                  <div className="text-muted small mt-1">
                                    {item.attributes.color && (
                                      <span className="me-2">Màu: {item.attributes.color}</span>
                                    )}
                                    {item.attributes.color && item.attributes.size && <span> • </span>}
                                    {item.attributes.size && (
                                      <span>Size: {item.attributes.size}</span>
                                    )}
                                  </div>
                                )}
                                <div className="text-muted small">SKU: {item.sku}</div>
                              </div>
                            </td>
                            <td>{Number(item.price).toLocaleString('vi-VN')} ₫</td>
                            <td>{item.quantity}</td>
                            <td><strong>{(Number(item.price) * item.quantity).toLocaleString('vi-VN')} ₫</strong></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end"><strong>Tổng cộng:</strong></td>
                          <td><strong>{Number(selectedOrder.total).toLocaleString('vi-VN')} ₫</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowOrderModal(false)
                    setSelectedOrder(null)
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

