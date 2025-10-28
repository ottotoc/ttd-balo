import React, { useState, useEffect } from 'react'
import Section from '../layout/Section.jsx'
import { tiktokVideos } from '../../lib/api'

export default function TikTokSection() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await tiktokVideos.getActive()
      setVideos(response.data.videos || [])
    } catch (error) {
      console.error('Failed to fetch TikTok videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const extractTikTokId = (url) => {
    // Extract TikTok video ID from various URL formats
    // https://www.tiktok.com/@username/video/1234567890
    // https://vm.tiktok.com/xxxxx/
    const match = url.match(/\/video\/(\d+)/)
    if (match) return match[1]
    return url
  }

  if (loading || videos.length === 0) {
    return null
  }

  return (
    <Section className="bg-light-gray">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center mb-4">
            <h2 className="display-5 fw-bold">TikTok của chúng tôi</h2>
            <p className="text-muted">Khám phá các video hot nhất về sản phẩm balo, túi xách</p>
          </div>
        </div>
        <div className="row g-4">
          {videos.map((video) => (
            <div key={video.id} className="col-md-4">
              <div className="tiktok-video-card h-100">
                <div className="card shadow-sm border-0 h-100">
                  <div className="tiktok-embed-wrapper position-relative" style={{ paddingTop: '177.78%' }}>
                    {video.videoUrl.includes('tiktok.com') ? (
                      // Render TikTok iframe embed
                      <iframe
                        className="position-absolute top-0 start-0 w-100 h-100"
                        src={`https://www.tiktok.com/embed/v2/${extractTikTokId(video.videoUrl)}`}
                        style={{ border: 'none', borderRadius: '8px' }}
                        allowFullScreen
                        scrolling="no"
                        allow="encrypted-media;"
                      ></iframe>
                    ) : (
                      // Fallback to thumbnail with link
                      <a 
                        href={video.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="position-absolute top-0 start-0 w-100 h-100 d-block"
                      >
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-100 h-100 object-fit-cover rounded"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div 
                            className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark text-white rounded"
                          >
                            <div className="text-center">
                              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                              </svg>
                              <p className="mt-2">Xem video</p>
                            </div>
                          </div>
                        )}
                      </a>
                    )}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{video.title}</h5>
                    {video.description && (
                      <p className="card-text text-muted small">{video.description}</p>
                    )}
                    {!video.videoUrl.includes('tiktok.com') && (
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-dark"
                      >
                        🎵 Xem trên TikTok
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

