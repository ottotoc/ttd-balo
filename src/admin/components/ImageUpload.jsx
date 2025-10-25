import React, { useState, useEffect } from 'react'
import { uploads } from '../../lib/api'

/**
 * ImageUpload Component - Upload ảnh lên Google Cloud Storage
 * 
 * Props:
 * - value: URL ảnh hiện tại (string)
 * - onChange: Callback khi upload thành công (url) => void
 * - label: Label của input (default: 'Image')
 * - required: Bắt buộc hay không (default: false)
 */
export default function ImageUpload({ value, onChange, label = 'Image', required = false }) {
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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB')
      return
    }

    try {
      setUploading(true)
      setError('')

      // Step 1: Get signed URL from backend
      console.log('📤 Requesting signed URL...')
      const result = await uploads.getSignedUrl(file.name, file.type)
      const { uploadUrl, publicUrl } = result.data

      console.log('✅ Got signed URL, uploading to GCS...')

      // Step 2: Upload file to GCS using signed URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload to GCS failed')
      }

      console.log('✅ Upload successful!')

      // Step 3: Update preview and notify parent
      setPreview(publicUrl)
      onChange(publicUrl)
      
    } catch (err) {
      console.error('❌ Upload error:', err)
      
      // Xử lý các loại lỗi khác nhau
      if (err.message === 'Failed to fetch') {
        setError('Không thể kết nối với server. Vui lòng kiểm tra:\n1. Backend có đang chạy?\n2. Đã login admin chưa?\n3. Thử refresh trang và login lại')
      } else if (err.message.includes('not configured')) {
        setError('Google Cloud Storage chưa được cấu hình. Xem file GCS_SETUP.md để biết cách setup.')
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

  return (
    <div className="form-group">
      <label>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      
      {preview ? (
        <div className="image-upload-preview">
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '300px', 
              objectFit: 'contain',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '8px',
              marginBottom: '12px',
              display: 'block'
            }} 
          />
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
                  JPG, PNG, WEBP, GIF (max 5MB)
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
        💾 Ảnh sẽ được lưu trên Google Cloud Storage
      </small>
    </div>
  )
}

