import React, { useState, useEffect } from 'react'
import { products, catalog } from '../../lib/api'

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
    stock: 0,
    categoryId: '',
    brandId: '',
    featured: false,
    published: true,
  })
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
    setForm({
      name: '',
      slug: '',
      sku: '',
      price: 0,
      stock: 0,
      categoryId: '',
      brandId: '',
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
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      sku: product.sku || '',
      price: Number(product.price) || 0,
      stock: product.stock || 0,
      categoryId: product.category?.id || '',
      brandId: product.brand?.id || '',
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
    } else if (name === 'price' || name === 'stock') {
      val = Number(value)
    } else if (name === 'categoryId' || name === 'brandId') {
      val = value ? Number(value) : ''
    }
    setForm((prev) => ({ ...prev, [name]: val }))
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = {
        name: form.name,
        slug: form.slug || undefined,
        sku: form.sku,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
        brandId: Number(form.brandId),
        featured: !!form.featured,
        published: !!form.published,
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
                  <td>{Number(product.price).toLocaleString('vi-VN')} ₫</td>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Slug</label>
                  <input
                    type="text"
                    name="slug"
                    className="form-control"
                    value={form.slug}
                    onChange={handleFormChange}
                    placeholder="auto from name if empty"
                  />
                </div>
                <div className="form-group">
                  <label>SKU</label>
                  <input
                    type="text"
                    name="sku"
                    className="form-control"
                    value={form.sku}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-row" style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Price (₫)</label>
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      value={form.price}
                      onChange={handleFormChange}
                      min={0}
                      step={1000}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      className="form-control"
                      value={form.stock}
                      onChange={handleFormChange}
                      min={0}
                      required
                    />
                  </div>
                </div>
                <div className="form-row" style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Category</label>
                    <select
                      name="categoryId"
                      className="form-control"
                      value={form.categoryId}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Brand</label>
                    <select
                      name="brandId"
                      className="form-control"
                      value={form.brandId}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select brand</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row" style={{ display: 'flex', gap: 12 }}>
                  <label className="d-flex align-items-center" style={{ gap: 8 }}>
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleFormChange} />
                    Featured
                  </label>
                  <label className="d-flex align-items-center" style={{ gap: 8 }}>
                    <input type="checkbox" name="published" checked={form.published} onChange={handleFormChange} />
                    Published
                  </label>
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
