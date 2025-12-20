import React, { useState } from 'react'
import Section from '../layout/Section.jsx'

const faqs = [
  {
    id: 1,
    question: 'Làm thế nào để đặt hàng?',
    answer: 'Bạn có thể đặt hàng trực tiếp trên website bằng cách thêm sản phẩm vào giỏ hàng và tiến hành thanh toán. Hoặc liên hệ hotline 0123 456 789 để được tư vấn và đặt hàng.'
  },
  {
    id: 2,
    question: 'Thời gian giao hàng là bao lâu?',
    answer: 'Đơn hàng nội thành TP.HCM sẽ được giao trong vòng 1-2 ngày. Đơn hàng ngoại thành và các tỉnh khác từ 3-5 ngày làm việc tùy khu vực.'
  },
  {
    id: 3,
    question: 'Chính sách đổi trả như thế nào?',
    answer: 'Sản phẩm được đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu còn nguyên tem mác, chưa qua sử dụng. Chi phí vận chuyển đổi trả do khách hàng chịu trừ trường hợp lỗi từ nhà sản xuất.'
  },
  {
    id: 4,
    question: 'Sản phẩm có bảo hành không?',
    answer: 'Tất cả sản phẩm balo, túi xách, vali đều được bảo hành 6-12 tháng tùy loại sản phẩm. Bảo hành miễn phí về khóa kéo, đường may, bánh xe (không bao gồm hư hỏng do tác động ngoại lực).'
  },
  {
    id: 5,
    question: 'Có hỗ trợ thanh toán trả góp không?',
    answer: 'Có, chúng tôi hỗ trợ thanh toán qua thẻ tín dụng với các ngân hàng liên kết. Bạn có thể trả góp 0% lãi suất cho đơn hàng từ 3 triệu trở lên.'
  },
  {
    id: 6,
    question: 'Làm sao để kiểm tra đơn hàng của tôi?',
    answer: 'Sau khi đặt hàng thành công, bạn sẽ nhận được mã đơn hàng qua email/SMS. Bạn có thể tra cứu tình trạng đơn hàng trên website hoặc liên hệ hotline để được hỗ trợ.'
  },
  {
    id: 7,
    question: 'Có được xem hàng trước khi thanh toán không?',
    answer: 'Có, với hình thức thanh toán COD (thanh toán khi nhận hàng), bạn được quyền kiểm tra sản phẩm trước khi thanh toán cho shipper.'
  },
  {
    id: 8,
    question: 'Sản phẩm có chống nước không?',
    answer: 'Hầu hết các sản phẩm balo và túi xách của chúng tôi đều có lớp phủ chống nước cơ bản, giúp bảo vệ đồ đạc khi gặp mưa nhỏ. Một số dòng cao cấp có khả năng chống nước tốt hơn.'
  }
]

export default function FAQSection() {
  const [activeId, setActiveId] = useState(null)

  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <Section usePattern={true}>
      <div className="faq-section py-5">
        <div className="row">
          {/* Left Column - Header */}
          <div className="col-lg-4 mb-5 mb-lg-0">
            <div className="sticky-top" style={{ top: '100px' }}>
              <h2 className="display-5 fw-bold mb-4">
                Câu hỏi thường gặp
              </h2>
              <p className="text-muted fs-5 mb-4">
                Tìm câu trả lời cho những thắc mắc phổ biến nhất của khách hàng
              </p>
              <div className="contact-box p-4 bg-light rounded-4">
                <h5 className="fw-bold mb-3">Không tìm thấy câu trả lời?</h5>
                <p className="text-muted mb-3">Liên hệ với chúng tôi để được hỗ trợ</p>
                <a href="tel:0123456789" className="btn btn-primary w-100 mb-2">
                  Gọi ngay: 0123 456 789
                </a>
                <a href="mailto:support@tanthoidal.com" className="btn btn-outline-primary w-100">
                  Email: support@tanthoidal.com
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - FAQ Accordion */}
          <div className="col-lg-8">
            <div className="accordion" id="faqAccordion">
              {faqs.map((faq, index) => (
                <div 
                  key={faq.id} 
                  className="accordion-item border-0 mb-3 shadow-sm rounded-3 overflow-hidden"
                  style={{ 
                    transition: 'all 0.3s ease',
                    border: activeId === faq.id ? '2px solid #ff6600' : '2px solid transparent'
                  }}
                >
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${activeId === faq.id ? '' : 'collapsed'} fw-bold`}
                      type="button"
                      onClick={() => toggleFAQ(faq.id)}
                      style={{
                        backgroundColor: activeId === faq.id ? '#fff5f0' : 'white',
                        color: activeId === faq.id ? '#ff6600' : '#2d2a2a',
                        fontSize: '1.1rem',
                        padding: '1.25rem 1.5rem'
                      }}
                    >
                      {faq.question}
                    </button>
                  </h2>
                  <div
                    className={`accordion-collapse collapse ${activeId === faq.id ? 'show' : ''}`}
                  >
                    <div className="accordion-body" style={{ 
                      padding: '1.5rem',
                      backgroundColor: '#fafafa',
                      fontSize: '1rem',
                      lineHeight: '1.8'
                    }}>
                      <p className="mb-0 text-muted">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          .accordion-button:not(.collapsed) {
            box-shadow: none;
          }
          
          .accordion-button:focus {
            box-shadow: none;
            border-color: transparent;
          }
          
          .accordion-button::after {
            background-size: 1.25rem;
            transition: transform 0.3s ease;
          }
          
          .accordion-item:hover {
            transform: translateX(5px);
          }
          
          .sticky-top {
            position: sticky;
          }
          
          @media (max-width: 991px) {
            .sticky-top {
              position: relative;
              top: 0 !important;
            }
          }
        `}</style>
      </div>
    </Section>
  )
}

