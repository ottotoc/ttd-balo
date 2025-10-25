import React, { useState, useEffect } from 'react'
import { admin } from '../../lib/api'
import { slugify } from '../../lib/slugify'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '', position: 0 })
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const result = await admin.categories.getAll()
      setCategories(result.data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEditing(null)
    setSlugManuallyEdited(false)
    setForm({ name: '', slug: '', position: 0 })
  }

  const openCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const openEdit = (category) => {
    setEditing(category)
    setSlugManuallyEdited(true) // When editing, consider slug as manually set
    setForm({
      name: category.name || '',
      slug: category.slug || '',
      position: category.position || 0,
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
      setForm((prev) => ({ ...prev, [name]: name === 'position' ? Number(value) : value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      if (editing) {
        await admin.categories.update(editing.id, form)
      } else {
        await admin.categories.create(form)
      }
      setShowModal(false)
      resetForm()
      loadCategories()
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return

    try {
      await admin.categories.delete(id)
      loadCategories()
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="data-table">
        <div className="data-table-header">
          <h2>Categories</h2>
          <button className="btn btn-primary" onClick={openCreate}>Add Category</button>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Position</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.name}</td>
                  <td>{cat.slug}</td>
                  <td>{cat.position}</td>
                  <td>{cat._count?.products || 0}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(cat)}>Edit</button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(cat.id)}
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
              <h5>{editing ? 'Edit Category' : 'Add Category'}</h5>
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
                    placeholder="Tự động tạo từ tên danh mục"
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
                  <label>Position</label>
                  <input
                    type="number"
                    name="position"
                    className="form-control"
                    value={form.position}
                    onChange={handleChange}
                    min={0}
                  />
                  <small className="form-text text-muted">
                    Vị trí hiển thị (số nhỏ hơn sẽ hiển thị trước)
                  </small>
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

