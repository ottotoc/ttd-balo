import React from 'react'
import Section from '../layout/Section.jsx'

export default function DiscountForm() {
  return (
    <Section usePattern={false}>
      <div className="bg-secondary py-5 my-5 rounded-5" style={{ background: "url('/images/bg-leaves-img-pattern.png') no-repeat" }}>
        <div className="container my-5">
          <div className="row">
            <div className="col-md-4 p-5">
              <div className="section-header">
                <h2 className="section-title display-4">Giảm ngay <span className="text-primary">25%</span> cho đơn đầu tiên</h2>
              </div>
              <p>Đăng ký nhận tin để nhận mã giảm giá cho đơn đầu tiên và cập nhật chương trình khuyến mãi mới nhất từ Tân Thời Đại.</p>
            </div>
            <div className="col-md-4 p-5">
              <form>
                <div className="mb-3">
                  <label className="form-label">Họ và tên</label>
                  <input type="text" className="form-control form-control-lg" placeholder="Họ và tên" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control form-control-lg" placeholder="email@domain.com" />
                </div>
                <div className="form-check form-check-inline mb-3">
                  <label className="form-check-label">
                    <input className="form-check-input" type="checkbox" value="subscribe" />
                    Đăng ký nhận bản tin khuyến mãi
                  </label>
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-dark btn-lg">Gửi</button>
                </div>
              </form>
            </div>
            <div className="col-md-4 p-5">
              <div className="location-section">
                <h4 className="mb-3">Vị trí cửa hàng</h4>
                <div className="map-container mb-3">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d489.99055859784374!2d106.63728234959869!3d10.74030470000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1c724cb579%3A0x850e74e280fc6196!2zQ8O0bmcgVHkgeG5rIFTDom4gdGjhu51pIMSR4bqhaSAtIGLDoW4gc-G7iSBiYWxvIC0gdMO6aSB4w6FjaA!5e0!3m2!1sen!2s!4v1762316128913!5m2!1sen!2s"
                    width="100%"
                    height="200"
                    style={{ border: 0, borderRadius: '10px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Tân Thời Đại Balo Store Location"
                  ></iframe>
                </div>
                <div className="location-info">
                  <p className="mb-2"><strong>Công ty TNHH TM-DV-XNK Tân Thời Đại</strong></p>
                  <p className="mb-1">Địa chỉ: 654/1C Phạm Văn Chí, phường Bình Tiên, Tp. Hồ Chí Minh</p>
                  <p className="mb-1">Giờ mở cửa: 8:00 - 22:00</p>
                  <a 
                    href="https://maps.google.com/?q=654/1C+Ph%E1%BA%A1m+V%C4%83n+Ch%C3%AD%2C+B%C3%ACnh+Ti%C3%AAn%2C+TP.+H%E1%BB%93+Ch%C3%AD+Minh" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm mt-2"
                  >
                    Xem trên Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}


