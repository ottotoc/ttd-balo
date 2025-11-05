import React from 'react'

export default function Footer() {
  return (
    <>
      <footer className="py-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-menu">
                <h1 className="fw-bold text-dark m-0" style={{ fontSize: '2rem', letterSpacing: 0.5 }}>Tân Thời Đại <span className="text-primary">Balo</span> Store</h1>
                <p className="mt-3 mb-0">
                  <strong>Công ty TNHH TM-DV-XNK Tân Thời Đại</strong><br/>
                  Địa chỉ: 654/1C Phạm Văn Chí, phường Bình Tiên, Tp. Hồ Chí Minh
                </p>
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
                <h5 className="widget-title">Về chúng tôi</h5>
                <ul className="menu-list list-unstyled">
                  <li className="menu-item"><a href="#" className="nav-link">Giới thiệu</a></li>
                  <li className="menu-item"><a href="#" className="nav-link">Điều khoản</a></li>
                  <li className="menu-item"><a href="#" className="nav-link">Blog</a></li>
                  <li className="menu-item"><a href="#" className="nav-link">Tuyển dụng</a></li>
                </ul>
              </div>
            </div>
            <div className="col-md-2 col-sm-6">
              <div className="footer-menu">
                <h5 className="widget-title">Hỗ trợ khách hàng</h5>
                <ul className="menu-list list-unstyled">
                  <li className="menu-item"><a href="#" className="nav-link">Câu hỏi thường gặp</a></li>
                  <li className="menu-item"><a href="#" className="nav-link">Liên hệ</a></li>
                  <li className="menu-item"><a href="#" className="nav-link">Chính sách bảo mật</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-menu">
                <h5 className="widget-title">Đăng ký nhận tin</h5>
                <p>Đăng ký để nhận ưu đãi và thông tin sản phẩm mới từ Tân Thời Đại.</p>
                <form className="d-flex mt-3 gap-0" role="newsletter">
                  <input className="form-control rounded-start rounded-0 bg-light" type="email" placeholder="Địa chỉ email" aria-label="Địa chỉ email" />
                  <button className="btn btn-dark rounded-end rounded-0" type="submit">Đăng ký</button>
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
              <p>© 2025 Tân Thời Đại. Tất cả bản quyền được bảo lưu.</p>
            </div>
            <div className="col-md-6 credit-link text-start text-md-end">
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


