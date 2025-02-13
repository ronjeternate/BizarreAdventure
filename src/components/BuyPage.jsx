import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

const BuyPage = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(product.sizes ? product.sizes[0] : "30ml");

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg p-6 w-full max-w-5xl flex relative">
        <button
          onClick={onClose} 
          className="absolute text-3xl top-0 right-0 mt-2 mr-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {/* Left Section - Product Image and Thumbnails */}
        <div className="w-1/2">
          <img
            src={product.imageUrl || "/path/to/perfume-bottle.jpg"}
            alt={product.name}
            className="w-full h-110 object-cover"
          />
          <div className="flex space-x-2 mt-2">
            {product.thumbnails?.map((thumb, index) => (
              <img
                key={index}
                src={thumb}
                alt="Thumbnail"
                className="w-16 h-16 border  cursor-pointer"
              />
            )) || (
              <>
                <img
                  src="https://via.placeholder.com/50"
                  alt="Thumbnail"
                  className="w-16 h-16 border "
                />
                <img
                  src="https://via.placeholder.com/50"
                  alt="Thumbnail"
                  className="w-16 h-16 border "
                />
                <img
                  src="https://via.placeholder.com/50"
                  alt="Thumbnail"
                  className="w-16 h-16 border "
                />
              </>
            )}
          </div>
        </div>

        {/* Right Section - Product Details */}
        <div className="w-1/2 pl-6">
          <h2 className="text-3xl font-semibold">{product.name}</h2>
          <p className="text-gray-600 mt-2">
            {product.description || "Blending sweet, alluring, and seductive notes, this fragrance is perfect for those who appreciate floral and sweet scents."}
          </p>
          <p className="text-3xl text-blue-950 font-normal mt-5">{product.price}</p>

          {/* Product Details */}
          <div className="mt-5 space-y-2 text-gray-600">
            <p>Shipping: <span className="font-semibold text-black">{product.shipping || "Free Shipping"}</span></p>
            <p>Formulation: <span className="font-semibold text-black">{product.formulation || "Spray"}</span></p>
            <p>Gender: <span className="font-semibold text-black">{product.gender || "Female"}</span></p>
          </div>

          {/* Size Selection (Updated UI) */}
          <div className="mt-4">
            <span className="text-gray-600">Size:</span>
            <div className="flex ml-18 space-x-2 mt-1">
              {product.sizes?.map((s) => (
                <button
                  key={s}
                  className={`px-3 py-1 border  ${size === s ? "bg-blue-950 text-white" : "bg-white text-black"}`}
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
          <div className="mt-20 flex items-center space-x-2">
            <p className="font-semibold">Quantity:</p>
            <div className="border border-black/30">
              <button
                className="px-3 py-1 border-r border-black/30"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-8 py-1 ">{quantity}</span>
              <button
                className="px-3 py-1 border-l border-black/30"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            <button className="flex-1 px-4 py-3 border-1 bg-blue-950/20 text-blue-950">
              <FontAwesomeIcon icon={faShoppingCart} className="mr-3" />
              Add to Cart
            </button>
            <button className="flex-1 px-4 py-3 border bg-blue-950 text-white">
              Buy Now!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyPage;
