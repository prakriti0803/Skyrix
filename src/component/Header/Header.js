import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SignUp from "../Modals/SignUp";
import { useDispatch, useSelector } from "react-redux";
import CitySelector from "../Modals/CityPopup";
import { MdAddShoppingCart } from "react-icons/md";
import {
  anniversaryDecoList,
  birthdayDecoList,
  categoryList,
  categorySubCatList,
  cityList,
  dealBannerList,
  kidsDecoList,
  topBannerList,
  weddingBalloonDecoList,
} from "../../reduxToolkit/Slices/ProductList/listApis";
import {
  deleteCartProduct,
  orderSummary,
} from "../../reduxToolkit/Slices/Cart/bookingApis";
import { toast } from "react-toastify";
import NavigationDropdown from "../Modals/DropdownNav";
import HelpCenter from "./HelpCenter";
const initialState = {
  signUpModal: false,
  selectCity: "",
  cancelsState: false,
  search: "",
  citySearch: "",
  openSidebar: false,
};

const Header = () => {
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [iState, updateState] = useState(initialState);
  let categoryArr = ["Birthday", "Anniversary", "Kid's Party", "Baby Shower"];
  const dispatch = useDispatch();
  const pathDetail = useLocation();

  const navigate = useNavigate();
  const [disableHover, setDisableHover] = useState(false);

  const { selectCity, search, citySearch, openSidebar } = iState;
  const { getUserDetailState, getCityList, getCategorySubCatList } =
    useSelector((state) => state.productList);
  const LoginTimer = JSON.parse(window.localStorage.getItem("LoginTimer"));
  const { getOrderSummaryDetail } = useSelector((state) => state.orderSummary);
  const [userDetail, setUserDetail] = useState(() => {
    return JSON.parse(window.localStorage.getItem("LennyUserDetail")) || null;
  });

  const handleCategory = (item, subCat) => {
    setDisableHover(true);
    updateState({ ...iState, openSidebar: false });
    navigate("/products", { state: { item, subCat, selectCity } });
    // setDisableHover(false);
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleDeleteProduct = () => {
    const data = {
      id: getOrderSummaryDetail?.data?._id,
    };

    dispatch(deleteCartProduct(data))
      .then((res) => {
        if (res?.payload?.status === 200) {
          toast?.success(res?.payload?.message);
          dispatch(orderSummary({ userId: userDetail?._id }));
          navigate("/");
          window.scrollTo({ top: 150, behavior: "smooth" });
        } else {
          toast?.error(res?.payload?.message || "Failed to cancel booking. Please try again.");
        }
      })
      .catch((err) => {
        toast?.error("Something went wrong while cancelling. Please try again.");
        console.error("deleteCartProduct failed:", err);
      });
  };

  const handleCitySelect = (city) => {
    updateState({
      ...iState,
      selectCity: city?.cityName,
    });

    window.localStorage?.setItem("LennyCity", city?.cityName);
    window.localStorage?.setItem(
      "LennyPincode",
      JSON.stringify(city?.pincode)
    );

    setShowCitySelector(false);
  };
  // Effect for user details and city-dependent lists
  useEffect(() => {
    const storedUser = window.localStorage.getItem("LennyUserDetail");
    if (getUserDetailState && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserDetail(parsedUser);

      // Dispatch order summary once userDetail is available
      dispatch(orderSummary({ userId: parsedUser._id }));
      window.localStorage.setItem("LoginTimer", false);
    } else {
      setUserDetail(null);
      window.localStorage.setItem("LoginTimer", true);
    }

    if (selectCity) {
      dispatch(birthdayDecoList({ selectCity }));
      dispatch(anniversaryDecoList({ selectCity }));
      dispatch(kidsDecoList({ selectCity }));
      dispatch(weddingBalloonDecoList({ selectCity }));
      dispatch(categorySubCatList());
    }
  }, [getUserDetailState, selectCity, dispatch]);

  // Effect for initial app data
  useEffect(() => {
    dispatch(cityList());
    dispatch(categoryList());
    dispatch(dealBannerList());
    dispatch(topBannerList());
  }, [dispatch]);

  // useEffect(() => {
  //   if (getCityList && citySearch === "") {
  //     const firstCity = getCityList?.data?.at(0);
  //     if (firstCity) {
  //       updateState(prevState => ({
  //         ...prevState,
  //         selectCity: firstCity.cityName,
  //       }));
  //       window.localStorage?.setItem("LennyCity", firstCity.cityName);
  //       window.localStorage?.setItem(
  //         "LennyPincode",
  //         JSON.stringify(firstCity.pincode)
  //       );
  //     }
  //   }
  // }, [getCityList, citySearch]);

  useEffect(() => {
    const savedCity =
      localStorage.getItem("selectedCity") ||
      localStorage.getItem("LennyCity");

    if (savedCity) {
      // If city already saved, update state
      updateState((prevState) => ({
        ...prevState,
        selectCity: savedCity,
      }));
    } else if (getCityList?.data?.length > 0) {
      // If no city saved, set first city from city list
      const firstCity = getCityList.data[0];
      updateState((prevState) => ({
        ...prevState,
        selectCity: firstCity.cityName,
      }));
      localStorage.setItem("LennyCity", firstCity.cityName);
      localStorage.setItem("selectedCity", firstCity.cityName);
      localStorage.setItem("LennyPincode", JSON.stringify(firstCity.pincode));
    } else {
      // Show popup only once after 1 sec
      const timer = setTimeout(() => {
        setShowCitySelector(true);
      }, 1000);

      return () => clearTimeout(timer); // cleanup timer on unmount
    }
  }, [getCityList]);



  useEffect(() => {
    if (search) {
      navigate("/search/products", { state: search });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (!search && pathDetail?.pathname === "/search/products") {
      navigate("/");
    }
  }, [search, navigate, pathDetail?.pathname]);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const data = { search: citySearch };
      dispatch(cityList(data));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [citySearch, dispatch]);

  useEffect(() => {
    if (LoginTimer) {
      const timeoutId = setInterval(() => {
        console.log("start");
        updateState(prevState => ({ ...prevState, signUpModal: true }));
        window.localStorage.setItem("LoginTimer", false);
      }, 500000);

      return () => clearInterval(timeoutId);
    }
  }, [LoginTimer]);




  console.log({ LoginTimer });
  return (
    <>
      <header className="newHeader">
        <nav class="navbar navbar-expand-lg navbar-light">
          <div class="container-fluid">
            <div className="logoArea">
              {openSidebar ? (
                <a
                  href="#"
                  onClick={() => updateState({ ...iState, openSidebar: false })}
                  className="navbar-toggler"
                  id="navbarToggleClose"
                  style={{ display: "block" }}
                >
                  <i class="fa-solid fa-xmark"></i>
                </a>
              ) : (
                <a
                  href="#"
                  onClick={() => updateState({ ...iState, openSidebar: true })}
                  className="navbar-toggler"
                  id="navbarToggle"
                >
                  <i class="fa-solid fa-bars-staggered"></i>
                </a>
              )}
              <a
                className="navbar-brand"
                onClick={() => {
                  updateState({ ...iState, search: "" });
                  navigate("/");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <img src={require("../../assets/images/Header_Logo.png")} />
              </a>
            </div>
            <form class="headerTwoBtn d-block d-lg-none">
              <div className="d-flex">
                <div className="citySelectorBtn">
                  <button
                    className="cityButton"
                    onClick={() => setShowCitySelector(true)}
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px 5px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      border: '1px solid #ddd',
                      padding: "5px",
                      borderRadius: '6px',
                      backgroundColor: '#f8f9fa',
                      cursor: 'pointer'
                    }}
                  >
                    <span className="LocationIcon">
                      <i className="fa-solid fa-location-dot" style={{ fontSize: '14px', color: '#666' }}></i>
                    </span>
                    <span className="cityText" style={{ flex: 1, minWidth: 0 }}>
                      {selectCity
                        ? selectCity?.charAt(0).toUpperCase() +
                        selectCity?.slice(1)
                        : "Select City"}
                    </span>
                  </button>
                </div>
              </div>
            </form>
            <ul className="CategoriesResponsive2">
              <li className="nav-item dropdown-item Categories">
                <div
                  className={`Categories_hover ${disableHover ? "disable-hover" : ""
                    }`}
                >
                  <div className="CategoriesMenu">
                    <p>All Categories</p>

                    <div className="Categories_dropdown">
                      <article>
                        {getCategorySubCatList?.data?.length > 0
                          ? getCategorySubCatList?.data?.map((item, i) => {
                            return (
                              <aside key={i}>
                                <h6
                                // style={{ color: i%2==0 ? "#02366F" : "Orange" }}
                                >
                                  {item?.categoryName}
                                </h6>
                                <ul>
                                  {item?.subcategories?.length > 0
                                    ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        if (index <= 4) {
                                          return (
                                            <li key={index}>
                                              <a
                                                onClick={() =>
                                                  handleCategory(
                                                    item,
                                                    subCat
                                                  )
                                                }
                                              >
                                                {subCat}
                                              </a>
                                            </li>
                                          );
                                        }
                                      }
                                    )
                                    : ""}
                                </ul>
                                <div className="category-border"></div>
                              </aside>
                            );
                          })
                          : ""}
                      </article>
                    </div>
                  </div>
                </div>

                <div className="CategoriesSearch">
                  <input
                    name="search"
                    value={search}
                    onChange={(e) => {
                      updateState({ ...iState, search: e.target.value });
                    }}
                    className="form-control me-2"
                    type="search"
                    placeholder="What are you looking for ?"
                  />
                  <span>
                    <img
                      src={require("../../assets/images/search-normal.png")}
                    />
                  </span>
                </div>
              </li>
            </ul>
            {/* <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button> */}
            <div
              class={`collapse navbar-collapse ${openSidebar ? "Left" : ""}`}
              id={`${openSidebar ? "navbarSupportedContent" : "link"}`}
            >
              <ul class="navbar-nav  me-auto mb-2 mb-lg-0 align-items-lg-center ">
                {categoryArr?.map((category_name, index) => {
                  return (
                    <li class="nav-item web-hidden dropdown" key={index}>
                      <a
                        class="nav-link"
                        id={`navbarDropdown${index}`}
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          "--hover-color": `${index == 0
                            ? "#f26a10"
                            : index == 1
                              ? "#f2c210"
                              : index == 3
                                ? "#ff3f6c"
                                : "#0db7af"
                            }`,
                        }}
                      >
                        {category_name}
                      </a>
                      {category_name == "Birthday" ? (
                        <ul
                          class="dropdown-menu"
                          aria-labelledby={`navbarDropdown${index}`}
                        >
                          {getCategorySubCatList?.data?.length > 0
                            ? getCategorySubCatList?.data?.map((item, i) => {
                              if (item?.categoryName == "BIRTHDAY") {
                                return (
                                  <>
                                    {item?.subcategories?.length > 0
                                      ? item?.subcategories?.map(
                                        (subCat, index) => {
                                          return (
                                            <li key={index}>
                                              <a
                                                class="dropdown-item"
                                                style={{
                                                  "--hover-color":
                                                    "#f26a10",
                                                }}
                                                onClick={() =>
                                                  handleCategory(
                                                    item,
                                                    subCat
                                                  )
                                                }
                                              >
                                                {subCat}
                                              </a>
                                            </li>
                                          );
                                        }
                                      )
                                      : ""}
                                  </>
                                );
                              }
                            })
                            : ""}
                        </ul>
                      ) : category_name == "Anniversary" ? (
                        <ul
                          class="dropdown-menu"
                          aria-labelledby={`navbarDropdown${index}`}
                        >
                          {getCategorySubCatList?.data?.length > 0
                            ? getCategorySubCatList?.data?.map((item, i) => {
                              if (item?.categoryName == "ANNIVERSARY") {
                                return (
                                  <>
                                    {item?.subcategories?.length > 0
                                      ? item?.subcategories?.map(
                                        (subCat, index) => {
                                          return (
                                            <li key={index}>
                                              <a
                                                class="dropdown-item"
                                                style={{
                                                  "--hover-color":
                                                    "#f2c210",
                                                }}
                                                onClick={() =>
                                                  handleCategory(
                                                    item,
                                                    subCat
                                                  )
                                                }
                                              >
                                                {subCat}
                                              </a>
                                            </li>
                                          );
                                        }
                                      )
                                      : ""}
                                  </>
                                );
                              }
                            })
                            : ""}
                        </ul>
                      ) : category_name == "Kid's Party" ? (
                        <ul
                          class="dropdown-menu"
                          aria-labelledby={`navbarDropdown${index}`}
                        >
                          {getCategorySubCatList?.data?.length > 0
                            ? getCategorySubCatList?.data?.map((item, i) => {
                              if (item?.categoryName == "KID'S PARTY") {
                                return (
                                  <>
                                    {item?.subcategories?.length > 0
                                      ? item?.subcategories?.map(
                                        (subCat, index) => {
                                          return (
                                            <li key={index}>
                                              <a
                                                class="dropdown-item"
                                                style={{
                                                  "--hover-color":
                                                    "#0db7af",
                                                }}
                                                onClick={() =>
                                                  handleCategory(
                                                    item,
                                                    subCat
                                                  )
                                                }
                                              >
                                                {subCat}
                                              </a>
                                            </li>
                                          );
                                        }
                                      )
                                      : ""}
                                  </>
                                );
                              }
                            })
                            : ""}
                        </ul>
                      ) : category_name == "Baby Shower" ? (
                        <ul
                          class="dropdown-menu"
                          aria-labelledby={`navbarDropdown${index}`}
                        >
                          {getCategorySubCatList?.data?.length > 0
                            ? getCategorySubCatList?.data?.map((item, i) => {
                              if (item?.categoryName == "BABY SHOWER") {
                                return (
                                  <>
                                    {item?.subcategories?.length > 0
                                      ? item?.subcategories?.map(
                                        (subCat, index) => {
                                          return (
                                            <li key={index}>
                                              <a
                                                class="dropdown-item"
                                                style={{
                                                  "--hover-color":
                                                    "#ff3f6c",
                                                }}
                                                onClick={() =>
                                                  handleCategory(
                                                    item,
                                                    subCat
                                                  )
                                                }
                                              >
                                                {subCat}
                                              </a>
                                            </li>
                                          );
                                        }
                                      )
                                      : ""}
                                  </>
                                );
                              }
                            })
                            : ""}
                        </ul>
                      ) : (
                        ""
                      )}
                    </li>
                  );
                })}
                <li className="nav-item dropdown-item Categories your-class">

                  <div className="CategoriesSearch">
                    <input
                      name="search"
                      value={search}
                      onChange={(e) => {
                        updateState({ ...iState, search: e.target.value });
                      }}
                      className="form-control me-2"
                      type="search"
                      placeholder="What are you looking for ?"
                    />
                    <span>
                      <img
                        src={require("../../assets/images/search-normal.png")}
                      />
                    </span>
                  </div>
                </li>
                <li className="nav-item dropdown-item Categories d-block d-lg-none">
                  <div
                    className={`Categories_hover ${disableHover ? "disable-hover" : ""
                      }`}
                  >
                    <div
                      className="CategoriesMenu"
                      onMouseEnter={() => setDisableHover(false)}
                    >
                      <p>All Categories</p>
                      <div className="Categories_dropdown">
                        <article>
                          {getCategorySubCatList?.data?.length > 0
                            ? getCategorySubCatList?.data?.map((item, i) => {
                              return (
                                <aside key={i}>
                                  <h6
                                  // style={{ color: i%2==0 ? "#02366F" : "Orange" }}
                                  >
                                    {item?.categoryName}
                                  </h6>
                                  <ul>
                                    {item?.subcategories?.length > 0
                                      ? item?.subcategories?.map(
                                        (subCat, index) => {
                                          if (index <= 4) {
                                            return (
                                              <li key={index}>
                                                <a
                                                  onClick={() =>
                                                    handleCategory(
                                                      item,
                                                      subCat
                                                    )
                                                  }
                                                >
                                                  {subCat}
                                                </a>
                                              </li>
                                            );
                                          }
                                        }
                                      )
                                      : ""}
                                  </ul>
                                  <div className="category-border"></div>
                                </aside>
                              );
                            })
                            : ""}
                        </article>
                      </div>
                    </div>
                  </div>

                  <div className="CategoriesSearch d-none">
                    <input
                      name="search"
                      value={search}
                      onChange={(e) => {
                        updateState({ ...iState, search: e.target.value });
                      }}
                      className="form-control me-2"
                      type="search"
                      placeholder="Find the perfect decor for your special event.."
                    />
                    <span>
                      <img
                        src={require("../../assets/images/search-normal.png")}
                      />
                    </span>
                  </div>
                </li>
              </ul>
              {/* Help Center */}
              <div className="help">
                <HelpCenter />
              </div>
              {/* City selection */}
              <form class="headerTwoBtn your-class">
                <div className="d-flex align-items-center">
                  <div className="citySelectorBtn">
                    <button
                      className="cityButton"
                      onClick={() => setShowCitySelector(true)}
                      type="button"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap',
                        padding: '10px 15px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        border: '1px solid #e4e9ee',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        color: '#333',
                        fontSize: '14px',
                        fontWeight: '500',
                        height: '44px',
                        minWidth: '120px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(48, 57, 67, 0.05)';
                        e.target.style.borderColor = '#303943';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.borderColor = '#e4e9ee';
                      }}
                    >
                      <span className="LocationIcon">
                        <i className="fa-solid fa-location-dot" style={{ fontSize: '16px', color: '#303943' }}></i>
                      </span>
                      <span className="cityText" style={{ flex: 1, minWidth: 0 }}>
                        {selectCity
                          ? selectCity?.charAt(0).toUpperCase() +
                          selectCity?.slice(1)
                          : "Select City"}
                      </span>
                    </button>
                  </div>

                  {userDetail && getOrderSummaryDetail ? (
                    <div className="Icons Avater">
                      <a className="UserIcon subAvater">
                        <img
                          src={require("../../assets/images/shopping-cart.png")}
                        />
                      </a>
                      <div className="cartArea">
                        <h5>Complete Your Booking</h5>
                        <div className="row">
                          <div className="col-6">
                            <img
                              src={getOrderSummaryDetail?.data?.productImage}
                            />
                          </div>
                          <div className="col-6">
                            <div className="ProdectDec">
                              <h6>
                                {getOrderSummaryDetail?.data?.productName}
                              </h6>
                              <p>
                                For Date: { }
                                {getOrderSummaryDetail?.data?.dateAdded}
                              </p>

                              <div className="Links">
                                <a
                                  style={{ marginRight: "25px" }}
                                  onClick={handleDeleteProduct}
                                >
                                  Cancel
                                </a>
                                <a
                                  onClick={() =>
                                    navigate("/checkout-1", {
                                      state: { userId: userDetail?._id },
                                    })
                                  }
                                >
                                  Checkout
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <ul className="Icons">
                    <li>
                      <Link
                        to="/upcoming-bookings"
                        className="cart-icon-link"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px',
                          border: '1px solid #e4e9ee',
                          borderRadius: '8px',
                          backgroundColor: 'transparent',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          height: '44px',
                          minWidth: '44px',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(48, 57, 67, 0.05)';
                          e.target.style.borderColor = '#303943';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.borderColor = '#e4e9ee';
                        }}
                      >
                        <MdAddShoppingCart
                          style={{ 
                            fontSize: '20px', 
                            color: '#303943',
                            transition: 'color 0.3s ease'
                          }}
                        />
                      </Link>
                    </li>
                    <li>
                      {userDetail ? (
                        <Link to="/profile" className="UserIcon">
                          <img src={require("../../assets/images/user.png")} />
                        </Link>
                      ) : (
                        <a
                          onClick={() =>
                            updateState({ ...iState, signUpModal: true })
                          }
                          class="Login loginBtn"
                        >
                          Login
                        </a>
                      )}
                    </li>
                  </ul>

                  {/* <button class="loginBtn" type="submit">
                      Login
                      </button> */}
                </div>
              </form>
            </div>

            <div className="searchLoginIcon d-block d-lg-none">
              {/* <a href="#" className="resNav searchIcon">
                <i class="fa-solid fa-magnifying-glass"></i>
              </a>

              <a href="#" className="resNav loginIcon">
                <i class="fa-solid fa-arrow-right-to-bracket"></i>
              </a> */}
              <ul className="Icons responsiveLogin ">
                <li>
                  {userDetail ? (
                    <Link to="/profile" className="UserIcon">
                      <img src={require("../../assets/images/user.png")} />
                    </Link>
                  ) : (
                    <a
                      onClick={() =>
                        updateState({ ...iState, signUpModal: true })
                      }
                      class="Login loginBtn ml-0 ms-0"
                    >
                      Login
                    </a>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <ul className="CategoriesResponsive hidePara">
          <li className="nav-item dropdown-item Categories">
            <div
              className={`Categories_hover ${disableHover ? "disable-hover" : ""
                }`}
            >
              <div className="CategoriesMenu">
                <p>All Categories</p>

                <div className="Categories_dropdown">
                  <article>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                        return (
                          <aside key={i}>
                            <h6
                            // style={{ color: i%2==0 ? "#02366F" : "Orange" }}
                            >
                              {item?.categoryName}
                            </h6>
                            <ul>
                              {item?.subcategories?.length > 0
                                ? item?.subcategories?.map(
                                  (subCat, index) => {
                                    if (index <= 4) {
                                      return (
                                        <li key={index}>
                                          <a
                                            onClick={() =>
                                              handleCategory(item, subCat)
                                            }
                                          >
                                            {subCat}
                                          </a>
                                        </li>
                                      );
                                    }
                                  }
                                )
                                : ""}
                            </ul>
                            <div className="category-border"></div>
                          </aside>
                        );
                      })
                      : ""}
                  </article>
                </div>
              </div>
            </div>

            <div className="CategoriesSearch" style={{ height: "42px" }}>
              <input
                name="search"
                value={search}
                onChange={(e) => {
                  updateState({ ...iState, search: e.target.value });
                }}
                className="form-control me-2"
                type="search"
                placeholder="Find the perfect decor for your special event.."
              />
              <span>
                <img src={require("../../assets/images/search-normal.png")} />
              </span>
            </div>
          </li>
        </ul>
        
        {/* Mobile Search Bar */}
        <div className="mobile-search-container">
          <div className="mobile-search-wrapper">
            <input
              type="search"
              className="mobile-search-input"
              placeholder="What are you celebrating?"
              value={search}
              onChange={(e) => {
                updateState({ ...iState, search: e.target.value });
              }}
            />
            <i className="fa-solid fa-search mobile-search-icon"></i>
          </div>
        </div>
      </header>

      {showCitySelector && (
        <CitySelector
          cities={getCityList?.data || []}
          onSelect={handleCitySelect}
          onClose={() => setShowCitySelector(false)}
        />
      )}
      <SignUp iState={iState} updateState={updateState} />
      <NavigationDropdown />
    </>

  );
};

export default Header;
