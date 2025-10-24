import React, { useState, useEffect } from 'react'
import { products, orders } from '../../lib/api'

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        products.getAll({ limit: 1 }),
        orders.getAll({ limit: 100 }),
      ])

      const allOrders = ordersRes.data?.items || []
      const pending = allOrders.filter(o => o.status === 'PENDING').length
      const revenue = allOrders
        .filter(o => o.paymentStatus === 'PAID')
        .reduce((sum, o) => sum + Number(o.total), 0)

      setStats({
        totalProducts: productsRes.data?.pagination?.total || 0,
        totalOrders: ordersRes.data?.pagination?.total || 0,
        pendingOrders: pending,
        revenue,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{stats.totalProducts}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders}</p>
        </div>
        
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-value">{stats.pendingOrders}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">{stats.revenue.toLocaleString('vi-VN')} ₫</p>
        </div>
      </div>

      <div className="alert alert-info mt-4">
        <h4>Quick Actions</h4>
        <p className="mb-0">
          Use the sidebar to navigate to different sections of the admin panel.
          You can manage products, orders, categories, and more.
        </p>
      </div>
    </div>
  )
}

