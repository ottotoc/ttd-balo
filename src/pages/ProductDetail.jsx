import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { useCart } from '../contexts/CartContext'
import { getImageUrl } from '../lib/imageUtils'
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
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)

  const handleAddToCart = async () => {
    // Nếu có variants nhưng chưa chọn đủ
    if (product?.variants && product.variants.length > 0) {
      if (!selectedColor || !selectedSize || !selectedVariant) {
        alert('Vui lòng chọn đầy đủ màu sắc và kích thước!')
        return
      }
      // Kiểm tra stock của variant
      if (selectedVariant.stock < quantity) {
        alert(`Chỉ còn ${selectedVariant.stock} sản phẩm trong kho!`)
        return
      }
    }

    try {
      setAdding(true)
      const variantId = selectedVariant?.id || null
      await addItem(product.id, variantId, quantity)
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error adding to cart:', error)
      }
      alert('Lỗi: ' + error.message)
    } finally {
      setAdding(false)
    }
  }

  const increaseQuantity = () => {
    const maxStock = selectedVariant?.stock || product?.stock || 0
    if (quantity < maxStock) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // Tính toán available colors và sizes từ variants
  const availableColors = React.useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return []
    const colors = [...new Set(product.variants.map(v => v.color).filter(Boolean))]
    return colors
  }, [product?.variants])

  const availableSizes = React.useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return []
    // Nếu đã chọn màu, chỉ hiển thị sizes của màu đó
    if (selectedColor) {
      const sizes = [...new Set(
        product.variants
          .filter(v => v.color === selectedColor && v.stock > 0)
          .map(v => v.size)
          .filter(Boolean)
      )]
      return sizes
    }
    // Nếu chưa chọn màu, hiển thị tất cả sizes có stock
    const sizes = [...new Set(
      product.variants
        .filter(v => v.stock > 0)
        .map(v => v.size)
        .filter(Boolean)
    )]
    return sizes
  }, [product?.variants, selectedColor])

  // Tìm variant dựa trên color và size đã chọn
  React.useEffect(() => {
    if (!product?.variants || product.variants.length === 0) {
      setSelectedVariant(null)
      return
    }

    if (selectedColor && selectedSize) {
      const variant = product.variants.find(
        v => v.color === selectedColor && v.size === selectedSize && v.stock > 0
      )
      setSelectedVariant(variant || null)
    } else {
      setSelectedVariant(null)
    }
  }, [product?.variants, selectedColor, selectedSize])

  // Auto-select first available color/size nếu có variants
  React.useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const firstVariant = product.variants.find(v => v.stock > 0)
      if (firstVariant) {
        if (firstVariant.color && !selectedColor) {
          setSelectedColor(firstVariant.color)
        }
        if (firstVariant.size && !selectedSize) {
          setSelectedSize(firstVariant.size)
        }
      }
    }
  }, [product?.variants])

  // Reset size khi đổi màu
  React.useEffect(() => {
    if (selectedColor) {
      setSelectedSize(null)
    }
  }, [selectedColor])

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
  const imageUrl = getImageUrl(primaryImage?.url) || '/images/product-thumb-1.png'
  
  // Calculate sale price and discount
  const hasSalePrice = product.salePrice && product.salePrice > 0 && product.salePrice < product.price
  
  // Tính stock và price hiện tại (variant hoặc product)
  const currentStock = selectedVariant?.stock ?? product?.stock ?? 0
  const currentPrice = selectedVariant?.price 
    ? Number(selectedVariant.price) 
    : (hasSalePrice ? Number(product.salePrice) : Number(product.price))
  const currentFormattedPrice = currentPrice.toLocaleString('vi-VN') + ' ₫'
  
  const displayPrice = hasSalePrice ? product.salePrice : product.price
  const formattedPrice = Number(displayPrice).toLocaleString('vi-VN') + ' ₫'
  const discountPercent = hasSalePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
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
                    src={getImageUrl(product.images?.[selectedImage]?.url) || imageUrl} 
                    alt={product.name}
                    className="img-fluid rounded"
                    onError={(e) => {
                      e.target.src = '/images/product-thumb-1.png';
                    }}
                  />
                  {hasSalePrice && (
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
                          src={getImageUrl(img.url)} 
                          alt={`${product.name} ${index + 1}`}
                          className="img-fluid rounded"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = '/images/product-thumb-1.png';
                          }}
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
                    <h2 className="price mb-0" style={{ color: '#ff6600' }}>{currentFormattedPrice}</h2>
                    {selectedVariant?.price && product.price && Number(selectedVariant.price) !== Number(product.price) && (
                      <span className="original-price text-decoration-line-through text-muted">
                        {Number(product.price).toLocaleString('vi-VN')} ₫
                      </span>
                    )}
                    {!selectedVariant && hasSalePrice && (
                      <span className="original-price text-decoration-line-through text-muted">
                        {Number(product.price).toLocaleString('vi-VN')} ₫
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

                {/* Variants Selection - Color */}
                {availableColors.length > 0 && (
                  <div className="variant-selection mb-3">
                    <label className="form-label fw-bold">Màu sắc:</label>
                    <div className="d-flex flex-wrap gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`btn ${selectedColor === color ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setSelectedColor(color)}
                          style={{
                            minWidth: '80px',
                            border: selectedColor === color ? '2px solid #ff6600' : '1px solid #dee2e6',
                            backgroundColor: selectedColor === color ? '#ff6600' : 'white',
                            color: selectedColor === color ? 'white' : '#333'
                          }}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variants Selection - Size */}
                {availableSizes.length > 0 && (
                  <div className="variant-selection mb-3">
                    <label className="form-label fw-bold">Kích thước:</label>
                    <div className="d-flex flex-wrap gap-2">
                      {availableSizes.map((size) => {
                        // Tìm variant tương ứng để check stock
                        const variantForSize = selectedColor
                          ? product.variants.find(v => v.color === selectedColor && v.size === size)
                          : product.variants.find(v => v.size === size)
                        const isOutOfStock = !variantForSize || variantForSize.stock === 0
                        
                        return (
                          <button
                            key={size}
                            type="button"
                            className={`btn ${selectedSize === size ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => !isOutOfStock && setSelectedSize(size)}
                            disabled={isOutOfStock}
                            style={{
                              minWidth: '60px',
                              border: selectedSize === size ? '2px solid #ff6600' : '1px solid #dee2e6',
                              backgroundColor: selectedSize === size ? '#ff6600' : (isOutOfStock ? '#f5f5f5' : 'white'),
                              color: selectedSize === size ? 'white' : (isOutOfStock ? '#999' : '#333'),
                              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                              opacity: isOutOfStock ? 0.5 : 1
                            }}
                            title={isOutOfStock ? 'Hết hàng' : size}
                          >
                            {size}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Stock Status */}
                <div className="stock-status mb-4">
                  {currentStock > 0 ? (
                    <div className="alert alert-success d-inline-flex align-items-center">
                      <svg width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                      </svg>
                      Còn hàng ({currentStock} sản phẩm)
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
                {currentStock > 0 && (
                  <div className="add-to-cart-section">
                    <div className="d-flex gap-3 mb-4">
                      {/* Quantity Selector */}
                      <div className="quantity-selector d-flex align-items-center">
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
                            if (val >= 1 && val <= currentStock) {
                              setQuantity(val)
                            }
                          }}
                          min="1"
                          max={currentStock}
                          style={{ width: '80px' }}
                        />
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={increaseQuantity}
                          disabled={quantity >= currentStock}
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
                      disabled={adding || (product?.variants?.length > 0 && (!selectedColor || !selectedSize))}
                      style={{ 
                        backgroundColor: '#ff6600', 
                        borderColor: '#ff6600',
                        opacity: (product?.variants?.length > 0 && (!selectedColor || !selectedSize)) ? 0.6 : 1
                      }}
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

