import React from 'react'
import Section from '../layout/Section.jsx'

const posts = [
  { img: '/images/post-thumb-1.jpg', date: '22 Aug 2021', cat: 'tips & tricks', title: 'Top 10 casual look ideas to dress up your kids' },
  { img: '/images/post-thumb-2.jpg', date: '25 Aug 2021', cat: 'trending', title: 'Latest trends of wearing street wears supremely' },
  { img: '/images/post-thumb-3.jpg', date: '28 Aug 2021', cat: 'inspiration', title: '10 Different Types of comfortable clothes ideas for women' },
]

export default function BlogSection() {
  return (
    <Section id="latest-blog">
      <div className="container-fluid">
        <div className="row">
          <div className="section-header d-flex align-items-center justify-content-between my-5">
            <h2 className="section-title">Our Recent Blog</h2>
            <div className="btn-wrap align-right">
              <a href="#" className="d-flex align-items-center nav-link">Read All Articles <svg width="24" height="24"><use xlinkHref="#arrow-right"></use></svg></a>
            </div>
          </div>
        </div>
        <div className="row">
          {posts.map((p) => (
            <div className="col-md-4" key={p.title}>
              <article className="post-item card border-0 shadow-sm p-3">
                <div className="image-holder zoom-effect">
                  <a href="#">
                    <img src={p.img} alt="post" className="card-img-top" />
                  </a>
                </div>
                <div className="card-body">
                  <div className="post-meta d-flex text-uppercase gap-3 my-2 align-items-center">
                    <div className="meta-date"><svg width="16" height="16"><use xlinkHref="#calendar"></use></svg>{p.date}</div>
                    <div className="meta-categories"><svg width="16" height="16"><use xlinkHref="#category"></use></svg>{p.cat}</div>
                  </div>
                  <div className="post-header">
                    <h3 className="post-title"><a href="#" className="text-decoration-none">{p.title}</a></h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam. A in arcu, hendrerit neque dolor morbi...</p>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}


