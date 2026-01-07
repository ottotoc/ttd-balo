import React, { useState, useEffect } from 'react'
import { uploads } from '../../lib/api'

/**
 * ImageUpload Component - Upload ảnh lên server local
 * 
 * Props:
 * - value: URL ảnh hiện tại (string)
 * - onChange: Callback khi upload thành công (url) => void
 * - label: Label của input (default: 'Image')
 * - required: Bắt buộc hay không (default: false)
 * - category: Category của ảnh - 'projects' | 'blog' | 'general' (default: 'general')
 * - previewSize: { width, height } - kích thước khung preview (optional, default: auto)
 */
export default function ImageUpload({ value, onChange, label = 'Image', required = false, category = 'general', previewSize }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const [error, setError] = useState('')

  // Update preview khi value thay đổi từ bên ngoài
  useEffect(() => {
    setPreview(value || '')
  }, [value])

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP, GIF)')
      return
    }

    // Validate file size (max 30MB - sẽ được resize và optimize bởi backend)
    if (file.size > 30 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 30MB')
      return
    }

    try {
      setUploading(true)
      setError('')

      // Upload file trực tiếp lên server với category
      const result = await uploads.uploadFile(file, category)
      
      // result.data chứa thông tin file đã upload
      // Backend trả về: { success: true, data: { url, webUrl, dashboardUrl, thumbnail, ... } }
      const responseData = result.data || result
      
      // Ưu tiên dùng webUrl cho database (cho frontend), fallback về url
      const webUrl = responseData.webUrl || responseData.url
      const dashboardUrl = responseData.dashboardUrl || responseData.url
      
      if (!webUrl) {
        throw new Error('Server did not return image URL')
      }

      // Update preview: dùng dashboardUrl cho admin panel (nhẹ hơn)
      const previewUrl = dashboardUrl
      const fullUrl = previewUrl.startsWith('http') 
        ? previewUrl 
        : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${previewUrl}`
      
      setPreview(fullUrl)
      
      // Lưu webUrl vào database (version đầy đủ cho frontend)
      // Đảm bảo URL có format /uploads/... để getImageUrl xử lý đúng
      const urlToSave = webUrl.startsWith('/uploads/') ? webUrl : `/uploads/${webUrl}`
      onChange(urlToSave)
      
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Upload error:', err)
      }
      
      // Xử lý các loại lỗi khác nhau
      if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
        setError('Không thể kết nối với server. Vui lòng kiểm tra:\n1. Backend có đang chạy?\n2. Đã login admin chưa?\n3. Thử refresh trang và login lại')
      } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Bạn chưa đăng nhập hoặc session đã hết hạn. Vui lòng đăng nhập lại.')
      } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
        setError('Bạn không có quyền upload file. Chỉ admin mới có thể upload.')
      } else {
        setError(err.message || 'Lỗi upload ảnh. Vui lòng thử lại.')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
    setError('')
  }

  // Helper để hiển thị URL ảnh (convert relative path thành full URL nếu cần)
  const getImageUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    // Nếu là relative path, thêm API_URL prefix
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    return `${apiUrl}${url}`
  }

  return (
    <div className="form-group">
      <label>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      
      {preview ? (
        <div className="image-upload-preview">
          <div
            style={{
              width: previewSize?.width || '100%',
              maxWidth: previewSize?.width || '100%',
              height: previewSize?.height || 'auto',
              maxHeight: previewSize?.height || 300,
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '4px',
              marginBottom: '8px',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img 
              src={getImageUrl(preview)} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain',
                display: 'block'
              }} 
            onError={(e) => {
              // Nếu ảnh không load được, thử với full URL
              const fullUrl = getImageUrl(preview)
              if (e.target.src !== fullUrl) {
                e.target.src = fullUrl
              }
            }} 
            />
          </div>
          <div className="d-flex gap-2">
            <label className="btn btn-sm btn-outline-primary" style={{ cursor: 'pointer' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              {uploading ? 'Đang upload...' : '📷 Đổi ảnh'}
            </label>
            <button 
              type="button" 
              className="btn btn-sm btn-outline-danger"
              onClick={handleRemove}
              disabled={uploading}
            >
              🗑️ Xóa
            </button>
          </div>
        </div>
      ) : (
        <div>
          <label 
            className="btn btn-outline-secondary w-100" 
            style={{ 
              cursor: 'pointer',
              padding: '48px 20px',
              border: '2px dashed #dee2e6',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa'
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              style={{ display: 'none' }}
              required={required && !preview}
            />
            {uploading ? (
              <div>
                <div className="spinner-border spinner-border-sm mb-2" role="status">
                  <span className="visually-hidden">Uploading...</span>
                </div>
                <div>Đang upload...</div>
              </div>
            ) : (
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" style={{ marginBottom: '12px', color: '#6c757d' }}>
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                </svg>
                <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                  📷 Click để chọn ảnh
                </div>
                <small className="text-muted" style={{ display: 'block' }}>
                  JPG, PNG, WEBP, GIF (max 30MB - tự động resize và optimize)
                </small>
              </div>
            )}
          </label>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger mt-2 mb-0" style={{ padding: '12px', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
          <strong>⚠️ Lỗi:</strong><br />
          {error}
        </div>
      )}
      
      <small className="form-text text-muted mt-2" style={{ display: 'block' }}>
        💾 Ảnh sẽ được tự động resize và optimize, lưu trên server local
      </small>
    </div>
  )
}
