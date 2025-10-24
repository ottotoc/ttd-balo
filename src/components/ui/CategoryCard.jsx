import React from 'react'

export default function CategoryCard({ title, image }) {
  return (
    <div className="card h-100 text-center">
      <div className="p-3">
        <img src={image} className="img-fluid" alt={title} style={{ maxHeight: 120 }} />
      </div>
      <div className="card-body pt-0">
        <h3 className="h6 m-0">{title}</h3>
      </div>
    </div>
  )
}


