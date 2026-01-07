import React, { useState, useEffect } from 'react'
import { admin } from '../../lib/api'
import ImageUpload from '../components/ImageUpload'
import Toast from '../components/Toast'
import { getImageUrl } from '../../lib/imageUtils'

export default function BannersPage() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState(null)
  const [selectedPosition, setSelectedPosition] = useState('hero')
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    link: '',
    position: 'hero',
    active: true,
    order: 0,
  })

  useEffect(() => {
    fetchBanners()
  }, [selectedPosition])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await admin.banners.getAll({ position: selectedPosition })
      setBanners(response.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch banners')
      if (import.meta.env.DEV) {
        console.error(err)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await admin.banners.update(editingId, formData)
        setToast({ type: 'success', message: 'Cập nhật banner thành công!' })
      } else {
        await admin.banners.create(formData)
        setToast({ type: 'success', message: 'Tạo banner thành công!' })
      }

      setFormData({
        title: '',
        imageUrl: '',
        link: '',
        position: selectedPosition,
        active: true,
        order: 0,
      })
      setEditingId(null)
      setShowModal(false)
      fetchBanners()
    } catch (err) {
      setError('Failed to save banner')
      setToast({ type: 'error', message: 'Lỗi: ' + (err.message || 'Không thể lưu banner') })
      if (import.meta.env.DEV) {
        console.error(err)
      }
    }
  }

  const handleEdit = (banner) => {
    setEditingId(banner.id)
    setFormData({
      title: banner.title || '',
      imageUrl: banner.imageUrl || '',
      link: banner.link || '',
      position: banner.position || 'hero',
      active: banner.active !== false,
      order: banner.order || 0,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa banner này?')) {
      return
    }

    try {
      await admin.banners.delete(id)
      setToast({ type: 'success', message: 'Xóa banner thành công!' })
      fetchBanners()
    } catch (err) {
      setError('Failed to delete banner')
      setToast({ type: 'error', message: 'Lỗi: ' + (err.message || 'Không thể xóa banner') })
      if (import.meta.env.DEV) {
        console.error(err)
      }
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      title: '',
      imageUrl: '',
      link: '',
      position: selectedPosition,
      active: true,
      order: 0,
    })
    setShowModal(false)
  }

  const toggleActive = async (id, currentActive) => {
    try {
      await admin.banners.update(id, { active: !currentActive })
      setToast({ type: 'success', message: 'Cập nhật trạng thái thành công!' })
      fetchBanners()
    } catch (err) {
      setError('Failed to toggle banner status')
      setToast({ type: 'error', message: 'Lỗi: ' + (err.message || 'Không thể cập nhật trạng thái') })
      if (import.meta.env.DEV) {
        console.error(err)
      }
    }
  }

  // Helper để hiển thị URL ảnh trong bảng (giống như ImageUpload component)
  const getImageDisplayUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    // Dùng dashboard version cho admin panel (nhẹ hơn, tối ưu cho preview)
    const dashboardUrl = getImageUrl(url, 'dashboard')
    if (dashboardUrl) return dashboardUrl
    // Fallback: thêm API_URL prefix nếu getImageUrl trả về null
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    return `${apiUrl}${url.startsWith('/') ? '' : '/'}${url}`
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
    <>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h2 className="mb-0">🖼️ Quản lý Banner</h2>
                <p className="text-muted">Quản lý các banner slide trên trang chủ</p>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <select
                  className="form-select"
                  value={selectedPosition}
                  onChange={(e) => {
                    setSelectedPosition(e.target.value)
                    setFormData({ ...formData, position: e.target.value })
                  }}
                  style={{ width: 'auto' }}
                >
                  <option value="hero">Banner Hero (Đầu trang)</option>
                  <option value="between-popular">Banner giữa - trên &quot;Sản phẩm phổ biến&quot;</option>
                  <option value="between-new">Banner giữa - trên &quot;Sản phẩm mới về&quot;</option>
                </select>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({
                      title: '',
                      imageUrl: '',
                      link: '',
                      position: selectedPosition,
                      active: true,
                      order: 0,
                    })
                    setShowModal(true)
                  }}
                >
                  + Thêm Banner
                </button>
              </div>
            </div>
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

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Ảnh</th>
                        <th>Tiêu đề</th>
                        <th>Link</th>
                        <th>Vị trí</th>
                        <th>Thứ tự</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {banners.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center text-muted py-4">
                            Chưa có banner nào. Hãy thêm banner đầu tiên!
                          </td>
                        </tr>
                      ) : (
                        banners.map((banner) => (
                          <tr key={banner.id}>
                            <td>
                              <img
                                src={getImageDisplayUrl(banner.imageUrl)}
                                alt={banner.title || 'Banner'}
                                style={{
                                  width: '120px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                }}
                                onError={(e) => {
                                  // Nếu getImageUrl fail, thử dùng URL gốc với API_URL
                                  if (banner.imageUrl) {
                                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
                                    const fallbackUrl = banner.imageUrl.startsWith('http') 
                                      ? banner.imageUrl 
                                      : `${apiUrl}${banner.imageUrl.startsWith('/') ? '' : '/'}${banner.imageUrl}`
                                    if (e.target.src !== fallbackUrl) {
                                      e.target.src = fallbackUrl
                                    }
                                  }
                                }}
                              />
                            </td>
                            <td>{banner.title || '-'}</td>
                            <td>
                              {banner.link ? (
                                <a href={banner.link} target="_blank" rel="noopener noreferrer">
                                  {banner.link.length > 30 ? banner.link.substring(0, 30) + '...' : banner.link}
                                </a>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td>
                              <span className="badge bg-info">
                                {banner.position === 'hero'
                                  ? 'Hero'
                                  : banner.position === 'between-popular'
                                  ? 'Giữa - trên Sản phẩm phổ biến'
                                  : banner.position === 'between-new'
                                  ? 'Giữa - trên Sản phẩm mới về'
                                  : banner.position}
                              </span>
                            </td>
                            <td>{banner.order}</td>
                            <td>
                              <button
                                className={`btn btn-sm ${banner.active ? 'btn-success' : 'btn-secondary'}`}
                                onClick={() => toggleActive(banner.id, banner.active)}
                              >
                                {banner.active ? 'Hiển thị' : 'Ẩn'}
                              </button>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(banner)}
                                >
                                  Sửa
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(banner.id)}
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCancel()
            }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingId ? 'Sửa Banner' : 'Thêm Banner Mới'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCancel}
                    aria-label="Close"
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Ảnh Banner *</label>
                      <ImageUpload
                        category="banners"
                        value={formData.imageUrl}
                        onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                      />
                      <small className="form-text text-muted">
                        Upload ảnh banner (khuyến nghị: 1920x600px hoặc tỷ lệ tương tự)
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Tiêu đề (tùy chọn)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Tiêu đề banner (không bắt buộc)"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Link (tùy chọn)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        placeholder="https://example.com hoặc /products"
                      />
                      <small className="form-text text-muted">
                        Link khi click vào banner (để trống nếu không cần)
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Vị trí hiển thị</label>
                      <select
                        className="form-select"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      >
                        <option value="hero">Banner Hero (Đầu trang)</option>
                        <option value="between-popular">Banner giữa - trên &quot;Sản phẩm phổ biến&quot;</option>
                        <option value="between-new">Banner giữa - trên &quot;Sản phẩm mới về&quot;</option>
                      </select>
                      <small className="form-text text-muted">
                        Chọn vị trí hiển thị banner trên trang chủ
                      </small>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Thứ tự hiển thị</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            min="0"
                          />
                          <small className="form-text text-muted">
                            Số nhỏ hơn sẽ hiển thị trước
                          </small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Trạng thái</label>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={formData.active}
                              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            />
                            <label className="form-check-label">
                              {formData.active ? 'Hiển thị' : 'Ẩn'}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!formData.imageUrl}
                    >
                      {editingId ? 'Cập nhật' : 'Tạo mới'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

