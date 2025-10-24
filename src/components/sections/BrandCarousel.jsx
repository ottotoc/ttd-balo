import React from 'react'
import Section from '../layout/Section.jsx'

export default function BrandCarousel() {
  return (
    <Section>
      <div className="section-header d-flex flex-wrap justify-content-between mb-5">
        <h2 className="section-title">Newly Arrived Brands</h2>
        <div className="d-flex align-items-center">
          <a href="#" className="btn-link text-decoration-none">View All Categories →</a>
        </div>
      </div>
      <div className="brand-carousel">
      </div>
    </Section>
  )
}


