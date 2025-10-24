import React from 'react'
import { createRoot } from 'react-dom/client'
import AdminApp from './AdminApp.jsx'

// Global styles
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './admin.css'

const container = document.getElementById('admin-root')
if (container) {
  const root = createRoot(container)
  root.render(<AdminApp />)
}

