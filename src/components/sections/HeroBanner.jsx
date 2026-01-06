import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { catalog } from '../../lib/api'
import { getImageUrl } from '../../lib/imageUtils'

export default function HeroBanner() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await catalog.getBanners('hero')
      const activeBanners = (response.data || []).filter(b => b.active)
      setBanners(activeBanners)
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to fetch banners:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-3" style={{ backgroundImage: "url('/images/background-pattern.jpg')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (banners.length === 0) {
    return null
  }

  return (
    <section className="py-3" style={{ backgroundImage: "url('/images/background-pattern.jpg')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="hero-banner-slider" style={{ borderRadius: '8px', overflow: 'hidden' }}>
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop={banners.length > 1}
                className="hero-swiper"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                {banners.map((banner) => {
                  // Lấy URL ảnh - ưu tiên dùng getImageUrl để xử lý đúng format
                  let imageUrl = banner.imageUrl
                  
                  // Nếu URL bắt đầu với /uploads/, xử lý qua getImageUrl
                  if (imageUrl && imageUrl.startsWith('/uploads/')) {
                    imageUrl = getImageUrl(imageUrl, 'web')
                  } else if (imageUrl && !imageUrl.startsWith('http')) {
                    // Nếu là relative path nhưng không có /uploads/, thêm API_URL
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
                    imageUrl = `${apiUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
                  }
                  
                  return (
                    <SwiperSlide key={banner.id}>
                      {banner.link ? (
                        <a
                          href={banner.link}
                          style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            textDecoration: 'none',
                          }}
                        >
                          <img
                            src={imageUrl}
                            alt={banner.title || 'Banner'}
                            style={{
                              width: '100%',
                              height: 'auto',
                              display: 'block',
                              objectFit: 'cover',
                            }}
                            onError={(e) => {
                              // Fallback: thử dùng URL gốc nếu getImageUrl fail
                              if (banner.imageUrl && banner.imageUrl !== imageUrl) {
                                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
                                e.target.src = banner.imageUrl.startsWith('http') 
                                  ? banner.imageUrl 
                                  : `${apiUrl}${banner.imageUrl.startsWith('/') ? '' : '/'}${banner.imageUrl}`
                              } else {
                                e.target.src = '/images/product-thumb-1.png'
                              }
                            }}
                          />
                        </a>
                      ) : (
                        <img
                          src={imageUrl}
                          alt={banner.title || 'Banner'}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            // Fallback: thử dùng URL gốc nếu getImageUrl fail
                            if (banner.imageUrl && banner.imageUrl !== imageUrl) {
                              const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
                              e.target.src = banner.imageUrl.startsWith('http') 
                                ? banner.imageUrl 
                                : `${apiUrl}${banner.imageUrl.startsWith('/') ? '' : '/'}${banner.imageUrl}`
                            } else {
                              e.target.src = '/images/product-thumb-1.png'
                            }
                          }}
                        />
                      )}
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .hero-banner-slider {
          width: 100%;
          min-height: 400px;
          max-height: 600px;
        }
        .hero-swiper {
          width: 100%;
          height: 100%;
        }
        .hero-swiper .swiper-slide {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-swiper .swiper-slide img {
          width: 100%;
          height: auto;
          max-height: 600px;
          object-fit: cover;
        }
        .hero-swiper .swiper-pagination-bullet {
          background: #fff;
          opacity: 0.5;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
        @media (max-width: 768px) {
          .hero-banner-slider {
            min-height: 250px;
            max-height: 350px;
          }
          .hero-swiper .swiper-slide img {
            max-height: 350px;
          }
        }
      `}</style>
    </section>
  )
}


