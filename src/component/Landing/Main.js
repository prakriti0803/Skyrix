// ...existing code...
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../assets/css/homepage-original-cards.css";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "bootstrap";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { FaStar } from "react-icons/fa";
import ServiceCarousel from "../Modals/ServiceCrousel";
import { fetchLatestReviews } from "../../reduxToolkit/Slices/ReviewAndRating/reviewRatingApis";

const CustomPrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev" onClick={onClick}>
    <i class="fa-solid fa-angle-left"></i>
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div className="custom-arrow next" onClick={onClick}>
    <i class="fa-solid fa-angle-right"></i>
  </div>
);

const Main = () => {
  const {
    getBirthdayList,
    getAnniversaryList,
    getKidsList,
    getWeddingDecoList,
    getCategoryList,
    getDealBannerList,
    getTopBannerList,
    loader,
  } = useSelector((state) => state.productList);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);
  const [reviews, setReviews] = useState([]);

  // Enhanced Review Carousel Functionality
  const [showPrevBtn, setShowPrevBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(true);

  useEffect(() => {
    const initializeCarousel = () => {
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const reviewContainer = document.getElementById('reviewContainer');

      if (!reviewContainer || !prevBtn || !nextBtn) return;

      const cardWidth = 320; // 300px card + 20px gap

      // Scroll Left Function
      const scrollLeft = () => {
        reviewContainer.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      };

      // Scroll Right Function  
      const scrollRight = () => {
        reviewContainer.scrollBy({ left: cardWidth, behavior: 'smooth' });
      };

      // Update Arrow Visibility
      const updateArrowVisibility = () => {
        const scrollLeft = reviewContainer.scrollLeft;
        const maxScroll = reviewContainer.scrollWidth - reviewContainer.clientWidth;
        
        // Show/hide previous button
        if (scrollLeft <= 0) {
          prevBtn.style.display = 'none';
          setShowPrevBtn(false);
        } else {
          prevBtn.style.display = 'flex';
          setShowPrevBtn(true);
        }
        
        // Show/hide next button (with small tolerance for rounding)
        if (scrollLeft >= maxScroll - 1) {
          nextBtn.style.display = 'none';
          setShowNextBtn(false);
        } else {
          nextBtn.style.display = 'flex';
          setShowNextBtn(true);
        }
      };

      // Event Listeners
      prevBtn.addEventListener('click', scrollLeft);
      nextBtn.addEventListener('click', scrollRight);
      reviewContainer.addEventListener('scroll', updateArrowVisibility);

      // Initial check
      updateArrowVisibility();

      // Cleanup function
      return () => {
        prevBtn.removeEventListener('click', scrollLeft);
        nextBtn.removeEventListener('click', scrollRight);
        reviewContainer.removeEventListener('scroll', updateArrowVisibility);
      };
    };

    // Initialize after component mounts
    const cleanup = initializeCarousel();
    
    return cleanup;
  }, []);

  // For reviews slider navigation with enhanced functionality
  const reviewsScrollRef = useRef(null);
  const [showReviewsPrevBtn, setShowReviewsPrevBtn] = useState(false);
  const [showReviewsNextBtn, setShowReviewsNextBtn] = useState(true);

  // Update arrow visibility based on scroll position
  const updateReviewsArrowVisibility = () => {
    if (reviewsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = reviewsScrollRef.current;
      setShowReviewsPrevBtn(scrollLeft > 0);
      setShowReviewsNextBtn(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Enhanced scroll functions with responsive card-width precision
  const getCardWidth = () => {
      // Check screen width to determine card size for product sections
    if (window.innerWidth <= 480) {
      return 270; // 250px card + 20px gap for mobile
    } else if (window.innerWidth <= 768) {
      return 300; // 280px card + 20px gap for tablet
    }
    return 320; // 300px card + 20px gap for desktop
  };

  const getTestimonialCardWidth = () => {
    // Check screen width to determine scroll distance for testimonial section
    if (window.innerWidth <= 360) {
      return 215; // 200px card + 15px gap to show 1.5 cards effect
    } else if (window.innerWidth <= 768) {
      return 215; // 200px card + 15px gap to show 1.5 cards effect
    }
    return 320; // Default testimonial card width + gap for desktop
  };

  const handleReviewsScrollLeft = () => {
    if (reviewsScrollRef.current) {
      const cardWidth = getTestimonialCardWidth();
      reviewsScrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const handleReviewsScrollRight = () => {
    if (reviewsScrollRef.current) {
      const cardWidth = getTestimonialCardWidth();
      reviewsScrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  // Add scroll event listener for reviews section
  useEffect(() => {
    const reviewsContainer = reviewsScrollRef.current;
    if (reviewsContainer) {
      const handleScroll = () => {
        updateReviewsArrowVisibility();
      };

      reviewsContainer.addEventListener('scroll', handleScroll);
      // Initial check
      updateReviewsArrowVisibility();

      return () => {
        reviewsContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // For FAQ toggle
  const [activeFaq, setActiveFaq] = useState(-1);
  const handleFaqToggle = (idx) => {
    setActiveFaq(activeFaq === idx ? -1 : idx);
  };

  const { latestReviews: latestReviewsRaw = [], loading, error } = useSelector(
    (state) => state.reviews
  );
  const latestReviews = Array.isArray(latestReviewsRaw) ? latestReviewsRaw : [];

  //Fetching the Latest Reviews
  useEffect(() => {
    dispatch(fetchLatestReviews());
  }, [dispatch]);

  console.log("Latest Reviews:", latestReviews);
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const anniversaryScrollRef = useRef(null);
  const kidsScrollRef = useRef(null);
  const babyShowerScrollRef = useRef(null);
  const birthdayScrollRef = useRef(null);

  // Enhanced Baby Shower carousel functionality state
  const [showBabyShowerPrevBtn, setShowBabyShowerPrevBtn] = useState(false);
  const [showBabyShowerNextBtn, setShowBabyShowerNextBtn] = useState(true);

  // Enhanced Kids Party carousel functionality state
  const [showKidsPrevBtn, setShowKidsPrevBtn] = useState(false);
  const [showKidsNextBtn, setShowKidsNextBtn] = useState(true);

  // Enhanced Anniversary carousel functionality state
  const [showAnniversaryPrevBtn, setShowAnniversaryPrevBtn] = useState(false);
  const [showAnniversaryNextBtn, setShowAnniversaryNextBtn] = useState(true);

  // Enhanced Birthday carousel functionality state
  const [showBirthdayPrevBtn, setShowBirthdayPrevBtn] = useState(false);
  const [showBirthdayNextBtn, setShowBirthdayNextBtn] = useState(true);

  // Update arrow visibility for Baby Shower section
  const updateBabyShowerArrowVisibility = () => {
    if (babyShowerScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = babyShowerScrollRef.current;
      setShowBabyShowerPrevBtn(scrollLeft > 0);
      setShowBabyShowerNextBtn(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Get scroll distance for Baby Shower section (modified for 1.5 card view on mobile)
  const getBabyShowerCardWidth = () => {
    if (window.innerWidth <= 768) {
      return 215; // 200px card + 15px gap to show 1.5 cards effect
    }
    return 320; // 300px card + 20px gap for desktop
  };

  const handleBabyShowerScrollLeft = () => {
    if (babyShowerScrollRef.current) {
      const cardWidth = getBabyShowerCardWidth();
      babyShowerScrollRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleBabyShowerScrollRight = () => {
    if (babyShowerScrollRef.current) {
      const cardWidth = getBabyShowerCardWidth();
      babyShowerScrollRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Add scroll event listener for Baby Shower section
  useEffect(() => {
    const babyShowerContainer = babyShowerScrollRef.current;
    if (babyShowerContainer) {
      const handleScroll = () => {
        updateBabyShowerArrowVisibility();
      };

      babyShowerContainer.addEventListener('scroll', handleScroll);
      // Initial check
      updateBabyShowerArrowVisibility();

      return () => {
        babyShowerContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Update arrow visibility for Kids Party section
  const updateKidsArrowVisibility = () => {
    if (kidsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = kidsScrollRef.current;
      setShowKidsPrevBtn(scrollLeft > 0);
      setShowKidsNextBtn(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Get scroll distance for Kids Party section (modified for 1.5 card view on mobile)
  const getKidsCardWidth = () => {
    if (window.innerWidth <= 768) {
      return 215; // 200px card + 15px gap to show 1.5 cards effect
    }
    return 320; // 300px card + 20px gap for desktop
  };

  const handleKidsScrollLeft = () => {
    if (kidsScrollRef.current) {
      const cardWidth = getKidsCardWidth();
      kidsScrollRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleKidsScrollRight = () => {
    if (kidsScrollRef.current) {
      const cardWidth = getKidsCardWidth();
      kidsScrollRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Add scroll event listener for Kids Party section
  useEffect(() => {
    const kidsContainer = kidsScrollRef.current;
    if (kidsContainer) {
      const handleScroll = () => {
        updateKidsArrowVisibility();
      };

      kidsContainer.addEventListener('scroll', handleScroll);
      // Initial check
      updateKidsArrowVisibility();

      return () => {
        kidsContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Update arrow visibility for Anniversary section
  const updateAnniversaryArrowVisibility = () => {
    if (anniversaryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = anniversaryScrollRef.current;
      setShowAnniversaryPrevBtn(scrollLeft > 0);
      setShowAnniversaryNextBtn(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Get scroll distance for Anniversary section (modified for 1.5 card view on mobile)
  const getAnniversaryCardWidth = () => {
    if (window.innerWidth <= 768) {
      return 215; // 200px card + 15px gap to show 1.5 cards effect
    }
    return 320; // 300px card + 20px gap for desktop
  };

  const handleAnniversaryScrollLeft = () => {
    if (anniversaryScrollRef.current) {
      const cardWidth = getAnniversaryCardWidth();
      anniversaryScrollRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleAnniversaryScrollRight = () => {
    if (anniversaryScrollRef.current) {
      const cardWidth = getAnniversaryCardWidth();
      anniversaryScrollRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Add scroll event listener for Anniversary section
  useEffect(() => {
    const anniversaryContainer = anniversaryScrollRef.current;
    if (anniversaryContainer) {
      const handleScroll = () => {
        updateAnniversaryArrowVisibility();
      };

      anniversaryContainer.addEventListener('scroll', handleScroll);
      // Initial check
      updateAnniversaryArrowVisibility();

      return () => {
        anniversaryContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Update arrow visibility for Birthday section
  const updateBirthdayArrowVisibility = () => {
    if (birthdayScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = birthdayScrollRef.current;
      setShowBirthdayPrevBtn(scrollLeft > 0);
      setShowBirthdayNextBtn(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Get scroll distance for Birthday section (modified for 1.5 card view on mobile)
  const getBirthdayCardWidth = () => {
    if (window.innerWidth <= 768) {
      return 215; // 200px card + 15px gap to show 1.5 cards effect
    }
    return 320; // 300px card + 20px gap for desktop
  };

  const handleBirthdayScrollLeft = () => {
    if (birthdayScrollRef.current) {
      const cardWidth = getBirthdayCardWidth();
      birthdayScrollRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleBirthdayScrollRight = () => {
    if (birthdayScrollRef.current) {
      const cardWidth = getBirthdayCardWidth();
      birthdayScrollRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Add scroll event listener for Birthday section
  useEffect(() => {
    const birthdayContainer = birthdayScrollRef.current;
    if (birthdayContainer) {
      const handleScroll = () => {
        updateBirthdayArrowVisibility();
      };

      birthdayContainer.addEventListener('scroll', handleScroll);
      // Initial check
      updateBirthdayArrowVisibility();

      return () => {
        birthdayContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Check arrow visibility when data loads
  useEffect(() => {
    // Small delay to ensure DOM is updated after data loads
    const timer = setTimeout(() => {
      updateBabyShowerArrowVisibility();
      updateKidsArrowVisibility();
      updateAnniversaryArrowVisibility();
      updateBirthdayArrowVisibility();
    }, 100);

    return () => clearTimeout(timer);
  }, [getWeddingDecoList, getKidsList, getAnniversaryList, getBirthdayList]);

  // Simple scroll animation for banner images
  useEffect(() => {
    const handleScroll = () => {
      const bannerImages = document.querySelectorAll('.kids-banner-img');
      
      bannerImages.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if image is in viewport
        if (rect.top < windowHeight && rect.bottom > 0) {
          // Add animation classes
          img.classList.add('animate-visible');
        } else {
          // Remove animation classes when out of view
          img.classList.remove('animate-visible');
        }
      });
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array to run once after component mounts

  const selectCity = window.localStorage.getItem("LennyCity");
  // const userDetail = JSON.parse(window.localStorage.getItem("LennyUserDetail"));

  const handleCategory = (item, subCat) => {
    navigate("/products", { state: { item, subCat, selectCity } });
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleProduct = (item) => {
    navigate("/products/product-details", { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const settings = {
    infinite: true,
    loop: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    rewind: true,
    autoplay: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  const settings1 = {
    infinite: false,
    loop: false,
    dots: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
  };

  useEffect(() => {
    const myCarousel = document.querySelector("#carouselExampleIndicators");
    if (myCarousel) {
      new Carousel(myCarousel, {
        interval: 5000,
        pause: false,
        ride: "carousel", // Ensure autoplay starts
      });
    }
  }, []);

  // Banner animation scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const bannerContainer = document.querySelector('.kids-party-banner-container');
      if (bannerContainer) {
        const rect = bannerContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if banner is in viewport (at least 30% visible)
        if (rect.top <= windowHeight * 0.7 && rect.bottom >= windowHeight * 0.3) {
          const bannerImages = bannerContainer.querySelectorAll('.kids-banner-img');
          bannerImages.forEach((img, index) => {
            // Add staggered delay - second image starts 0.3 seconds later
            setTimeout(() => {
              img.classList.add('animate-zoom-in');
            }, index * 300);
          });
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Check on mount in case already in view
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  console.log({ getBirthdayList });

  console.log({ getDealBannerList });

  return (
    <>
      <div className="Hero-Section">
        <div className="cards">
          {/* 1. Same day decoration */}
          <div className="card1" style={{ cursor: "pointer" }} onClick={() => handleCategory({ categoryName: "SAME DAY DECORATION" })}>
            <img src={require("../../assets/images/td.png")} />
            <p>Same day <br /> decoration</p>
          </div>
          {/* 2. Birthday */}
          <div className="card1" style={{ cursor: "pointer" }} onClick={() => handleCategory({ categoryName: "BIRTHDAY" })}>
            <img src={require("../../assets/images/on.png")} />
            <p>Birthday</p>
          </div>
          {/* 3. Ballon bouquet */}
          <div className="card1" style={{ cursor: "pointer" }} onClick={() => handleCategory({ categoryName: "BALLOON BOUQUET" })}>
            <img src={require("../../assets/images/td.png")} />
            <p>Balloon <br /> bouquet</p>
          </div>
          {/* 4. Premium decoration */}
          <div className="card1" style={{ cursor: "pointer" }} onClick={() => handleCategory({ categoryName: "PREMIUM DECOR'S" })}>
            <img src={require("../../assets/images/thd.png")} />
            <p>Premium <br /> decoration</p>
          </div>
          {/* 5. Theme decoration */}
          <div className="card1" style={{ cursor: "pointer" }} onClick={() => handleCategory({ categoryName: "THEME DECOR'S" })}>
            <img src={require("../../assets/images/forthcard.png")} />
            <p>Theme <br /> decoration</p>
          </div>
          {/* 6. Kids party */}
          <div className="card1" style={{ cursor: "pointer" }} onClick={() => handleCategory({ categoryName: "KID'S PARTY" })}>
            <img src={require("../../assets/images/fifthcard.png")} />
            <p>Kids <br /> party</p>
          </div>
          {/* 8. Anniversary */}
          <div className="card1" style={{ cursor: "pointer" }} onClick={() => handleCategory({ categoryName: "ANNIVERSARY" })}>
            <img className="imgmat" src={require("../../assets/images/seventhcard.png")} />
            <p>Anniversary</p>
          </div>
          {/* 9. Welcome */}
          <div className="card1" style={{ cursor: "pointer" }} onClick={() => handleCategory({ categoryName: "WELCOME" })}>
            <img src={require("../../assets/images/eightcard.png")} />
            <p>Welcome</p>
          </div>
          {/* 10. Room decoration */}
          <div className="card1" style={{ cursor: "pointer" }} onClick={() => handleCategory({ categoryName: "ROOM DECORATION" })}>
            <img src={require("../../assets/images/ninthcard.png")} />
            <p>Room <br /> decoration</p>
          </div>
          {/* 11. Baby shower */}
          <div className="card1" style={{ cursor: "pointer" }} onClick={() => handleCategory({ categoryName: "BABY SHOWER" })}>
            <img src={require("../../assets/images/sixthcard.png")} />
            <p>Baby <br /> shower</p>
          </div>
        </div>
        <div id="carouselExampleIndicators" className="carousel slide">
          <div className="carousel-inner">
            {getTopBannerList?.data?.length > 0
              ? getTopBannerList?.data?.map((item, i) => {
                return (
                  <div className={`carousel-item ${i == 0 ? "active" : ""}`}>
                    <div>
                      <div className="HeroRight">
                        <img src={item?.bannerImage} />
                      </div>
                    </div>
                  </div>
                );
              })
              : ""}
          </div>
          <div className="carousel-indicators">
            {getTopBannerList?.data?.length > 0
              ? getTopBannerList?.data?.map((item, i) => {
                return (
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={i}
                    className={`${i == 0 ? "active" : ""}`}
                    aria-current={`${i == 0 ? "true" : "false"}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                );
              })
              : ""}
          </div>
        </div>
      </div>

  <div className="Main">
        <div className="FeatureArea">
          <div className="container-fluid" style={{ width: "100%", padding: "0", margin: "0" }}>
            <div className="section-title">
              <h2>Celebrations We Create</h2>
            </div>
            {/* <Slider {...settings}>
              {getCategoryList?.data?.length > 0
                ? getCategoryList?.data?.map((item, i) => {
                    return (
                      <div className="item" key={i}>
                        <div className="FeatureBoxMain">
                          <div className="FeatureBox">
                            <aside
                              style={{ cursor: "pointer" }}
                              onClick={() => handleCategory(item)}
                              className={
                                i == 0
                                  ? "Blue"
                                  : i == 1
                                  ? "Green"
                                  : i % 2 == 0
                                  ? "Orange"
                                  : i % 3 == 0
                                  ? "Cyan"
                                  : i % 4 == 0
                                  ? "Yellow"
                                  : i % 5 == 0
                                  ? "DarkGreen"
                                  : "Pink"
                              }
                            >
                              <figure>
                                <img src={item?.categoryImage} />
                              </figure>
                            </aside>
                            <h4
                              data-tooltip-id="my-tooltip"
                              data-tooltip-content={item?.categoryName}
                            >
                              {item?.categoryName}
                            </h4>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </Slider> */}
            <div className="row">
              {getCategoryList?.data?.length > 0
                ? getCategoryList?.data?.map((item, i) => {
                  return (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6 top" key={i}>
                      <div className="FeatureBoxMain">
                        <div className="FeatureBox">
                          <aside
                            style={{ cursor: "pointer" }}
                            onClick={() => handleCategory(item)}
                            className={
                              i == 0
                                ? "Blue"
                                : i == 1
                                  ? "Green"
                                  : i % 2 == 0
                                    ? "Orange"
                                    : i % 3 == 0
                                      ? "Cyan"
                                      : i % 4 == 0
                                        ? "Yellow"
                                        : i % 5 == 0
                                          ? "DarkGreen"
                                          : "Pink"
                            }
                          >
                            <figure>
                              <img src={item?.categoryImage} />
                            </figure>
                          </aside>
                          <h4
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={item?.categoryName}
                          >
                            {item?.categoryName}
                          </h4>
                        </div>
                      </div>
                    </div>
                  );
                })
                : ""}
            </div>
          </div>
        </div>
        <div className="BirthdayDecorationArea">
          {/* <Slider {...settings1}> */}
          {getDealBannerList?.data?.length > 0
            ? getDealBannerList?.data?.map((item, i) => {
              if (item?.dealbannerTitle == "Birthday Decoration") {
                return (
                  <img
                    key={i}
                    src={item?.dealbannerImage}
                    onClick={() =>
                      handleCategory({ categoryName: "BIRTHDAY" })
                    }
                    style={{ cursor: "pointer" }}
                  />
                );
              }
            })
            : ""}
          {/* </Slider> */}
        </div>

        <ServiceCarousel />

        <div className="BirthdayDecorationArea BirthDecImage">
          <div className="container-fluid">
            <div className="section-title">
              <h2>Birthday Decoration</h2>
              <p>
                Transform Your Birthday into a Magical Celebration with Stunning
                Decorations!
              </p>
  
            </div>

            <div className="scroll-container-wrapper">
              {/* Left Arrow */}
              {showBirthdayPrevBtn && (
                <button className="testimonial-nav-btn prev birthday-nav-btn" onClick={handleBirthdayScrollLeft}>
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
              )}

              {/* Scrollable Content */}
              <div
                ref={birthdayScrollRef}
                className="homepage-birthday-scroll-container"
              >
                {getBirthdayList?.data?.length > 0 ? (
                  getBirthdayList?.data?.map((item, i) => {
                    return (
                      <div key={i} className="homepage-birthday-item">
                        <div className="homepage-product-card">
                          <img
                            src={item?.productimages?.at(0)}
                            onClick={() => handleProduct(item)}
                            style={{ cursor: 'pointer' }}
                            alt={item?.productDetails?.productname}
                          />
                          
                          <div className="homepage-card-body">
                            <div className="homepage-card-info">
                              <p className="homepage-card-location">At your location</p>
                              <h3 className="homepage-card-title">{item?.productDetails?.productname}</h3>
                              <div className="homepage-card-meta">
                                <div className="homepage-rating-location">
                                  <div className="homepage-card-rating">
                                    <div className="homepage-stars">
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star">★</span>
                                    </div>
                    {/* Removed rating number */}
                                  </div>
                                </div>
                                <div className="homepage-price-section">
                                  {item?.priceDetails?.discountedPrice ? (
                                    <>
                                      <div className="homepage-price-row">
                                        <span className="homepage-current-price">₹{item?.priceDetails?.discountedPrice}</span>
                      {/* Removed discount percentage */}
                                      </div>
                                      <span className="homepage-original-price">₹{item?.priceDetails?.price}</span>
                                    </>
                                  ) : (
                                    <span className="homepage-current-price">₹{item?.priceDetails?.price}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            className="homepage-card-action-button"
                            onClick={() => handleProduct(item)}
                          >
                            BOOK NOW
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No item Available</p>
                )}
                
                {/* View All Button inside the scroller */}
                <div className="homepage-birthday-item view-all-item">
                  <div className="homepage-product-card view-all-card" onClick={() => handleCategory({ categoryName: "BIRTHDAY" })}>
                    <div className="view-all-image">
                      <div className="celebration-icon">🎉</div>
                    </div>
                    
                    <div className="homepage-card-body">
                      <div className="homepage-card-info">
                        <h3 className="homepage-card-title">View All Birthday Decorations</h3>
                        <p className="homepage-card-location">Explore more options</p>
                      </div>
                    </div>
                    
                    <button className="homepage-view-all-button">
                      EXPLORE MORE
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Right Arrow */}
              {showBirthdayNextBtn && (
                <button className="testimonial-nav-btn next birthday-nav-btn" onClick={handleBirthdayScrollRight}>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="BirthdayDecorationArea">
          {/* <Slider {...settings1}> */}
          {getDealBannerList?.data?.length > 0
            ? getDealBannerList?.data?.map((item, i) => {
              if (item?.dealbannerTitle == "Anniversary Decoration") {
                return (
                  <img
                    key={i}
                    src={item?.dealbannerImage}
                    onClick={() =>
                      handleCategory({ categoryName: "ANNIVERSARY" })
                    }
                    style={{ cursor: "pointer" }}
                  />
                );
              }
            })
            : ""}
          {/* </Slider> */}
        </div>

        <div className="BirthdayDecorationArea AnniDecImage">
          <div className="container-fluid">
            <div className="section-title">
              <h2>Anniversary Decoration</h2>
              <p>
                Celebrate Your Love with Elegant & Breathtaking Anniversary
                Decorations!
              </p>
            </div>

            <div className="scroll-container-wrapper">
              {/* Left Arrow */}
              {showAnniversaryPrevBtn && (
                <button className="testimonial-nav-btn prev anniversary-nav-btn" onClick={handleAnniversaryScrollLeft}>
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
              )}

              {/* Scrollable Content */}
              <div
                ref={anniversaryScrollRef}
                className="homepage-anniversary-scroll-container"
              >
                {getAnniversaryList?.data?.length > 0 ? (
                  getAnniversaryList?.data?.map((item, i) => {
                    return (
                      <div key={i} className="homepage-anniversary-item">
                        <div className="homepage-product-card">
                          <img
                            src={item?.productimages?.at(0)}
                            onClick={() => handleProduct(item)}
                            style={{ cursor: 'pointer' }}
                            alt={item?.productDetails?.productname}
                          />
                          
                          <div className="homepage-card-body">
                            <div className="homepage-card-info">
                              <p className="homepage-card-location">At your location</p>
                              <h3 className="homepage-card-title">{item?.productDetails?.productname}</h3>
                              <div className="homepage-card-meta">
                                <div className="homepage-rating-location">
                                  <div className="homepage-card-rating">
                                    <div className="homepage-stars">
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star">★</span>
                                    </div>
                    {/* Removed rating number */}
                                  </div>
                                </div>
                                <div className="homepage-price-section">
                                  {item?.priceDetails?.discountedPrice ? (
                                    <>
                                      <div className="homepage-price-row">
                                        <span className="homepage-current-price">₹{item?.priceDetails?.discountedPrice}</span>
                      {/* Removed discount percentage */}
                                      </div>
                                      <span className="homepage-original-price">₹{item?.priceDetails?.price}</span>
                                    </>
                                  ) : (
                                    <span className="homepage-current-price">₹{item?.priceDetails?.price}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            className="homepage-card-action-button"
                            onClick={() => handleProduct(item)}
                          >
                            BOOK NOW
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No item Available</p>
                )}
                
                {/* View All Button inside the scroller */}
                <div className="homepage-anniversary-item view-all-item">
                  <div className="homepage-product-card view-all-card" onClick={() => handleCategory({ categoryName: "ANNIVERSARY" })}>
                    <div className="view-all-image">
                      <div className="celebration-icon">💕</div>
                    </div>
                    
                    <div className="homepage-card-body">
                      <div className="homepage-card-info">
                        <h3 className="homepage-card-title">View All Anniversary Decorations</h3>
                        <p className="homepage-card-location">Explore more options</p>
                      </div>
                    </div>
                    
                    <button className="homepage-view-all-button">
                      EXPLORE MORE
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Right Arrow */}
              {showAnniversaryNextBtn && (
                <button className="testimonial-nav-btn next anniversary-nav-btn" onClick={handleAnniversaryScrollRight}>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="BirthdayDecorationArea" style={{ cursor: "pointer" }}>
          {/* <Slider {...settings1}> */}
          {getDealBannerList?.data?.length > 0
            ? getDealBannerList?.data?.map((item, i) => {
              if (item?.dealbannerTitle == "Kids Party") {
                return (
                  <img
                    key={i}
                    src={item?.dealbannerImage}
                    onClick={() =>
                      handleCategory({ categoryName: "KID'S PARTY" })
                    }
                  />
                );
              }
            })
            : ""}
          {/* </Slider> */}
        </div>

        <div className="BirthdayDecorationArea BirthDecImage">
          <div className="container-fluid">
            {/* Animated Banner Images */}
            <div className="kids-party-banner-container">
              <div className="animated-banner-image">
                <img 
                  src={require("../../assets/images/840x400_Banner-2_Desktop_01_20241029_125154.avif")} 
                  alt="Kids Party Banner" 
                  className="kids-banner-img"
                />
              </div>
              <div className="animated-banner-image">
                <img 
                  src={require("../../assets/images/840x400_Banner-2_Desktop_01_20241029_125154.avif")} 
                  alt="Kids Party Banner" 
                  className="kids-banner-img"
                />
              </div>
            </div>

            <div className="section-title">
              <h2>Kid's Party</h2>
              <p>
                Turn Your Kid's Party into a Whimsical Wonderland of Fun &
                Magic!
              </p>
            </div>

            <div className="scroll-container-wrapper">
              {/* Left Arrow */}
              {showKidsPrevBtn && (
                <button className="testimonial-nav-btn prev kids-nav-btn" onClick={handleKidsScrollLeft}>
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
              )}

              {/* Scrollable Content */}
              <div
                ref={kidsScrollRef}
                className="homepage-kids-scroll-container"
              >
                {getKidsList?.data?.length > 0 ? (
                  getKidsList?.data?.map((item, i) => {
                    return (
                      <div key={i} className="homepage-kids-item">
                        <div className="homepage-product-card">
                          <img
                            src={item?.productimages?.at(0)}
                            onClick={() => handleProduct(item)}
                            style={{ cursor: 'pointer' }}
                            alt={item?.productDetails?.productname}
                          />
                          
                          <div className="homepage-card-body">
                            <div className="homepage-card-info">
                              <p className="homepage-card-location">At your location</p>
                              <h3 className="homepage-card-title">{item?.productDetails?.productname}</h3>
                              <div className="homepage-card-meta">
                                <div className="homepage-rating-location">
                                  <div className="homepage-card-rating">
                                    <div className="homepage-stars">
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star">★</span>
                                    </div>
                    {/* Removed rating number */}
                                  </div>
                                </div>
                                <div className="homepage-price-section">
                                  {item?.priceDetails?.discountedPrice ? (
                                    <>
                                      <div className="homepage-price-row">
                                        <span className="homepage-current-price">₹{item?.priceDetails?.discountedPrice}</span>
                      {/* Removed discount percentage */}
                                      </div>
                                      <span className="homepage-original-price">₹{item?.priceDetails?.price}</span>
                                    </>
                                  ) : (
                                    <span className="homepage-current-price">₹{item?.priceDetails?.price}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            className="homepage-card-action-button"
                            onClick={() => handleProduct(item)}
                          >
                            BOOK NOW
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No item Available</p>
                )}
                
                {/* View All Button inside the scroller */}
                <div className="homepage-kids-item view-all-item">
                  <div className="homepage-product-card view-all-card" onClick={() => handleCategory({ categoryName: "KID'S PARTY" })}>
                    <div className="view-all-image">
                      <div className="celebration-icon">🎈</div>
                    </div>
                    
                    <div className="homepage-card-body">
                      <div className="homepage-card-info">
                        <h3 className="homepage-card-title">View All Kids Party Decorations</h3>
                        <p className="homepage-card-location">Explore more options</p>
                      </div>
                    </div>
                    
                    <button className="homepage-view-all-button">
                      EXPLORE MORE
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Right Arrow */}
              {showKidsNextBtn && (
                <button className="testimonial-nav-btn next kids-nav-btn" onClick={handleKidsScrollRight}>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="BirthdayDecorationArea" style={{ cursor: "pointer" }}>
          {/* <Slider {...settings1}> */}
          {getDealBannerList?.data?.length > 0
            ? getDealBannerList?.data?.map((item, i) => {
              if (item?.dealbannerTitle == "Baby Shower") {
                return (
                  <img
                    key={i}
                    src={item?.dealbannerImage}
                    onClick={() =>
                      handleCategory({ categoryName: "BABY SHOWER" })
                    }
                  />
                );
              }
            })
            : ""}
          {/* </Slider> */}
        </div>

        <div className="BirthdayDecorationArea AnniDecImage">
          <div className="container" style={{ padding: "0", margin: "0 auto", width: "100%" }}>
            <div className="section-title">
              <h2>Baby Shower</h2>
              <p>
                Celebrate the Joy of New Beginnings with Enchanting Baby Shower
                Decor!
              </p>
            </div>

            <div className="scroll-container-wrapper">
              {/* Left Arrow */}
              {showBabyShowerPrevBtn && (
                <button className="testimonial-nav-btn prev baby-shower-nav-btn" onClick={handleBabyShowerScrollLeft}>
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
              )}

              {/* Scrollable Content */}
              <div
                ref={babyShowerScrollRef}
                className="testimonials-slider homepage-baby-shower-scroll-container"
              >
                {getWeddingDecoList?.data?.length > 0 ? (
                  getWeddingDecoList?.data?.map((item, i) => {
                    return (
                      <div key={i} className="homepage-baby-shower-item">
                        <div className="homepage-product-card">
                          <img
                            src={item?.productimages?.at(0)}
                            onClick={() => handleProduct(item)}
                            style={{ cursor: 'pointer' }}
                            alt={item?.productDetails?.productname}
                          />
                          
                          <div className="homepage-card-body">
                            <div className="homepage-card-info">
                              <p className="homepage-card-location">At your location</p>
                              <h3 className="homepage-card-title">{item?.productDetails?.productname}</h3>
                              <div className="homepage-card-meta">
                                <div className="homepage-rating-location">
                                  <div className="homepage-card-rating">
                                    <div className="homepage-stars">
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star filled">★</span>
                                      <span className="homepage-star">★</span>
                                    </div>
                    {/* Removed rating number */}
                                  </div>
                                </div>
                                <div className="homepage-price-section">
                                  {item?.priceDetails?.discountedPrice ? (
                                    <>
                                      <div className="homepage-price-row">
                                        <span className="homepage-current-price">₹{item?.priceDetails?.discountedPrice}</span>
                      {/* Removed discount percentage */}
                                      </div>
                                      <span className="homepage-original-price">₹{item?.priceDetails?.price}</span>
                                    </>
                                  ) : (
                                    <span className="homepage-current-price">₹{item?.priceDetails?.price}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            className="homepage-card-action-button"
                            onClick={() => handleProduct(item)}
                          >
                            BOOK NOW
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No item Available</p>
                )}
                
                {/* View All Button inside the scroller */}
                <div className="homepage-baby-shower-item view-all-item">
                  <div className="homepage-product-card view-all-card" onClick={() => handleCategory({ categoryName: "BABY SHOWER" })}>
                    <div className="view-all-image">
                      <div className="celebration-icon">👶</div>
                    </div>
                    
                    <div className="homepage-card-body">
                      <div className="homepage-card-info">
                        <h3 className="homepage-card-title">View All Baby Shower Decorations</h3>
                        <p className="homepage-card-location">Explore more options</p>
                      </div>
                    </div>
                    
                    <button className="homepage-view-all-button">
                      EXPLORE MORE
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Right Arrow */}
              {showBabyShowerNextBtn && (
                <button className="testimonial-nav-btn next baby-shower-nav-btn" onClick={handleBabyShowerScrollRight}>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="BirthdayDecorationArea">
          <img src={require("../../assets/images/Photos 1.png")} />
        </div>
        <article>
          <img
            className="stats-image animated"
            style={{ margin: "10px 0" }}
            src={require("../../assets/images/stats 2.png")}
          />
        </article>


        {/* ===== CUSTOMER REVIEWS SECTION ===== */}
        <div className="reviews-section">
          <div className="container" style={{ padding: "0", margin: "0 auto" }}>
            <div className="reviews-header">
              <h1>What Customers Say</h1>
              <p>Genuine feedback from our delighted customers who trusted us with their special moments</p>
            </div>
            {latestReviews.length === 0 ? (
              <div className="testimonials-container">
                {showReviewsPrevBtn && (
                  <button className="testimonial-nav-btn prev" onClick={handleReviewsScrollLeft}>
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                )}
                <div className="testimonials-slider" ref={reviewsScrollRef}>
                  {/* Sample reviews with better names and product images */}
                  {[
                    { 
                      name: "Priya Sharma", 
                      rating: 5, 
                      comment: "Absolutely amazing birthday decoration! The team was professional and the setup was beyond our expectations.", 
                      productName: "Glitzy Silver and Black Birthday Decor", 
                      userImage: "https://images.unsplash.com/photo-1494790108755-2616b612b739?w=150&h=150&fit=crop&crop=face",
                      productImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=80&h=80&fit=crop"
                    },
                    { 
                      name: "Rahul Patel", 
                      rating: 4, 
                      comment: "Great service for our anniversary celebration. The balloon arrangements were beautiful and exactly what we wanted.", 
                      productName: "Dreamy Ring Candlelight Dinner", 
                      userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                      productImage: "https://images.unsplash.com/photo-1518135714426-c18f5ffb6f4d?w=80&h=80&fit=crop"
                    },
                    { 
                      name: "Sneha Verma", 
                      rating: 5, 
                      comment: "Perfect decoration for our baby shower! Every detail was taken care of and the colors were just perfect.", 
                      productName: "Safari Adventure Birthday Package", 
                      userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                      productImage: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=80&h=80&fit=crop"
                    },
                    { 
                      name: "Arjun Singh", 
                      rating: 4, 
                      comment: "Excellent work on our wedding decoration. The team was punctual and very creative with their designs.", 
                      productName: "Caricature Artist For Kids Birthday Party", 
                      userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
                      productImage: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=80&h=80&fit=crop"
                    },
                    { 
                      name: "Kavya Reddy", 
                      rating: 5, 
                      comment: "Outstanding birthday surprise setup! My daughter was absolutely delighted. Highly recommend their services.", 
                      productName: "Expert Makeup for Kids Birthday", 
                      userImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
                      productImage: "https://images.unsplash.com/photo-1514613818067-e207c3441db3?w=80&h=80&fit=crop"
                    }
                  ].map((review, index) => (
                    <div key={index} className="testimonial-card">
                      <div className="testimonial-header">
                        <div className="customer-info">
                          <div className="customer-avatar">
                            <img src={review.userImage} alt={review.name} />
                          </div>
                          <div className="customer-details">
                            <h3>{review.name}</h3>
                            <div className="verified-purchase">Verified Purchase</div>
                          </div>
                        </div>
                      </div>
                      <div className="testimonial-content">
                        <p>{review.comment}</p>
                      </div>
                      <div className="product-info">
                        <div className="product-image">
                          <img src={review.productImage} alt={review.productName} />
                        </div>
                        <div className="product-details">
                          <div className="product-name">{review.productName}</div>
                          <div className="product-rating">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`fa-solid fa-star ${i < review.rating ? 'filled' : ''}`}
                              ></i>
                            ))}
                            <span className="product-rating-text">{review.rating}.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {showReviewsNextBtn && (
                  <button className="testimonial-nav-btn next" onClick={handleReviewsScrollRight}>
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                )}
              </div>
            ) : (
              <div className="testimonials-container">
                {showReviewsPrevBtn && (
                  <button className="testimonial-nav-btn prev" onClick={handleReviewsScrollLeft}>
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                )}
                <div className="testimonials-slider" ref={reviewsScrollRef}>
                  {latestReviews.map((review, index) => (
                    <div key={index} className="testimonial-card">
                      <div className="testimonial-header">
                        <div className="customer-info">
                          <div className="customer-avatar">
                            <img src={review.userImage || "https://cdn-icons-png.flaticon.com/512/6681/6681204.png"} alt={review.name} />
                          </div>
                          <div className="customer-details">
                            <h3>{review.name}</h3>
                            <div className="verified-purchase">Verified Purchase</div>
                          </div>
                        </div>
                      </div>
                      <div className="testimonial-content">
                        <p>{review.comment}</p>
                      </div>
                      <div className="product-info">
                        <div className="product-image">
                          <img src={review.productImage || "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=80&h=80&fit=crop"} alt={review.productName} />
                        </div>
                        <div className="product-details">
                          <div className="product-name">{review.productName}</div>
                          <div className="product-rating">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`fa-solid fa-star ${i < review.rating ? 'filled' : ''}`}
                              ></i>
                            ))}
                            <span className="product-rating-text">{review.rating}.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {showReviewsNextBtn && (
                  <button className="testimonial-nav-btn next" onClick={handleReviewsScrollRight}>
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="about-section">
          <h1>
            <strong> Skyrixe – Celebrate Life’s Special Moments with us
              Us&nbsp;&nbsp;&nbsp;</strong>
          </h1>
          <p>
            <span>Each celebratory occasion needs a unique touch of excellence.
              Skyrixe&nbsp; devotes itself to providing memorable experiences for every
              moment. Do you&nbsp; remember the last time you got services tailored for
              you? Neither can we, and that’s exactly why we go above and beyond
              every single time, making sure that every service we offer is truly
              remarkable. With our setup services, every special moment can come to life.
              We provide romantic dinners and simple birthday decorations.</span>
          </p>
          <p className='second'>
            <span>In our ten years of operation, we have held many events across India. We
              have served thousands of customers as they created special memories. Our
              dedicated team creates impressive event experiences for our customers. We
              enhance celebrations with balloon decorations and themed party decor. We
              cater to both small home events and large banquet functions.</span>
          </p>
          <h2>
            <strong>Our Services – Fully Customizable For Your Every Event</strong>
          </h2>
          <p>
            <span>Every event requires a personalized touch to be unique. Skyrixe provides
              decoration solutions for basic birthday arrangements, anniversary
              decorations, and complete surprise party preparations. Our deep experience
              with multiple event decoration services enhances your special moments on all
              occasions.</span>
          </p>
          <div className="city-links">
  <a href="#">Balloon decoration in Bangalore</a> |
  <a href="#">Balloon decoration in Bhubaneswar</a> |
  <a href="#">Balloon decoration in Chennai</a> |
  <a href="#">Balloon decoration in Delhi</a> |
  <a href="#">Balloon decoration in Gurgaon</a> |
  <a href="#">Balloon decoration in Hyderabad</a> |
  <a href="#">Balloon decoration in Mumbai</a> |
  <a href="#">Balloon decoration in Pune</a> |
  <a href="#">Balloon decoration in Kolkata</a> |
  <a href="#">Balloon decoration in Noida</a> |
  <a href="#">Balloon decoration in Patna</a>
</div>

        </div>

        {/* ===== FAQ SECTION ===== */}
        <div className="faq-section-enhanced">
          <div className="container" style={{ padding: "0", margin: "0 auto" }}>
            <div className="section-title">
              <h2>Frequently Asked Questions</h2>
              <p>Everything you need to know about our decoration services</p>
            </div>
            
            <div className="faq-grid">
              <div className={`faq-item ${activeFaq === 0 ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => handleFaqToggle(0)}>
                  <h3>What kind of events do you provide your decorations for?</h3>
                  <div className="faq-toggle">
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
                <div className="faq-answer">
                  <p>We provide decorations for all types of celebrations including birthdays, weddings, anniversaries, baby showers, corporate events, housewarming parties, engagement ceremonies, and festival celebrations. Our team specializes in creating magical moments for every occasion.</p>
                </div>
              </div>
              
              <div className={`faq-item ${activeFaq === 1 ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => handleFaqToggle(1)}>
                  <h3>How do we book a service with you?</h3>
                  <div className="faq-toggle">
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
                <div className="faq-answer">
                  <p>Booking is easy! You can book through our website, call us directly, message us on WhatsApp, or reach out via our social media channels. Our team will guide you through the entire process and help customize your perfect celebration.</p>
                </div>
              </div>
              
              <div className={`faq-item ${activeFaq === 2 ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => handleFaqToggle(2)}>
                  <h3>How much does simple birthday decoration cost?</h3>
                  <div className="faq-toggle">
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
                <div className="faq-answer">
                  <p>Our simple birthday decoration packages start from ₹2,999 and can go up to ₹15,000+ depending on your requirements. We offer various packages to suit different budgets and preferences. Contact us for a personalized quote.</p>
                </div>
              </div>
              
              <div className={`faq-item ${activeFaq === 3 ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => handleFaqToggle(3)}>
                  <h3>In which cities is Skyrixe available?</h3>
                  <div className="faq-toggle">
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
                <div className="faq-answer">
                  <p>We currently serve major cities including Bangalore, Mumbai, Delhi, Chennai, Hyderabad, Pune, Kolkata, Gurgaon, Noida, Bhubaneswar, and Patna. We're continuously expanding to serve more cities across India.</p>
                </div>
              </div>
              
              <div className={`faq-item ${activeFaq === 4 ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => handleFaqToggle(4)}>
                  <h3>Do you provide same-day decoration services?</h3>
                  <div className="faq-toggle">
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
                <div className="faq-answer">
                  <p>Yes, we offer same-day decoration services based on availability. However, we recommend booking at least 24-48 hours in advance to ensure we can accommodate your specific requirements and preferences.</p>
                </div>
              </div>
              
              <div className={`faq-item ${activeFaq === 5 ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => handleFaqToggle(5)}>
                  <h3>Can I customize the decoration according to my theme?</h3>
                  <div className="faq-toggle">
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
                <div className="faq-answer">
                  <p>Absolutely! We specialize in custom decorations. Share your theme, color preferences, and specific requirements with our team, and we'll create a unique decoration setup tailored to your vision and budget.</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="BirthdayDecorationArea client">

          <img src={require("../../assets/images/Our Clients.png")} className="client-img-desktop" />
          {/* Mobile-only Our Clients image */}
          <img
            src={require("../../assets/images/stats 3.png")}
            alt="Our Clients"
            className="client-img-mobile"
          />


        </div>
      </div >
      <Tooltip id="my-tooltip" place="bottom" />
    </>
  );
};

export default Main;
