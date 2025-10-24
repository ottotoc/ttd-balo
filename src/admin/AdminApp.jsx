import React, { useState, useEffect } from 'react'
import { auth } from '../lib/api'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'

export default function AdminApp() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const result = await auth.me()
      if (result.data?.user?.role === 'ADMIN') {
        setUser(result.data.user)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (email, password) => {
    const result = await auth.login({ email, password })
    if (result.data?.user?.role !== 'ADMIN') {
      throw new Error('Access denied. Admin only.')
    }
    setUser(result.data.user)
  }

  const handleLogout = async () => {
    await auth.logout()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return <AdminDashboard user={user} onLogout={handleLogout} />
}

