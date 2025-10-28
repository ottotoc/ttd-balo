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
                <h2 className="section-title display-4">Get <span className="text-primary">25% Discount</span> on your first purchase</h2>
              </div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dictumst amet, metus, sit massa posuere maecenas. At tellus ut nunc amet vel egestas.</p>
            </div>
            <div className="col-md-4 p-5">
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control form-control-lg" placeholder="Name" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control form-control-lg" placeholder="abc@mail.com" />
                </div>
                <div className="form-check form-check-inline mb-3">
                  <label className="form-check-label">
                    <input className="form-check-input" type="checkbox" value="subscribe" />
                    Subscribe to the newsletter
                  </label>
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-dark btn-lg">Submit</button>
                </div>
              </form>
            </div>
            <div className="col-md-4 p-5">
              <div className="location-section">
                <h4 className="mb-3">Vị trí cửa hàng</h4>
                <div className="map-container mb-3">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.325123456789!2d106.629123456789!3d10.776123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1234567890%3A0x1234567890abcdef!2sT%C3%A2n%20Th%E1%BB%9Di%20%C4%90%E1%BA%A1i%20Balo%20Store!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
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
                  <p className="mb-2"><strong>Tân Thời Đại Balo Store</strong></p>
                  <p className="mb-1">Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
                  <p className="mb-1">Hotline: 0123 456 789</p>
                  <p className="mb-1">Giờ mở cửa: 8:00 - 22:00</p>
                  <a 
                    href="https://maps.google.com/?q=Tân+Thời+Đại+Balo+Store" 
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


