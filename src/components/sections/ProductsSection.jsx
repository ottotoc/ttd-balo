import React from 'react'
import Section from '../layout/Section.jsx'
import ProductCard from '../ui/ProductCard.jsx'

const products = [
  { title: 'Avocado', price: '$5.00', unit: '/kg', image: '/images/thumb-avocado.png' },
  { title: 'Bananas', price: '$2.50', unit: '/kg', image: '/images/thumb-bananas.png' },
  { title: 'Cucumber', price: '$1.80', unit: '/kg', image: '/images/thumb-cucumber.png' },
  { title: 'Orange Juice', price: '$3.20', unit: '/L', image: '/images/thumb-orange-juice.png' },
]

export default function ProductsSection() {
  return (
    <Section id="react-products" title="Sản phẩm (React)">
      <div className="row g-3">
        {products.map((p) => (
          <div key={p.title} className="col-6 col-md-3">
            <ProductCard {...p} />
          </div>
        ))}
      </div>
    </Section>
  )
}


