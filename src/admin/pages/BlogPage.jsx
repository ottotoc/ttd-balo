import React, { useState, useEffect } from 'react'
import { blog } from '../../lib/api'

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
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {editingId ? '✏️ Edit Blog Post' : '➕ Create New Blog Post'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCancel}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter blog post title"
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Slug *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        placeholder="url-friendly-slug"
                        required
                      />
                      <small className="text-muted">Auto-generated from title</small>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Cover Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.coverUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, coverUrl: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Excerpt</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      placeholder="Short summary of the blog post..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-control"
                      rows="15"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="Write your blog post content here..."
                      style={{ fontFamily: 'monospace' }}
                    />
                    <small className="text-muted">
                      Supports HTML and Markdown formatting
                    </small>
                  </div>

                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) =>
                          setFormData({ ...formData, published: e.target.checked })
                        }
                        style={{ cursor: 'pointer' }}
                      />
                      <label className="form-check-label">
                        {formData.published ? '✅ Published (visible to public)' : '❌ Draft (hidden from public)'}
                      </label>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      {editingId ? '💾 Update' : '➕ Create'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

