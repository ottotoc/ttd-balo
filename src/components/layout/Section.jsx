import React from 'react'

export default function Section({ id, title, subtitle, children, usePattern = false, noPadding = false }) {
  const sectionStyle = {
    padding: noPadding ? '0' : '40px 0',
    ...(usePattern && {
      backgroundImage: "url('/images/background-pattern.jpg')",
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    })
  }

  return (
    <section id={id} style={sectionStyle}>
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


