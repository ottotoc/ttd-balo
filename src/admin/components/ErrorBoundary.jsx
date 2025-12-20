import React from 'react'

/**
 * Error Boundary Component
 * Bắt lỗi trong quá trình render và hiển thị fallback UI
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return this.props.fallback || (
        <div className="alert alert-warning">
          <h5>⚠️ Lỗi khi render component</h5>
          <p>{this.state.error?.message || 'Đã xảy ra lỗi không xác định'}</p>
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Thử lại
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

