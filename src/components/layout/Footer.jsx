import React from 'react'

export default function Footer() {
  return (
    <>
      <footer className="py-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-menu">
                <img src="/images/logo.png" alt="logo" />
                <div className="social-links mt-5">
                  <ul className="d-flex list-unstyled gap-2">
                    <li><a href="#" className="btn btn-outline-light">F</a></li>
                    <li><a href="#" className="btn btn-outline-light">X</a></li>
                    <li><a href="#" className="btn btn-outline-light">Y</a></li>
                    <li><a href="#" className="btn btn-outline-light">I</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-sm-6">
              <div className="footer-menu">
                <h5 className="widget-title">Ultras</h5>
                <ul className="menu-list list-unstyled">
                  <li className="menu-item"><a href="#" className="nav-link">About us</a></li>
                  <li className="menu-item"><a href="#" className="nav-link">Conditions</a></li>
                  <li className="menu-item"><a href="#" className="nav-link">Our Journals</a></li>
                  <li className="menu-item"><a href="#" className="nav-link">Careers</a></li>
                </ul>
              </div>
            </div>
            <div className="col-md-2 col-sm-6">
              <div className="footer-menu">
                <h5 className="widget-title">Customer Service</h5>
                <ul className="menu-list list-unstyled">
                  <li className="menu-item"><a href="#" className="nav-link">FAQ</a></li>
                  <li className="menu-item"><a href="#" className="nav-link">Contact</a></li>
                  <li className="menu-item"><a href="#" className="nav-link">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-menu">
                <h5 className="widget-title">Subscribe Us</h5>
                <p>Subscribe to our newsletter to get updates about our grand offers.</p>
                <form className="d-flex mt-3 gap-0" role="newsletter">
                  <input className="form-control rounded-start rounded-0 bg-light" type="email" placeholder="Email Address" aria-label="Email Address" />
                  <button className="btn btn-dark rounded-end rounded-0" type="submit">Subscribe</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div id="footer-bottom">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 copyright">
              <p>© 2023 Foodmart. All rights reserved.</p>
            </div>
            <div className="col-md-6 credit-link text-start text-md-end">
              <p>Free HTML Template by <a href="https://templatesjungle.com/">TemplatesJungle</a> Distributed by <a href="https://themewagon">ThemeWagon</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


