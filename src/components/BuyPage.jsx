import React, { useState } from "react";
import { useCart } from "../components/CartItems";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const BuyPage = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(product.sizes ? product.sizes[0] : "30ml");
  const { addToCart } = useCart();

  // Ensure price is a number (in case it's a string like "₱ 219")
  const price = parseFloat(product.price.replace(/[^\d.]/g, "")) || 0;

  // Max quantity (Optional: change as needed)
  const MAX_QUANTITY = 10;

  const handleQuantityChange = (type) => {
    setQuantity((prevQuantity) => {
      let newQuantity = type === "increase" ? prevQuantity + 1 : prevQuantity - 1;
      return Math.max(1, Math.min(newQuantity, MAX_QUANTITY)); // Prevents going below 1 or above MAX_QUANTITY
    });
  };

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      unitPrice: price, // Using numeric price
      quantity,
      size,
      totalPrice: price * quantity, // Updated total price calculation
      gender: product.gender,
      imageUrl: product.imageUrl,
    };
    addToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg p-6 w-full max-w-5xl flex relative">
        <button onClick={onClose} className="absolute top-0 right-3 text-3xl text-gray-500">
          &times;
        </button>
        <div className="w-1/2">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="w-1/2 pl-6">
          <h2 className="text-3xl font-semibold">{product.name}</h2>
          <p className="text-gray-600 mt-2">{product.description || "No description available."}</p>
          <p className="text-3xl text-blue-950 font-normal mt-5">₱ {price * quantity}</p> {/* Updated to reflect quantity */}

          {/* Product Details */}
          <div className="mt-5 space-y-2 text-gray-600">
            <p>Shipping: <span className="font-semibold text-black">{product.shipping || "Free Shipping"}</span></p>
            <p>Formulation: <span className="font-semibold text-black">{product.formulation || "Spray"}</span></p>
            <p>Gender: <span className="font-semibold text-black">{product.gender || "Female"}</span></p>
          </div>

          {/* Size Selection */}
          <div className="mt-4">
            <span className="text-gray-600">Size:</span>
            <div className="flex space-x-2 mt-1">
              {product.sizes?.map((s) => (
                <button
                  key={s}
                  className={`px-3 py-1 border ${size === s ? "bg-blue-950 text-white" : "bg-white text-black"}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              )) || (
                <>
                  <button
                    className={`px-4 py-1 border border-blue-950 ${size === "30ml" ? "border-2 bg-blue-950/20 text-black" : "bg-white text-black"}`}
                    onClick={() => setSize("30ml")}
                  >
                    30ml
                  </button>
                  <button
                    className={`px-4 py-1 border border-blue-950 ${size === "65ml" ? "border-2 bg-blue-950/20  text-black" : "bg-white text-black"}`}
                    onClick={() => setSize("65ml")}
                  >
                    65ml
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center space-x-2">
            <p className="font-semibold">Quantity:</p>
            <button 
              className="px-3 py-1 border" 
              onClick={() => handleQuantityChange("decrease")}
              disabled={quantity <= 1} // Disable button when quantity is 1
            >
              -
            </button>
            <span>{quantity}</span>
            <button 
              className="px-3 py-1 border" 
              onClick={() => handleQuantityChange("increase")}
              disabled={quantity >= MAX_QUANTITY} // Disable button when reaching max
            >
              +
            </button>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            <button className="flex-1 px-4 py-3 border bg-blue-950 text-white" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="flex-1 px-4 py-3 border bg-blue-950/20 text-blue-950">Buy Now!</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyPage;
