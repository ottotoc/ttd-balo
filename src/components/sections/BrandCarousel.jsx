import React, { useRef, useEffect, useState } from 'react'
import Section from '../layout/Section.jsx'
import { useBrands } from '../../hooks/useBrands'

export default function BrandCarousel() {
  const { brands, loading, error } = useBrands()
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0) // index in extended list
  const [noTransition, setNoTransition] = useState(false)

  const ITEMS_PER_VIEW = 5
  const GAP_PX = 16

  const data = Array.isArray(brands) ? brands : []
  const hasExtra = data.length > ITEMS_PER_VIEW

  const headClones = hasExtra ? data.slice(0, ITEMS_PER_VIEW) : []
  const tailClones = hasExtra ? data.slice(-ITEMS_PER_VIEW) : []
  const extended = hasExtra ? [...tailClones, ...data, ...headClones] : data

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setContainerWidth(el.clientWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [brands])

  useEffect(() => {
    if (hasExtra) {
      setCurrentIndex(ITEMS_PER_VIEW)
    } else {
      setCurrentIndex(0)
    }
  }, [hasExtra, data.length])

  const stepNext = () => setCurrentIndex((prev) => prev + 1)
  const stepPrev = () => setCurrentIndex((prev) => prev - 1)

  // Autoplay when more than 5 items
  useEffect(() => {
    if (!hasExtra) return
    const id = setInterval(() => {
      stepNext()
    }, 3000)
    return () => clearInterval(id)
  }, [hasExtra])

  const itemWidthPx = containerWidth > 0
    ? (containerWidth - (ITEMS_PER_VIEW - 1) * GAP_PX) / ITEMS_PER_VIEW
    : 0
  const stepPx = itemWidthPx + GAP_PX

  const handleTransitionEnd = () => {
    if (!hasExtra) return
    const firstReal = ITEMS_PER_VIEW
    const lastReal = ITEMS_PER_VIEW + data.length - 1

    if (currentIndex > lastReal) {
      // Jump back to equivalent real index without animation
      setNoTransition(true)
      setCurrentIndex(firstReal)
      requestAnimationFrame(() => setNoTransition(false))
    } else if (currentIndex < firstReal) {
      setNoTransition(true)
      setCurrentIndex(lastReal)
      requestAnimationFrame(() => setNoTransition(false))
    }
  }

  if (loading) {
    return (
      <Section>
        <div className="section-header d-flex flex-wrap justify-content-between mb-5">
          <h2 className="section-title">Thương hiệu nổi bật</h2>
        </div>
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </Section>
    )
  }

  if (error || data.length === 0) return null

  const itemStyle = {
    flex: '0 0 auto',
    width: itemWidthPx > 0 ? `${itemWidthPx}px` : undefined
  }

  const translateX = hasExtra
    ? -(currentIndex * stepPx)
    : 0

  return (
    <Section>
      <div className="section-header d-flex flex-wrap justify-content-between mb-4">
        <h2 className="section-title">Thương hiệu nổi bật</h2>
        <div className="d-flex align-items-center gap-2">
          {hasExtra && (
            <div className="carousel-nav d-flex gap-2">
              <button
                className="btn btn-outline-secondary btn-sm rounded-circle"
                onClick={stepPrev}
                style={{ width: '40px', height: '40px', padding: 0 }}
                aria-label="Previous"
              >
                ←
              </button>
              <button
                className="btn btn-outline-secondary btn-sm rounded-circle"
                onClick={stepNext}
                style={{ width: '40px', height: '40px', padding: 0 }}
                aria-label="Next"
              >
                →
              </button>
            </div>
          )}
          <a href="/brands" className="btn-link text-decoration-none">Xem tất cả →</a>
        </div>
      </div>

      <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          className="d-flex"
          onTransitionEnd={handleTransitionEnd}
          style={{
            columnGap: `${GAP_PX}px`,
            transform: `translateX(${translateX}px)`,
            transition: noTransition ? 'none' : 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {(hasExtra ? extended : data).map((brand, idx) => (
            <a
              key={`${brand.id}-${idx}`}
              href={`/products?brand=${brand.slug}`}
              className="text-decoration-none"
              style={itemStyle}
            >
              <div className="card h-100 text-center brand-card" style={{ border: '2px solid #f0f0f0' }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center p-3">
                  {brand.imageUrl ? (
                    <img
                      src={brand.imageUrl}
                      alt={brand.name}
                      className="img-fluid mb-2 brand-image"
                      style={{ maxHeight: '60px', objectFit: 'contain' }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center mb-2 brand-initial"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#6c757d'
                      }}
                    >
                      {brand.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <h6 className="mb-1 text-dark" style={{ fontSize: '0.9rem' }}>{brand.name}</h6>
                  
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .brand-card { transition: all 0.2s ease; }
        .brand-card:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.12); border-color: var(--bs-primary) !important; }
        .brand-card:hover .brand-image, .brand-card:hover .brand-initial { transform: scale(1.06); }
        .carousel-nav button { transition: all 0.2s ease; }
        .carousel-nav button:hover { background-color: var(--bs-primary); color: #fff; border-color: var(--bs-primary); transform: scale(1.06); }
        .carousel-nav button:active { transform: scale(0.95); }
      `}</style>
    </Section>
  )
}


