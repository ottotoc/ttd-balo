import React, { useState, useEffect } from 'react'
import { discounts, products as productsApi, catalog } from '../../lib/api'

export default function DiscountsPage() {
  const [discountList, setDiscountList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)

  // Form state
  const [form, setForm] = useState({
    code: '',
    type: 'PERCENT',
    value: 0,
    minOrder: '',
    startAt: '',
    endAt: '',
    usageLimit: '',
    active: true,
    productIds: [],
    categoryIds: [],
  })

  const [allProducts, setAllProducts] = useState([])
  const [allCategories, setAllCategories] = useState([])

  useEffect(() => {
    loadDiscounts()
  }, [])

  useEffect(() => {
    // Load products and categories for selection (first 200 for simplicity)
    const loadMeta = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          productsApi.getAll({ limit: 200 }),
          catalog.getCategories(),
        ])
        setAllProducts(pRes.data?.items || [])
        setAllCategories(cRes.data || [])
      } catch (e) {
        console.error('Error loading products/categories:', e)
      }
    }
    loadMeta()
  }, [])

  const loadDiscounts = async () => {
    try {
      setLoading(true)
      const result = await discounts.getAll()
      setDiscountList(result.data?.items || [])
    } catch (error) {
      console.error('Error loading discounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEditing(null)
    setForm({
      code: '',
      type: 'PERCENT',
      value: 0,
      minOrder: '',
      startAt: '',
      endAt: '',
      usageLimit: '',
      active: true,
      productIds: [],
      categoryIds: [],
    })
  }

  const openCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const openEdit = (discount) => {
    setEditing(discount)
    setForm({
      code: discount.code || '',
      type: discount.type || 'PERCENT',
      value: discount.value || 0,
      minOrder: discount.minOrder || '',
      startAt: discount.startAt ? discount.startAt.substring(0, 10) : '',
      endAt: discount.endAt ? discount.endAt.substring(0, 10) : '',
      usageLimit: discount.usageLimit || '',
      active: !!discount.active,
      productIds: (discount.products || []).map(p => p.productId || p.product?.id).filter(Boolean),
      categoryIds: (discount.categories || []).map(c => c.categoryId || c.category?.id).filter(Boolean),
    })
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let val = value
    if (type === 'checkbox') val = checked
    if (['value', 'usageLimit'].includes(name)) val = value === '' ? '' : Number(value)
    if (name === 'minOrder') val = value === '' ? '' : Number(value)
    setForm(prev => ({ ...prev, [name]: val }))
  }

  const toggleArray = (field, id) => {
    setForm(prev => {
      const list = new Set(prev[field])
      if (list.has(id)) list.delete(id)
      else list.add(id)
      return { ...prev, [field]: Array.from(list) }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrder: form.minOrder === '' ? null : Number(form.minOrder),
        startAt: form.startAt || null,
        endAt: form.endAt || null,
        usageLimit: form.usageLimit === '' ? null : Number(form.usageLimit),
        active: !!form.active,
        productIds: form.productIds,
        categoryIds: form.categoryIds,
      }

      if (editing) {
        await discounts.update(editing.id, payload)
      } else {
        await discounts.create(payload)
      }

      setShowModal(false)
      resetForm()
      loadDiscounts()
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this discount?')) return
    try {
      await discounts.delete(id)
      loadDiscounts()
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="data-table">
        <div className="data-table-header">
          <h2>Discount Codes</h2>
          <button className="btn btn-primary" onClick={openCreate}>Add Discount</button>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Used</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discountList.map((discount) => (
                <tr key={discount.id}>
                  <td><strong>{discount.code}</strong></td>
                  <td>{discount.type}</td>
                  <td>
                    {discount.type === 'PERCENT' ? `${discount.value}%` : `${discount.value.toLocaleString('vi-VN')} ₫`}
                  </td>
                  <td>{discount.used} / {discount.usageLimit || '∞'}</td>
                  <td>
                    <span className={`badge ${discount.active ? 'badge-success' : 'badge-danger'}`}>
                      {discount.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(discount)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(discount.id)}>Delete</button>
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
              <h5>{editing ? 'Edit Discount' : 'Add Discount'}</h5>
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
                <div className="form-row" style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Code</label>
                    <input
                      type="text"
                      name="code"
                      className="form-control"
                      value={form.code}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ width: 180 }}>
                    <label>Type</label>
                    <select name="type" className="form-control" value={form.type} onChange={handleChange}>
                      <option value="PERCENT">PERCENT</option>
                      <option value="FIXED">FIXED</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ width: 180 }}>
                    <label>Value</label>
                    <input type="number" name="value" className="form-control" value={form.value} onChange={handleChange} min={0} />
                  </div>
                </div>
                <div className="form-row" style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ width: 200 }}>
                    <label>Min Order (₫)</label>
                    <input type="number" name="minOrder" className="form-control" value={form.minOrder} onChange={handleChange} min={0} step={1000} />
                  </div>
                  <div className="form-group" style={{ width: 200 }}>
                    <label>Usage Limit</label>
                    <input type="number" name="usageLimit" className="form-control" value={form.usageLimit} onChange={handleChange} min={0} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ margin: 0 }}>Active</label>
                    <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row" style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ width: 200 }}>
                    <label>Start Date</label>
                    <input type="date" name="startAt" className="form-control" value={form.startAt} onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ width: 200 }}>
                    <label>End Date</label>
                    <input type="date" name="endAt" className="form-control" value={form.endAt} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row" style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Apply to Products</label>
                    <div className="chip-list" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {allProducts.map(p => (
                        <label key={p.id} className="chip" style={{ border: '1px solid #dee2e6', borderRadius: 16, padding: '4px 10px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={form.productIds.includes(p.id)} onChange={() => toggleArray('productIds', p.id)} style={{ marginRight: 6 }} />
                          {p.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-row" style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Apply to Categories</label>
                    <div className="chip-list" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {allCategories.map(c => (
                        <label key={c.id} className="chip" style={{ border: '1px solid #dee2e6', borderRadius: 16, padding: '4px 10px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={form.categoryIds.includes(c.id)} onChange={() => toggleArray('categoryIds', c.id)} style={{ marginRight: 6 }} />
                          {c.name}
                        </label>
                      ))}
                    </div>
                  </div>
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

