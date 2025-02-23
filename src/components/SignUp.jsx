import { useState } from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginBg from "../assets/loginbg.png";
import { auth, db } from "../firebase/firebase"; // Firebase auth and Firestore
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from "@heroicons/react/solid"; // Icons

Modal.setAppElement("#root"); // Ensures accessibility

const SignUp = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Handle manual sign-up
  const handleSignUp = async () => {
    setError(""); // Clear previous errors
    if (!fullName || !email || !password) {
      toast.error("All fields are required!", { position: "top-right", className: "mt-15" });
      return;
    }

    try {
      // Create user with email & password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        createdAt: new Date(),
        phoneNumber: "", // Placeholder for future updates
      });

      toast.success("Sign-up successful!", { position: "top-right", className: "mt-15" });
      setTimeout(() => onClose(), 2000); // Close modal after 2 seconds
    } catch (err) {
      toast.error(err.message, { position: "top-right" });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center pt-14 bg-black/90"
    >
      <motion.div
        initial={{ y: "0vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100vh", opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-lg w-[1000px] h-[600px] flex relative"
      >
        {/* Toast Container for Notifications */}
        <ToastContainer />

        {/* Left Side: Image */}
        <div className="w-3/4">
          <img src={LoginBg} alt="Sign Up" className="w-full h-full object-cover" />
        </div>

        {/* Right Side: Sign-Up Form */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          {/* Back Button */}
          <button
            className="absolute top-7 flex items-center text-blue-950 hover:text-gray-800 text-lg"
            onClick={onClose}
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
          </button>

          {/* Title */}
          <h2 className="text-lg font-semibold text-center mb-3">
            Sign up for <span className="text-blue-950">BIZARRE</span>
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Create an account to start shopping with <br /> <span className="text-blue-950">B I Z A R R E</span>.
          </p>

          {/* Input Fields */}
          <input
            type="text"
            placeholder="Enter full name"
            className="w-full p-3 border rounded mb-3 focus:ring-2 focus:ring-blue-600"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter email address"
            className="w-full p-3 border rounded mb-3 focus:ring-2 focus:ring-blue-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Field with Eye Icon */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-blue-600 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Toggle Password Visibility */}
            <button
              type="button"
              className="absolute inset-y-0 right-4 bottom-4 flex items-center text-blue-950"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Sign-Up Button */}
          <button
            onClick={handleSignUp}
            className="w-full bg-blue-950 text-white p-2 mt-3 rounded-lg hover:bg-blue-800 transition"
          >
            Sign Up
          </button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default SignUp;
