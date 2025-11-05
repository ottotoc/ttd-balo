import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import AnnouncementBar from './AnnouncementBar'

export default function Header() {
  const { cart } = useCart()
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const cartTotal = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
  const formattedTotal = cartTotal.toLocaleString('vi-VN') + ' ₫'
  
  return (
    <>
      <AnnouncementBar />
      <header className="site-header">
      <div className="container-fluid">
        <div className="row py-3 border-bottom">
          <div className="col-sm-4 col-lg-3 text-center text-sm-start">
            <div className="main-logo">
              <Link to="/" style={{ textDecoration: "none" }}>
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
              </Link>
            </div>
          </div>
          <div className="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
            <div className="search-bar row bg-light p-2 my-2 rounded-4">
              <div className="col-md-4 d-none d-md-block">
                <select className="form-select border-0 bg-transparent">
                  <option>Tất cả danh mục</option>
                  <option>Balo</option>
                  <option>Túi xách</option>
                  <option>Vali</option>
                </select>
                  
              </div>
              <div className="col-11 col-md-7">
                <form id="search-form" className="text-center" action="#" method="post">
                  <input type="text" className="form-control border-0 bg-transparent" placeholder="Tìm kiếm với hơn 2,000 sản phẩm" />
                </form>
              </div>
              <div className="col-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"/></svg>
              </div>
            </div>
          </div>
          <div className="col-sm-8 col-lg-4 d-flex gap-5 align-items-center mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
            <div className="support-box text-end d-none d-xl-block">
              <Link to="/products" className="text-decoration-none me-3">Sản phẩm</Link>
              <Link to="/about" className="text-decoration-none">Giới thiệu</Link>
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
              <Link to="/cart" className="border-0 bg-transparent d-flex flex-column gap-2 lh-1 text-decoration-none" style={{ cursor: 'pointer' }}>
                <span className="fs-6 text-muted">
                  Giỏ hàng
                  {itemCount > 0 && (
                    <span className="badge bg-danger rounded-pill ms-1" style={{ fontSize: '0.7rem', color: 'black' }}>
                      {itemCount}
                    </span>
                  )}
                </span>
                <span className="cart-total fs-5 fw-bold text-dark">{formattedTotal}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  )
}


