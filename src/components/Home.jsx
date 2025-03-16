import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import bestSeller from "../assets/bestSeller.png";
import backgroundImage from "../assets/Background.png";
import poloSport from "../assets/polo.png";
import Enchante from "../assets/enchante.png";
import Antheia from "../assets/antheia.png";
import Slick from "../assets/slick.png";
import Testimonials from "./Testimonials"; 
import Login from "./Login";
import { useAuth } from "../components/AuthContext";
import { NavLink} from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import footerBg from "../assets/Background.png";
import logo from "../assets/wlogo.png";



const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) { // Only show modal if no user is logged in
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 1500);
  
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.75 });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, x: 0 });
    } else {
      controls.start({ opacity: 0, x: 100 });
    }
  }, [controls, inView]);

  const aboutUsControls = useAnimation();
  const { ref: aboutUsRef, inView: aboutUsInView } = useInView({ triggerOnce: false, threshold: 0.75 });

  useEffect(() => {
    if (aboutUsInView) {
      aboutUsControls.start({ opacity: 1, x: 0 });
    } else {
      aboutUsControls.start({ opacity: 0, x: -100 });
    }
  }, [aboutUsControls, aboutUsInView]);

  const mulletControls = useAnimation();
  const { ref: mulletRef, inView: mulletInView } = useInView({ triggerOnce: false, threshold: 0.75 });

  useEffect(() => {
    if (mulletInView) {
      mulletControls.start({ opacity: 1, x: 0 });
    } else {
      mulletControls.start({ opacity: 0, x: 100 });
    }
  }, [mulletControls, mulletInView]);

  return (
    
    <div>
      {/* HOME PAGE */}
      <Login isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className={isModalOpen ? "pointer-events-none blur-sm" : ""}>
      <div className="flex items-center justify-center pt-5 gap-30 pb-20 min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div>
          <h1 className="text-white font-[Bebas] text-[150px] leading-none drop-shadow-[8px_8px_5px_rgba(24,60,141,100)]">
            Bizarre Scented
          </h1>
          <h1 className="text-white font-[Bebas] text-[150px] leading-none drop-shadow-[8px_8px_5px_rgba(24,60,141,100)]">
            Adventures
          </h1>
          <p className="text-gray-300 font-[Kumbh] text-2xl pb-12">
            A little extra luxury goes along the way!
          </p>

          <NavLink to="/perfume" className="tracking-[.2em] text-white text-[20px] font-[Aboreto] p-5 pl-15 pr-15  bg-blue-950 hover:bg-blue-950/90 ">Shop now!</NavLink>
        </div>

        <motion.div
          className="pt-20"
          initial={{ opacity: 0, x: 100 }}
          animate={controls}
          transition={{ duration: 1 }}
          ref={ref}
        >
          <img src={bestSeller} alt="BestSeller" className="w-70" />
        </motion.div>
      </div>

      {/* ABOUT US */}
      <div id="about-us" className="flex items-center justify-center pt-5 pb-20 gap-60">
        <motion.div
          className="pt-30"
          initial={{ opacity: 0, x: -100 }}
          animate={aboutUsControls}
          transition={{ duration: 1 }}
          ref={aboutUsRef}
        >
          <img src={bestSeller} alt="BestSeller" className="w-70" />
        </motion.div>

        <div className="pt-40">
          <h1 className="text-black font-[Bebas] text-[100px] leading-none pb-5">
            About <span className="text-blue-950 font-[Bebas] text-[100px] leading-none">us</span>
          </h1>
          <p className="text-black font-[Kumbh] text-2xl pb-15">
            Kenn Bryll Catubay's perfume brand fuses <br /> European elegance with local charm to
            <br /> create refined, luxurious fragrances. By <br /> focusing on affordability, it
            makes high- <br />
            end scents accessible to a broader <br />
            audience.
          </p>
          <a
            href="https://www.facebook.com/profile.php?id=61553872173314"
            target="_blank"
            className="tracking-[.2em] text-white text-[20px] font-[Aboreto] p-5 pl-15 pr-15 bg-blue-950 hover:bg-blue-950/90"
          >
            Learn more about us!
          </a>
        </div>
      </div>

      {/*BEST SELLER*/}
      <div id="best-seller" className="flex items-center justify-center pt-30 pb-20 min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div>
          <div className="flex justify-center gap-150 pt-0">
            <div>
              <h1 className="text-white font-[Bebas] text-[100px] leading-none">Best <span className="text-blue-950 font-[Bebas] text-[100px] leading-none">Seller</span></h1>
            </div>
            <div className="pt-15">
              <a href="/perfume" className="tracking-[.2em] text-white text-[15px] font-[Aboreto]">View Perfumes {'>'}</a>
            </div>  
          </div>

          <div className="flex items-center justify-center">
            <img src={poloSport} alt="Polo Sport" className="w-70" />
            <img src={Enchante} alt="Enchante" className="w-70" />
            <img src={bestSeller} alt="BestSeller" className="w-70" />
            <img src={Antheia} alt="Antheia" className="w-70" />
            <img src={Slick} alt="Slick" className="w-70" />
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div id="testimonials" className="w-full py-40  bg-white">
        <div className="text-left pl-23">
          <h1 className="text-blue-950 font-[Bebas] text-[100px] leading-none">
            Testimonials</h1>
            
        </div>
          <Testimonials/>
        </div>

      
      </div>
      <footer
        className="text-white py-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${footerBg})` }}
      >
        <div className="container mx-auto flex justify-between  px-10">
          {/* Logo Section */}
          <div className="flex flex-col items-center w-1/3">
            <img src={logo} alt="Bizarre Logo" className="w-20" />
            <h1 className="text-lg font-bold mt-2">BIZARRE</h1>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h2 className="text-lg font-bold">Quick links</h2>
            <ul className="space-y-1 mt-2">
              <li>Home</li>
              <li>Perfume</li>
              <li>Order Tracking</li>
              <li>Cart</li>
              <li>Profile</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-lg font-bold">Contact</h2>
            <p className="mt-2">09751883932</p>
          </div>

          {/* Social Media Links */}
          <div>
            <h2 className="text-lg font-bold">Follow us</h2>
            <div className="items-center space-x-3 mt-2">
              <a href="#" className="flex items-center space-x-1">
                <FaFacebook /> <span>Bizarre Scents</span>
              </a>
              <a href="#" className="flex items-center space-x-1">
                <FaInstagram /> <span>@bizarrescentsph</span>
              </a>
              <a href="#" className="flex items-center space-x-1">
                <FaTiktok /> <span>bizarrescentsofficial</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
