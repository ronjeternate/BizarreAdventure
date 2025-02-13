import { useState } from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid"; 
import LoginBg from "../assets/loginbg.png";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import { XIcon } from "@heroicons/react/solid";

Modal.setAppElement("#root");

const Login = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ Password visibility state

  // Handle Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      onClose();
    } catch (err) {
      setError("Invalid email or password. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google Login successful!");
      onClose();
    } catch (err) {
      setError("Google login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onRequestClose={onClose} className="fixed inset-0 flex items-center justify-center pt-14 bg-black/90">
        <motion.div
          initial={{ y: "-100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100vh", opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white shadow-lg w-[1000px] h-[600px] flex relative"
        >
          <div className="w-3/4">
            <img src={LoginBg} alt="Login" className="w-full h-full object-cover" />
          </div>

          <div className="w-1/2 p-8 flex flex-col justify-center">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-blue-950 hover:text-gray-800"
              onClick={onClose}
            >
              <XIcon className="w-6 h-6" /> {/* Heroicons Close Icon */}
            </button>

            <h2 className="text-lg font-semibold text-center mb-3">
              Log in to <span className="text-blue-950">BIZARRE</span>
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Welcome to <span className="text-blue-950">B I Z A R R E</span>, use your email or Google to log in.
            </p>

            {error && <p className="text-red-500 text-center mb-3">{error}</p>}

            <form onSubmit={handleEmailLogin}>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded mb-3 focus:ring-2 focus:ring-blue-600"
                disabled={isLoading}
              />

              {/* ✅ Password Input with Show/Hide Button */}
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"} // Toggle type
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-600"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-blue-950"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                className={`w-full text-white p-2 mt-3 rounded-lg transition ${
                  isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-950 hover:bg-blue-800"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Forgot Password & Sign-Up Links */}
            <div className="flex justify-between mt-3 text-sm">
              <button onClick={() => setIsForgotPasswordOpen(true)} className="text-blue-950" disabled={isLoading}>
                Forgot password?
              </button>
              <button onClick={() => setIsSignUpOpen(true)} className="text-blue-950" disabled={isLoading}>
                Sign up
              </button>
            </div>
            <ForgotPassword isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} />

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className={`w-full flex items-center justify-center border border-gray-600 p-2 mt-15 rounded-lg transition ${
                isLoading ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-200"
              }`}
              disabled={isLoading}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Logo"
                className="w-6 h-6 mr-2"
              />
              {isLoading ? "Signing in..." : "Continue with Google"}
            </button>
          </div>
        </motion.div>
      </Modal>

      {/* Sign-Up Modal */}
      <SignUp isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
    </>
  );
};

export default Login;
