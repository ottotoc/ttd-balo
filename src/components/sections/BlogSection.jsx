import React, { useState, useEffect } from 'react'
import Section from '../layout/Section.jsx'
import { blog } from '../../lib/api'

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
          {posts.map((post) => (
            <div className="col-md-4" key={post.id}>
              <article className="post-item card border-0 shadow-sm p-3">
                <div className="image-holder zoom-effect">
                  <a href={`#/blog/${post.slug}`}>
                    <img 
                      src={post.coverUrl || '/images/post-thumb-1.jpg'} 
                      alt={post.title} 
                      className="card-img-top" 
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                  </a>
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
                      <a href={`#/blog/${post.slug}`} className="text-decoration-none">
                        {post.title}
                      </a>
                    </h3>
                    <p className="text-muted">
                      {post.excerpt || 'Đọc thêm để khám phá nội dung thú vị...'}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}


