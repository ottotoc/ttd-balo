import React from 'react'

export default function AdminSidebar({ currentPage, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'orders', label: 'Orders', icon: '🛒' },
    { id: 'categories', label: 'Categories', icon: '📁' },
    { id: 'brands', label: 'Brands', icon: '🏷️' },
    { id: 'discounts', label: 'Discounts', icon: '💰' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'blog', label: 'Blog', icon: '📝' },
    { id: 'banners', label: 'Banners', icon: '🖼️' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'tiktok', label: 'TikTok Videos', icon: '📱' },
  ]

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h3>🎒 TTD Balo Admin</h3>
      </div>
      <ul className="admin-nav">
        {menuItems.map((item) => (
          <li key={item.id} className="admin-nav-item">
            <a
              href="#"
              className={`admin-nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                onNavigate(item.id)
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

