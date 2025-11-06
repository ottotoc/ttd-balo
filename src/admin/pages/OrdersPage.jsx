import React, { useState, useEffect } from 'react'
import { orders } from '../../lib/api'

export default function OrdersPage() {
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

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
                          onClick={() => {
                            // TODO: Implement order detail modal or page
                            alert(`Chi tiết đơn hàng #${order.id}`)
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
    </div>
  )
}

