import { useState } from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { EyeIcon, EyeOffIcon, XIcon } from "@heroicons/react/solid";
import LoginBg from "../assets/loginbg.png";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

Modal.setAppElement("#root");

const Login = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Show Toast Notification
  const notifySuccess = (message) => toast.success(message, { position: "top-right",  className: "mt-15" });
  const notifyError = (message) => toast.error(message, { position: "top-right", className: "mt-15" });

  // Handle Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // ✅ Update lastActive in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        lastActive: serverTimestamp(),
      });
  
      notifySuccess("Login successful!");
      onClose();
    } catch (err) {
      notifyError("Invalid email or password. Try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
      
        await setDoc(userRef, {
          uid: user.uid,
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          lastActive: serverTimestamp(), 
        });
      } else {
        await updateDoc(userRef, {
          lastActive: serverTimestamp(),
        });
      }
  
      notifySuccess("Google Login successful!");
      onClose();
    } catch (err) {
      console.error("Google Login Error:", err);
      notifyError("Google login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <>
      <ToastContainer autoClose={1000}  /> {/* Toast Container for Notifications */}
      
      <Modal isOpen={isOpen} onRequestClose={onClose} className="fixed inset-0 flex items-center justify-center pt-14 bg-black/90">
        <motion.div
          initial={{ y: "-100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100vh", opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white shadow-lg w-[1000px] h-[600px] flex relative "
        >
          <div className="w-3/4">
            <img src={LoginBg} alt="Login" className="w-full h-full object-cover" />
          </div>

          <div className="w-1/2 p-8 flex flex-col justify-center">
            <button className="absolute top-4 right-4 text-blue-950 hover:text-gray-800" onClick={onClose}>
              <XIcon className="w-6 h-6 cursor-pointer" />
            </button>

            <h2 className="text-lg font-semibold text-center mb-3">
              Log in to <span className="text-blue-950">BIZARRE</span>
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Welcome to <span className="text-blue-950">B I Z A R R E</span>, use your email or Google to log in.
            </p>

            <form onSubmit={handleEmailLogin}>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border  border-black/50 mb-3 "
                disabled={isLoading}
              />

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border  border-black/50 "
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-blue-950 cursor-pointer hover:text-blue-950/90"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                className={`w-full text-white p-2 mt-3  transition cursor-pointer ${
                  isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-950 hover:bg-blue-950/90"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="flex justify-between mt-3 text-sm">
              <button onClick={() => setIsForgotPasswordOpen(true)} className="text-blue-950 cursor-pointer hover:text-blue-900" disabled={isLoading}>
                Forgot password?
              </button>
              <button onClick={() => setIsSignUpOpen(true)} className="text-blue-950 cursor-pointer hover:text-blue-900" disabled={isLoading}>
                Sign up
              </button>
            </div>
            <ForgotPassword isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} />

            <button
              onClick={handleGoogleLogin}
              className={`w-full flex items-center justify-center  border cursor-pointer border-black/30 p-2 mt-15 transition ${
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

      <SignUp isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
    </>
  );
};

export default Login;
