import React, { useState, useEffect } from 'react'

/**
 * Toast Notification Component
 * Hiển thị thông báo toast đẹp và tự động ẩn
 * 
 * Usage:
 * const [toast, setToast] = useState(null)
 * 
 * // Show success
 * setToast({ type: 'success', message: 'Lưu thành công!' })
 * 
 * // Show error
 * setToast({ type: 'error', message: 'Có lỗi xảy ra!' })
 * 
 * // Render
 * {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
 */
export default function Toast({ toast, onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (toast) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          onClose()
        }, 300) // Wait for fade out animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [toast, duration, onClose])

  if (!toast) return null

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return 'ℹ️'
    }
  }

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return '#28a745'
      case 'error':
        return '#dc3545'
      case 'warning':
        return '#ffc107'
      case 'info':
        return '#17a2b8'
      default:
        return '#17a2b8'
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        minWidth: '300px',
        maxWidth: '500px',
        backgroundColor: getBgColor(),
        color: 'white',
        padding: '16px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(400px)',
        transition: 'all 0.3s ease-in-out',
        pointerEvents: 'auto',
      }}
    >
      <span style={{ fontSize: '20px', flexShrink: 0 }}>{getIcon()}</span>
      <div style={{ flex: 1, fontSize: '14px', fontWeight: '500', lineHeight: '1.4' }}>
        {toast.message}
      </div>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(() => onClose(), 300)
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '0',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          opacity: 0.8,
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.8'}
      >
        ×
      </button>
    </div>
  )
}




