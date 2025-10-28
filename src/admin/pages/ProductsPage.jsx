import React, { useState, useEffect } from 'react'
import { products, catalog } from '../../lib/api'
import ImageUpload from '../components/ImageUpload'
import { slugify } from '../../lib/slugify'

const DISPLAY_SECTIONS = [
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'justarrived', label: 'Just Arrived' },
  { value: 'mostpopular', label: 'Most Popular' },
  { value: 'featured', label: 'Featured' },
]

export default function ProductsPage() {
  const [productList, setProductList] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showSectionsModal, setShowSectionsModal] = useState(false)

  // Create/Edit product modal state
  const [showFormModal, setShowFormModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    sku: '',
    price: 0,
    salePrice: 0,
    stock: 0,
    categoryId: '',
    brandId: '',
    imageUrl: '',
    shortDesc: '',
    description: '',
    featured: false,
    published: true,
  })
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  useEffect(() => {
    loadProducts()
  }, [page])

  useEffect(() => {
    // Preload categories and brands for the form
    const loadMeta = async () => {
      try {
        const [cRes, bRes] = await Promise.all([
          catalog.getCategories(),
          catalog.getBrands(),
        ])
        setCategories(cRes.data || [])
        setBrands(bRes.data || [])
      } catch (e) {
        console.error('Error loading meta:', e)
      }
    }
    loadMeta()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const result = await products.getAll({ page, limit: 20 })
      setProductList(result.data?.items || [])
      setTotal(result.data?.pagination?.total || 0)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setSlugManuallyEdited(false)
    setForm({
      name: '',
      slug: '',
      sku: '',
      price: 0,
      salePrice: 0,
      stock: 0,
      categoryId: '',
      brandId: '',
      imageUrl: '',
      shortDesc: '',
      description: '',
      featured: false,
      published: true,
    })
  }

  const openCreate = () => {
    resetForm()
    setShowFormModal(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setSlugManuallyEdited(true) // When editing, consider slug as manually set
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      sku: product.sku || '',
      price: Number(product.price) || 0,
      salePrice: Number(product.salePrice) || 0,
      stock: product.stock || 0,
      categoryId: product.category?.id || '',
      brandId: product.brand?.id || '',
      imageUrl: product.images?.[0]?.url || '',
      shortDesc: product.shortDesc || '',
      description: product.description || '',
      featured: !!product.featured,
      published: !!product.published,
    })
    setShowFormModal(true)
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    let val = value
    if (type === 'checkbox') {
      val = checked
    } else if (name === 'price' || name === 'salePrice' || name === 'stock') {
      val = Number(value)
    } else if (name === 'categoryId' || name === 'brandId') {
      val = value ? Number(value) : ''
    }
    
    // Auto-generate slug from name if slug hasn't been manually edited
    if (name === 'name' && !slugManuallyEdited) {
      const autoSlug = slugify(value)
      setForm((prev) => ({ ...prev, name: val, slug: autoSlug }))
    } else if (name === 'slug') {
      // Mark slug as manually edited if user changes it
      setSlugManuallyEdited(true)
      setForm((prev) => ({ ...prev, [name]: val }))
    } else {
      setForm((prev) => ({ ...prev, [name]: val }))
    }
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    
    // Validate image
    if (!form.imageUrl) {
      alert('⚠️ Vui lòng upload ảnh sản phẩm')
      return
    }
    
    try {
      setSaving(true)
      const payload = {
        name: form.name,
        slug: form.slug || undefined,
        sku: form.sku,
        price: Number(form.price),
        salePrice: form.salePrice > 0 ? Number(form.salePrice) : null,
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
        brandId: Number(form.brandId),
        shortDesc: form.shortDesc || undefined,
        description: form.description || undefined,
        featured: !!form.featured,
        published: !!form.published,
        // Thêm images array
        images: form.imageUrl ? [{ url: form.imageUrl, isPrimary: true, position: 0 }] : undefined,
      }

      if (editingProduct) {
        await products.update(editingProduct.id, payload)
      } else {
        await products.create(payload)
      }

      setShowFormModal(false)
      resetForm()
      loadProducts()
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await products.delete(id)
      loadProducts()
    } catch (error) {
      alert('Error deleting product: ' + error.message)
    }
  }

  const handleEditSections = (product) => {
    setEditingProduct({
      ...product,
      displaySections: product.displaySections || []
    })
    setShowSectionsModal(true)
  }

  const handleToggleSection = (sectionValue) => {
    setEditingProduct(prev => {
      const sections = prev.displaySections || []
      const exists = sections.includes(sectionValue)
      
      return {
        ...prev,
        displaySections: exists
          ? sections.filter(s => s !== sectionValue)
          : [...sections, sectionValue]
      }
    })
  }

  const handleSaveSections = async () => {
    try {
      await products.update(editingProduct.id, {
        displaySections: editingProduct.displaySections
      })
      setShowSectionsModal(false)
      setEditingProduct(null)
      loadProducts()
      alert('Cập nhật thành công!')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  if (loading) {
    return <div>Loading products...</div>
  }

  return (
    <div>
      <div className="data-table">
        <div className="data-table-header">
          <h2>Products ({total})</h2>
          <button className="btn btn-primary" onClick={openCreate}>Add Product</button>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Display Sections</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>
                    <div>
                      {product.salePrice ? (
                        <>
                          <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85em' }}>
                            {Number(product.price).toLocaleString('vi-VN')} ₫
                          </div>
                          <div style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                            {Number(product.salePrice).toLocaleString('vi-VN')} ₫
                          </div>
                        </>
                      ) : (
                        <div>{Number(product.price).toLocaleString('vi-VN')} ₫</div>
                      )}
                    </div>
                  </td>
                  <td>{product.stock}</td>
                  <td>{product.category?.name}</td>
                  <td>{product.brand?.name}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {product.displaySections?.length > 0 ? (
                        product.displaySections.map(section => (
                          <span key={section} className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                            {DISPLAY_SECTIONS.find(s => s.value === section)?.label || section}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted small">None</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${product.published ? 'badge-success' : 'badge-warning'}`}>
                      {product.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditSections(product)}
                      >
                        Sections
                      </button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => openEdit(product)}>Edit</button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination mt-3">
        <button
          className="page-link"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="page-link active">{page}</span>
        <button
          className="page-link"
          disabled={productList.length < 20}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Modal for create/edit product */}
      {showFormModal && (
        <div className="modal-backdrop" onClick={() => setShowFormModal(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>{editingProduct ? 'Edit Product' : 'Add Product'}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowFormModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitForm}>
              <div className="modal-body">
                {/* Image Upload - Full Width */}
                <div className="form-group-full">
                  <ImageUpload
                    value={form.imageUrl}
                    onChange={(url) => setForm(prev => ({ ...prev, imageUrl: url }))}
                    label="Ảnh sản phẩm"
                    required={true}
                  />
                </div>
                
                {/* Form Grid - 2 Columns */}
                <div className="form-grid">
                  {/* Name - Full Width */}
                  <div className="form-group form-group-full">
                    <label>Tên sản phẩm <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="Nhập tên sản phẩm"
                      required
                    />
                  </div>
                  
                  {/* Slug - Full Width */}
                  <div className="form-group form-group-full">
                    <label>Slug {!slugManuallyEdited && <span className="text-muted small">(tự động từ tên)</span>}</label>
                    <input
                      type="text"
                      name="slug"
                      className="form-control"
                      value={form.slug}
                      onChange={handleFormChange}
                      placeholder="Tự động tạo từ tên sản phẩm"
                      style={{ 
                        backgroundColor: !slugManuallyEdited ? '#f8f9fa' : 'white',
                        fontStyle: !slugManuallyEdited ? 'italic' : 'normal'
                      }}
                    />
                    <small className="form-text text-muted">
                      {slugManuallyEdited 
                        ? 'Bạn đã tùy chỉnh slug thủ công' 
                        : '✨ Slug sẽ tự động cập nhật khi bạn nhập tên'}
                    </small>
                  </div>
                  
                  {/* SKU */}
                  <div className="form-group">
                    <label>SKU <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="sku"
                      className="form-control"
                      value={form.sku}
                      onChange={handleFormChange}
                      placeholder="Mã sản phẩm"
                      required
                    />
                  </div>
                  
                  {/* Price */}
                  <div className="form-group">
                    <label>Giá gốc (₫) <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      value={form.price}
                      onChange={handleFormChange}
                      min={0}
                      step={1000}
                      placeholder="0"
                      required
                    />
                  </div>

                  {/* Sale Price */}
                  <div className="form-group">
                    <label>Giá sale (₫)</label>
                    <input
                      type="number"
                      name="salePrice"
                      className="form-control"
                      value={form.salePrice}
                      onChange={handleFormChange}
                      min={0}
                      step={1000}
                      placeholder="Để trống nếu không sale"
                    />
                    <small className="form-text text-muted">
                      Để trống nếu sản phẩm không có giá sale
                    </small>
                  </div>
                  
                  {/* Stock */}
                  <div className="form-group">
                    <label>Tồn kho <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      name="stock"
                      className="form-control"
                      value={form.stock}
                      onChange={handleFormChange}
                      min={0}
                      placeholder="0"
                      required
                    />
                  </div>
                  
                  {/* Category */}
                  <div className="form-group">
                    <label>Danh mục <span className="text-danger">*</span></label>
                    <select
                      name="categoryId"
                      className="form-control"
                      value={form.categoryId}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Brand */}
                  <div className="form-group">
                    <label>Thương hiệu <span className="text-danger">*</span></label>
                    <select
                      name="brandId"
                      className="form-control"
                      value={form.brandId}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">-- Chọn thương hiệu --</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Short Description - Full Width */}
                  <div className="form-group form-group-full">
                    <label>Mô tả ngắn</label>
                    <textarea
                      name="shortDesc"
                      className="form-control"
                      value={form.shortDesc}
                      onChange={handleFormChange}
                      placeholder="Mô tả ngắn gọn về sản phẩm (hiển thị trong card)"
                      rows={2}
                    />
                    <small className="form-text text-muted">
                      Tối đa 150 ký tự, hiển thị trên card sản phẩm
                    </small>
                  </div>
                  
                  {/* Description - Full Width */}
                  <div className="form-group form-group-full">
                    <label>Mô tả chi tiết</label>
                    <textarea
                      name="description"
                      className="form-control textarea-lg"
                      value={form.description}
                      onChange={handleFormChange}
                      placeholder="Mô tả chi tiết về sản phẩm"
                      rows={4}
                    />
                    <small className="form-text text-muted">
                      Thông tin chi tiết về sản phẩm (hiển thị trên trang chi tiết)
                    </small>
                  </div>
                  
                  {/* Checkboxes - Full Width */}
                  <div className="form-group form-group-full" style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                    <label className="d-flex align-items-center" style={{ gap: 8, cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        name="featured" 
                        checked={form.featured} 
                        onChange={handleFormChange}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>
                        <strong>Featured</strong>
                        <small className="d-block text-muted">Hiển thị trong mục nổi bật</small>
                      </span>
                    </label>
                    <label className="d-flex align-items-center" style={{ gap: 8, cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        name="published" 
                        checked={form.published} 
                        onChange={handleFormChange}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>
                        <strong>Published</strong>
                        <small className="d-block text-muted">Công khai sản phẩm</small>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowFormModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for editing display sections */}
      {showSectionsModal && editingProduct && (
        <div className="modal-backdrop" onClick={() => setShowSectionsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Chọn vị trí hiển thị</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowSectionsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <h6 className="mb-3">{editingProduct.name}</h6>
              <p className="text-muted small mb-3">
                Chọn các vị trí mà sản phẩm này sẽ xuất hiện trên trang chủ
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {DISPLAY_SECTIONS.map(section => (
                  <label 
                    key={section.value} 
                    className="d-flex align-items-center"
                    style={{ cursor: 'pointer', padding: '8px', borderRadius: '4px', border: '1px solid #dee2e6' }}
                  >
                    <input
                      type="checkbox"
                      checked={editingProduct.displaySections?.includes(section.value) || false}
                      onChange={() => handleToggleSection(section.value)}
                      style={{ marginRight: '8px', width: '18px', height: '18px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{section.label}</div>
                      <small className="text-muted">
                        {section.value === 'bestselling' && 'Hiển thị trong mục "Sản phẩm bán chạy"'}
                        {section.value === 'justarrived' && 'Hiển thị trong mục "Sản phẩm mới về"'}
                        {section.value === 'mostpopular' && 'Hiển thị trong mục "Sản phẩm phổ biến"'}
                        {section.value === 'featured' && 'Hiển thị trong mục "Sản phẩm nổi bật"'}
                      </small>
                    </div>
                  </label>
                ))}
              </div>

              <div className="alert alert-info mt-3" style={{ fontSize: '0.9rem' }}>
                <strong>Lưu ý:</strong> Sản phẩm có thể xuất hiện ở nhiều vị trí cùng lúc
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowSectionsModal(false)}
              >
                Hủy
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSaveSections}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
