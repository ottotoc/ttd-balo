import React from 'react'

export default function Section({ id, title, subtitle, children, usePattern = false, noPadding = false, backgroundColor = 'white' }) {
  const sectionStyle = {
    padding: noPadding ? '0' : '40px 0',
    backgroundColor: backgroundColor,
    position: 'relative',
    ...(usePattern && {
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/images/background-pattern.jpg')`,
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


