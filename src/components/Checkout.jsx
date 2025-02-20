import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, user } = location.state || {};

  if (!product || !user) {
    return <p className="text-center mt-10">No product selected for checkout.</p>;
  }

  const shippingFee = 120;
  const total = product.unitPrice * product.quantity + shippingFee;

  const handlePlaceOrder = () => {
    toast.success("Order placed successfully!", { position: "top-right", className:"mt-15" });
    setTimeout(() => {
      navigate("/ordertracking");
    }, 2000); // Navigate to order tracking page after 2 seconds
  };

  return (
    <div className="max-w-full mx-auto p-10 mt-10">
      <h1 className="font-[Bebas] text-[100px] leading-none text-blue-950">CHECKOUT!</h1>

      <div className=" border-b border-black/30 py-5 p-5">
        <h2 className="text-lg font-semibold">Delivery Information</h2>
        <div className="flex justify-between">
            <p className="text-gray-600 mt-1">
            {user.name} ({user.contact}) {user.address}
            </p>
            <button className="text-blue-950 text-sm mt-2 cursor-pointer ">Change</button>
        </div>
      </div>

      <div className=" border-b border-black/30 py-5 p-5">
        <h2 className="text-lg font-semibold">Product/s Ordered</h2>
        <div className="flex items-center mt-3">
          <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover" />
          <div className="ml-4">
            <p className="font-semibold">{product.name}</p>
            <p className="text-gray-500 text-sm">Gender: {product.gender} | Size: {product.size}</p>
          </div>
          <p className="ml-auto font-semibold">{product.quantity} x ₱{product.unitPrice}</p>
        </div>
      </div>

      <div className=" border-b border-black/30">
        <div className="m-5"> 
            <h2 className="text-lg font-semibold ">Order Summary</h2>
            <div className="mt-3 text-gray-700">
            <p className="flex justify-between">
                <span className="mb-5">Payment Method</span>
                <span>(COD) Cash on Delivery</span>
                <button className="text-blue-950 text-sm mt-2 cursor-pointer">Change</button>
            </p>
            <p className="flex justify-between">
                <span>Product Price</span>
                <span>₱{product.unitPrice * product.quantity}</span>
            </p>
            <p className="flex justify-between">
                <span>Shipping Fee</span>
                <span>₱{shippingFee}</span>
            </p>
            <p className="flex justify-end font-normal mt-5 pt-2">
                <span className="mr-10">Total:</span>
                <span className="text-2xl text-blue-950">₱{total}</span>
            </p>
            </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="w-50 mt-6 bg-blue-950/30 text-black border border-blue-950 py-3 mr-5 text-center cursor-pointer"
        >
            Cancel
        </button>
        <button
            onClick={handlePlaceOrder}
            className="w-50 mt-6 bg-blue-950 text-white py-3 text-center cursor-pointer"
        >
            Place Order
        </button>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Checkout;
