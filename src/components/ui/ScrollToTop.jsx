import React, { useState, useEffect } from 'react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Social media links
  const zaloLink = 'https://zalo.me/0766616888'
  const facebookLink = 'https://www.facebook.com/share/1bGrUW7n4B/'

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {isVisible && (
        <div className="floating-buttons-container">
          {/* Zalo Button */}
          <button
            onClick={() => handleSocialClick(zaloLink)}
            className="social-button zalo-button"
            aria-label="Liên hệ Zalo"
            title="Liên hệ qua Zalo"
          >
            <img 
              src="/images/Icon_of_Zalo.svg.png" 
              alt="Zalo" 
              style={{ 
                width: '32px', 
                height: '32px', 
                objectFit: 'contain',
                display: 'block'
              }}
              onError={(e) => {
                // Fallback: ẩn ảnh và hiển thị SVG mặc định
                e.target.style.display = 'none'
                const fallbackSvg = `
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    <line x1="9" y1="10" x2="15" y2="10"/>
                    <line x1="9" y1="14" x2="13" y2="14"/>
                  </svg>
                `
                e.target.parentElement.insertAdjacentHTML('beforeend', fallbackSvg)
              }}
            />
          </button>

          {/* Facebook Button */}
          <button
            onClick={() => handleSocialClick(facebookLink)}
            className="social-button facebook-button"
            aria-label="Facebook"
            title="Theo dõi Facebook"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
          </button>

          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className="scroll-to-top-btn"
            aria-label="Scroll to top"
            title="Lên đầu trang"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}

