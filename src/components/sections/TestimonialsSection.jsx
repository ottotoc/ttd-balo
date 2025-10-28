import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import Section from '../layout/Section.jsx'

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    role: 'Sinh viên',
    avatar: '/images/reviewer-1.jpg',
    rating: 5,
    comment: 'Balo rất đẹp và chất lượng tốt! Đựng laptop 15 inch vừa vặn, nhiều ngăn tiện lợi. Shop tư vấn nhiệt tình, giao hàng nhanh.',
    date: '2 tuần trước'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    role: 'Nhân viên văn phòng',
    avatar: '/images/reviewer-2.jpg',
    rating: 5,
    comment: 'Túi xách công sở sang trọng, da mềm mại. Mình đã mua 3 chiếc cho cả gia đình. Giá cả hợp lý, chất lượng vượt mong đợi!',
    date: '1 tháng trước'
  },
  {
    id: 3,
    name: 'Lê Minh C',
    role: 'Doanh nhân',
    avatar: '/images/reviewer-3.jpg',
    rating: 5,
    comment: 'Vali du lịch rất bền, bánh xe êm ái. Đã dùng qua 5 chuyến bay vẫn như mới. Rất đáng đồng tiền bát gạo!',
    date: '3 tuần trước'
  },
  {
    id: 4,
    name: 'Phạm Thu D',
    role: 'Giáo viên',
    avatar: '/images/reviewer-1.jpg',
    rating: 5,
    comment: 'Balo học sinh cho con rất đẹp, chống nước tốt. Con rất thích và tự hào khi đi học. Cảm ơn shop!',
    date: '1 tuần trước'
  }
]

export default function TestimonialsSection() {
  return (
    <Section usePattern={true}>
      <div className="testimonials-section py-5">
        <div className="section-header text-center mb-5">
          <h2 className="section-title display-5 fw-bold">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-muted fs-5">Hơn 10,000+ khách hàng hài lòng</p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="testimonials-swiper pb-5"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="testimonial-card card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body p-4">
                  {/* Rating Stars */}
                  <div className="rating mb-3">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={index < testimonial.rating ? 'text-warning' : 'text-muted'}
                        style={{ fontSize: '1.2rem' }}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="testimonial-text text-muted mb-4" style={{ minHeight: '100px' }}>
                    "{testimonial.comment}"
                  </p>

                  {/* Author Info */}
                  <div className="d-flex align-items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="rounded-circle me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect width="50" height="50" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23999"%3E' + testimonial.name.charAt(0) + '%3C/text%3E%3C/svg%3E'
                      }}
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.role}</small>
                      <div>
                        <small className="text-muted">{testimonial.date}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx>{`
          .hover-lift {
            transition: all 0.3s ease;
          }
          .hover-lift:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.15) !important;
          }
          .testimonials-swiper {
            padding-bottom: 50px !important;
          }
        `}</style>
      </div>
    </Section>
  )
}

