import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { catalog } from '../lib/api'
import { getImageUrl } from '../lib/imageUtils'
import IconsSprite from '../components/layout/IconsSprite.jsx'
import OffcanvasCart from '../components/layout/OffcanvasCart.jsx'
import OffcanvasSearch from '../components/layout/OffcanvasSearch.jsx'
import Header from '../components/layout/Header.jsx'
import Footer from '../components/layout/Footer.jsx'
import ScrollToTop from '../components/ui/ScrollToTop.jsx'
import './ProductsPage.css'

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 20
  })
  
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  const { products, total, loading: productsLoading, error } = useProducts(filters)

  // Load categories and brands
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          catalog.getCategories(),
          catalog.getBrands()
        ])
        setCategories(categoriesRes.data || [])
        setBrands(brandsRes.data || [])
      } catch (err) {
        console.error('Error loading catalog:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCatalog()
  }, [])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }))
  }

  const handleSortChange = (sortField) => {
    setFilters(prev => ({
      ...prev,
      sort: sortField,
      order: prev.sort === sortField && prev.order === 'asc' ? 'desc' : 'asc',
      page: 1
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getSortText = (field) => {
    if (filters.sort !== field) return ''
    
    if (field === 'createdAt') {
      return filters.order === 'asc' ? '(cũ - mới)' : '(mới - cũ)'
    } else if (field === 'price') {
      return filters.order === 'asc' ? '(thấp - cao)' : '(cao - thấp)'
    } else if (field === 'name') {
      return filters.order === 'asc' ? '(A - Z)' : '(Z - A)'
    }
    return ''
  }

  const totalPages = Math.ceil(total / filters.limit)

  if (loading) {
    return (
      <>
        <IconsSprite />
        <OffcanvasCart />
        <OffcanvasSearch />
        <Header />
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <IconsSprite />
      <OffcanvasCart />
      <OffcanvasSearch />
      <Header />
      
      <div className="container py-5" style={{ backgroundImage: "url('/images/background-pattern.jpg')", backgroundRepeat: 'repeat', backgroundSize: 'auto', minHeight: '100vh' }}>
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h2 mb-3">Tất cả sản phẩm</h1>
            <p className="text-muted">Tìm kiếm và lọc sản phẩm theo nhu cầu của bạn</p>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row g-3">
                  {/* Search */}
                  <div className="col-md-4">
                    <label className="form-label">Tìm kiếm</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập tên sản phẩm..."
                      value={filters.q}
                      onChange={(e) => handleFilterChange('q', e.target.value)}
                    />
                  </div>

                  {/* Category */}
                  <div className="col-md-2">
                    <label className="form-label">Danh mục</label>
                    <select
                      className="form-select"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">Tất cả</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Brand */}
                  <div className="col-md-2">
                    <label className="form-label">Thương hiệu</label>
                    <select
                      className="form-select"
                      value={filters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                    >
                      <option value="">Tất cả</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.slug}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="col-md-2">
                    <label className="form-label">Giá từ</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Giá đến</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="1000000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="row mb-3">
          <div className="col-12">
            <p className="mb-0">
              Hiển thị {((filters.page - 1) * filters.limit) + 1} - {Math.min(filters.page * filters.limit, total)} 
              trong tổng số {total} sản phẩm
            </p>
          </div>
        </div>

        {/* Products Layout */}
        <div className="row">
          {/* Products Grid - Left Side */}
          <div className="col-lg-9 order-2 order-lg-1">
            {productsLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-5">
                <div className="alert alert-danger">
                  <h5>Lỗi tải dữ liệu</h5>
                  <p>{error}</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <h5>Không tìm thấy sản phẩm</h5>
                <p className="text-muted">Hãy thử thay đổi bộ lọc để tìm kiếm sản phẩm khác</p>
              </div>
            ) : (
              <div className="row g-4">
                {products.map(product => (
                  <div key={product.id} className="col-sm-6 col-md-6 col-xl-4">
                    <div className="card h-100 shadow-sm products-page-card">
                      <div className="position-relative">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={getImageUrl(product.images[0].url)}
                            alt={product.name}
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/images/product-thumb-1.png';
                            }}
                          />
                        ) : (
                          <div 
                            className="card-img-top bg-light d-flex align-items-center justify-content-center"
                            style={{ height: '200px' }}
                          >
                            <i className="fas fa-image text-muted fa-3x"></i>
                          </div>
                        )}
                        {product.featured && (
                          <span className="products-page-featured-badge">
                            Nổi bật
                          </span>
                        )}
                        <span className={`products-page-stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                        </span>
                      </div>
                      
                      <div className="card-body d-flex flex-column">
                        <div className="mb-2">
                          <span className="products-page-category-badge me-1">
                            {product.category?.name || 'N/A'}
                          </span>
                          <span className="products-page-brand-badge">
                            {product.brand?.name || 'N/A'}
                          </span>
                        </div>
                        
                        <h5 className="card-title mb-2" style={{ fontSize: '1.1rem' }}>
                          {product.name}
                        </h5>
                        
                        {product.shortDesc && (
                          <p className="card-text text-muted small mb-3" style={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {product.shortDesc}
                          </p>
                        )}
                        
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                              <strong className="products-page-price">
                                {formatPrice(product.price)}
                              </strong>
                              <div className="small text-muted">
                                SKU: <code>{product.sku}</code>
                              </div>
                            </div>
                          </div>
                          
                          <div className="d-grid gap-2">
                            <Link
                              to={`/product/${product.slug}`}
                              className="btn btn-primary"
                            >
                              <i className="fas fa-eye me-1"></i>
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sort Panel - Right Side */}
          <div className="col-lg-3 order-1 order-lg-2 mb-4 mb-lg-0">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  Sắp xếp sản phẩm
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button
                    className={`btn products-page-sort-btn ${filters.sort === 'createdAt' ? 'active' : 'btn-outline-secondary'}`}
                    onClick={() => handleSortChange('createdAt')}
                  >
                    Mới nhất {getSortText('createdAt')}
                  </button>
                  
                  <button
                    className={`btn products-page-sort-btn ${filters.sort === 'price' ? 'active' : 'btn-outline-secondary'}`}
                    onClick={() => handleSortChange('price')}
                  >
                    Giá {getSortText('price')}
                  </button>
                  
                  <button
                    className={`btn products-page-sort-btn ${filters.sort === 'name' ? 'active' : 'btn-outline-secondary'}`}
                    onClick={() => handleSortChange('name')}
                  >
                    Tên A-Z {getSortText('name')}
                  </button>
                </div>
                
                <hr />
                
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Số sản phẩm hiển thị
                  </label>
                  <select
                    className="form-select"
                    value={filters.limit}
                    onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                  >
                    <option value={10}>10 sản phẩm</option>
                    <option value={20}>20 sản phẩm</option>
                    <option value={50}>50 sản phẩm</option>
                    <option value={100}>100 sản phẩm</option>
                  </select>
                </div>
                
                <div className="text-center">
                  <small className="text-muted">
                    Hiển thị {filters.limit} sản phẩm mỗi trang
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="row mt-4">
            <div className="col-lg-9 order-2 order-lg-1">
              <nav aria-label="Products pagination">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${filters.page === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                    >
                      Trước
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first 3 pages, last 3 pages, and current page with context
                    const showPage = page <= 3 || 
                                   page >= totalPages - 2 || 
                                   Math.abs(page - filters.page) <= 1
                    
                    if (!showPage) {
                      if (page === 4 && filters.page > 5) {
                        return <li key={page} className="page-item disabled"><span className="page-link">...</span></li>
                      }
                      if (page === totalPages - 3 && filters.page < totalPages - 4) {
                        return <li key={page} className="page-item disabled"><span className="page-link">...</span></li>
                      }
                      return null
                    }
                    
                    return (
                      <li key={page} className={`page-item ${filters.page === page ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    )
                  })}
                  
                  <li className={`page-item ${filters.page === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === totalPages}
                    >
                      Sau
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-lg-3 order-1 order-lg-2"></div>
          </div>
        )}
      </div>

      <Footer />
      <ScrollToTop />
    </>
  )
}
