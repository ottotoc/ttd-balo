import React from 'react'

export default function Header() {
  return (
    <header>
      <div className="container-fluid">
        <div className="row py-3 border-bottom">
          <div className="col-sm-4 col-lg-3 text-center text-sm-start">
            <div className="main-logo">
              <a href="/" style={{ textDecoration: "none" }}>
                <span
                  style={{
                    fontFamily: "'Nunito', 'Open Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: "#2d2a2a",
                    background: "#ffffff",
                    borderRadius: "10px",
                    padding: "0.4em 1em",
                    
                    letterSpacing: "1px",
                    
                    display: "inline-block",
                  }}
                >
                  <span style={{ color: "#ff6600" }}>Tân Thời Đại</span>
                  <span style={{
                    color: "#4b4b4b",
                    fontWeight: 400,
                    fontSize: "1.1rem",
                    marginLeft: "10px"
                  }}>- Balo store</span>
                </span>
              </a>
            </div>
          </div>
          <div className="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
            <div className="search-bar row bg-light p-2 my-2 rounded-4">
              <div className="col-md-4 d-none d-md-block">
                <select className="form-select border-0 bg-transparent">
                  <option>All Categories</option>
                  <option>Groceries</option>
                  <option>Drinks</option>
                  <option>Chocolates</option>
                </select>
              </div>
              <div className="col-11 col-md-7">
                <form id="search-form" className="text-center" action="#" method="post">
                  <input type="text" className="form-control border-0 bg-transparent" placeholder="Search for more than 20,000 products" />
                </form>
              </div>
              <div className="col-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"/></svg>
              </div>
            </div>
          </div>
          <div className="col-sm-8 col-lg-4 d-flex gap-5 align-items-center mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
            <div className="support-box text-end d-none d-xl-block">
              <span className="fs-6 text-muted">For Support?</span>
              <h5 className="mb-0">+980-34984089</h5>
            </div>
            <ul className="d-flex justify-content-end list-unstyled m-0">
              <li>
                <a href="#" className="rounded-circle bg-light p-2 mx-1"><svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#user" /></svg></a>
              </li>
              <li>
                <a href="#" className="rounded-circle bg-light p-2 mx-1"><svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#heart" /></svg></a>
              </li>
              <li className="d-lg-none">
                <a href="#" className="rounded-circle bg-light p-2 mx-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart"><svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#cart" /></svg></a>
              </li>
              <li className="d-lg-none">
                <a href="#" className="rounded-circle bg-light p-2 mx-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSearch" aria-controls="offcanvasSearch"><svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#search" /></svg></a>
              </li>
            </ul>
            <div className="cart text-end d-none d-lg-block dropdown">
              <button className="border-0 bg-transparent d-flex flex-column gap-2 lh-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
                <span className="fs-6 text-muted dropdown-toggle">Your Cart</span>
                <span className="cart-total fs-5 fw-bold">$1290.00</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}


