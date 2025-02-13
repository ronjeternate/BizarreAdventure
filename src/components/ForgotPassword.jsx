import { useState } from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { auth } from "../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import LoginBg from "../assets/loginbg.png";
import { ArrowLeftIcon } from "@heroicons/react/solid"; // Import back icon

Modal.setAppElement("#root");

const ForgotPassword = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!email) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset link sent! Check your email.");
      setEmail(""); 
    } catch (err) {
      console.error("Error sending reset email:", err);
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Try again later.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="fixed inset-0 flex items-center pt-14 justify-center bg-black/90">
      <motion.div
        initial={{ y: "0vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100vh", opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg w-[1000px] h-[600px] flex relative"
      >
        <div className="w-3/4">
          <img src={LoginBg} alt="Forgot Password" className="w-full h-full object-cover" />
        </div>

        <div className="w-1/2 p-8 flex flex-col justify-center">
         
          <button
            className="absolute top-4 right-4 flex items-center text-blue-950 hover:text-gray-800 text-lg"
            onClick={onClose}
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            
          </button>

          <h2 className="text-lg font-semibold text-center mb-3">Forgot Password</h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Enter your registered email address, and we will send you a link to reset your password.
          </p>

          {error && <p className="text-red-500 text-center mb-3">{error}</p>}
          {successMessage && <p className="text-green-500 text-center mb-3">{successMessage}</p>}

          <form onSubmit={handleSendResetEmail}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded mb-3 focus:ring-2 focus:ring-blue-600"
              disabled={loading}
            />

            <button
              type="submit"
              className="w-full bg-blue-950 text-white p-2 rounded-lg hover:bg-blue-800 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z"></path>
                </svg>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </Modal>
  );
};

export default ForgotPassword;
