import React, { useState, useEffect } from 'react'
import { blog } from '../../lib/api'
import ImageUpload from '../components/ImageUpload'
import SimpleRichEditor from '../components/SimpleRichEditor'

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverUrl: '',
    published: false,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await blog.getAll()
      setPosts(response.data.posts)
      setError(null)
    } catch (err) {
      setError('Failed to fetch blog posts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const handleTitleChange = (title) => {
    setFormData({
      ...formData,
      title,
      slug: editingId ? formData.slug : generateSlug(title),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await blog.update(editingId, formData)
      } else {
        await blog.create(formData)
      }

      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverUrl: '',
        published: false,
      })
      setEditingId(null)
      setShowModal(false)
      fetchPosts()
    } catch (err) {
      setError('Failed to save blog post')
      console.error(err)
    }
  }

  const handleEdit = (post) => {
    setEditingId(post.id)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      coverUrl: post.coverUrl || '',
      published: post.published,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return
    }

    try {
      await blog.delete(id)
      fetchPosts()
    } catch (err) {
      setError('Failed to delete blog post')
      console.error(err)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverUrl: '',
      published: false,
    })
    setShowModal(false)
  }

  const togglePublished = async (id, currentPublished) => {
    try {
      await blog.update(id, { published: !currentPublished })
      fetchPosts()
    } catch (err) {
      setError('Failed to toggle publish status')
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
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0">📝 Blog Management</h2>
              <p className="text-muted">Quản lý các bài viết blog</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              ➕ Thêm Blog Mới
            </button>
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

      {/* List */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">📋 All Blog Posts</h5>
            </div>
            <div className="card-body p-0">
              {posts.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <p>No blog posts yet. Create your first one!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '50px' }}>ID</th>
                        <th>Title</th>
                        <th style={{ width: '200px' }}>Slug</th>
                        <th style={{ width: '100px' }}>Status</th>
                        <th style={{ width: '150px' }}>Created</th>
                        <th style={{ width: '200px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post) => (
                        <tr key={post.id}>
                          <td>{post.id}</td>
                          <td>
                            <strong>{post.title}</strong>
                            {post.excerpt && (
                              <div className="text-muted small">{post.excerpt.substring(0, 80)}...</div>
                            )}
                          </td>
                          <td>
                            <code className="small">{post.slug}</code>
                          </td>
                          <td>
                            <button
                              className={`btn btn-sm ${
                                post.published ? 'btn-success' : 'btn-secondary'
                              }`}
                              onClick={() => togglePublished(post.id, post.published)}
                            >
                              {post.published ? '✅ Published' : '❌ Draft'}
                            </button>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                            </small>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(post)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(post.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="blog-modal-backdrop" onClick={handleCancel}>
          <div className="blog-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="blog-modal-content">
              <div className="blog-modal-header">
                <div className="d-flex align-items-center gap-2">
                  <div className="blog-modal-icon">
                    {editingId ? '✏️' : '➕'}
                  </div>
                  <h5 className="blog-modal-title mb-0">
                    {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h5>
                </div>
                <button
                  type="button"
                  className="blog-modal-close"
                  onClick={handleCancel}
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="blog-modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="blog-form-row">
                    <div className="blog-form-group blog-form-group-large">
                      <label className="blog-form-label">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="blog-form-control"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter blog post title"
                        required
                      />
                    </div>
                    <div className="blog-form-group blog-form-group-small">
                      <label className="blog-form-label">
                        Slug <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="blog-form-control"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        placeholder="url-friendly-slug"
                        required
                      />
                      <small className="blog-form-help">Auto-generated from title</small>
                    </div>
                  </div>

                  <div className="blog-form-group">
                    <ImageUpload
                      label="Cover Image"
                      value={formData.coverUrl}
                      onChange={(url) => setFormData({ ...formData, coverUrl: url })}
                      category="blog"
                    />
                  </div>

                  <div className="blog-form-group">
                    <label className="blog-form-label">Excerpt</label>
                    <textarea
                      className="blog-form-control"
                      rows="3"
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      placeholder="Short summary of the blog post..."
                    />
                  </div>

                  <div className="blog-form-group">
                    <label className="blog-form-label">
                      Content <span className="text-danger">*</span>
                    </label>
                    <SimpleRichEditor
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      placeholder="Viết nội dung blog... Sử dụng toolbar để format text."
                    />
                    <small className="blog-form-help">
                      💡 Nhập text bình thường và sử dụng toolbar để format. Không cần nhập HTML!
                    </small>
                  </div>

                  <div className="blog-form-group">
                    <div className="blog-form-switch">
                      <input
                        className="blog-form-checkbox"
                        type="checkbox"
                        id="published-switch"
                        checked={formData.published}
                        onChange={(e) =>
                          setFormData({ ...formData, published: e.target.checked })
                        }
                      />
                      <label htmlFor="published-switch" className="blog-form-switch-label">
                        <span className="blog-form-switch-slider"></span>
                        <span className="blog-form-switch-text">
                          {formData.published ? '✅ Published (visible to public)' : '❌ Draft (hidden from public)'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="blog-modal-footer">
                    <button type="submit" className="blog-btn blog-btn-primary">
                      {editingId ? (
                        <>
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                            <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.5a.5.5 0 0 1-1 0V2A2 2 0 0 1 9.5 0H13a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm-1.138-1.138L13.424 1.87 9.592 5.702 5.498 8.932Z"/>
                          </svg>
                          Update
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                          </svg>
                          Create
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="blog-btn blog-btn-secondary"
                      onClick={handleCancel}
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                      </svg>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles for Blog Modal */}
      <style>{`
        .blog-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .blog-modal-dialog {
          width: 100%;
          max-width: 1200px;
          max-height: 95vh;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .blog-modal-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          max-height: 95vh;
          overflow: hidden;
        }

        .blog-modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: none;
        }

        .blog-modal-icon {
          font-size: 1.5rem;
          line-height: 1;
        }

        .blog-modal-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
          color: white;
        }

        .blog-modal-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          padding: 0;
        }

        .blog-modal-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .blog-modal-body {
          padding: 2rem;
          overflow-y: auto;
          flex: 1;
        }

        .blog-form-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .blog-form-row {
            grid-template-columns: 1fr;
          }
        }

        .blog-form-group {
          margin-bottom: 1.5rem;
        }

        .blog-form-group-large {
          /* Already handled by grid */
        }

        .blog-form-group-small {
          /* Already handled by grid */
        }

        .blog-form-label {
          display: block;
          font-weight: 600;
          font-size: 0.95rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .blog-form-control {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #fff;
        }

        .blog-form-control:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .blog-form-control::placeholder {
          color: #adb5bd;
        }

        .blog-form-help {
          display: block;
          font-size: 0.875rem;
          color: #6c757d;
          margin-top: 0.5rem;
        }

        .blog-form-switch {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .blog-form-checkbox {
          width: 0;
          height: 0;
          opacity: 0;
          position: absolute;
        }

        .blog-form-switch-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
        }

        .blog-form-switch-slider {
          position: relative;
          width: 50px;
          height: 26px;
          background: #dee2e6;
          border-radius: 13px;
          transition: all 0.3s;
        }

        .blog-form-switch-slider::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          top: 3px;
          left: 3px;
          transition: all 0.3s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .blog-form-checkbox:checked + .blog-form-switch-label .blog-form-switch-slider {
          background: #28a745;
        }

        .blog-form-checkbox:checked + .blog-form-switch-label .blog-form-switch-slider::before {
          transform: translateX(24px);
        }

        .blog-form-switch-text {
          font-weight: 500;
          color: #495057;
        }

        .blog-modal-footer {
          padding: 1.5rem 2rem;
          border-top: 1px solid #e9ecef;
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          background: #f8f9fa;
        }

        .blog-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .blog-btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .blog-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
        }

        .blog-btn-primary:active {
          transform: translateY(0);
        }

        .blog-btn-secondary {
          background: #6c757d;
          color: white;
        }

        .blog-btn-secondary:hover {
          background: #5a6268;
          transform: translateY(-1px);
        }

        /* Scrollbar styling for modal body */
        .blog-modal-body::-webkit-scrollbar {
          width: 8px;
        }

        .blog-modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .blog-modal-body::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .blog-modal-body::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  )
}

