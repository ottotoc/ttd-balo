import React from 'react'
import Section from '../layout/Section.jsx'
import ProductCard from '../ui/ProductCard.jsx'
import { useProducts } from '../../hooks/useProducts'

export default function ProductsSection() {
  const { products, loading, error } = useProducts({ limit: 8, featured: true })
  
  if (loading) {
    return (
      <Section id="react-products" title="Sản phẩm nổi bật">
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
      <Section id="react-products" title="Sản phẩm nổi bật">
        <div className="alert alert-danger">
          Lỗi tải sản phẩm: {error}
        </div>
      </Section>
    )
  }
  
  return (
    <Section id="react-products" title="Sản phẩm nổi bật">
      <div className="row g-3">
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


