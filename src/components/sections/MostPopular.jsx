import React from 'react'
import Section from '../layout/Section.jsx'
import ProductCard from '../ui/ProductCard.jsx'
import { useProducts } from '../../hooks/useProducts'

export default function MostPopular() {
  const { products, loading, error } = useProducts({ 
    limit: 8,
    section: 'mostpopular' // Filter by display section
  })
  
  if (loading) {
    return (
      <Section usePattern={false}>
        <div className="section-header d-flex justify-content-between">
          <h2 className="section-title">Sản phẩm phổ biến</h2>
        </div>
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </Section>
    )
  }
  
  if (error) return null
  
  return (
    <Section usePattern={false}>
      <div className="section-header d-flex justify-content-between mb-4">
        <h2 className="section-title">Sản phẩm phổ biến</h2>
        <a href="/products" className="btn btn-outline-primary btn-sm">Xem tất cả</a>
      </div>
      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-6 col-md-3">
            <ProductCard product={product} showBadge={true} badgeText="PHỔ BIẾN" />
          </div>
        ))}
      </div>
    </Section>
  )
}


