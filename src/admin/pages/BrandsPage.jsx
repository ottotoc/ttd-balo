import React, { useState, useEffect } from 'react'
import { admin } from '../../lib/api'
import { slugify } from '../../lib/slugify'

export default function BrandsPage() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '', imageUrl: '' })
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    try {
      setLoading(true)
      const result = await admin.brands.getAll()
      setBrands(result.data || [])
    } catch (error) {
      console.error('Error loading brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEditing(null)
    setSlugManuallyEdited(false)
    setForm({ name: '', slug: '', imageUrl: '' })
  }

  const openCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const openEdit = (brand) => {
    setEditing(brand)
    setSlugManuallyEdited(true) // When editing, consider slug as manually set
    setForm({
      name: brand.name || '',
      slug: brand.slug || '',
      imageUrl: brand.imageUrl || '',
    })
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Auto-generate slug from name if slug hasn't been manually edited
    if (name === 'name' && !slugManuallyEdited) {
      const autoSlug = slugify(value)
      setForm((prev) => ({ ...prev, name: value, slug: autoSlug }))
    } else if (name === 'slug') {
      // Mark slug as manually edited if user changes it
      setSlugManuallyEdited(true)
      setForm((prev) => ({ ...prev, [name]: value }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      if (editing) {
        await admin.brands.update(editing.id, form)
      } else {
        await admin.brands.create(form)
      }
      setShowModal(false)
      resetForm()
      loadBrands()
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this brand?')) return

    try {
      await admin.brands.delete(id)
      loadBrands()
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="data-table">
        <div className="data-table-header">
          <h2>Brands</h2>
          <button className="btn btn-primary" onClick={openCreate}>Add Brand</button>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Image</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td>{brand.id}</td>
                  <td>{brand.name}</td>
                  <td>{brand.slug}</td>
                  <td>
                    {brand.imageUrl ? (
                      <img src={brand.imageUrl} alt={brand.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>
                  <td>{brand._count?.products || 0}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(brand)}>Edit</button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(brand.id)}
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

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>{editing ? 'Edit Brand' : 'Add Brand'}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Slug {!slugManuallyEdited && <span className="text-muted small">(tự động từ tên)</span>}</label>
                  <input
                    type="text"
                    name="slug"
                    className="form-control"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="Tự động tạo từ tên thương hiệu"
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
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    className="form-control"
                    value={form.imageUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
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
    </div>
  )
}

