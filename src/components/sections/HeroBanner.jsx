import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'

export default function HeroBanner() {
  useEffect(() => {}, [])

  return (
    <section className="py-3" style={{ backgroundImage: "url('/images/background-pattern.jpg')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="banner-blocks">
              <div className="banner-ad large bg-info block-1">
                <Swiper modules={[Pagination]} pagination={{ clickable: true }} className="main-swiper">
                  <SwiperSlide>
                    <div className="row banner-content p-5">
                      <div className="content-wrapper col-md-7">
                        <div className="categories my-3">100% tự nhiên</div>
                        <h3 className="display-4">Ba lô đa năng</h3>
                        <p> Balo đa năng cao cấp, bảo vệ tối ưu cho đồ dùng, laptop</p>
                        <a href="#" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 px-4 py-3 mt-3">Xem ngay</a>
                      </div>
                      <div className="img-wrapper col-md-5">
                        <img src="/images/product-thumb-1.png" alt="Balo đa năng" className="img-fluid" />
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="row banner-content p-5">
                      <div className="content-wrapper col-md-7">
                        <div className="categories mb-3 pb-3">100% natural</div>
                        <h3 className="banner-title">Balo học sinh</h3>
                        <p>Balo học sinh cao cấp, đa năng tối ưu cho sách vở và đồ dùng học tập</p>
                        <a href="#" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1">Xem ngay</a>
                      </div>
                      <div className="img-wrapper col-md-5">
                        <img src="/images/product-thumb-1.png" alt="Balo học sinh" className="img-fluid" />
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="row banner-content p-5">
                      <div className="content-wrapper col-md-7">
                        <div className="categories mb-3 pb-3">100% natural</div>
                        <h3 className="banner-title">Balo du lịch</h3>
                        <p>Đồng hành cùng bạn trên những chuyến đi xa</p>
                        <a href="#" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1">Xem ngay</a>
                      </div>
                      <div className="img-wrapper col-md-5">
                        <img src="/images/product-thumb-1.png" alt="Balo du lịch" className="img-fluid" />
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
              <div className="banner-ad bg-success-subtle block-2" style={{ background: "url('') no-repeat", backgroundPosition: 'right bottom' }}>
                <div className="row banner-content p-5">
                  <div className="content-wrapper col-md-7">
                    <div className="categories sale mb-3 pb-3">20% off</div>
                    <h3 className="banner-title">Túi chéo và túi đeo hông</h3>
                    <a href="#" className="d-flex align-items-center nav-link">Shop Collection <svg width="24" height="24"><use xlinkHref="#arrow-right"></use></svg></a>
                  </div>
                </div>
              </div>
              <div className="banner-ad bg-danger block-3" style={{ background: "url('') no-repeat", backgroundPosition: 'right bottom' }}>
                <div className="row banner-content p-5">
                  <div className="content-wrapper col-md-7">
                    <div className="categories sale mb-3 pb-3">15% off</div>
                    <h3 className="item-title">Vali du lịch</h3>
                    <a href="#" className="d-flex align-items-center nav-link">Shop Collection <svg width="24" height="24"><use xlinkHref="#arrow-right"></use></svg></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


