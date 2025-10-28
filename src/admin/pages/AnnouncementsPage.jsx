import React, { useState, useEffect } from 'react'
import { admin } from '../../lib/api'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    text: '',
    active: true,
    position: 0,
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await admin.announcements.getAll()
      setAnnouncements(response.data.announcements)
      setError(null)
    } catch (err) {
      setError('Failed to fetch announcements')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        // Update
        await admin.announcements.update(editingId, formData)
      } else {
        // Create
        await admin.announcements.create(formData)
      }
      
      setFormData({ text: '', active: true, position: 0 })
      setEditingId(null)
      fetchAnnouncements()
    } catch (err) {
      setError('Failed to save announcement')
      console.error(err)
    }
  }

  const handleEdit = (announcement) => {
    setEditingId(announcement.id)
    setFormData({
      text: announcement.text,
      active: announcement.active,
      position: announcement.position,
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return
    }

    try {
      await admin.announcements.delete(id)
      fetchAnnouncements()
    } catch (err) {
      setError('Failed to delete announcement')
      console.error(err)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ text: '', active: true, position: 0 })
  }

  const toggleActive = async (id, currentActive) => {
    try {
      await admin.announcements.update(id, { active: !currentActive })
      fetchAnnouncements()
    } catch (err) {
      setError('Failed to toggle announcement status')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-0">📢 Announcement Bar Management</h2>
          <p className="text-muted">Quản lý nội dung thanh thông báo trên website</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Form */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                {editingId ? '✏️ Edit Announcement' : '➕ Add New Announcement'}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Text Content *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.text}
                    onChange={(e) =>
                      setFormData({ ...formData, text: e.target.value })
                    }
                    placeholder="🎉 SALE OFF TỚI 50% TẤT CẢ SẢN PHẨM..."
                    required
                  />
                  <small className="text-muted">
                    Nhập nội dung thông báo (có thể dùng emoji)
                  </small>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Position (Order)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          position: parseInt(e.target.value),
                        })
                      }
                      min="0"
                    />
                    <small className="text-muted">
                      Thứ tự hiển thị (số nhỏ hơn hiển thị trước)
                    </small>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) =>
                          setFormData({ ...formData, active: e.target.checked })
                        }
                        style={{ cursor: 'pointer' }}
                      />
                      <label className="form-check-label">
                        {formData.active ? '✅ Active' : '❌ Inactive'}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingId ? '💾 Update' : '➕ Create'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      ❌ Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">📋 All Announcements</h5>
            </div>
            <div className="card-body p-0">
              {announcements.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <p>No announcements yet. Create your first one!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '50px' }}>ID</th>
                        <th>Text</th>
                        <th style={{ width: '100px' }}>Position</th>
                        <th style={{ width: '100px' }}>Status</th>
                        <th style={{ width: '150px' }}>Created</th>
                        <th style={{ width: '200px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {announcements.map((announcement) => (
                        <tr key={announcement.id}>
                          <td>{announcement.id}</td>
                          <td>
                            <div
                              style={{
                                maxWidth: '500px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {announcement.text}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {announcement.position}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`btn btn-sm ${
                                announcement.active
                                  ? 'btn-success'
                                  : 'btn-secondary'
                              }`}
                              onClick={() =>
                                toggleActive(announcement.id, announcement.active)
                              }
                            >
                              {announcement.active ? '✅ Active' : '❌ Inactive'}
                            </button>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(announcement.createdAt).toLocaleDateString(
                                'vi-VN'
                              )}
                            </small>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(announcement)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(announcement.id)}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {announcements.filter((a) => a.active).length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">👁️ Live Preview</h5>
              </div>
              <div className="card-body p-0">
                <div
                  className="announcement-bar"
                  style={{
                    background: 'linear-gradient(90deg, #ff6600 0%, #ff8533 100%)',
                    color: 'white',
                    padding: '10px 0',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="announcement-content"
                    style={{
                      display: 'flex',
                      whiteSpace: 'nowrap',
                      animation: 'marquee 30s linear infinite',
                    }}
                  >
                    {announcements
                      .filter((a) => a.active)
                      .map((announcement) => (
                        <span
                          key={announcement.id}
                          style={{
                            display: 'inline-block',
                            padding: '0 50px',
                            fontWeight: 600,
                            fontSize: '14px',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {announcement.text}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

