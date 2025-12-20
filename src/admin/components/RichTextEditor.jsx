import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from './ErrorBoundary.jsx'

/**
 * Rich Text Editor Component
 * Sử dụng react-quill nếu có và tương thích, fallback về textarea nếu không
 * 
 * LƯU Ý: react-quill@2.0.0 không tương thích với React 19 (sử dụng findDOMNode đã bị deprecated)
 * Component này sẽ tự động fallback về textarea với preview cho React 19
 */
export default function RichTextEditor({ value = '', onChange, placeholder = 'Viết nội dung blog...' }) {
  const [useQuill, setUseQuill] = useState(false)
  const [quillError, setQuillError] = useState(false)
  const [ReactQuill, setReactQuill] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  // Check React version và disable react-quill cho React 19+
  useEffect(() => {
    const reactVersion = parseInt(React.version?.split('.')[0] || '0')
    
    // React 19+ không tương thích với react-quill@2.0.0
    if (reactVersion >= 19) {
      if (import.meta.env.DEV) {
        console.warn('React 19+ không tương thích với react-quill. Sử dụng textarea với preview.')
      }
      setUseQuill(false)
      setQuillError(true)
      return
    }

    // Try to load react-quill cho React 18 trở xuống
    const loadQuill = async () => {
      try {
        const quillModule = await import('react-quill')
        await import('react-quill/dist/quill.snow.css')
        
        setReactQuill(() => quillModule.default)
        setUseQuill(true)
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('react-quill không thể load. Sử dụng textarea đơn giản.')
        }
        setUseQuill(false)
        setQuillError(true)
      }
    }
    loadQuill()
  }, [])

  // Rich Text Editor với react-quill (chỉ cho React < 19)
  if (useQuill && ReactQuill && !quillError) {
    const modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
    }

    const formats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'color', 'background',
      'align',
      'link', 'image', 'video'
    ]

    return (
      <ErrorBoundary
        fallback={
          <div className="alert alert-warning">
            <p>⚠️ Rich text editor không thể load. Đang sử dụng HTML editor.</p>
            <button 
              className="btn btn-sm btn-primary"
              onClick={() => {
                setQuillError(true)
                setUseQuill(false)
              }}
            >
              Chuyển sang HTML Editor
            </button>
          </div>
        }
      >
        <div className="rich-text-editor">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            style={{ 
              minHeight: '400px',
              backgroundColor: 'white'
            }}
          />
          <style>{`
            .rich-text-editor .ql-container {
              min-height: 350px;
              font-size: 16px;
            }
            .rich-text-editor .ql-editor {
              min-height: 350px;
            }
            .rich-text-editor .ql-editor.ql-blank::before {
              font-style: normal;
              color: #6c757d;
            }
          `}</style>
        </div>
      </ErrorBoundary>
    )
  }

  // Fallback: Simple textarea với preview
  return (
    <div className="rich-text-editor-fallback">
      <div className="d-flex gap-2 mb-2">
        <button
          type="button"
          className={`btn btn-sm ${!showPreview ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setShowPreview(false)}
        >
          ✏️ Edit HTML
        </button>
        <button
          type="button"
          className={`btn btn-sm ${showPreview ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setShowPreview(true)}
        >
          👁️ Preview
        </button>
        <small className="text-muted align-self-center ms-auto">
          {quillError ? (
            <span className="text-warning">
              ⚠️ react-quill không tương thích với React 19. Sử dụng HTML editor.
            </span>
          ) : (
            <span>
              💡 Viết HTML trực tiếp hoặc sử dụng các thẻ HTML chuẩn
            </span>
          )}
        </small>
      </div>
      
      {!showPreview ? (
        <textarea
          className="form-control"
          rows="20"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ 
            fontFamily: 'monospace',
            fontSize: '14px'
          }}
        />
      ) : (
        <div 
          className="border rounded p-4 bg-light"
          style={{ 
            minHeight: '400px',
            maxHeight: '600px',
            overflow: 'auto'
          }}
          dangerouslySetInnerHTML={{ __html: value || '<p class="text-muted">Chưa có nội dung...</p>' }}
        />
      )}
      
      <div className="mt-2">
        <small className="text-muted">
          <strong>Hướng dẫn viết HTML:</strong>
          <br />
          <code>&lt;h2&gt;Tiêu đề&lt;/h2&gt;</code> - Tiêu đề lớn
          <br />
          <code>&lt;h3&gt;Tiêu đề nhỏ&lt;/h3&gt;</code> - Tiêu đề nhỏ
          <br />
          <code>&lt;p&gt;Đoạn văn...&lt;/p&gt;</code> - Đoạn văn
          <br />
          <code>&lt;ul&gt;&lt;li&gt;Mục 1&lt;/li&gt;&lt;li&gt;Mục 2&lt;/li&gt;&lt;/ul&gt;</code> - Danh sách
          <br />
          <code>&lt;strong&gt;In đậm&lt;/strong&gt;</code> - <strong>In đậm</strong>
          <br />
          <code>&lt;em&gt;In nghiêng&lt;/em&gt;</code> - <em>In nghiêng</em>
          <br />
          <code>&lt;a href="url"&gt;Link&lt;/a&gt;</code> - Link
          <br />
          <code>&lt;img src="url" alt="mô tả" /&gt;</code> - Hình ảnh
        </small>
      </div>
    </div>
  )
}

