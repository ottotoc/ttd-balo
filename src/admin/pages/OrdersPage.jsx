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

  const handleConfirmPayment = async (id) => {
    if (!confirm('Confirm payment and deduct stock?')) return

    try {
      await orders.confirmPayment(id)
      alert('Payment confirmed!')
      loadOrders()
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'badge-warning',
      AWAITING_CONFIRMATION: 'badge-info',
      PAID: 'badge-success',
      PROCESSING: 'badge-info',
      SHIPPED: 'badge-info',
      COMPLETED: 'badge-success',
      CANCELLED: 'badge-danger',
    }
    return badges[status] || 'badge-secondary'
  }

  if (loading) {
    return <div>Loading orders...</div>
  }

  return (
    <div>
      <div className="data-table">
        <div className="data-table-header">
          <h2>Orders</h2>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.user?.name || order.user?.email || 'Guest'}</td>
                  <td>{Number(order.total).toLocaleString('vi-VN')} ₫</td>
                  <td>{order.paymentMethod.replace('_', ' ')}</td>
                  <td>
                    <span className={`badge ${order.paymentStatus === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary">View</button>
                      {order.paymentStatus === 'PENDING' && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleConfirmPayment(order.id)}
                        >
                          Confirm Payment
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

