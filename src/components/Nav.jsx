import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

// Import White Icons
import Wchat from "../assets/wchat.png";
import Wcart from "../assets/wcart.png";
import Wlogo from "../assets/wlogo.png";
import Wlogin from "../assets/wlogin.png";

// Import Blue Icons
import Bchat from "../assets/Bchat.png";
import Bcart from "../assets/Bcart.png";
import Blogo from "../assets/Blogo.png";
import Blogin from "../assets/Blogin.png";

const Nav = () => {
  const [inAboutUs, setInAboutUs] = useState(false);
  const [inTestimonials, setInTestimonials] = useState(false);
  const [inChat, setInChat] = useState(false);
  const [inOrderTracking, setInOrderTracking] = useState(false);
  const [inPerfume, setInPerfume] = useState(false);
  const [inProductsSection, setInProductsSection] = useState(false);
  const location = useLocation();

  // Check if the current route is the profile page
  const isProfilePage = location.pathname === "/profile";
  const isPerfumePage = location.pathname === "/perfume";
  const isCheckoutPage = location.pathname === "/checkout";

  useEffect(() => {
    const handleScroll = () => {
      setInPerfume(isPerfumePage);
      const aboutUsSection = document.getElementById("about-us");
      const testimonialsSection = document.getElementById("testimonials");

      if (isPerfumePage) {
        const productsSection = document.getElementById("products");
        if (!productsSection) return;
        const productsTop = productsSection.offsetTop;
        const productsHeight = productsSection.offsetHeight;
        const scrollY = window.scrollY + window.innerHeight / 5; // Check mid-screen

        // Update state when in the product section
        setInProductsSection(scrollY >= productsTop && scrollY <= productsTop + productsHeight);
      }

      if (!aboutUsSection || !testimonialsSection) return;

      const aboutUsTop = aboutUsSection.offsetTop;
      const aboutUsHeight = aboutUsSection.offsetHeight;
      const testimonialsTop = testimonialsSection.offsetTop;
      const testimonialsHeight = testimonialsSection.offsetHeight;
      const scrollY = window.scrollY + window.innerHeight / 15; // Check mid-screen

      setInAboutUs(scrollY >= aboutUsTop && scrollY <= aboutUsTop + aboutUsHeight);
      setInTestimonials(scrollY >= testimonialsTop && scrollY <= testimonialsTop + testimonialsHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [],[isPerfumePage]);

  useEffect(() => {
    setInPerfume(location.pathname === "/perfume");
    setInOrderTracking(location.pathname === "/orderTracking");
    setInChat(location.pathname === "/customerService");
  }, [location.pathname]);

  const inCart = location.pathname === "/cart";

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 w-full z-50 tracking-[.25em] font-[Aboreto] bg-transparent p-3 border-b border-gray-800 transition-colors duration-300 ${
          isProfilePage || inCart || inChat || inOrderTracking 
            ? "text-blue-950 font-semibold"
            : ""
        }`}
      >
        <ul className="flex items-center justify-center space-x-18">
          {/* Logo */}
          <li className="w-10 mr-50">
            <NavLink to="/">
              <img
                src={
                  isProfilePage || inCart || inChat || inOrderTracking || isPerfumePage  && inProductsSection || isCheckoutPage
                    ? Blogo
                    : inAboutUs || inTestimonials
                    ? Blogo
                    : inPerfume
                    ? Wlogo
                    : Wlogo
                }
                alt="Logo"
              />
            </NavLink>
          </li>

          {/* Nav Links */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? "border-b-2 border-blue-950 pb-1" : ""} 
                 hover:border-b-2 hover:border-blue-950 transition-colors duration-300 pb-1 ${
                   isProfilePage || inCart || inChat || inOrderTracking || isPerfumePage && inProductsSection || isCheckoutPage
                     ? "text-blue-950 font-semibold"
                     : inPerfume
                     ? "text-white"
                     : inAboutUs || inTestimonials
                     ? "text-blue-950 font-semibold"
                     : "text-white"
                 }`
              }
            >
              HOME
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/perfume"
              className={({ isActive }) =>
                `${isActive ? "border-b-2 border-blue-950 pb-1" : ""} 
                 hover:border-b-2 hover:border-blue-950 transition-colors duration-300 pb-1 ${
                   isProfilePage || inCart || inChat || inOrderTracking  || isPerfumePage && inProductsSection || isCheckoutPage
                     ? "text-blue-950 font-semibold"
                     : inPerfume 
                     ? "text-white"
                     : inAboutUs || inTestimonials 
                     ? "text-blue-950 font-semibold"
                     : "text-white"
                 }`
              }
            >
              PERFUME
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/orderTracking"
              className={({ isActive }) =>
                `${isActive ? "border-b-2 border-blue-950 pb-1" : ""} 
                 hover:border-b-2 hover:border-blue-950 transition-colors duration-300 pb-1 ${
                   isProfilePage || inCart || inChat || inOrderTracking || isPerfumePage && inProductsSection || isCheckoutPage
                     ? "text-blue-950 font-semibold"
                     : inPerfume
                     ? "text-white"
                     : inAboutUs || inTestimonials
                     ? "text-blue-950 font-semibold"
                     : "text-white"
                 }`
              }
            >
              ORDER TRACKING
            </NavLink>
          </li>

          {/* Chat */}
          <li className="w-5">
            <NavLink to="/customerService">
              <img
                src={
                  isProfilePage || inCart || inChat || inOrderTracking || isPerfumePage && inProductsSection || isCheckoutPage
                    ? Bchat
                    : inAboutUs || inTestimonials
                    ? Bchat
                    : inPerfume
                    ? Wchat
                    : Wchat
                }
                alt="Chat"
              />
            </NavLink>
          </li>

          {/* Cart */}
          <li className="w-5">
            <NavLink to="/cart">
              <img
                src={
                  isProfilePage || inCart || inChat || inOrderTracking || isPerfumePage && inProductsSection || isCheckoutPage
                    ? Bcart
                    : inAboutUs || inTestimonials
                    ? Bcart
                    : inPerfume
                    ? Wcart
                    : Wcart
                }
                alt="Cart"
              />
            </NavLink>
          </li>

          {/* Profile */}
          <li className="w-5 ml-40">
            <NavLink to="/profile">
              <img
                src={
                  isProfilePage || inCart || inChat || inOrderTracking || isPerfumePage && inProductsSection  
                    ? Blogin
                    : inAboutUs || inTestimonials || isCheckoutPage
                    ? Blogin
                    : inPerfume
                    ? Wlogin
                    : Wlogin
                }
                alt="Login"
              />
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Nav;
