import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import DashboardHome from '../pages/DashboardHome'
import ProductsPage from '../pages/ProductsPage'
import OrdersPage from '../pages/OrdersPage'
import CategoriesPage from '../pages/CategoriesPage'
import BrandsPage from '../pages/BrandsPage'
import DiscountsPage from '../pages/DiscountsPage'
import ReviewsPage from '../pages/ReviewsPage'
import AnnouncementsPage from '../pages/AnnouncementsPage'
import TikTokVideosPage from '../pages/TikTokVideosPage'
import BlogPage from '../pages/BlogPage'

export default function AdminDashboard({ user, onLogout }) {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome />
      case 'products':
        return <ProductsPage />
      case 'orders':
        return <OrdersPage />
      case 'categories':
        return <CategoriesPage />
      case 'brands':
        return <BrandsPage />
      case 'discounts':
        return <DiscountsPage />
      case 'reviews':
        return <ReviewsPage />
      case 'announcements':
        return <AnnouncementsPage />
      case 'tiktok':
        return <TikTokVideosPage />
      case 'blog':
        return <BlogPage />
      default:
        return <DashboardHome />
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="admin-main">
        <AdminHeader user={user} onLogout={onLogout} />
        <div className="admin-content">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}

