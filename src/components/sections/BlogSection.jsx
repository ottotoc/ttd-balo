import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Section from '../layout/Section.jsx'
import { blog } from '../../lib/api'
import { getImageUrl } from '../../lib/imageUtils'

export default function BlogSection() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await blog.getPublished(3) // Get 3 latest published posts
      setPosts(response.data.posts || [])
    } catch (error) {
      console.error('Failed to fetch blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  if (loading || posts.length === 0) {
    return null
  }

  return (
    <Section id="latest-blog" usePattern={true}>
      <div className="container-fluid">
        <div className="row">
          <div className="section-header d-flex align-items-center justify-content-between my-5">
            <h2 className="section-title">Blog Mới Nhất</h2>
            <div className="btn-wrap align-right">
              <a href="#" className="d-flex align-items-center nav-link">
                Xem Tất Cả <svg width="24" height="24"><use xlinkHref="#arrow-right"></use></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="row">
          {posts.map((post) => {
            // Lấy URL ảnh - ưu tiên coverUrl từ backend
            let imageUrl = '/images/post-thumb-1.jpg' // Default placeholder
            
            if (post.coverUrl && post.coverUrl.trim() !== '') {
              const processedUrl = getImageUrl(post.coverUrl, 'web')
              if (processedUrl) {
                imageUrl = processedUrl
              } else {
                // Nếu getImageUrl trả về null, thử dùng coverUrl trực tiếp
                imageUrl = post.coverUrl.startsWith('http') 
                  ? post.coverUrl 
                  : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${post.coverUrl}`
              }
            }
            
            return (
            <div className="col-md-4" key={post.id}>
              <article className="post-item card border-0 shadow-sm p-3">
                <div className="image-holder zoom-effect">
                  <Link to={`/blog/${post.slug}`}>
                    <img 
                      src={imageUrl} 
                      alt={post.title} 
                      className="card-img-top" 
                      style={{ height: '250px', objectFit: 'cover' }}
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
                        if (currentSrc !== '/images/post-thumb-1.jpg' && !currentSrc.includes('/images/post-thumb-1.jpg')) {
                          e.target.src = '/images/post-thumb-1.jpg'
                        }
                      }}
                    />
                  </Link>
                </div>
                <div className="card-body">
                  <div className="post-meta d-flex text-uppercase gap-3 my-2 align-items-center">
                    <div className="meta-date">
                      <svg width="16" height="16"><use xlinkHref="#calendar"></use></svg>
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                  <div className="post-header">
                    <h3 className="post-title">
                      <Link to={`/blog/${post.slug}`} className="text-decoration-none">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-muted">
                      {post.excerpt || 'Đọc thêm để khám phá nội dung thú vị...'}
                    </p>
                  </div>
                </div>
              </article>
            </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}


