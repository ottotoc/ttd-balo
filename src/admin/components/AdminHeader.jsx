import React from 'react'

export default function AdminHeader({ user, onLogout }) {
  return (
    <div className="admin-header">
      <div>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Admin Panel</h1>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span>Welcome, <strong>{user.name || user.email}</strong></span>
        <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

