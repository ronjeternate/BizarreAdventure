import React, { useState, useEffect } from "react";
import { useCart } from "../components/CartItems";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BuyPage = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("30ml");
  const [price, setPrice] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate(); // React Router navigation hook

  const MAX_QUANTITY = 10;
  const availableSizes = ["30ml", "65ml"];

  // Mock user info (Replace with actual user authentication data)
  const user = {
    name: "Tracy Reyes",
    phone: "9123345568",
    address: "5124 Degafdw Ohio, USA",
  };

  const priceMapping = {
    "30ml": { Men: 219, Women: 225 },
    "65ml": { Men: 389, Women: 389 },
  };

  useEffect(() => {
    const gender = product.gender || "Men";
    const newPrice = priceMapping[size][gender];
    setPrice(newPrice);
  }, [size, product.gender]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + (type === "increase" ? 1 : -1), MAX_QUANTITY)));
  };

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id, // 🔥 Ensure correct ID key
      name: product.name,
      unitPrice: price,
      quantity,
      size,
      totalPrice: price * quantity,
      gender: product.gender,
      imageUrl: product.imageUrl,
    };

  addToCart(cartItem);
  toast.success("Item added to cart!", {position:"top-right", className:"mt-15"});
  };

  const handleBuyNow = () => {
    const orderDetails = {
      user,
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
    };

    navigate("/checkout", { state: orderDetails }); // Navigate to Checkout with order details
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg p-6 w-full max-w-5xl flex relative">
          <button onClick={onClose} className="absolute top-0 right-3 text-3xl text-gray-500 cursor-pointer">&times;</button>
          <div className="w-1/2">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="w-1/2 pl-6">
            <h2 className="text-3xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 mt-2">{product.description || "No description available."}</p>
            <p className="text-3xl text-blue-950 font-normal mt-5">₱ {price * quantity}</p>

            <div className="mt-5 space-y-2 text-gray-600">
              <p>Formulation: <span className="font-semibold text-black">{product.formulation || "Spray"}</span></p>
              <p>Gender: <span className="font-semibold text-black">{product.gender || "Female"}</span></p>
            </div>

            <div className="mt-4">
              <span className="text-gray-600">Size:</span>
              <div className="flex space-x-2 mt-1 ml-10">
                {availableSizes.map((availableSize) => (
                  <button
                    key={availableSize}
                    className={`px-5 py-2 border cursor-pointer ${size === availableSize ? "bg-blue-950 text-white" : "bg-white text-black"}`}
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
                <button className="px-3 py-1 border-r border-black/10 cursor-pointer" onClick={() => handleQuantityChange("decrease")} disabled={quantity <= 1}>-</button>
                <span className="mx-5">{quantity}</span>
                <button className="px-3 py-1 border-l border-black/10 cursor-pointer" onClick={() => handleQuantityChange("increase")} disabled={quantity >= MAX_QUANTITY}>+</button>
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button className="flex-1 px-4 py-3 border bg-blue-950/20 text-blue-950 cursor-pointer" onClick={handleAddToCart}>Add to Cart</button>
              <button className="flex-1 px-4 py-3 border bg-blue-950 text-white cursor-pointer" onClick={handleBuyNow}>Buy Now!</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyPage;
