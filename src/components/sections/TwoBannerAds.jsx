import React from 'react'
import Section from '../layout/Section.jsx'

export default function TwoBannerAds() {
  return (
    <Section usePattern={false}>
      <div className="row">
        <div className="col-md-6">
          <div className="banner-ad bg-danger mb-3" style={{ background: "')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right bottom' }}>
            <div className="banner-content p-5">
              <div className="categories text-primary fs-3 fw-bold">Giảm giá đến 25%</div>
              <h3 className="banner-title">Các dòng túi xách nữ thời trang</h3>
              <p>Túi xách nữ cao cấp, bảo vệ tối ưu cho đồ, laptop</p>
              <a href="#" className="btn btn-dark text-uppercase">Xem ngay</a>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="banner-ad bg-info" style={{ background: "')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right bottom' }}>
            <div className="banner-content p-5">
              <div className="categories text-primary fs-3 fw-bold">Giảm giá đến 15%</div>
              <h3 className="banner-title">Các dòng balo học sinh</h3>
              <p>Balo học sinh cao cấp, bảo vệ tối ưu cho sách vở, laptop</p>
              <a href="#" className="btn btn-dark text-uppercase">Xem ngay</a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}


