import React from 'react'

export default function CategoryCard({ category }) {
  const imageUrl = category.imageUrl || '/images/icon-vegetables-broccoli.png'
  
  return (
    <a href={`/products?category=${category.slug}`} className="text-decoration-none">
      <div className="card h-100 text-center category-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
        <div className="p-3">
          <img 
            src={imageUrl} 
            className="img-fluid" 
            alt={category.name} 
            style={{ maxHeight: 120, objectFit: 'contain' }} 
          />
        </div>
        <div className="card-body pt-0">
          <h3 className="h6 m-0 text-dark">{category.name}</h3>
        </div>
      </div>
    </a>
  )
}


