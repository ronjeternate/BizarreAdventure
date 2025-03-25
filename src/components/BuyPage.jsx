import React, { useState, useEffect } from "react";
import { useCart } from "../components/CartItems";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, getDoc, collection, addDoc  } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "./AuthContext";
import { Box, TextField } from "@mui/material";

const BuyPage = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("30ml");
  const [basePrice, setBasePrice] = useState(0); // Base price from Firestore
  const [price, setPrice] = useState(0); // Adjusted price based on size
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  const MAX_QUANTITY = 10;
  const availableSizes = ["30ml", "65ml"];

  // Fetch authenticated user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? currentUser : null);
    });

    return () => unsubscribe();
  }, []);

  // Fetch product price from Firestore
  useEffect(() => {
    const fetchProductPrice = async () => {
      if (!product?.id) return;

      try {
        const productRef = doc(db, "products", product.id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          setBasePrice(productData.price || 0);
          setPrice(productData.price || 0); // Set default price for 30ml
        } else {
          console.error("Product not found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching product price:", error);
      }
    };

    fetchProductPrice();
  }, [product]);

  // Update price when size changes
  useEffect(() => {
    if (size === "30ml") {
      setPrice(basePrice);
    } else if (size === "65ml") {
      setPrice(389); // Fixed price for 65ml
    }
  }, [size, basePrice]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      Math.max(1, Math.min(prev + (type === "increase" ? 1 : -1), MAX_QUANTITY))
    );
  };

  const handleAddToCart = () => {
    try {
      if (!user) {
        toast.error("You must be logged in to proceed.", {
          position: "top-right",
          className:'mt-15',
          autoClose: 1000,
        });
        return;
      }

      setAddingToCart(true);

      const cartItem = {
        productId: product.id,
        name: product.name,
        unitPrice: price,
        quantity,
        size,
        totalPrice: price * quantity,
        gender: product.gender,
        imageUrl: product.imageUrl,
      };

      addToCart(cartItem);
      toast.success("Item added to cart!", {
        position: "top-right",
        className: "mt-15",
      });

    }catch (error) { 
      console.error("Error processing checkout:", error);
      toast.error("An error occurred while processing checkout.", {
        position: "top-right",
      });
    } finally {
      setAddingToCart(false);
    }
  };


  const handleBuyNow = async () => {
    
    try {
      if (!user) {
        toast.error("You must be logged in to proceed.", {
          position: "top-right",
          className:'mt-15',
          autoClose: 1000,
        });
        return;
      }

      setIsCheckingOut(true);

      navigate("/checkout", {
        state: {
          user: {
            uid: user.uid,
          },
          product: {
            id: product.id,
            name: product.name,
            unitPrice: price,
            quantity,
            size,
            totalPrice: price * quantity,
            gender: product.gender,
            imageUrl: product.imageUrl,
          },
        },
      });
    } catch (error) { 
      console.error("Error processing checkout:", error);
      toast.error("An error occurred while processing checkout.", {
        position: "top-right",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSubmitFeedback = async () => {
    const { currentUser } = useAuth();

    if (!user) {
      console.log("User:", user); 
      toast.error("You must be logged in to submit feedback.");
      return;
    }
  
    if (!feedback.name || !feedback.desc || !feedback.rating) {
      toast.error("Please fill in all fields.",{className: "mt-15",});
      return;
    }
  
    try {
      const feedbackData = {
        name: feedback.name,
        desc: feedback.desc,
        rating: feedback.rating,
        userId: currentUser.uid,
        timestamp: new Date(), 
        shown: false,
      };
  
      await addDoc(collection(db, "testimonials"), feedbackData);
  
      toast.success("Feedback submitted successfully!" ,{className: "mt-15",});
      setShowFeedbackForm(false);
      setFeedback({ name: "", desc: "", rating: "" }); // Clear the form
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.",{className: "mt-15",});
    }
  };
 
  return (
    <>
      <ToastContainer autoClose={1000} />
      <div className="fixed inset-0 flex items-center mt-10 justify-center p-4">
        <div>
          <div className="bg-white shadow-lg p-6 w-full max-w-5xl flex relative">
            <button
              onClick={onClose}
              className="absolute top-0 right-3 text-3xl text-gray-500 cursor-pointer"
            >
              &times;
            </button>
            <div className="w-1/2">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-1/2 pl-6">
              <h2 className="text-3xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 mt-2">
                {product.description || "No description available."}
              </p>
              <p className="text-3xl text-blue-950 font-normal mt-5">
                ₱ {price * quantity}
              </p>

              <div className="mt-5 space-y-2 text-gray-600">
                <p>
                  Formulation:{" "}
                  <span className="font-semibold text-black">
                    {product.formulation || "Spray"}
                  </span>
                </p>
                <p>
                  Gender:{" "}
                  <span className="font-semibold text-black">
                    {product.gender || "Female"}
                  </span>
                </p>
              </div>

              <div className="mt-4">
                <span className="text-gray-600">Size:</span>
                <div className="flex space-x-2 mt-1 ml-10">
                  {availableSizes.map((availableSize) => (
                    <button
                      key={availableSize}
                      className={`px-5 py-2 border cursor-pointer ${
                        size === availableSize
                          ? "bg-blue-950 text-white"
                          : "bg-white text-black hover:bg-blue-950/30 border-blue-950"
                      }`}
                      onClick={() => setSize(availableSize)}
                    >
                      {availableSize}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-18 flex items-center space-x-2">
                <p className="text-gray-600 font-normal">Quantity:</p>
                <div className="border border-black/10">
                  <button
                    className="px-3 py-1 border-r border-black/10 cursor-pointer"
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="mx-5">{quantity}</span>
                  <button
                    className="px-3 py-1 border-l border-black/10 cursor-pointer"
                    onClick={() => handleQuantityChange("increase")}
                    disabled={quantity >= MAX_QUANTITY}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  className="flex-1 px-4 py-3 border bg-blue-950/20 text-blue-950 hover:bg-blue-950/30 cursor-pointer"
                  onClick={handleAddToCart}
                >
                  {addingToCart ? "Please wait..." : "Add to cart"}
                </button>
                <button
                  className={`flex-1 px-4 py-3  bg-blue-950 hover:bg-blue-950/90 text-white flex items-center justify-center ${
                    isCheckingOut ? " cursor-not-allowed" : "cursor-pointer"
                  }`}
                  onClick={handleBuyNow}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Please wait..." : "Buy Now!"}
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 w-full shadow-lg ">
            <div className="flex gap-5 items-center justify-center">
              <h2>Let us know what you think about our products:</h2>
              <button onClick={() => {
              if (!user) {
                  toast.error("You must be login to submit feedback.",{className:'mt-15', autoClose:2000});
                  return;
                }
                setShowFeedbackForm(true);
              }} 
              
              className="px-4 py-2 bg-blue-950 text-white cursor-pointer hover:bg-blue-950/90">Submit a feedback</button>
            </div>
          </div>
        </div>
      </div>

      {showFeedbackForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white p-6  shadow-lg w-150">
                <h2 className="text-xl font-bold mb-4">Submit Feedback</h2>
                <Box component="form" noValidate autoComplete="off" sx={{ width: "100%" }}>
                  {/* Name */}
                  <TextField
                    id="name"
                    name="name"
                    label="Your Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={feedback.name}
                    onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                  />

                  {/* Description */}
                  <TextField
                    id="desc"
                    name="desc"
                    label="Description"
                    multiline
                    rows={4} // Adjust height similar to h-50
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={feedback.desc}
                    onChange={(e) => setFeedback({ ...feedback, desc: e.target.value })}
                  />

                  {/* Rating */}
                  <TextField
                    id="rating"
                    name="rating"
                    label="Rating (1-5)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 3 }}
                    value={feedback.rating}
                    onChange={(e) =>
                      setFeedback({
                        ...feedback,
                        rating: Math.min(5, Math.max(1, Number(e.target.value))),
                      })
                    }
                    inputProps={{ min: 1, max: 5 }}
                  />
                </Box>

                <div className="flex gap-5">
                  <button onClick={() => setShowFeedbackForm(false)} className="flex-1 bg-gray-300 cursor-pointer">Cancel</button>
                  <button className="flex-1 bg-blue-950 text-white p-2 cursor-pointer" onClick={handleSubmitFeedback}>Submit</button>
                </div>
              </div>
            </div>
          )}
    </>
  );
};

export default BuyPage;






