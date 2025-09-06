import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { categoryProductList } from "../../reduxToolkit/Slices/ProductList/listApis";
import "react-tooltip/dist/react-tooltip.css";
import { Modal } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import "react-range-slider-input/dist/style.css";
import "./Product.css"; // Product page specific styles
import { credAndUrl } from "../../config/config";


const CustomPrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev" onClick={onClick}>
    <i className="fa-solid fa-angle-left"></i>
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div className="custom-arrow next" onClick={onClick}>
    <i className="fa-solid fa-angle-right"></i>
  </div>
);

const initialState = {
  city: false,
  pincode: 0,
  filter_city: false,
  minPrice: 0,
  maxPrice: 10000,
  filter_minPrice: 0,
  filter_maxPrice: 10000,
  showAll: false,
  set_minPrice: 0,
  set_maxPrice: 0,
  set_filter_minPrice: 0,
  set_filter_maxPrice: 0,
  cityApply: false,
  isLoc_open: false,
  isPrice_open: false,
  isBestfilter_open: false,
  sameDay: false,
  discount: false,
  showSortModal: false,
  sortBy: "recommended"
};

const Product = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [iState, updateState] = useState(initialState);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showSortFab, setShowSortFab] = useState(false);
  const {
    city,
    filter_city,
    minPrice,
    maxPrice,
    set_maxPrice,
    set_minPrice,
    isLoc_open,
    isPrice_open,
    sameDay,
    discount,
    showSortModal,
    sortBy
  } = iState;
  const [value, setValue] = useState([minPrice, maxPrice]);
  const selectCity = window.localStorage.getItem("LennyCity");
  const { loader, getCategoryProductList } = useSelector(
    (state) => state.productList
  );
  const state = location?.state;
  const navigate = useNavigate();
  const initializedRef = useRef(false);
  const refetchedRef = useRef(false);
  const cardsRef = useRef(null);

  // Resolve image URLs robustly (arrays of strings or objects) and sanitize spaces/backslashes
  const sanitizeUrl = (u) => {
    if (!u || typeof u !== 'string') return '';
    const fixed = u.trim().replace(/\\/g, '/');
    return fixed.includes(' ') ? fixed.replace(/\s/g, '%20') : fixed;
  };
  const getUrlFromMaybeObject = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return sanitizeUrl(val);
    if (typeof val === 'object') {
      const cand = val.url || val.secure_url || val.image || val.src || val.link || val.Location || val.path || val.location;
      return sanitizeUrl(typeof cand === 'string' ? cand : '');
    }
    return '';
  };

  const handleProduct = (item) => {
    navigate("product-details", { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChangeSlider = (event) => {
    updateState({
      ...iState,
      minPrice: event[0],
      maxPrice: event[1],
    });
    setValue([event[0], event[1]]);

    console.log(event[0]);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name == "city" || name == "filter_city") {
      if (checked) {
        if (name == "city") {
          window.localStorage?.setItem(
            "LennyCity",
            JSON.parse(value)?.cityName
          );
          window.localStorage?.setItem(
            "LennyPincode",
            JSON.stringify(JSON.parse(value)?.pincode)
          );
        }

        updateState({
          ...iState,
          [name]: JSON.parse(value)?.cityName,
          pincode: JSON.parse(value)?.pincode,
        });
      } else {
        updateState({ ...iState, [name]: false, pincode: 0 });
      }
    } else if (name == "minPrice" || name == "maxPrice") {
      let modifiedValue =
        name == "minPrice"
          ? value >= 0
            ? value
            : minPrice + ""
          : value >= 0
            ? value
            : maxPrice + "";
      updateState({ ...iState, [name]: modifiedValue });
    } else if (name == "sameDay" || name == "discount") {
      updateState({ ...iState, [name]: checked });
    }
  };

  const handleCategory = (item, subCat) => {
    navigate("/products", { state: { item, subCat, selectCity } });
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  // Carousel Navigation Functions
  const handleNextCard = () => {
    const totalCards = getCategoryProductList?.subcategory?.length || 0;
    let maxVisibleCards;
    
    if (windowWidth <= 480) {
      maxVisibleCards = 1; // Extra small mobile: show 1 centered
    } else if (windowWidth <= 768) {
      maxVisibleCards = 1; // Mobile: show 1 centered with peek
    } else if (windowWidth <= 1024) {
      maxVisibleCards = 3; // Tablet: show 3 full + part of 4th
    } else {
      maxVisibleCards = 5; // Desktop: show 5 full + part of 6th
    }
    
    if (currentCarouselIndex < totalCards - 1) {
      setCurrentCarouselIndex(prev => prev + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCarouselIndex > 0) {
      setCurrentCarouselIndex(prev => prev - 1);
    }
  };

  const handleSortModal = () => {
    updateState({
      ...iState,
      showSortModal: !showSortModal,
    });
  };

  const handleSortChange = (sortOption) => {
    updateState({
      ...iState,
      sortBy: sortOption,
      showSortModal: false,
    });

    // Sort the products based on the selected option
    if (getCategoryProductList?.data?.length > 0) {
      let sortedData = [...getCategoryProductList.data];

      switch (sortOption) {
        case 'priceLowToHigh':
          sortedData.sort((a, b) => {
            const priceA = Number(a?.priceDetails?.discountedPrice || a?.priceDetails?.price || 0);
            const priceB = Number(b?.priceDetails?.discountedPrice || b?.priceDetails?.price || 0);
            return priceA - priceB;
          });
          break;
        case 'priceHighToLow':
          sortedData.sort((a, b) => {
            const priceA = Number(a?.priceDetails?.discountedPrice || a?.priceDetails?.price || 0);
            const priceB = Number(b?.priceDetails?.discountedPrice || b?.priceDetails?.price || 0);
            return priceB - priceA;
          });
          break;
        case 'recommended':
        default:
          // Reset to original order
          sortedData = [...getCategoryProductList.data];
          break;
      }

      setSortedProducts(sortedData);
    }
  };

  const settings = {
    infinite: true,
    loop: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    margin: 10,
    rewind: true,
    autoplay: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          arrows: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2.5,
          arrows: true,
          margin: 5,
        },
      },
    ],
  };

  useEffect(() => {
    if (state || selectCity) {
      updateState({ ...iState, city: selectCity, filter_city: selectCity });
      const payload = {
        category: state?.item?.categoryName,
        city: selectCity,
      };
      if (state?.subCat) payload.subcategory = state.subCat;
    dispatch(categoryProductList(payload));
    initializedRef.current = true;
    }
  }, [state, selectCity]);

  useEffect(() => {
  if (!initializedRef.current) return;
    const payload = {
      category: state?.item?.categoryName,
      city: selectCity,
      sameDay,
      discount,
    };
    if (state?.subCat) payload.subcategory = state.subCat;
    if (payload.category && payload.city) {
      dispatch(categoryProductList(payload));
    }
  }, [sameDay, discount]);

  useEffect(() => {
  if (!initializedRef.current) return;
    const payload = {
      category: state?.item?.categoryName,
      city: selectCity,
      minPrice: minPrice,
      maxPrice: maxPrice,
      sameDay,
      discount,
    };
    if (state?.subCat) payload.subcategory = state.subCat;
    if (!(payload.category && payload.city)) return;
    const timeoutId = setTimeout(() => {
      dispatch(categoryProductList(payload));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [minPrice, maxPrice]);

  // If no subcategory was provided, and API returned subcategories, refetch using the first one to populate products
  useEffect(() => {
    if (refetchedRef.current) return;
    if (!getCategoryProductList || !getCategoryProductList?.subcategory) return;
    if (Array.isArray(sortedProducts) && sortedProducts.length > 0) return; // already have data
    const firstSub = getCategoryProductList.subcategory[0]?.subcategoryName;
    const category = state?.item?.categoryName;
    if (category && firstSub && selectCity && !state?.subCat) {
      refetchedRef.current = true;
      dispatch(categoryProductList({ category, subcategory: firstSub, city: selectCity }));
    }
  }, [getCategoryProductList?.subcategory, sortedProducts?.length]);

  useEffect(() => {
    if (!getCategoryProductList) return;
    updateState(prev => ({
      ...prev,
      set_minPrice: prev.set_minPrice == 0 ? getCategoryProductList?.minPrice : prev.set_minPrice,
      set_maxPrice: prev.set_maxPrice == 0 ? getCategoryProductList?.maxPrice : prev.set_maxPrice,
      minPrice: prev.minPrice == 0 ? getCategoryProductList?.minPrice : prev.minPrice,
      maxPrice: prev.maxPrice == 10000 ? getCategoryProductList?.maxPrice : prev.maxPrice,
    }));
    setSortedProducts(getCategoryProductList?.data || []);
  }, [getCategoryProductList]);

  useEffect(() => {
    if (!getCategoryProductList?.data?.length) return;

    if (sortBy === 'recommended') {
      setSortedProducts([...getCategoryProductList.data]);
      return;
    }
    let sortedData = [...getCategoryProductList.data];

    if (sortBy === 'priceLowToHigh') {
      sortedData.sort((a, b) => {
        const priceA = Number(a?.priceDetails?.discountedPrice || a?.priceDetails?.price || 0);
        const priceB = Number(b?.priceDetails?.discountedPrice || b?.priceDetails?.price || 0);
        return priceA - priceB;
      });
    } else if (sortBy === 'priceHighToLow') {
      sortedData.sort((a, b) => {
        const priceA = Number(a?.priceDetails?.discountedPrice || a?.priceDetails?.price || 0);
        const priceB = Number(b?.priceDetails?.discountedPrice || b?.priceDetails?.price || 0);
        return priceB - priceA;
      });
    }

    setSortedProducts(sortedData);
  }, [getCategoryProductList, sortBy]);

  // Window resize effect for responsive carousel
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setCurrentCarouselIndex(0); // Reset carousel position on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show Sort button when product cards are in view; hide near top
  useEffect(() => {
    const target = cardsRef.current;
    if (!target) return;

    // Prefer IntersectionObserver, fallback to scroll handler where not supported
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setShowSortFab(Boolean(entry.isIntersecting));
        },
        { root: null, threshold: 0.01 }
      );
      observer.observe(target);
      return () => observer.disconnect();
    }

    const onScroll = () => {
      const rect = target.getBoundingClientRect();
      const viewH = window.innerHeight || document.documentElement.clientHeight;
      // show when top of grid is within viewport minus some offset
      setShowSortFab(rect.top < viewH - 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sortedProducts?.length]);

  return (
    <>
      <div className="Main products-page-container">
        <div className="BirthdayDecorationArea p-0">
          {(() => {
            const cat = state?.item?.categoryName;
            let src = null;
            if (cat === "BIRTHDAY") src = require("../../assets/images/Birthday inner banner.png");
            else if (cat === "ROOM & HALL DECOR'S") src = require("../../assets/images/room decor inner banner.png");
            else if (cat === "KID'S PARTY") src = require("../../assets/images/Party Magic.png");
            else if (cat === "PREMIUM DECOR'S") src = require("../../assets/images/PREMIUM DECOR'S inner banner.png");
            else if (cat === "THEME DECOR'S") src = require("../../assets/images/THEME DECOR'S inner banner.png");
            else if (cat === "ANNIVERSARY") src = require("../../assets/images/Anniversary inner banner png.png");
            else if (cat === "BABY SHOWER") src = require("../../assets/images/baby shower inner banner.png");
            else if (cat === "BALLOON BOUQUET") src = require("../../assets/images/ballon banguetes inner banner.png");
            return src ? <img src={src} alt={cat || "Category banner"} /> : null;
          })()}
        </div>
        <div className="FeatureArea carouselPadding">
          <div className="modern-carousel-section">
            <div className="container-fluid">
              <div className="modern-carousel-wrapper">
                {/* Previous Arrow */}
                {currentCarouselIndex > 0 && (
                  <button 
                    className="modern-carousel-nav modern-nav-prev" 
                    onClick={handlePrevCard}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                )}

                {/* Carousel Container */}
                <div className="modern-carousel-container">
                  <div 
                    className="modern-carousel-track"
                    style={{
                      transform: `translateX(-${currentCarouselIndex * (windowWidth <= 480 ? 65 : windowWidth <= 768 ? 70 : windowWidth <= 1024 ? 30 : 18)}%)`,
                    }}
                  >
                    {getCategoryProductList?.subcategory?.map((item, i) => {
                      // Determine if this item should be highlighted (centered)
                      const isActive = i === currentCarouselIndex;
                      
                      return (
                        <div 
                          key={i} 
                          className={`modern-carousel-item ${isActive ? 'active' : ''}`}
                          onClick={() =>
                            handleCategory(
                              { categoryName: state?.item?.categoryName },
                              item?.subcategoryName
                            )
                          }
                        >
                          <div className="modern-item-image">
                            {(() => {
                              const fallback = 'https://via.placeholder.com/200x120?text=Image';
                              const src = getUrlFromMaybeObject(item?.subcategoryImage) || fallback;
                              return (
                                <img
                                  src={src}
                                  alt={item?.subcategoryName || 'Subcategory'}
                                  loading={isActive ? 'eager' : 'lazy'}
                                  decoding="async"
                                  fetchPriority={isActive ? 'high' : 'low'}
                                  width={140}
                                  height={140}
                                  onError={(e)=>{ if(e.currentTarget.src!==fallback){ e.currentTarget.src=fallback; } }}
                                />
                              );
                            })()}
                          </div>
                          <div className="modern-item-text">
                            <h4>{item?.subcategoryName}</h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Next Arrow */}
                {(() => {
                  const totalCards = getCategoryProductList?.subcategory?.length || 0;
                  
                  return currentCarouselIndex < totalCards - 1;
                })() && (
                  <button 
                    className="modern-carousel-nav modern-nav-next" 
                    onClick={handleNextCard}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="PrivateDining">
          <div className="container-fluid">
            <div className="section-title">
              <h2>{state?.subCat}</h2>
            </div>
            <div className="row">
              <div className="col-12" style={{ position: 'relative' }}>
                {/* Sort Button via portal to ensure true fixed positioning on mobile */}
                {createPortal(
                  (
                    <button
                      onClick={handleSortModal}
                      type="button"
                      aria-label="Open sort options"
                      className={`sort-btn sort-fab products-sort-fab ${showSortFab ? 'visible' : 'hidden'}`}
                    >
                      <i className="fa-solid fa-sort"></i>
                      <span>Sort</span>
                    </button>
                  ),
                  document.body
                )}
                <div className="row gy-5" ref={cardsRef}>
                  {sortedProducts?.length > 0 ? (
                    sortedProducts?.map((item, i) => {
                      return (
                        <div
                          className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6"
                          key={i}
                        >
                          <div className="PrivateDiningBox">
                            <figure>
                              {(() => {
                                const imgs = Array.isArray(item?.productimages) ? item.productimages : [];
                                const primary = imgs && imgs.length ? imgs[0] : undefined; // avoid .at(0) for mobile compatibility
                                const fallback = 'https://via.placeholder.com/400x400?text=Image';
                                const src = getUrlFromMaybeObject(primary) || fallback;
                return (
                                  <img
                                    onClick={() => handleProduct(item)}
                                    src={src}
                                    style={{ cursor: 'pointer' }}
                                    alt={item?.productDetails?.productname || 'Product'}
                                    loading={i < 4 ? 'eager' : 'lazy'}
                                    decoding="async"
                                    fetchPriority={i < 4 ? 'high' : 'auto'}
                                    sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 25vw"
                                    onError={(e) => {
                                      if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                                    }}
                                  />
                                );
                              })()}
                            </figure>
                            
                            {/* Location first - single row */}
                            <div className="loc">
                              <h1>At your location</h1>
                            </div>
                            
                            {/* Title second */}
                            <h6>{item?.productDetails?.productname}</h6>
                            
                            {/* Main content row - price left, reviews right */}
                            <div className="rightcard">
                              <div className="Info">
                                <div className="text-right">
                                  <div className="priceArea">
                                    {/* Main price */}
                                    {item?.priceDetails?.discountedPrice ? (
                                      <h5>₹{item?.priceDetails?.discountedPrice}</h5>
                                    ) : (
                                      <h5>₹{item?.priceDetails?.price}</h5>
                                    )}
                                  </div>
                                  {/* Crossed price below main price */}
                                  {item?.priceDetails?.discountedPrice && (
                                    <div className="crossed-price">
                                      ₹{item?.priceDetails?.price}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Reviews section - inside Info div */}
                                <p>
                                  {(Math.random() * (4.9 - 4.0) + 4.0).toFixed(1)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : !loader ? (
                    <p className="para">No Data found.</p>
                  ) : (
                    ""
                  )}
                </div>
                {loader ? (
                  <p className="load">
                    <BeatLoader loading={loader} size={10} color="#02366f" />
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Modal */}
      <Modal
        show={showSortModal}
        onHide={handleSortModal}
        centered
        size="sm"
        className="sort-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Sort By</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="sort-options-container">
            <div
              className={`sort-option ${sortBy === 'recommended' ? 'active' : ''}`}
              onClick={() => handleSortChange('recommended')}
            >
              <span className="sort-option-text">Recommended</span>
              <input
                type="radio"
                name="sortOption"
                value="recommended"
                checked={sortBy === 'recommended'}
                onChange={() => handleSortChange('recommended')}
                className="sort-radio"
              />
            </div>
            <div
              className={`sort-option ${sortBy === 'priceLowToHigh' ? 'active' : ''}`}
              onClick={() => handleSortChange('priceLowToHigh')}
            >
              <span className="sort-option-text">Price (Low to High)</span>
              <input
                type="radio"
                name="sortOption"
                value="priceLowToHigh"
                checked={sortBy === 'priceLowToHigh'}
                onChange={() => handleSortChange('priceLowToHigh')}
                className="sort-radio"
              />
            </div>
            <div
              className={`sort-option ${sortBy === 'priceHighToLow' ? 'active' : ''}`}
              onClick={() => handleSortChange('priceHighToLow')}
            >
              <span className="sort-option-text">Price (High to Low)</span>
              <input
                type="radio"
                name="sortOption"
                value="priceHighToLow"
                checked={sortBy === 'priceHighToLow'}
                onChange={() => handleSortChange('priceHighToLow')}
                className="sort-radio"
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Product;