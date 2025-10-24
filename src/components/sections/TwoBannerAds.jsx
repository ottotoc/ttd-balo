import React from 'react'
import Section from '../layout/Section.jsx'

export default function TwoBannerAds() {
  return (
    <Section>
      <div className="row">
        <div className="col-md-6">
          <div className="banner-ad bg-danger mb-3" style={{ background: "')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right bottom' }}>
            <div className="banner-content p-5">
              <div className="categories text-primary fs-3 fw-bold">Upto 25% Off</div>
              <h3 className="banner-title">text...</h3>
              <p>text...</p>
              <a href="#" className="btn btn-dark text-uppercase">Show Now</a>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="banner-ad bg-info" style={{ background: "')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right bottom' }}>
            <div className="banner-content p-5">
              <div className="categories text-primary fs-3 fw-bold">Upto 25% Off</div>
              <h3 className="banner-title">text...</h3>
              <p>text...</p>
              <a href="#" className="btn btn-dark text-uppercase">Show Now</a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}


