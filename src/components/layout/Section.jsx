import React from 'react'

export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} style={{ padding: '40px 0' }}>
      <div className="container">
        {(title || subtitle) && (
          <div className="row mb-4">
            <div className="col-12">
              {title && <h2 className="h4 m-0">{title}</h2>}
              {subtitle && <p className="text-muted m-0">{subtitle}</p>}
            </div>
          </div>
        )}
        {children}
      </div>
    </section>
  )
}


