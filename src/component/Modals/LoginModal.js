import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import {
  loginApiSlice,
  otpVerificationApiSlice
} from "../../reduxToolkit/Slices/Auth/auth";
import { userDetailState } from "../../reduxToolkit/Slices/ProductList/listApis";
import CreateAccount from "./CreateAccount";
import "../../assets/css/LoginModal.css";
import {
  handleGoogleLogin,
  handleGoogleLoginPopup,
  handleFacebookLogin,
  handleSocialLoginSuccess,
  handleSocialLoginError,
  validateSocialAuthEnvironment
} from "../../Utils/SocialAuthUtil.js";

const LoginModal = ({
  show,
  onHide,
  onLoginSuccess,
  bookingDetails,
  selectedProduct,
  selectedRecommendedItems = [], // Add this prop with default value
  onEditDate,
  onEditTime,
  onEditCustomizations
}) => {
  // State management
  const [loginMethod, setLoginMethod] = useState("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isEmailSignUp, setIsEmailSignUp] = useState(false); // Toggle between login/signup
  const [otp, setOtp] = useState("");
  const [otpValues, setOtpValues] = useState(Array(4).fill(""));
  const [showOtp, setShowOtp] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpTimer, setOtpTimer] = useState(0);
  const [createAccountModal, setCreateAccountModal] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redux
  const dispatch = useDispatch();
  const { getUserDetailState } = useSelector((state) => state.productList);

  // Cookies
  const [cookies, setCookie] = useCookies(["LennyPhone_number", "LennyCheck"]);

  // Initialize and check auth environment on mount
  useEffect(() => {
    validateSocialAuthEnvironment();

    // Pre-fill mobile number from cookies if available
    if (cookies.LennyPhone_number) {
      setMobileNumber(cookies.LennyPhone_number);
    }
  }, [cookies.LennyPhone_number]);

  // OTP Timer Effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Reset login state when modal closes
  useEffect(() => {
    if (!show) {
      resetLoginState();
    }
  }, [show]);

  // Database simulation functions (same as SignUp component)
  const getUserByEmail = (email) => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return users.find(user => user.email === email);
  };

  const createUser = (userData) => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    return newUser;
  };

  // Handle Mobile Login
  const handleMobileSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!mobileNumber || mobileNumber.length !== 10) {
      setErrors({ mobile: "Please enter a valid 10-digit mobile number" });
      return;
    }

    // Check for valid Indian mobile number pattern
    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(mobileNumber)) {
      setErrors({ mobile: "Please enter a valid Indian mobile number" });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await dispatch(loginApiSlice({ phone: mobileNumber }));
      console.log('Login API response:', response);

      if (response?.payload?.status === 200) {
        setShowOtp(true);
        setOtpTimer(60); // Start 60 second timer
        toast.success(`OTP sent to +91 ${mobileNumber}`);
      } else {
        const errorMessage = response?.payload?.message || "Failed to send OTP. Please try again.";
        toast.error(errorMessage);
        setErrors({ mobile: errorMessage });
      }
    } catch (err) {
      console.error('Login API error:', err);
      const errorMessage = err?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      setErrors({ mobile: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpInputChange = (e, index) => {
    const value = e.target.value;

    // Only allow digits
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }

      // Auto-submit when all 4 digits are filled
      if (newOtpValues.every(val => val.length === 1)) {
        const fullOtp = newOtpValues.join("");
        setTimeout(() => handleOtpVerification(fullOtp), 100); // Small delay for better UX
      }
    }
  };

  // Handle OTP key down for backspace
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) {
        prevInput.focus();
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
      }
    }
  };

  // Handle OTP Verification
  const handleOtpVerification = async (otpToVerify = null) => {
    const otpString = otpToVerify || otpValues.join("");

    if (!otpString || otpString.length !== 4) {
      setErrors({ otp: "Please enter a valid 4-digit OTP" });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await dispatch(otpVerificationApiSlice({
        phone: mobileNumber,
        otp: Number(otpString)
      }));

      console.log('OTP verification response:', response);

      if (response?.payload?.status === 400) {
        const errorMessage = response?.payload?.message || "Invalid OTP. Please try again.";
        toast.error(errorMessage);
        setErrors({ otp: errorMessage });

        // Reset OTP inputs on error
        setOtpValues(Array(4).fill(""));
        const firstInput = document.querySelector(`input[name="otp-0"]`);
        if (firstInput) firstInput.focus();

      } else if (response?.payload?.status === 200) {
        // Check if user needs to create account
        if (!response?.payload?.message?.endsWith("Login successful.")) {
          // New user - show create account modal
          setUserDetail(response?.payload);
          setCreateAccountModal(true);
          resetLoginState();
        } else {
          // Existing user - complete login
          const userData = response?.payload?.data;

          // Store user data
          window.localStorage.setItem("LennyUserDetail", JSON.stringify(userData));
          window.localStorage.setItem("LoginTimer", "false");

          // Set cookies
          setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
          setCookie("LennyPhone_number", mobileNumber, { path: "/" }, { expires: new Date("9999-12-31") });

          // Update Redux state
          dispatch(userDetailState(true));

          toast.success("Login successful!");

          // Call success callback
          onLoginSuccess({
            mobileNumber,
            method: "mobile",
            userData: userData
          });

          resetLoginState();
          onHide(); // Close modal
        }
      } else {
        toast.error("Verification failed. Please try again.");
        setErrors({ otp: "Verification failed. Please try again." });
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      const errorMessage = err?.response?.data?.message || "Verification failed. Please try again.";
      toast.error(errorMessage);
      setErrors({ otp: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Manual Submit
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    handleOtpVerification();
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (otpTimer > 0) return;

    setIsLoading(true);

    try {
      const response = await dispatch(loginApiSlice({ phone: mobileNumber }));

      if (response?.payload?.status === 200) {
        setOtpTimer(60);
        setOtpValues(Array(4).fill(""));
        setErrors({});
        toast.success("OTP resent successfully!");

        // Focus first input
        const firstInput = document.querySelector(`input[name="otp-0"]`);
        if (firstInput) firstInput.focus();
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Email validation function
  const validateEmailForm = () => {
    const error = {};
    let valid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      error.emailError = "Valid email required";
      valid = false;
    }
    if (!password || password.length < 6) {
      error.passwordError = "Password must be at least 6 characters";
      valid = false;
    }

    // Additional validation for signup
    if (isEmailSignUp) {
      if (!fullName || fullName.trim().length < 2) {
        error.nameError = "Full name is required (minimum 2 characters)";
        valid = false;
      }
      if (password !== confirmPassword) {
        error.confirmPasswordError = "Passwords do not match";
        valid = false;
      }
    }

    setErrors(error);
    return valid;
  };

  // Handle Email Sign Up
  const handleEmailSignUp = async () => {
    if (!validateEmailForm()) return;

    try {
      setIsLoading(true);

      // Check if user already exists
      const existingUser = getUserByEmail(email);
      if (existingUser) {
        toast.error("User already exists with this email. Please login instead.");
        setIsEmailSignUp(false);
        setConfirmPassword("");
        setFullName("");
        return;
      }

      // Create new user
      const newUser = createUser({
        email,
        password, // In real app, this should be hashed
        fullName,
        authMethod: 'email'
      });

      // Create user session data
      const userData = {
        _id: `email_${newUser.id}`,
        userId: `email_${newUser.id}`,
        data: {
          personalInfo: {
            name: fullName,
            email,
            photo: "",
            phone: "",
            gender: "",
            dob: "",
          },
          addresses: [],
          authMethod: "email",
        },
      };

      // Store session
      window.localStorage.setItem("LennyUserDetail", JSON.stringify(userData));
      window.localStorage.setItem("LoginTimer", "false");
      setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
      dispatch(userDetailState(true));

      toast.success("Account created successfully!");

      // Call success callback
      onLoginSuccess({
        email,
        method: "email",
        userData: userData,
        isNewUser: true
      });

      resetLoginState();
      onHide();

    } catch (error) {
      console.error('Email signup error:', error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Login
  const handleEmailLogin = async () => {
    if (!validateEmailForm()) return;

    try {
      setIsLoading(true);

      // Check if user exists
      const existingUser = getUserByEmail(email);
      if (!existingUser) {
        toast.error("No account found with this email. Please sign up first.");
        setIsEmailSignUp(true);
        return;
      }

      // Validate password
      if (existingUser.password !== password) {
        toast.error("Incorrect password. Please try again.");
        return;
      }

      // Create user session data
      const userData = {
        _id: `email_${existingUser.id}`,
        userId: `email_${existingUser.id}`,
        data: {
          personalInfo: {
            name: existingUser.fullName,
            email: existingUser.email,
            photo: "",
            phone: "",
            gender: "",
            dob: "",
          },
          addresses: [],
          authMethod: "email",
        },
      };

      // Store session
      window.localStorage.setItem("LennyUserDetail", JSON.stringify(userData));
      window.localStorage.setItem("LoginTimer", "false");
      setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
      dispatch(userDetailState(true));

      toast.success("Login successful!");

      // Call success callback
      onLoginSuccess({
        email,
        method: "email",
        userData: userData
      });

      resetLoginState();
      onHide();

    } catch (error) {
      console.error('Email login error:', error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Submit (Login or SignUp)
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (isEmailSignUp) {
      await handleEmailSignUp();
    } else {
      await handleEmailLogin();
    }
  };

  // Toggle between email login and signup
  const toggleEmailSignUpMode = () => {
    setIsEmailSignUp(!isEmailSignUp);
    setErrors({});
    setPassword("");
    setConfirmPassword("");
    setFullName("");
  };

  // Handle Social Login - FIXED VERSION
  const handleSocialLogin = async (method) => {
    console.log('Social login initiated:', method);
    setIsLoading(true);

    try {
      if (method === "google") {
        // Try the popup version first, fallback to original if needed
        try {
          const result = await handleGoogleLoginPopup();
          console.log('Google login result:', result);

          if (result.success) {
            // Store user data
            window.localStorage.setItem("LennyUserDetail", JSON.stringify(result.userData));
            window.localStorage.setItem("LoginTimer", "false");
            setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
            dispatch(userDetailState(true));

            toast.success(result.message);

            // Call success callback with proper data structure
            onLoginSuccess({
              method: "google",
              userData: result.userData,
              user: result.userData // Add this for compatibility
            });

            onHide(); // Close the modal on successful login
          } else {
            throw new Error(result.error || 'Google login failed');
          }
        } catch (error) {
          console.error('Google popup login failed, trying original method:', error);

          // Fallback to original method
          try {
            const result = await handleGoogleLogin();
            console.log('Google login fallback result:', result);

            if (result.success) {
              // Store user data
              window.localStorage.setItem("LennyUserDetail", JSON.stringify(result.userData));
              window.localStorage.setItem("LoginTimer", "false");
              setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
              dispatch(userDetailState(true));

              toast.success(result.message);

              // Call success callback
              onLoginSuccess({
                method: "google",
                userData: result.userData,
                user: result.userData // Add this for compatibility
              });

              onHide(); // Close the modal on successful login
            } else {
              throw new Error(result.error || 'Google login failed');
            }
          } catch (fallbackError) {
            console.error('Both Google login methods failed:', fallbackError);
            handleSocialLoginError(fallbackError, 'Google');
          }
        }
      } else if (method === "facebook") {
        try {
          const result = await handleFacebookLogin();
          console.log('Facebook login result:', result);

          if (result.success) {
            // Store user data
            window.localStorage.setItem("LennyUserDetail", JSON.stringify(result.userData));
            window.localStorage.setItem("LoginTimer", "false");
            setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
            dispatch(userDetailState(true));

            toast.success(result.message);

            // Call success callback
            onLoginSuccess({
              method: "facebook",
              userData: result.userData,
              user: result.userData // Add this for compatibility
            });

            onHide(); // Close the modal on successful login
          } else {
            throw new Error(result.error || 'Facebook login failed');
          }
        } catch (error) {
          console.error('Facebook login failed:', error);
          handleSocialLoginError(error, 'Facebook');
        }
      } else if (method === "email") {
        setLoginMethod("email");
        setShowEmailForm(true);
        setIsLoading(false);
        return; // Don't set loading to false at the end
      }
    } catch (error) {
      console.error(`${method} login error:`, error);
      toast.error(`${method} login failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset login state
  const resetLoginState = () => {
    setMobileNumber(cookies.LennyPhone_number || ""); // Keep saved mobile number
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setIsEmailSignUp(false);
    setOtp("");
    setOtpValues(Array(4).fill(""));
    setShowOtp(false);
    setShowEmailForm(false);
    setErrors({});
    setOtpTimer(0);
    setLoginMethod("mobile");
    setIsLoading(false);
  };

  // Handle create account completion
  const handleCreateAccountComplete = () => {
    setCreateAccountModal(false);
    onLoginSuccess({
      mobileNumber,
      method: "mobile",
      isNewUser: true
    });
    resetLoginState();
    onHide();
  };

  // Go back to mobile login
  const goBackToMobile = () => {
    setLoginMethod("mobile");
    setShowEmailForm(false);
    setIsEmailSignUp(false);
    setErrors({});
  };

  // Utility functions
  const formatDate = (date) => {
    if (!date) return "No date selected";
    if (typeof date === 'string') return date;
    if (date instanceof Date) {
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('en-US', options);
    }
    return "Invalid date";
  };

  const formatTime = (timeSlot) => {
    return timeSlot?.time || "No time selected";
  };

  // Updated calculateTotal function to include recommended items
  const calculateTotal = () => {
    const basePrice = selectedProduct?.priceDetails?.discountedPrice ||
      selectedProduct?.priceDetails?.price ||
      0;
    
    const customizationsTotal = bookingDetails?.selectedCustomizations?.reduce((sum, item) => {
      const itemPrice = item.price || 0;
      const itemQuantity = item.quantity || 1;
      return sum + (itemPrice * itemQuantity);
    }, 0) || 0;

    // Add recommended items total
    const recommendedItemsTotal = selectedRecommendedItems.reduce((sum, item) => {
      const itemPrice = item.price || 0;
      const itemQuantity = item.quantity || 1;
      return sum + (itemPrice * itemQuantity);
    }, 0);

    console.log('Price calculation:', {
      basePrice,
      customizationsTotal,
      recommendedItemsTotal,
      selectedCustomizations: bookingDetails?.selectedCustomizations,
      selectedRecommendedItems,
      total: basePrice + customizationsTotal + recommendedItemsTotal
    });

    return basePrice + customizationsTotal + recommendedItemsTotal;
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmailModalTitle = () => {
    return isEmailSignUp ? "Create Account" : "Email Login";
  };

  const getEmailSubmitButtonText = () => {
    return isEmailSignUp
      ? (isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT")
      : (isLoading ? "LOGGING IN..." : "LOGIN WITH EMAIL");
  };

  return (
    <>
      <Modal className="ModalBox LoginModal" show={show} onHide={onHide} centered size="xl">
        <div className="ModalArea">
          <a className="CloseModal" onClick={onHide}>×</a>

          <div className="ModalContent">
            <div className="LoginSection">
              <h3>Please Login to Continue Booking</h3>

              <div className="LoginMethods">
                {/* Mobile Login */}
                {loginMethod === "mobile" && (
                  <div className="MobileLogin">
                    <h4>Mobile Login</h4>
                    {!showOtp ? (
                      <form onSubmit={handleMobileSubmit}>
                        <div className="FormGroup">
                          <input
                            type="tel"
                            className="FormInput"
                            placeholder="Enter 10 digit Mobile Number Eg: 8010679679"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                            maxLength={10}
                            disabled={isLoading}
                          />
                          {errors.mobile && <span className="ErrorText">{errors.mobile}</span>}
                        </div>
                        <button type="submit" className="LoginBtn" disabled={isLoading}>
                          {isLoading ? "SENDING OTP..." : "LOG IN VIA OTP"}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleOtpSubmit}>
                        <div className="FormGroup">
                          <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>
                            OTP sent to +91 {mobileNumber}
                            <button
                              type="button"
                              className="EditPhoneBtn"
                              onClick={() => {
                                setShowOtp(false);
                                setOtpValues(Array(4).fill(""));
                                setOtpTimer(0);
                                setErrors({});
                              }}
                              disabled={isLoading}
                            >
                              Edit
                            </button>
                          </p>

                          <div className="OTPInputContainer">
                            {otpValues.map((value, index) => (
                              <input
                                key={index}
                                type="tel"
                                name={`otp-${index}`}
                                className="OTPInput"
                                maxLength="1"
                                value={value}
                                onChange={(e) => handleOtpInputChange(e, index)}
                                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                pattern="[0-9]*"
                                inputMode="numeric"
                                disabled={isLoading}
                              />
                            ))}
                          </div>

                          {errors.otp && <span className="ErrorText">{errors.otp}</span>}

                          <div className="OTPActions">
                            {otpTimer > 0 ? (
                              <span className="TimerText">
                                Resend OTP in {formatTimer(otpTimer)}
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="ResendBtn"
                                onClick={handleResendOtp}
                                disabled={isLoading}
                              >
                                {isLoading ? "Sending..." : "Resend OTP"}
                              </button>
                            )}
                          </div>
                        </div>

                        <button type="submit" className="LoginBtn" disabled={isLoading}>
                          {isLoading ? "VERIFYING..." : "VERIFY OTP & CONTINUE"}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Email Login/Signup */}
                {loginMethod === "email" && (
                  <div className="EmailLogin">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                      <button
                        type="button"
                        className="BackBtn"
                        onClick={goBackToMobile}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '20px',
                          cursor: 'pointer',
                          marginRight: '10px'
                        }}
                      >
                        ←
                      </button>
                      <h4>{getEmailModalTitle()}</h4>
                    </div>

                    <form onSubmit={handleEmailSubmit}>
                      {isEmailSignUp && (
                        <div className="FormGroup">
                          <input
                            type="text"
                            className="FormInput"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={isLoading}
                          />
                          {errors.nameError && <span className="ErrorText">{errors.nameError}</span>}
                        </div>
                      )}

                      <div className="FormGroup">
                        <input
                          type="email"
                          className="FormInput"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                        />
                        {errors.emailError && <span className="ErrorText">{errors.emailError}</span>}
                      </div>

                      <div className="FormGroup">
                        <input
                          type="password"
                          className="FormInput"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                        />
                        {errors.passwordError && <span className="ErrorText">{errors.passwordError}</span>}
                      </div>

                      {isEmailSignUp && (
                        <div className="FormGroup">
                          <input
                            type="password"
                            className="FormInput"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                          />
                          {errors.confirmPasswordError && <span className="ErrorText">{errors.confirmPasswordError}</span>}
                        </div>
                      )}

                      {/* Toggle between Login/Signup */}
                      <div style={{ textAlign: 'center', margin: '10px 0' }}>
                        <span style={{ color: '#666', fontSize: '14px' }}>
                          {isEmailSignUp ? "Already have an account? " : "Don't have an account? "}
                          <button
                            type="button"
                            onClick={toggleEmailSignUpMode}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#007bff',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                            disabled={isLoading}
                          >
                            {isEmailSignUp ? "Login here" : "Sign up here"}
                          </button>
                        </span>
                      </div>

                      <button type="submit" className="LoginBtn" disabled={isLoading}>
                        {getEmailSubmitButtonText()}
                      </button>
                    </form>

                    {!isEmailSignUp && (
                      <div className="ForgotPassword">
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          Forgot Password?
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Show social login options only for mobile login method */}
                {loginMethod === "mobile" && (
                  <>
                    <div className="Divider">
                      <span>or continue with</span>
                    </div>

                    {/* Social Login */}
                    <div className="SocialLogin">
                      <button
                        className="SocialBtn GoogleBtn"
                        onClick={() => handleSocialLogin("google")}
                        disabled={isLoading}
                      >
                        <i className="fab fa-google"></i>
                        {isLoading ? "Loading..." : "Google"}
                      </button>

                      <button
                        className="SocialBtn FacebookBtn"
                        onClick={() => handleSocialLogin("facebook")}
                        disabled={isLoading}
                      >
                        <i className="fab fa-facebook-f"></i>
                        {isLoading ? "Loading..." : "Facebook"}
                      </button>

                      <button
                        className="SocialBtn EmailBtn"
                        onClick={() => handleSocialLogin("email")}
                        disabled={isLoading}
                      >
                        <i className="fas fa-envelope"></i>
                        {isLoading ? "Loading..." : "Email"}
                      </button>
                    </div>
                  </>
                )}

                <div className="TermsText">
                  By logging in you are agreeing to our{" "}
                  <a href="#" onClick={(e) => e.preventDefault()}>Terms and Conditions</a>{" "}
                  and our{" "}
                  <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="OrderSummary">
              <h4>Order Summary</h4>
              <div className="SummaryContent">
                

                <div className="BookingDetails">
                  <div className="BookingInfo">
                    <div className="InfoRow">
                      <i className="fa-solid fa-calendar"></i>
                      <span>{formatDate(bookingDetails?.selectedDate)}</span>
                      <button className="EditBtn" onClick={onEditDate}>
                        <i className="fa-solid fa-edit"></i>
                        Edit
                      </button>
                    </div>
                    <div className="InfoRow">
                      <i className="fa-solid fa-clock"></i>
                      <span>{formatTime(bookingDetails?.selectedTimeSlot)}</span>
                      <button className="EditBtn" onClick={onEditTime}>
                        <i className="fa-solid fa-edit"></i>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>

                <div className="ProductInfo">
                  <div className="ProductImage">
                    <img
                      src={selectedProduct?.productimages?.[0] || require("../../assets/images/custom-1.png")}
                      alt="Product"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80x80?text=Product";
                      }}
                    />
                  </div>
                  <div className="ProductDetails">
                    <h5>{selectedProduct?.productDetails?.productname || "Product Name"}</h5>
                    <div className="ProductPrice">
                      ₹ {selectedProduct?.priceDetails?.discountedPrice ||
                        selectedProduct?.priceDetails?.price ||
                        0}
                    </div>
                  </div>
                </div>

                <div className="CustomizationsInfo">
                  <h6>
                    Customisations
                    <i className="fa-solid fa-edit" onClick={onEditCustomizations}></i>
                  </h6>
                  {bookingDetails?.selectedCustomizations?.length > 0 ? (
                    <div className="CustomizationsList">
                      {bookingDetails.selectedCustomizations.map((item, index) => (
                        <div key={index} className="CustomizationItem">
                          <span>{item.name}</span>
                          <span>₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="NoCustomizations">No customization added</p>
                  )}
                </div>

                {/* Add Recommended Items Section */}
                {selectedRecommendedItems.length > 0 && (
                  <div className="RecommendedItemsInfo">
                    <h6>
                      Recommended Items ({selectedRecommendedItems.length})
                    </h6>
                    <div className="RecommendedItemsList">
                      {selectedRecommendedItems.map((item, index) => (
                        <div key={index} className="RecommendedItem">
                          <span>{item.name}</span>
                          <span>₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="LocationInfo">
                  <div className="LocationRow">
                    <span>City</span>
                    <span>Delhi NCR</span>
                  </div>
                </div>

                <div className="SummaryTotal">
                  <div className="TotalRow">
                    <span>Total</span>
                    <span>₹ {calculateTotal()}</span>
                  </div>
                </div>

                <div className="SecurePayments">
                  <h6>100% Secure Payments</h6>
                  <div className="PaymentIcons">
                    <i className="fab fa-cc-visa"></i>
                    <i className="fab fa-cc-mastercard"></i>
                    <i className="fab fa-cc-amex"></i>
                    <i className="fab fa-cc-paypal"></i>
                    <i className="fab fa-google-pay"></i>
                    <i className="fab fa-cc-paypal"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ModalFooter">
            <div className="WhatsAppHelp">
              <div className="HelpIcon">
                <img src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png" alt="help" />
              </div>
              <span>
                Unable to login or facing payment issues? {" "}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Click to connect on WhatsApp
                </a>
              </span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Create Account Modal */}
      <CreateAccount
        createAccountModal={createAccountModal}
        setCreateAccountModal={setCreateAccountModal}
        userDetail={userDetail}
        onComplete={handleCreateAccountComplete}
      />
    </>
  );
};

export default LoginModal;