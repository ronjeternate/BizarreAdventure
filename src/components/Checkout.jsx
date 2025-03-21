import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs, query,  updateDoc, doc, deleteDoc, serverTimestamp, addDoc, onSnapshot } from "firebase/firestore";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, user, products } = location.state || {};
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  
  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = fetchUserAddresses();
      return () => unsubscribe(); // Cleanup on unmount
    }
  }, []);
  
  const fetchUserAddresses = () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
  
      const userAddressesRef = collection(db, `users/${currentUser.uid}/addresses`);
  
      // Listen for real-time updates
      const unsubscribe = onSnapshot(userAddressesRef, (snapshot) => {
        const fetchedAddresses = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAddresses(fetchedAddresses);
        const defaultAddr = fetchedAddresses.find((addr) => addr.defaultAddress === true);
        setDefaultAddress(defaultAddr || fetchedAddresses[0]);
      });
  
      return unsubscribe; // Return unsubscribe function to stop listening when unmounted
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // ✅ Set selected address as default
  const handleSetDefaultAddress = async (addressId) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Update Firestore to set the selected address as default
      const userAddressesRef = collection(db, `users/${currentUser.uid}/addresses`);
      const querySnapshot = await getDocs(userAddressesRef);

      // Reset all addresses' default status
      for (const docSnapshot of querySnapshot.docs) {
        await updateDoc(doc(db, `users/${currentUser.uid}/addresses`, docSnapshot.id), {
          defaultAddress: docSnapshot.id === addressId,
        });
      }

      // Refresh the address list
      toast.success("Default address updated!", {autoClose: 1000,});
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to update default address.", {autoClose: 1000,});
    }
  };

  // ❌ Remove an address
  const handleRemoveAddress = async (addressId) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      await deleteDoc(doc(db, `users/${currentUser.uid}/addresses`, addressId));

      // Refresh address list
      setAddresses(addresses.filter((address) => address.id !== addressId));
      toast.success("Address removed!", {autoClose: 1000,});
    } catch (error) {
      console.error("Error removing address:", error);
      toast.error("Failed to remove address." , {autoClose: 1000,});
    }
  };

  if ((!product && !products) || !user) {
    return <p className="text-center mt-10">No product selected for checkout.</p>;
  }

  const shippingFee = 120;
  const totalProductPrice = product
    ? product.unitPrice * product.quantity
    : products.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const total = totalProductPrice + shippingFee;

  const handlePlaceOrder = async () => {
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      toast.error("You must be logged in to place an order.", { className: "mt-15" });
      return;
    }
  
    setIsPlacingOrder(true); // 🔄 Start loading
  
    try {
      const orderData = {
        userId: currentUser.uid,
        customerName: defaultAddress.fullName,
        customerAddress: `${defaultAddress.street}, ${defaultAddress.region}, ${defaultAddress.postalCode}`,
        customerPhone: defaultAddress.phoneNumber,
        products: product ? [product] : products,
        total,
        shippingFee,
        orderDate: serverTimestamp(),
        status: "Pending",
      };
  
      const orderRef = await addDoc(collection(db, `users/${currentUser.uid}/orders`), orderData);
      const orderId = orderRef.id; // Get the generated order ID
  
      // ✅ Call the backend to send the email
      await fetch("http://localhost:5000/send-order-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          name: defaultAddress.fullName,
          orderId,
          status: "Pending",
        }),
      });
  
      toast.success("Order placed successfully!", {
        position: "top-right",
        className: "mt-15",
        autoClose: 1000,
      });
  
      setTimeout(() => navigate("/orderTracking"), 1500);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Please add or set a default address to continue.", { className: "mt-15", autoClose: 2000 });
    } finally {
      setIsPlacingOrder(false); // ✅ Stop loading
    }
  };
  

  return (
    <div className="max-w-full mx-auto p-10 mt-10">
      <h1 className="font-[Bebas] text-[100px] leading-none text-blue-950">
        CHECKOUT!
      </h1>

      <div className="border-b border-black/30 py-5 p-5">
        <h2 className="text-lg font-semibold">Delivery Information</h2>
        <div className="flex justify-between">
        {defaultAddress ? (
            <p className="text-gray-600 mt-1">
              {defaultAddress.fullName} ({defaultAddress.phoneNumber}) {defaultAddress.street}, {defaultAddress.region}, {defaultAddress.postalCode}
            </p>
          ) : (
            <p className="text-gray-400">No address found. Please add one.</p>
          )}
          <button className="text-blue-950 text-sm mt-2 cursor-pointer" onClick={() => setIsAddressOpen(true)}>
            Change
          </button>
        </div>
      </div>

      {isAddressOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 shadow-lg w-[1000px] max-w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">My Addresses</h2>
                <p className="text-gray-500">Manage and track your address.</p>
              </div>
              {/* Close Modal Button */}
              <button
                onClick={() => setIsAddressOpen(false)}
                className="text-[30px] text-gray-600 hover:text-gray-800 cursor-pointer mb-4 "
              >
                &times;
              </button>
            </div>

            {/* Divider */}
            <hr className="border-gray-300 my-4" />

            {/* Address List */}
            <div className="space-y-4">
              <h1 className="text-black font-normal">Address</h1>
              {addresses.length === 0 ? (
                <p className="text-gray-400">No address saved yet.</p>
              ) : (
                addresses.map((address) => (
                  <div key={address.id} className="border-b border-black/20 p-4 space-y-2">
                    <div className="flex gap-5">
                      <h3 className="font-semibold">{address.fullName || "Unnamed"}</h3>
                      <p className="text-gray-600/50">|</p>
                      <p className="text-sm text-gray-600">
                        (+63) {address.phoneNumber || "N/A"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {address.street || "No street provided"}, <br />
                      {address.region || "No region"}, {address.postalCode || "No postal code"}
                    </p>
                    <div className="flex justify-between">
                      <button
                        onClick={() => handleSetDefaultAddress(address.id)}
                        className={`px-2 py-1 text-xs border ${
                          address.defaultAddress
                            ? "text-white bg-blue-950 border-blue-950"
                            : "text-blue-950 border-blue-950 cursor-pointer"
                        }`}
                      >
                        {address.defaultAddress ? "Default" : "Set as Default"}
                      </button>

                      <button
                        onClick={() => handleRemoveAddress(address.id)}
                        className="px-2 py-1 text-xs text-red-500 border border-red-500 cursor-pointer hover:bg-red-500 hover:text-white transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}


      <div className="border-b border-black/30 py-5 p-5">
        <h2 className="text-lg font-semibold">Product/s Ordered</h2>
        {(product ? [product] : products).map((item) => (
          <div className="flex items-center mt-3" key={item.id}>
            <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover" />
            <div className="ml-4">
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-500 text-sm">Gender: {item.gender} | Size: {item.size}</p>
            </div>
            <p className="ml-auto font-semibold">
              {item.quantity} x ₱{item.unitPrice}
            </p>
          </div>
        ))}
      </div>

      <div className="border-b border-black/30">
        <div className="m-5">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-3 text-gray-700">
            <p className="flex justify-between">
              <span className="mb-5">Payment Method</span>
              <span>(COD) Cash on Delivery</span>
              <button className="text-blue-950 text-sm mt-2 cursor-pointer">Change</button>
            </p>
            <p className="flex justify-between"><span>Product Price</span><span>₱{totalProductPrice}</span></p>
            <p className="flex justify-between"><span>Shipping Fee</span><span>₱{shippingFee}</span></p>
            <p className="flex justify-end font-normal mt-5 pt-2">
              <span className="mr-10">Total:</span>
              <span className="text-2xl text-blue-950">₱{total}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="w-50 mt-6 bg-blue-950/30 text-black border border-blue-950 py-3 mr-5 text-center cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handlePlaceOrder}
          className={`w-50 mt-6 bg-blue-950 hover:bg-blue-950/90 text-white flex items-center justify-center px-4 py-3 border ${
            isPlacingOrder ? "cursor-not-allowed opacity-75" : "cursor-pointer"
          }`}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder && (
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="15" fill="none" />
            </svg>
          )}
          {isPlacingOrder ? "Please wait..." : "Place Order"}
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Checkout;
