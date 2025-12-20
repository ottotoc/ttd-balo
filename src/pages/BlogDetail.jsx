import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { blog } from '../lib/api'
import { getImageUrl } from '../lib/imageUtils'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import OffcanvasCart from '../components/layout/OffcanvasCart'
import OffcanvasSearch from '../components/layout/OffcanvasSearch'
import IconsSprite from '../components/layout/IconsSprite'

export default function BlogDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await blog.getBySlug(slug)
      if (response.data && response.data.post) {
        setPost(response.data.post)
      } else {
        setError('Không tìm thấy bài viết')
      }
    } catch (err) {
      console.error('Error fetching blog post:', err)
      setError('Không thể tải bài viết')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <>
        <IconsSprite />
        <OffcanvasCart />
        <OffcanvasSearch />
        <Header />
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải bài viết...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !post) {
    return (
      <>
        <IconsSprite />
        <OffcanvasCart />
        <OffcanvasSearch />
        <Header />
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4>Không tìm thấy bài viết</h4>
            <p>{error || 'Bài viết không tồn tại hoặc đã bị xóa'}</p>
            <Link to="/" className="btn btn-primary">Về trang chủ</Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <IconsSprite />
      <OffcanvasCart />
      <OffcanvasSearch />
      <Header />
      
      <section className="blog-detail-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Trang chủ</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/#latest-blog">Blog</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {post.title}
                  </li>
                </ol>
              </nav>

              {/* Article Header */}
              <article className="blog-post">
                <header className="mb-4">
                  <h1 className="blog-title mb-3">{post.title}</h1>
                  
                  <div className="post-meta d-flex align-items-center gap-3 mb-4 text-muted">
                    <div className="meta-date">
                      <svg width="16" height="16" fill="currentColor" className="me-1">
                        <use xlinkHref="#calendar"></use>
                      </svg>
                      {formatDate(post.createdAt)}
                    </div>
                    {post.excerpt && (
                      <div className="meta-excerpt">
                        <em>{post.excerpt}</em>
                      </div>
                    )}
                  </div>
                </header>

                {/* Cover Image */}
                {post.coverUrl && post.coverUrl.trim() !== '' && (
                  <div className="cover-image mb-4">
                    <img
                      src={getImageUrl(post.coverUrl, 'web') || `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${post.coverUrl}`}
                      alt={post.title}
                      className="img-fluid rounded shadow-sm"
                      style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                      onError={(e) => {
                        // Nếu .webp không tồn tại, thử dùng file gốc
                        const currentSrc = e.target.src
                        if (currentSrc.includes('.webp') && post.coverUrl && post.coverUrl.startsWith('/uploads/')) {
                          // Thử dùng file gốc (.jpg/.png)
                          const originalUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${post.coverUrl}`
                          if (currentSrc !== originalUrl) {
                            e.target.src = originalUrl
                            return
                          }
                        }
                        // Nếu vẫn lỗi, fallback về placeholder
                        console.error('Failed to load blog cover image:', post.coverUrl)
                        if (currentSrc !== '/images/post-thumb-1.jpg' && !currentSrc.includes('/images/post-thumb-1.jpg')) {
                          e.target.src = '/images/post-thumb-1.jpg'
                        }
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div 
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: post.content || '<p>Chưa có nội dung...</p>' }}
                  style={{
                    fontSize: '18px',
                    lineHeight: '1.8',
                    color: '#333'
                  }}
                />

                {/* Styling for blog content */}
                <style>{`
                  .blog-content h1,
                  .blog-content h2,
                  .blog-content h3,
                  .blog-content h4,
                  .blog-content h5,
                  .blog-content h6 {
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    font-weight: 600;
                    color: #2c3e50;
                  }
                  .blog-content h2 {
                    font-size: 2rem;
                    border-bottom: 2px solid #e9ecef;
                    padding-bottom: 0.5rem;
                  }
                  .blog-content h3 {
                    font-size: 1.5rem;
                  }
                  .blog-content p {
                    margin-bottom: 1.5rem;
                  }
                  .blog-content ul,
                  .blog-content ol {
                    margin-bottom: 1.5rem;
                    padding-left: 2rem;
                  }
                  .blog-content li {
                    margin-bottom: 0.5rem;
                  }
                  .blog-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 1.5rem 0;
                  }
                  .blog-content blockquote {
                    border-left: 4px solid #007bff;
                    padding-left: 1rem;
                    margin: 1.5rem 0;
                    font-style: italic;
                    color: #6c757d;
                  }
                  .blog-content code {
                    background-color: #f4f4f4;
                    padding: 0.2rem 0.4rem;
                    border-radius: 3px;
                    font-size: 0.9em;
                  }
                  .blog-content pre {
                    background-color: #f4f4f4;
                    padding: 1rem;
                    border-radius: 5px;
                    overflow-x: auto;
                    margin: 1.5rem 0;
                  }
                  .blog-content a {
                    color: #007bff;
                    text-decoration: none;
                  }
                  .blog-content a:hover {
                    text-decoration: underline;
                  }
                  .blog-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1.5rem 0;
                  }
                  .blog-content table th,
                  .blog-content table td {
                    border: 1px solid #dee2e6;
                    padding: 0.75rem;
                    text-align: left;
                  }
                  .blog-content table th {
                    background-color: #f8f9fa;
                    font-weight: 600;
                  }
                `}</style>

                {/* Footer */}
                <footer className="mt-5 pt-4 border-top">
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to="/#latest-blog" className="btn btn-outline-primary">
                      ← Quay lại Blog
                    </Link>
                    <div className="text-muted small">
                      Đăng ngày: {formatDate(post.createdAt)}
                    </div>
                  </div>
                </footer>
              </article>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

