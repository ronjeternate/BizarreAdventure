import { useState } from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginBg from "../assets/loginbg.png";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";


Modal.setAppElement("#root");

const SignUp = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle manual sign-up
  const handleSignUp = async () => {
    setError("");
    if (!fullName || !email || !password) {
      toast.error("All fields are required!", { position: "top-right", className: "mt-15" });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        createdAt: new Date(),
      });

      await auth.signOut();

      await sendWelcomeEmail(email, fullName);

      toast.success("Sign-up successful!", { position: "top-right", className: "mt-15" });

      // ✅ Clear input fields after success
      setFullName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 2000);
    } catch (err) {
      toast.error(err.message, { position: "top-right", className: "mt-15" });
      setLoading(false);
    }
  };

  const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        await fetch("http://localhost:5000/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail, name: userName }),
        });

        console.log("Welcome email sent!");
    } catch (error) {
        console.error("Error sending email:", error);
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
        <ToastContainer autoClose={1000} />

        <div className="w-3/4">
          <img src={LoginBg} alt="Sign Up" className="w-full h-full object-cover" />
        </div>

        <div className="w-1/2 p-8 flex flex-col justify-center">
          <button
            className="absolute top-7 flex items-center text-blue-950 cursor-pointer hover:text-gray-800 text-lg"
            onClick={onClose}
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
          </button>

          <h2 className="text-lg font-semibold text-center mb-3">
            Sign up for <span className="text-blue-950">BIZARRE</span>
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Create an account to start shopping with <br /> <span className="text-blue-950">B I Z A R R E</span>.
          </p>

          <Box
            component="form"
            sx={{ "& > :not(style)": { width: "100%" } }} // Full width
            noValidate
            autoComplete="off"
          >
            <TextField
              id="fullName"
              label="Enter full name"
              variant="outlined"
              fullWidth
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Box>
          <Box
            component="form"
            sx={{ "& > :not(style)": { width: "100%" } }} // Full width styling
            noValidate
            autoComplete="off"
          >
            <TextField
              id="email"
              label="Enter email address"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>

          <div className="relative w-full">
            <Box
              component="form"
              sx={{ "& > :not(style)": { m: 1, width: "100%" } }} // Full width styling
              noValidate
              autoComplete="off"
            >
              <TextField
                id="password"
                label="Enter password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </div>

          <button
            onClick={handleSignUp}
            disabled={loading}
            className={`w-full bg-blue-950 text-white p-2 mt-3 cursor-pointer transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-950/90"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default SignUp;
