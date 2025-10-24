import React, { useState } from 'react'
import Section from '../layout/Section.jsx'

export default function TrendingTabs() {
  const [tab, setTab] = useState('all')

  return (
    <Section>
      <div className="bootstrap-tabs product-tabs">
        <div className="tabs-header d-flex justify-content-between border-bottom my-5">
          <h3>Trending Products</h3>
          <nav>
            <div className="nav nav-tabs" role="tablist">
              <button className={`nav-link text-uppercase fs-6 ${tab==='all'?'active':''}`} onClick={() => setTab('all')}>All</button>
              <button className={`nav-link text-uppercase fs-6 ${tab==='fruits'?'active':''}`} onClick={() => setTab('fruits')}>Fruits & Veges</button>
              <button className={`nav-link text-uppercase fs-6 ${tab==='juices'?'active':''}`} onClick={() => setTab('juices')}>Juices</button>
            </div>
          </nav>
        </div>
        <div className="tab-content">
          <div className="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">
          </div>
        </div>
      </div>
    </Section>
  )
}


