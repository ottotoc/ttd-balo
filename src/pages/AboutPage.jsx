import React from 'react'
import { Link } from 'react-router-dom'
import IconsSprite from '../components/layout/IconsSprite.jsx'
import OffcanvasCart from '../components/layout/OffcanvasCart.jsx'
import OffcanvasSearch from '../components/layout/OffcanvasSearch.jsx'
import Header from '../components/layout/Header.jsx'
import Footer from '../components/layout/Footer.jsx'
import ScrollToTop from '../components/ui/ScrollToTop.jsx'

export default function AboutPage() {
  return (
    <>
      <IconsSprite />
      <OffcanvasCart />
      <OffcanvasSearch />
      <Header />

      {/* Breadcrumb */}
      <section className="py-3 bg-light">
        <div className="container-fluid">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Giới thiệu</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="about-hero py-5" style={{ 
        background: 'linear-gradient(135deg, #ff6600 0%, #ff8533 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container-fluid">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4" style={{ 
                animation: 'fadeInUp 0.8s ease',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                Về Tân Thời Đại
              </h1>
              <p className="lead mb-4" style={{ 
                fontSize: '1.25rem',
                lineHeight: '1.8',
                animation: 'fadeInUp 0.8s ease 0.2s backwards'
              }}>
                Chúng tôi tự hào là đơn vị hàng đầu trong lĩnh vực kinh doanh balo, túi xách và phụ kiện thời trang. 
                Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng cao, 
                giá cả hợp lý và dịch vụ chăm sóc khách hàng tận tâm.
              </p>
              <div className="d-flex gap-3 flex-wrap" style={{ animation: 'fadeInUp 0.8s ease 0.4s backwards' }}>
                <Link to="/products" className="btn btn-light btn-lg px-4 py-3">
                  Xem sản phẩm
                </Link>
                <a href="#contact" className="btn btn-outline-light btn-lg px-4 py-3">
                  Liên hệ
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-5 mt-lg-0">
              <div style={{ 
                animation: 'fadeInRight 0.8s ease 0.6s backwards',
                position: 'relative'
              }}>
                <div className="about-hero-image" style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '40px',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.2)'
                }}>
                  <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="150" cy="150" r="140" stroke="white" strokeWidth="3" fill="none" opacity="0.3"/>
                    <path d="M150 50 L150 250 M50 150 L250 150" stroke="white" strokeWidth="2" opacity="0.5"/>
                    <text x="150" y="160" textAnchor="middle" fill="white" fontSize="60" fontWeight="bold">TTD</text>
                    <text x="150" y="190" textAnchor="middle" fill="white" fontSize="20">Balo Store</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute bottom-0 start-0 w-100" style={{ height: '100px', background: 'white', clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)' }}></div>
      </section>

      {/* Company Intro Section */}
      <section className="py-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="h3 fw-bold mb-4 text-primary">Công ty TNHH TM-DV-XNK Tân Thời Đại</h2>
              <div className="mb-4">
                <p className="lead">
                  Tân Thời Đại được thành lập với sứ mệnh trở thành địa chỉ tin cậy của mọi khách hàng khi tìm kiếm 
                  các sản phẩm balo, túi xách và phụ kiện thời trang chất lượng.
                </p>
                <p>
                  Với đội ngũ nhân viên giàu kinh nghiệm và đam mê, chúng tôi không ngừng nỗ lực để:
                </p>
                <ul className="list-unstyled ms-4">
                  <li className="mb-2">
                    Cung cấp sản phẩm đa dạng, chất lượng cao từ các thương hiệu uy tín
                  </li>
                  <li className="mb-2">
                    Đảm bảo giá cả cạnh tranh nhất thị trường
                  </li>
                  <li className="mb-2">
                    Mang đến trải nghiệm mua sắm tiện lợi và thú vị
                  </li>
                  <li className="mb-2">
                    Hỗ trợ khách hàng tận tâm, chuyên nghiệp
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg h-100">
                <div className="card-body p-4">
                  <h3 className="h5 fw-bold mb-4">Thông tin công ty</h3>
                  <div className="mb-3">
                    <strong className="d-block mb-2 text-primary">
                      Địa chỉ
                    </strong>
                    <p className="mb-0 ms-4">654/1C Phạm Văn Chí, phường Bình Tiên, TP. Hồ Chí Minh</p>
                  </div>
                  <div className="mb-3">
                    <strong className="d-block mb-2 text-primary">
                      Email
                    </strong>
                    <p className="mb-0 ms-4">ccmm1680@gmail.com</p>
                  </div>
                  <div className="mb-3">
                    <strong className="d-block mb-2 text-primary">
                      Giờ làm việc
                    </strong>
                    <p className="mb-0 ms-4">Thứ 2 - Chủ nhật: 8:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <div className="container-fluid">
          <div className="row g-4">
            <div className="col-md-3 col-sm-6">
              <div className="text-center p-4 bg-white rounded shadow-sm h-100 stats-counter">
                <div className="display-4 fw-bold text-primary mb-2">10+</div>
                <div className="text-muted">Năm kinh nghiệm</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="text-center p-4 bg-white rounded shadow-sm h-100 stats-counter">
                <div className="display-4 fw-bold text-primary mb-2">10K+</div>
                <div className="text-muted">Khách hàng hài lòng</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="text-center p-4 bg-white rounded shadow-sm h-100 stats-counter">
                <div className="display-4 fw-bold text-primary mb-2">2K+</div>
                <div className="text-muted">Sản phẩm đa dạng</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="text-center p-4 bg-white rounded shadow-sm h-100 stats-counter">
                <div className="display-4 fw-bold text-primary mb-2">50+</div>
                <div className="text-muted">Thương hiệu hợp tác</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-5">
        <div className="container-fluid">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg h-100 mission-vision-card" style={{ 
                background: 'linear-gradient(135deg, #ff6600 0%, #ff8533 100%)',
                color: 'white'
              }}>
                <div className="card-body p-5">
                  <h3 className="h4 fw-bold mb-4">Sứ mệnh</h3>
                  <p className="lead mb-0" style={{ lineHeight: '1.8' }}>
                    Mang đến cho khách hàng những sản phẩm balo, túi xách chất lượng cao với giá cả hợp lý, 
                    đồng thời xây dựng niềm tin và mối quan hệ lâu dài với mọi khách hàng thông qua dịch vụ 
                    chăm sóc khách hàng tận tâm và chuyên nghiệp.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg h-100 bg-primary text-white mission-vision-card">
                <div className="card-body p-5">
                  <h3 className="h4 fw-bold mb-4">Tầm nhìn</h3>
                  <p className="lead mb-0" style={{ lineHeight: '1.8' }}>
                    Trở thành thương hiệu hàng đầu tại Việt Nam trong lĩnh vực kinh doanh balo và túi xách, 
                    được công nhận bởi chất lượng sản phẩm, dịch vụ khách hàng xuất sắc và là đối tác tin cậy 
                    của các thương hiệu quốc tế.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-5 bg-light">
        <div className="container-fluid">
          <h2 className="text-center h3 fw-bold mb-5">Giá trị cốt lõi</h2>
          <div className="row g-4">
            {[
              { title: 'Chất lượng', desc: 'Đảm bảo 100% sản phẩm chính hãng, chất lượng cao' },
              { title: 'Uy tín', desc: 'Xây dựng niềm tin với khách hàng qua từng giao dịch' },
              { title: 'Tận tâm', desc: 'Luôn lắng nghe và đáp ứng nhu cầu khách hàng' },
              { title: 'Đổi mới', desc: 'Không ngừng cải tiến và phát triển dịch vụ' },
            ].map((value, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100 text-center p-4 core-value-card" style={{ 
                  cursor: 'pointer'
                }}>
                  <h4 className="h5 fw-bold mb-3">{value.title}</h4>
                  <p className="text-muted mb-0">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-5">
        <div className="container-fluid">
          <h2 className="text-center h3 fw-bold mb-5">Hành trình phát triển</h2>
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              {[
                { year: '2016', title: 'Thành lập công ty', desc: 'Bắt đầu với cửa hàng nhỏ tại TP.HCM' },
                { year: '2018', title: '1000 khách hàng', desc: 'Đạt cột mốc 1000 khách hàng đầu tiên' },
                { year: '2020', title: 'Đối tác quốc tế', desc: 'Hợp tác với 20+ thương hiệu nổi tiếng' },
                { year: '2024', title: 'Hiện tại', desc: 'Phục vụ 10,000+ khách hàng, 2000+ sản phẩm' },
              ].map((milestone, idx) => (
                <div key={idx} className="d-flex mb-4">
                  <div className="flex-shrink-0 text-center" style={{ width: '100px' }}>
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-2" 
                         style={{ width: '60px', height: '60px' }}>
                      {milestone.year}
                    </div>
                    {idx < 4 && (
                      <div className="mx-auto" style={{ 
                        width: '2px', 
                        height: '80px', 
                        background: '#dee2e6' 
                      }}></div>
                    )}
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h4 className="h5 fw-bold mb-2">{milestone.title}</h4>
                    <p className="text-muted mb-0">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5 bg-light">
        <div className="container-fluid">
          <h2 className="text-center h3 fw-bold mb-5">Đội ngũ của chúng tôi</h2>
          <div className="row g-4">
            {[
              { name: 'Trần Nhì Múi', position: 'Giám đốc công ty', desc: '10 năm kinh nghiệm' },
              { name: 'Từ Yến Thảo', position: 'Nhân viên kinh doanh', desc: '10 năm kinh nghiệm' },
              { name: 'Từ Chí Quang', position: 'Quản lý kho hàng', desc: '8 năm kinh nghiệm' },
              { name: 'Xuân Thanh', position: 'Quản lý kiểm hàng', desc: '7 năm kinh nghiệm' },
            ].map((member, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100 text-center team-member-card">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold" 
                           style={{ width: '100px', height: '100px', fontSize: '2rem' }}>
                        {member.name.split(' ').pop()[0]}
                      </div>
                    </div>
                    <h5 className="fw-bold mb-1">{member.name}</h5>
                    <p className="text-primary small mb-2">{member.position}</p>
                    <p className="text-muted small mb-0">{member.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="h3 fw-bold mb-4">Liên hệ với chúng tôi</h2>
              <p className="lead mb-4">
                Bạn có câu hỏi hoặc cần hỗ trợ? Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn!
              </p>
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Thông tin liên hệ</h5>
                <p className="mb-2">
                  <strong>Địa chỉ:</strong><br/>
                  654/1C Phạm Văn Chí, phường Bình Tiên, Quận 6, TP. Hồ Chí Minh
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> ccnn1680@gmail.com
                </p>
                <p className="mb-0">
                  <strong>Giờ làm việc:</strong><br/>
                  Thứ 2 - Chủ nhật: 8:00 - 20:00
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Gửi tin nhắn</h5>
                  <form className="contact-form">
                    <div className="mb-3">
                      <input type="text" className="form-control" placeholder="Họ và tên" required />
                    </div>
                    <div className="mb-3">
                      <input type="email" className="form-control" placeholder="Email" required />
                    </div>
                    <div className="mb-3">
                      <input type="tel" className="form-control" placeholder="Số điện thoại" required />
                    </div>
                    <div className="mb-3">
                      <textarea className="form-control" rows="4" placeholder="Nội dung tin nhắn" required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg w-100">
                      Gửi tin nhắn
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-0" style={{ height: '400px' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d979.9808264522051!2d106.63723126961914!3d10.740394316948926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDQ0JzI1LjQiTiAxMDbCsDM4JzE2LjQiRQ!5e0!3m2!1sen!2s!4v1762313002010!5m2!1sen!2shttps://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d489.9905571792268!2d106.63752525511147!3d10.740305574534752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1c724cb579%3A0x850e74e280fc6196!2zQ8O0bmcgVHkgeG5rIFTDom4gdGjhu51pIMSR4bqhaSAtIGLDoW4gc-G7iSBiYWxvIC0gdMO6aSB4w6FjaA!5e0!3m2!1sen!2s!4v1762313242644!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Bản đồ địa chỉ Tân Thời Đại"
        ></iframe>
      </section>

      <Footer />
      <ScrollToTop />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .min-vh-50 {
          min-height: 50vh;
        }

        .about-hero {
          position: relative;
        }

        .about-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>');
          opacity: 0.3;
        }

        .about-hero > * {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </>
  )
}
