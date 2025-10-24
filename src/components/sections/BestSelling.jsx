import React from 'react'
import Section from '../layout/Section.jsx'
import ProductCard from '../ui/ProductCard.jsx'
import { useProducts } from '../../hooks/useProducts'

export default function BestSelling() {
  const { products, loading, error } = useProducts({ 
    limit: 8,
    section: 'bestselling', // Filter by display section
    sort: 'createdAt', 
    order: 'desc' 
  })
  
  if (loading) {
    return (
      <Section>
        <div className="section-header d-flex flex-wrap justify-content-between my-5">
          <h2 className="section-title">Sản phẩm bán chạy</h2>
        </div>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </Section>
    )
  }
  
  if (error) {
    return (
      <Section>
        <div className="section-header d-flex flex-wrap justify-content-between my-5">
          <h2 className="section-title">Sản phẩm bán chạy</h2>
        </div>
        <div className="alert alert-danger">
          Lỗi tải sản phẩm: {error}
        </div>
      </Section>
    )
  }
  
  return (
    <Section>
      <div className="section-header d-flex flex-wrap justify-content-between my-5">
        <h2 className="section-title">Sản phẩm bán chạy</h2>
        <a href="/products" className="btn btn-primary">Xem tất cả</a>
      </div>
      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-6 col-md-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center py-5 text-muted">
          Chưa có sản phẩm nào
        </div>
      )}
    </Section>
  )
}


