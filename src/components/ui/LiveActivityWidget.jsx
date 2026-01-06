import React, { useState, useEffect } from 'react'

// Danh sách tên người Việt Nam
const vietnameseNames = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Phạm Thị Dung',
  'Hoàng Văn Đức', 'Nguyễn Thị Hoa', 'Trần Văn Hùng', 'Lê Thị Lan',
  'Phạm Văn Minh', 'Hoàng Thị Mai', 'Nguyễn Văn Nam', 'Trần Thị Oanh',
  'Lê Văn Phong', 'Phạm Thị Quỳnh', 'Hoàng Văn Sơn', 'Nguyễn Thị Thu',
  'Trần Văn Tuấn', 'Lê Thị Uyên', 'Phạm Văn Việt', 'Hoàng Thị Xuân',
  'Nguyễn Văn Anh', 'Trần Thị Bích', 'Lê Văn Dũng', 'Phạm Thị Giang',
  'Hoàng Văn Hiếu', 'Nguyễn Thị Hương', 'Trần Văn Khoa', 'Lê Thị Linh',
  'Phạm Văn Long', 'Hoàng Thị Nga', 'Nguyễn Văn Quang', 'Trần Thị Thanh'
]

// Danh sách sản phẩm giả
const fakeProducts = [
  'Balo Laptop Mikkor 15.6 inch', 'Túi Xách Da Tomtoc', 'Balo Du Lịch Thể Thao',
  'Vali Kéo Samsonite 20 inch', 'Balo Học Sinh Thời Trang', 'Túi Chéo Nữ Da Thật',
  'Balo Laptop Chống Sốc', 'Túi Xách Công Sở', 'Balo Du Lịch Chống Nước',
  'Vali Kéo 24 inch', 'Balo Laptop 14 inch', 'Túi Xách Nữ Hàng Hiệu',
  'Balo Thể Thao Đa Năng', 'Túi Chéo Nam Da', 'Vali Kéo Trolley',
  'Balo Học Sinh Siêu Nhẹ', 'Túi Xách Da Bò', 'Balo Laptop 17 inch',
  'Túi Du Lịch Đa Năng', 'Balo Công Sở Chống Nước'
]

// Danh sách địa điểm
const locations = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Ninh', 'Bến Tre',
  'Bình Định', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau'
]

// Tạo dữ liệu mua hàng giả
const generateFakePurchase = () => {
  const randomName = vietnameseNames[Math.floor(Math.random() * vietnameseNames.length)]
  const randomProduct = fakeProducts[Math.floor(Math.random() * fakeProducts.length)]
  const randomLocation = locations[Math.floor(Math.random() * locations.length)]
  const purchaseTime = new Date()
  
  return {
    id: Date.now() + Math.random(),
    name: randomName,
    product: randomProduct,
    location: randomLocation,
    time: purchaseTime
  }
}

