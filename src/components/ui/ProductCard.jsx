import React from 'react'

export default function ProductCard({ title, price, image, unit }) {
  return (
    <div className="card h-100">
      <img src={image} className="card-img-top" alt={title} />
      <div className="card-body d-flex flex-column">
        <h3 className="h6 flex-grow-1">{title}</h3>
        <div className="d-flex align-items-center justify-content-between mt-2">
          <span className="fw-bold">{price}</span>
          {unit && <small className="text-muted">{unit}</small>}
        </div>
      </div>
    </div>
  )
}


