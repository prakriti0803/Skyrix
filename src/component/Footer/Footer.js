import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const { getCityList, getCategoryList } = useSelector(
    (state) => state.productList
  );

  const phoneNumber = "9004898839"; // Replace with your WhatsApp number
  const message = encodeURIComponent(
    "Hello, I have a question about https://skyrixe.com/"
  );

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <>
      <footer>
        <div className="FooterTop">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="FooterLogo">
                  <Link to="/" style={{ width: "140px" }}>
                    <img
                      src={require("../../assets/images/Footer_Logo.png")}
                    />
                  </Link>
                  <p>
                    Making Every Celebration Unforgettable From intimate room
                    surprises to grand setups, we bring creativity, elegance,
                    and joy to every occasion.
                  </p>
                </div>
              </div>
              <div className="col-lg-9 col-md-12">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="FooterLinks">
                      <h3>Category</h3>
                      <ul>
                        {getCategoryList?.data?.length > 0
                          ? getCategoryList?.data?.map((item, i) => {
                              if (i <= 4) {
                                return (
                                  <li>
                                    <a>{item?.categoryName}</a>
                                  </li>
                                );
                              }
                            })
                          : ""}
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="FooterLinks">
                      <h3>City</h3>
                      <ul>
                        {getCityList?.data?.length > 0
                          ? getCityList?.data?.map((city, i) => {
                              if (i <= 4) {
                                return (
                                  <li>
                                    <a>
                                      {city?.cityName.charAt(0).toUpperCase() +
                                        city?.cityName.slice(1)}
                                    </a>
                                  </li>
                                );
                              }
                            })
                          : ""}
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="FooterLinks">
                      <h3>About Skyrixe</h3>
                      <ul>
                        <li>
                          <Link to="/about-us">About Us</Link>
                        </li>
                        <li>
                          <Link to="/terms-conditions">
                            Terms and Conditions
                          </Link>
                        </li>
                        <li>
                          <Link to="/return-policy">Return Policy</Link>
                        </li>
                        <li>
                          <Link to="/privacy-policy">Privacy Policy</Link>
                        </li>
                        <li>
                          <Link to="/contact-us">Contact Us</Link>
                        </li>
                        <li>
                          <Link to="/faq">FAQ</Link>
                        </li>
                        <li>
                          <Link to="/blog">Blog</Link>   
                        {/* <a rel="noreferrer" href="https://blog.skyrixe.com" target="_blank"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="footer_icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M172.2 226.8c-14.6-2.9-28.2 8.9-28.2 23.8V301c0 10.2 7.1 18.4 16.7 22 18.2 6.8 31.3 24.4 31.3 45 0 26.5-21.5 48-48 48s-48-21.5-48-48V120c0-13.3-10.7-24-24-24H24c-13.3 0-24 10.7-24 24v248c0 89.5 82.1 160.2 175 140.7 54.4-11.4 98.3-55.4 109.7-109.7 17.4-82.9-37-157.2-112.5-172.2zM209 0c-9.2-.5-17 6.8-17 16v31.6c0 8.5 6.6 15.5 15 15.9 129.4 7 233.4 112 240.9 241.5.5 8.4 7.5 15 15.9 15h32.1c9.2 0 16.5-7.8 16-17C503.4 139.8 372.2 8.6 209 0zm.3 96c-9.3-.7-17.3 6.7-17.3 16.1v32.1c0 8.4 6.5 15.3 14.8 15.9 76.8 6.3 138 68.2 144.9 145.2.8 8.3 7.6 14.7 15.9 14.7h32.2c9.3 0 16.8-8 16.1-17.3-8.4-110.1-96.5-198.2-206.6-206.7z"></path></svg> Blog</a> */}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="FooterLinks">
                      <h3>Contact Us</h3>
                      <ul>
                        <li>
                          <a
                            onClick={handleClick}
                            style={{ cursor: "pointer" }}
                          >
                            Whatsapp Us
                          </a>
                        </li>
                        <li>
                          <a>Call Us</a>
                        </li>
                      </ul>

                      <p>Skyrixe Services Pvt Ltd</p>
                      <p>Office Address: Bandra West, Mumbai, India</p>
                      <p>Email: Contact@skyrixe.com</p>
                      <p>Phone: +91 9004898839</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="FooterBottom">
          <div className="container-fluid">
            <div className="footer-icons">
              <p>COPYRIGHT © SKYRIXE CO.. LTD. ALL RIGHTS RESERVED.</p>
              <p>
                <i class="fa-brands fa-facebook-f"></i>
                <i class="fa-brands fa-instagram"></i>
                <i class="fa-brands fa-pinterest"></i>
                <i class="fa-brands fa-twitter"></i>
                <i class="fa-brands fa-youtube"></i>
                {/* <Link to="https://www.facebook.com/login/" target="_main">
                  <i class="fa-brands fa-facebook-f"></i>
                </Link>
                <Link to="https://www.instagram.com/accounts/login/" target="_main">
                  <i class="fa-brands fa-instagram"></i>
                </Link>
                <Link >
                  <i class="fa-brands fa-pinterest"></i>
                </Link>

                <Link>
                  <i class="fa-brands fa-twitter"></i>
                </Link>

                <Link>
                  <i class="fa-brands fa-youtube"></i>
                </Link> */}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