// Format thời gian
const formatTimeAgo = (time) => {
  const now = new Date()
  const diff = Math.floor((now - time) / 1000) // seconds
  
  if (diff < 60) {
    return `${diff} giây trước`
  }
  const minutes = Math.floor(diff / 60)
  if (minutes < 60) {
    return `${minutes} phút trước`
  }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} giờ trước`
  }
  return `${Math.floor(hours / 24)} ngày trước`
}

export default function LiveActivityWidget() {
  const [onlineUsers, setOnlineUsers] = useState(25)
  const [recentPurchases, setRecentPurchases] = useState([])
  const [isMinimized, setIsMinimized] = useState(false)

  // Khởi tạo một số giao dịch ban đầu
  useEffect(() => {
    const initialPurchases = []
    for (let i = 0; i < 5; i++) {
      const purchase = generateFakePurchase()
      purchase.time = new Date(Date.now() - (i + 1) * 10000) // 10 giây cách nhau
      initialPurchases.push(purchase)
    }
    setRecentPurchases(initialPurchases)
  }, [])

  // Cập nhật số người online (20-30)
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(20 + Math.floor(Math.random() * 11)) // 20-30
    }, 5000) // Cập nhật mỗi 5 giây

    return () => clearInterval(interval)
  }, [])

  // Thêm giao dịch mới ngẫu nhiên (dưới 1 phút)
  useEffect(() => {
    const addRandomPurchase = () => {
      const newPurchase = generateFakePurchase()
      setRecentPurchases(prev => {
        const updated = [newPurchase, ...prev]
        // Giữ tối đa 10 giao dịch gần nhất
        return updated.slice(0, 10)
      })
    }

    // Thêm giao dịch đầu tiên sau 5 giây
    const firstTimeout = setTimeout(() => {
      addRandomPurchase()
    }, 5000)

    // Sau đó thêm giao dịch mới với khoảng thời gian ngẫu nhiên (10-55 giây)
    const scheduleNext = () => {
      const randomDelay = 10000 + Math.random() * 45000 // 10-55 giây
      setTimeout(() => {
        addRandomPurchase()
        scheduleNext()
      }, randomDelay)
    }

    scheduleNext()

    return () => {
      clearTimeout(firstTimeout)
    }
  }, [])

  // Cập nhật thời gian hiển thị mỗi giây
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render để cập nhật thời gian
      setRecentPurchases(prev => [...prev])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className="live-activity-widget"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '350px',
        maxWidth: 'calc(100vw - 40px)',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        zIndex: 1050, // Cao hơn để hiển thị trên các element khác, nhưng vẫn thấp hơn modal (thường 1100+)
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.8)'
      }}
    >
      {/* Header */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #ff6600 0%, #ff8533 50%, #FFC43F 100%)',
          color: '#fff',
          padding: '16px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        {/* Decorative overlay */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '150%',
          height: '150%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h6 className="mb-0 fw-bold" style={{ 
            fontSize: '15px',
            letterSpacing: '0.3px',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            Hoạt động trực tiếp
          </h6>
          <div style={{ 
            fontSize: '12px', 
            opacity: 0.95, 
            marginTop: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span className="d-inline-block" style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#4ade80',
              borderRadius: '50%',
              boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
              animation: 'pulse 2s infinite',
              flexShrink: 0
            }}></span>
            <span style={{ fontWeight: '500' }}>{onlineUsers} người đang online</span>
          </div>
        </div>
        <button
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '6px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            position: 'relative',
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setIsMinimized(!isMinimized)
          }}
        >
          {isMinimized ? '▼' : '▲'}
        </button>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <div style={{ padding: '15px' }}>
            <h6 className="mb-3 fw-bold" style={{ fontSize: '14px', color: '#333' }}>
              Mua hàng gần đây
            </h6>
            
            {recentPurchases.length === 0 ? (
              <p className="text-muted text-center py-3" style={{ fontSize: '12px' }}>
                Chưa có giao dịch nào
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    style={{
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                      animation: 'slideIn 0.3s ease',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff6600 0%, #FFC43F 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        flexShrink: 0
                      }}>
                        {purchase.name.split(' ').pop().charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontSize: '13px', 
                          fontWeight: '600',
                          color: '#333',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {purchase.name}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#666',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          đã mua {purchase.product}
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          fontSize: '11px',
                          color: '#999'
                        }}>
                          <span>📍 {purchase.location}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(purchase.time)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .live-activity-widget::-webkit-scrollbar {
          width: 6px;
        }

        .live-activity-widget::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .live-activity-widget::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .live-activity-widget::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        @media (max-width: 768px) {
          .live-activity-widget {
            /* Trên mobile: đặt widget ở bên trái, tránh đè lên floating buttons bên phải */
            width: calc(100vw - 90px); /* Trừ đi 90px: 45px (button) + 20px (right margin) + 25px (buffer) */
            left: 10px;
            bottom: 10px;
            max-width: calc(100vw - 90px);
            z-index: 1050; /* Giữ z-index cao để hiển thị đẹp */
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          }
        }
        
        /* Đảm bảo floating buttons luôn ở trên */
        @media (max-width: 768px) {
          .floating-buttons-container {
            z-index: 1060 !important; /* Cao hơn LiveActivityWidget một chút */
          }
        }
      `}</style>
    </div>
  )
}

