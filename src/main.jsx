import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Global styles
import 'bootstrap/dist/css/bootstrap.min.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../css/vendor.css'
import '../style.css'

// Bootstrap JS (for offcanvas, dropdowns)
import 'bootstrap'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<App />)
}


