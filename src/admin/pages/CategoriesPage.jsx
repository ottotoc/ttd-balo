import React, { useState, useEffect } from 'react'
import { admin } from '../../lib/api'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '', imageUrl: '', position: 0 })
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
    setForm({ name: '', slug: '', imageUrl: '', position: 0 })
  }

  const openCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const openEdit = (category) => {
    setEditing(category)
    setForm({
      name: category.name || '',
      slug: category.slug || '',
      imageUrl: category.imageUrl || '',
      position: category.position || 0,
    })
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'position' ? Number(value) : value }))
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
                <th>Image</th>
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
                  <td>
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>
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
                  <label>Slug</label>
                  <input
                    type="text"
                    name="slug"
                    className="form-control"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="auto from name if empty"
                  />
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

