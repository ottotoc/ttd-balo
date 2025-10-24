import React, { useState, useEffect } from 'react'
import { reviews } from '../../lib/api'

export default function ReviewsPage() {
  const [reviewList, setReviewList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const result = await reviews.getAll({ approved: false })
      setReviewList(result.data?.items || [])
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await reviews.approve(id)
      loadReviews()
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return

    try {
      await reviews.delete(id)
      loadReviews()
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="data-table">
        <div className="data-table-header">
          <h2>Pending Reviews</h2>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>User</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewList.map((review) => (
                <tr key={review.id}>
                  <td>{review.product?.name}</td>
                  <td>{review.user?.name || review.user?.email || 'Anonymous'}</td>
                  <td>{'⭐'.repeat(review.rating)}</td>
                  <td>{review.comment}</td>
                  <td>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleApprove(review.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reviewList.length === 0 && (
            <div className="text-center p-4">No pending reviews</div>
          )}
        </div>
      </div>
    </div>
  )
}

