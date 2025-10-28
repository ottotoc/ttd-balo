import React, { useState, useEffect } from 'react'
import { admin } from '../../lib/api'

export default function TikTokVideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    thumbnailUrl: '',
    description: '',
    active: true,
    position: 0,
  })

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await admin.tiktokVideos.getAll()
      setVideos(response.data.videos)
      setError(null)
    } catch (err) {
      setError('Failed to fetch TikTok videos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await admin.tiktokVideos.update(editingId, formData)
      } else {
        await admin.tiktokVideos.create(formData)
      }

      setFormData({
        title: '',
        videoUrl: '',
        thumbnailUrl: '',
        description: '',
        active: true,
        position: 0,
      })
      setEditingId(null)
      fetchVideos()
    } catch (err) {
      setError('Failed to save video')
      console.error(err)
    }
  }

  const handleEdit = (video) => {
    setEditingId(video.id)
    setFormData({
      title: video.title,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || '',
      description: video.description || '',
      active: video.active,
      position: video.position,
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return
    }

    try {
      await admin.tiktokVideos.delete(id)
      fetchVideos()
    } catch (err) {
      setError('Failed to delete video')
      console.error(err)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      title: '',
      videoUrl: '',
      thumbnailUrl: '',
      description: '',
      active: true,
      position: 0,
    })
  }

  const toggleActive = async (id, currentActive) => {
    try {
      await admin.tiktokVideos.update(id, { active: !currentActive })
      fetchVideos()
    } catch (err) {
      setError('Failed to toggle video status')
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
          <h2 className="mb-0">📱 TikTok Videos Management</h2>
          <p className="text-muted">Quản lý 3 video TikTok hiển thị trên trang chủ</p>
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
                {editingId ? '✏️ Edit TikTok Video' : '➕ Add New TikTok Video'}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Balo đi học siêu đẹp"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">TikTok Video URL *</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.videoUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, videoUrl: e.target.value })
                      }
                      placeholder="https://www.tiktok.com/@username/video/1234567890"
                      required
                    />
                    <small className="text-muted">
                      Link video TikTok đầy đủ (ví dụ: https://www.tiktok.com/@username/video/1234567890)
                    </small>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Thumbnail URL (Optional)</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.thumbnailUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnailUrl: e.target.value })
                    }
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                  <small className="text-muted">
                    Để trống nếu sử dụng embed TikTok
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Mô tả ngắn về video..."
                  />
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
                      Thứ tự hiển thị (0, 1, 2 cho 3 video)
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
              <h5 className="mb-0">📋 All TikTok Videos</h5>
              <small className="text-muted">Chỉ hiển thị 3 video active đầu tiên trên website</small>
            </div>
            <div className="card-body p-0">
              {videos.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <p>No TikTok videos yet. Create your first one!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '50px' }}>ID</th>
                        <th>Title</th>
                        <th>Video URL</th>
                        <th style={{ width: '100px' }}>Position</th>
                        <th style={{ width: '100px' }}>Status</th>
                        <th style={{ width: '200px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videos.map((video) => (
                        <tr key={video.id}>
                          <td>{video.id}</td>
                          <td>
                            <strong>{video.title}</strong>
                            {video.description && (
                              <div className="text-muted small">{video.description}</div>
                            )}
                          </td>
                          <td>
                            <a
                              href={video.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none small"
                            >
                              {video.videoUrl.length > 40
                                ? video.videoUrl.substring(0, 40) + '...'
                                : video.videoUrl}
                            </a>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {video.position}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`btn btn-sm ${
                                video.active ? 'btn-success' : 'btn-secondary'
                              }`}
                              onClick={() => toggleActive(video.id, video.active)}
                            >
                              {video.active ? '✅ Active' : '❌ Inactive'}
                            </button>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(video)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(video.id)}
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
    </div>
  )
}

