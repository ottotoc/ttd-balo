import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'

export default function ProductsCarousel({ items }) {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      slidesPerView={5}
      spaceBetween={30}
      breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 3 }, 991: { slidesPerView: 4 }, 1500: { slidesPerView: 6 } }}
      className="products-carousel"
    >
      {items.map((p) => (
        <SwiperSlide key={p.title}>
          <div className="product-item">
            {p.badge && <span className="badge bg-success position-absolute m-3">{p.badge}</span>}
            <a href="#" className="btn-wishlist"><svg width="24" height="24"><use xlinkHref="#heart"></use></svg></a>
            <figure>
              <a href="#" title={p.title}>
                <img src={p.img} className="tab-image" />
              </a>
            </figure>
            <h3>{p.title}</h3>
            {p.unit && <span className="qty">{p.unit}</span>}<span className="rating"><svg width="24" height="24" className="text-primary"><use xlinkHref="#star-solid"></use></svg> 4.5</span>
            <span className="price">{p.price}</span>
            <div className="d-flex align-items-center justify-content-between">
              <div className="input-group product-qty">
                <span className="input-group-btn">
                  <button type="button" className="quantity-left-minus btn btn-danger btn-number" data-type="minus">
                    <svg width="16" height="16"><use xlinkHref="#minus"></use></svg>
                  </button>
                </span>
                <input type="text" name="quantity" className="form-control input-number" defaultValue="1" />
                <span className="input-group-btn">
                  <button type="button" className="quantity-right-plus btn btn-success btn-number" data-type="plus">
                    <svg width="16" height="16"><use xlinkHref="#plus"></use></svg>
                  </button>
                </span>
              </div>
              <a href="#" className="nav-link">Add to Cart</a>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}


