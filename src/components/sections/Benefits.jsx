import React from 'react'
import Section from '../layout/Section.jsx'

const items = [
  { title: 'Free delivery', text: 'Lorem ipsum dolor sit amet, consectetur adipi elit.' },
  { title: '100% secure payment', text: 'Lorem ipsum dolor sit amet, consectetur adipi elit.' },
  { title: 'Quality guarantee', text: 'Lorem ipsum dolor sit amet, consectetur adipi elit.' },
  { title: 'guaranteed savings', text: 'Lorem ipsum dolor sit amet, consectetur adipi elit.' },
  { title: 'Daily offers', text: 'Lorem ipsum dolor sit amet, consectetur adipi elit.' },
]

export default function Benefits() {
  return (
    <Section>
      <div className="container-fluid">
        <div className="row row-cols-1 row-cols-sm-3 row-cols-lg-5">
          {items.map((i) => (
            <div className="col" key={i.title}>
              <div className="card mb-3 border-0">
                <div className="row">
                  <div className="col-md-2 text-dark">★</div>
                  <div className="col-md-10">
                    <div className="card-body p-0">
                      <h5>{i.title}</h5>
                      <p className="card-text">{i.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}


