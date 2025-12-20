import React, { useState, useEffect } from 'react'
import Section from '../layout/Section.jsx'

export default function SocialProofSection() {
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    reviews: 0,
    rating: 0
  })

  // Animated counter effect
  useEffect(() => {
    const targetStats = {
      customers: 10000,
      products: 2000,
      reviews: 5000,
      rating: 4.9
    }

    const duration = 2000 // 2 seconds
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setStats({
        customers: Math.floor(targetStats.customers * progress),
        products: Math.floor(targetStats.products * progress),
        reviews: Math.floor(targetStats.reviews * progress),
        rating: (targetStats.rating * progress).toFixed(1)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setStats(targetStats)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const trustBadges = [
    {
      title: 'Chính hãng 100%',
      description: 'Cam kết sản phẩm chính hãng',
      color: '#4CAF50'
    },
    {
      title: 'Top 1 Việt Nam',
      description: 'Thương hiệu balo số 1',
      color: '#FF9800'
    },
    {
      title: 'Đổi trả 7 ngày',
      description: 'Miễn phí đổi trả',
      color: '#2196F3'
    },
    {
      title: 'Giao hàng nhanh',
      description: 'Toàn quốc 24-48h',
      color: '#F44336'
    }
  ]

  return (
    <Section usePattern={true}>
      <div className="social-proof-section py-5">
        {/* Stats Counter */}
        <div className="stats-section mb-5">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="stat-card p-4 bg-white rounded-4 shadow-sm h-100 hover-stat">
                <h3 className="stat-number display-4 fw-bold text-primary mb-2">
                  {stats.customers.toLocaleString()}+
                </h3>
                <p className="stat-label text-muted mb-0">Khách hàng tin tưởng</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card p-4 bg-white rounded-4 shadow-sm h-100 hover-stat">
                <h3 className="stat-number display-4 fw-bold text-success mb-2">
                  {stats.products.toLocaleString()}+
                </h3>
                <p className="stat-label text-muted mb-0">Sản phẩm đa dạng</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card p-4 bg-white rounded-4 shadow-sm h-100 hover-stat">
                <h3 className="stat-number display-4 fw-bold text-warning mb-2">
                  {stats.reviews.toLocaleString()}+
                </h3>
                <p className="stat-label text-muted mb-0">Đánh giá 5 sao</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card p-4 bg-white rounded-4 shadow-sm h-100 hover-stat">
                <h3 className="stat-number display-4 fw-bold text-danger mb-2">
                  {stats.rating}
                </h3>
                <p className="stat-label text-muted mb-0">Điểm đánh giá TB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="trust-badges-section">
          <h3 className="text-center mb-5 fw-bold fs-2">Tại sao chọn chúng tôi?</h3>
          <div className="row g-4">
            {trustBadges.map((badge, index) => (
              <div key={index} className="col-6 col-md-3">
                <div className="trust-badge text-center p-4 bg-white rounded-4 shadow-sm h-100 hover-badge">
                  <div className="badge-icon mb-3 mx-auto" style={{ 
                    width: '80px',
                    height: '80px',
                    background: `${badge.color}15`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `3px solid ${badge.color}30`
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: badge.color,
                      borderRadius: '50%'
                    }}></div>
                  </div>
                  <h5 className="fw-bold mb-2">{badge.title}</h5>
                  <p className="text-muted small mb-0">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="awards-section mt-5 p-5 bg-white rounded-4 shadow-sm">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
              <h4 className="fw-bold mb-3">Giải thưởng & Chứng nhận</h4>
              <p className="text-muted mb-0">
                Được tin tưởng bởi hàng triệu khách hàng và đối tác trên toàn quốc. 
                Chứng nhận ISO 9001:2015 về chất lượng sản phẩm và dịch vụ.
              </p>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-wrap justify-content-center justify-content-md-end gap-3">
                <div className="award-badge bg-light p-3 rounded-3 text-center" style={{ minWidth: '100px' }}>
                  <small className="d-block mt-2 fw-bold">Top Brand</small>
                  <small className="text-muted">2024</small>
                </div>
                <div className="award-badge bg-light p-3 rounded-3 text-center" style={{ minWidth: '100px' }}>
                  <small className="d-block mt-2 fw-bold">Premium</small>
                  <small className="text-muted">Quality</small>
                </div>
                <div className="award-badge bg-light p-3 rounded-3 text-center" style={{ minWidth: '100px' }}>
                  <small className="d-block mt-2 fw-bold">Customer</small>
                  <small className="text-muted">Choice</small>
                </div>
                <div className="award-badge bg-light p-3 rounded-3 text-center" style={{ minWidth: '100px' }}>
                  <small className="d-block mt-2 fw-bold">ISO</small>
                  <small className="text-muted">9001:2015</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .hover-stat {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .hover-stat:hover {
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
          }
          
          .hover-badge {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .hover-badge:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.15) !important;
          }
          
          .hover-badge:hover .badge-icon {
            transform: scale(1.2) rotate(10deg);
            transition: all 0.3s ease;
          }
          
          .stat-number {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .award-badge {
            transition: all 0.3s ease;
          }
          
          .award-badge:hover {
            transform: scale(1.1);
            background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%) !important;
          }
        `}</style>
      </div>
    </Section>
  )
}

