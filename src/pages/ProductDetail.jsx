import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { useCart } from '../contexts/CartContext'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import OffcanvasCart from '../components/layout/OffcanvasCart'
import OffcanvasSearch from '../components/layout/OffcanvasSearch'
import IconsSprite from '../components/layout/IconsSprite'

export default function ProductDetail() {
  const { slug } = useParams()
  const { product, loading, error } = useProduct(slug)
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const handleAddToCart = async () => {
    try {
      setAdding(true)
      await addItem(product.id, null, quantity)
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`)
      // Optionally: Show toast or update cart UI
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Lỗi: ' + error.message)
    } finally {
      setAdding(false)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product?.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (loading) {
    return (
      <>
        <IconsSprite />
        <OffcanvasCart />
        <OffcanvasSearch />
        <Header />
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải sản phẩm...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <IconsSprite />
        <OffcanvasCart />
        <OffcanvasSearch />
        <Header />
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4>Không tìm thấy sản phẩm</h4>
            <p>{error || 'Sản phẩm không tồn tại'}</p>
            <Link to="/" className="btn btn-primary">Về trang chủ</Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
  const imageUrl = primaryImage?.url || '/images/product-thumb-1.png'
  const formattedPrice = Number(product.price).toLocaleString('vi-VN') + ' ₫'
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <>
      <IconsSprite />
      <OffcanvasCart />
      <OffcanvasSearch />
      <Header />
      
      <section className="product-detail-section py-5">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
              {product.category && (
                <li className="breadcrumb-item">
                  <Link to={`/products?category=${product.category.slug}`}>
                    {product.category.name}
                  </Link>
                </li>
              )}
              <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
            </ol>
          </nav>

          {/* Product Detail */}
          <div className="row g-5">
            {/* Image Gallery */}
            <div className="col-lg-6">
              <div className="product-images">
                {/* Main Image */}
                <div className="main-image mb-3">
                  <img 
                    src={product.images?.[selectedImage]?.url || imageUrl} 
                    alt={product.name}
                    className="img-fluid rounded"
                    style={{ width: '100%', objectFit: 'cover', maxHeight: '600px' }}
                  />
                  {hasDiscount && (
                    <div className="badge-discount">-{discountPercent}%</div>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="thumbnails d-flex gap-2">
                    {product.images.map((img, index) => (
                      <div 
                        key={index}
                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                        onClick={() => setSelectedImage(index)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img 
                          src={img.url} 
                          alt={`${product.name} ${index + 1}`}
                          className="img-fluid rounded"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="col-lg-6">
              <div className="product-info">
                {/* Category & Brand */}
                <div className="d-flex gap-3 mb-3">
                  {product.category && (
                    <span className="badge bg-light text-dark">{product.category.name}</span>
                  )}
                  {product.brand && (
                    <span className="badge bg-secondary">{product.brand.name}</span>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="product-title mb-3">{product.name}</h1>

                {/* Rating */}
                {product.rating && (
                  <div className="rating mb-3">
                    <div className="d-flex align-items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          width="20" 
                          height="20" 
                          fill={i < Math.floor(product.rating) ? '#FFC43F' : '#E0E0E0'}
                          viewBox="0 0 16 16"
                        >
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                      ))}
                      <span className="ms-2 text-muted">({product.reviewCount || 0} đánh giá)</span>
                    </div>
                  </div>
                )}

                {/* SKU */}
                <div className="mb-3">
                  <span className="text-muted">SKU: </span>
                  <span className="fw-bold">{product.sku}</span>
                </div>

                {/* Price */}
                <div className="product-price mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <h2 className="price mb-0">{formattedPrice}</h2>
                    {hasDiscount && (
                      <span className="original-price text-decoration-line-through text-muted">
                        {Number(product.originalPrice).toLocaleString('vi-VN')} ₫
                      </span>
                    )}
                  </div>
                </div>

                {/* Short Description */}
                {product.shortDesc && (
                  <div className="short-desc mb-4">
                    <p className="text-muted">{product.shortDesc}</p>
                  </div>
                )}

                {/* Stock Status */}
                <div className="stock-status mb-4">
                  {product.stock > 0 ? (
                    <div className="alert alert-success d-inline-flex align-items-center">
                      <svg width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                      </svg>
                      Còn hàng ({product.stock} sản phẩm)
                    </div>
                  ) : (
                    <div className="alert alert-danger d-inline-flex align-items-center">
                      <svg width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                      </svg>
                      Hết hàng
                    </div>
                  )}
                </div>

                {/* Quantity & Add to Cart */}
                {product.stock > 0 && (
                  <div className="add-to-cart-section">
                    <div className="d-flex gap-3 mb-4">
                      {/* Quantity Selector */}
                      <div className="quantity-selector">
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={decreaseQuantity}
                          disabled={quantity <= 1}
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                          </svg>
                        </button>
                        <input 
                          type="number" 
                          className="form-control text-center" 
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1
                            if (val >= 1 && val <= product.stock) {
                              setQuantity(val)
                            }
                          }}
                          min="1"
                          max={product.stock}
                          style={{ width: '80px' }}
                        />
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={increaseQuantity}
                          disabled={quantity >= product.stock}
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      className="btn btn-primary btn-lg w-100"
                      onClick={handleAddToCart}
                      disabled={adding}
                    >
                      {adding ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Đang thêm...
                        </>
                      ) : (
                        <>
                          <svg width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                          </svg>
                          Thêm vào giỏ hàng
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="row mt-5">
              <div className="col-12">
                <div className="product-description">
                  <h3 className="mb-4">Mô tả sản phẩm</h3>
                  <div className="description-content">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{product.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}

