import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Wcart from "../assets/wcart.png";
import Wlogo from "../assets/wlogo.png";
import Wlogin from "../assets/wlogin.png";

const Nav = () => {
  const [inPerfume, setInPerfume] = useState(false);
  const location = useLocation();

  // Check if the current route is the profile, cart, chat, order tracking, or checkout page
  const isPerfumePage = location.pathname === "/perfume";

  useEffect(() => {
    setInPerfume(location.pathname === "/perfume");
  }, [location.pathname]);

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full z-50 tracking-[.25em] font-[Aboreto] bg-black/70 p-3 border-b border-white/30 transition-colors duration-300 text-white">
        <ul className="flex items-center justify-center space-x-18">
          {/* Logo */}
          <li className="w-10 mr-50">
            <NavLink to="/">
              <img src={Wlogo} alt="Logo" />
            </NavLink>
          </li>

          {/* Nav Links */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? "border-b-2 border-white pb-1" : ""} 
                 hover:border-b-2 hover:border-white transition-colors duration-300 pb-1 text-white`
              }
            >
              HOME
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/perfume"
              className={({ isActive }) =>
                `${isActive ? "border-b-2 border-white pb-1" : ""} 
                 hover:border-b-2 hover:border-white transition-colors duration-300 pb-1 text-white`
              }
            >
              PERFUME
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/orderTracking"
              className={({ isActive }) =>
                `${isActive ? "border-b-2 border-white pb-1" : ""} 
                 hover:border-b-2 hover:border-white transition-colors duration-300 pb-1 text-white`
              }
            >
              ORDER TRACKING
            </NavLink>
          </li>

          {/* Cart */}
          <li className="w-5">
            <NavLink to="/cart">
              <img src={Wcart} alt="Cart" />
            </NavLink>
          </li>

          {/* Profile */}
          <li className="w-5 ml-40">
            <NavLink to="/profile">
              <img src={Wlogin} alt="Login" />
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
