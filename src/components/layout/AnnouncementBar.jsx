import React, { useState, useEffect } from 'react'
import { announcements as announcementsAPI } from '../../lib/api'

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementsAPI.getActive()
      setAnnouncements(response.data.announcements)
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
      // Fallback to default message if API fails
      setAnnouncements([
        {
          id: 1,
          text: '🎉 SALE OFF TỚI 50% TẤT CẢ SẢN PHẨM BALO - MIỄN PHÍ VẬN CHUYỂN ĐƠN TỪ 500K - ƯU ĐÃI CỰC SỐC CHỈ CÓ TRONG THÁNG NÀY! 🎉',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading || announcements.length === 0) {
    return null
  }

  // Duplicate announcements 3 times for seamless scrolling
  const duplicatedAnnouncements = [
    ...announcements,
    ...announcements,
    ...announcements,
  ]

  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        {duplicatedAnnouncements.map((announcement, index) => (
          <span key={`${announcement.id}-${index}`} className="announcement-text">
            {announcement.text}
          </span>
        ))}
      </div>
    </div>
  )
}

