import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { catalog } from '../../lib/api'
import { getImageUrl } from '../../lib/imageUtils'
import Section from '../layout/Section.jsx'

export default function BannerSlide({ position = 'between-new' }) {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [position])

  const fetchBanners = async () => {
    try {
      const response = await catalog.getBanners(position)
      const activeBanners = (response.data || []).filter(b => b.active).sort((a, b) => a.order - b.order)
      setBanners(activeBanners)
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to fetch middle banners:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null
  }

  if (banners.length === 0) {
    return null
  }

  return (
    <Section usePattern={false}>
      <div className="banner-slide-container" style={{ marginBottom: '2rem' }}>
        <div className="banner-slide-wrapper" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={banners.length > 1}
            className="middle-banner-swiper"
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
      <style>{`
        .banner-slide-container {
          width: 100%;
        }
        .banner-slide-wrapper {
          width: 100%;
          min-height: 200px;
          max-height: 400px;
        }
        .middle-banner-swiper {
          width: 100%;
          height: 100%;
        }
        .middle-banner-swiper .swiper-slide {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .middle-banner-swiper .swiper-slide img {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: cover;
        }
        .middle-banner-swiper .swiper-pagination-bullet {
          background: #fff;
          opacity: 0.5;
        }
        .middle-banner-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
        @media (max-width: 768px) {
          .banner-slide-wrapper {
            min-height: 150px;
            max-height: 250px;
          }
          .middle-banner-swiper .swiper-slide img {
            max-height: 250px;
          }
        }
      `}</style>
    </Section>
  )
}

