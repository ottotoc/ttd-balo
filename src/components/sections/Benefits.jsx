import React from 'react'
import Section from '../layout/Section.jsx'

const items = [
  { 
    title: 'Miễn phí vận chuyển', 
    text: 'Cho đơn hàng trên 500K',
    color: '#4CAF50'
  },
  { 
    title: 'Thanh toán an toàn', 
    text: 'Bảo mật 100%',
    color: '#2196F3'
  },
  { 
    title: 'Chất lượng đảm bảo', 
    text: 'Sản phẩm chính hãng',
    color: '#FF9800'
  },
  { 
    title: 'Giá tốt nhất', 
    text: 'Cam kết hoàn tiền',
    color: '#9C27B0'
  },
  { 
    title: 'Ưu đãi hấp dẫn', 
    text: 'Khuyến mãi mỗi ngày',
    color: '#F44336'
  },
]

export default function Benefits() {
  return (
    <Section usePattern={false}>
      <div className="benefits-section py-4">
        <div className="container-fluid">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
            {items.map((item) => (
              <div className="col" key={item.title}>
                <div className="benefit-card card h-100 border-0 shadow-sm text-center p-4 hover-benefit">
                  <div className="icon-wrapper mb-3 mx-auto" style={{ 
                    width: '80px', 
                    height: '80px',
                    background: `${item.color}15`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `3px solid ${item.color}30`
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: item.color,
                      borderRadius: '50%'
                    }}></div>
                  </div>
                  <div className="card-body p-0">
                    <h5 className="fw-bold mb-2" style={{ fontSize: '1.1rem' }}>{item.title}</h5>
                    <p className="card-text text-muted small mb-0">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .hover-benefit {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }
          
          .hover-benefit:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important;
          }
          
          .hover-benefit:hover .icon-wrapper {
            transform: scale(1.1) rotate(5deg);
            transition: all 0.3s ease;
          }
        `}</style>
      </div>
    </Section>
  )
}


