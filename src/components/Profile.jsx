import { TiLocation } from "react-icons/ti";
import React, { useState, useEffect } from "react";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, updateDoc, writeBatch, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressModal from "./AddressModal";
import { motion, AnimatePresence } from "framer-motion";
import Logo from '/titlelogo.png'

const Profile = () => {
  const [activeTab, setActiveTab] = useState("My Purchases");
  const [orderTab, setOrderTab] = useState("All");
  const [addresses, setAddresses] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const [userData, setUserData] = useState({
    fullName: "",
    gender: "",
    phoneNumber: "",
  });

  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserAddresses();
      fetchUserOrders();
    }
  }, [user]);


  const handleRemoveAddress = async () => {
    if (!addressToDelete) return;
    setLoadings(true); 
  
    try {
      const addressDoc = doc(db, `users/${user.uid}/addresses`, addressToDelete);
      await updateDoc(addressDoc, { deleted: true }); // Optionally mark as deleted
      await deleteDoc(addressDoc);
  
      toast.success("Address removed successfully!", { position: "top-right" });
      fetchUserAddresses(); // Refresh address list
    } catch (error) {
      console.error("Error removing address:", error.message);
      toast.error("Failed to remove address. Please try again.", { position: "top-right" });
    }
    setLoadings(false);
    setShowConfirmModal(false);
  };
  
  // Trigger modal before deletion
  const confirmRemoveAddress = (addressId) => {
    setAddressToDelete(addressId);
    setShowConfirmModal(true);
  };

  // Fetch User Info
  const fetchUserData = async () => {
    try {
      const userDoc = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        setUserData({
          fullName: data.fullName || "",
          gender: data.gender || "",
          phoneNumber: "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  // Fetch User Addresses
  const fetchUserAddresses = async () => {
    try {
      const addressCollection = collection(db, `users/${user.uid}/addresses`);
      const snapshot = await getDocs(addressCollection);
  
      const addressList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAddresses(addressList);
    } catch (error) {
      console.error("Error fetching addresses:", error.message);
    }
  };

  const setDefaultAddress = async (selectedAddressId) => {
    const addressCollection = collection(db, `users/${user.uid}/addresses`);
    const snapshot = await getDocs(addressCollection);
  
    const batch = writeBatch(db);
  
    // Loop through all addresses and update their default status
    snapshot.docs.forEach((doc) => {
      const isDefault = doc.id === selectedAddressId;
      batch.update(doc.ref, { defaultAddress: isDefault });
    });
  
    await batch.commit();
    fetchUserAddresses();
  };

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    const maskedName = name.slice(0, 3) + "*".repeat(name.length - 3); // Show first 4 chars
    return `${maskedName}@${domain}`;
  };
  

  // Save Updated User Info
  const handleSave = async () => {
    try {
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        await updateDoc(userDoc, {
          fullName: userData.fullName,
          gender: userData.gender,
        });

        toast.success("Profile updated successfully!", {
          position: "top-right",
          className:"mt-15"
        });
      }
    } catch (error) {
      toast.error("Error updating profile. Please try again.", {
        position: "top-right",
        className:"mt-15"
      });
      console.error("Error updating profile:", error.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    setShowConfirmLogout(false);
    try {
      await signOut(auth);
      
    } catch (error) {
      console.error("Logout Error:", error.message);
      setLoading(false); 
    }
  };
  

  const fetchUserOrders = async () => {
    try {
      const ordersCollection = collection(db, `users/${user.uid}/orders`);
      const snapshot = await getDocs(ordersCollection);
  
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setOrders(orderList);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    }
  };

  // Tabs Content
  const renderContent = () => {
    switch (activeTab) {
      case "My Purchases":
        return (
          <div> 
            <div className="flex justify-around bg-black/7">
              {["All", "Completed", "Cancelled"].map((tab) => (
                <button
                  key={tab} 
                  className={`w-full py-4 font-semibold cursor-pointer ${
                    orderTab === tab
                      ? "border-b-2 border-blue-950 text-blue-950"
                      : "text-gray-500"
                  }`}
                  onClick={() => setOrderTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-col h-120 bg-black/7 my-5 max-h-full overflow-y-auto">
              {orderTab === "All" ? (
                orders.filter(order => order.status === "Completed" || order.status === "Cancelled").length > 0 ? (
                  orders
                    .filter(order => order.status === "Completed" || order.status === "Cancelled")
                    .map((order) => (
                      <div key={order.id} className="p-5 mx-2 border-b border-black/10 last:border-none flex items-center gap-4 cursor-pointer hover:bg-gray-200"
                      onClick={() => setSelectedOrder(order)}>
                        
                        <img
                          src={order.products[0].imageUrl}
                          alt={order.products[0].name}
                          className="w-20 h-20 object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{order.products[0].name}</p>
                          <p className="text-gray-500 text-sm">
                            Gender: {order.products[0].gender} | Size: {order.products[0].size}
                          </p>
                          {order.products.length > 1 && (
                            <p className="text-blue-950 text-sm">This order has +{order.products.length - 1} more items</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₱{order.total}</p>
                          <p className="text-gray-500 text-sm">
                            <span className={order.status === "Completed" ? "text-green-600" : "text-red-600"}>
                              {order.status}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-120 my-5">
                    <FaShoppingCart className="text-blue-950 text-6xl" />
                    <p className="mt-3 text-gray-600">No orders yet</p>
                  </div>
                )
              ) : orderTab === "Cancelled" ? (
                orders.filter(order => order.status === "Cancelled").length > 0 ? (
                  orders
                    .filter(order => order.status === "Cancelled")
                    .map((order) => (
                      <div key={order.id} className="p-5 mx-2 border-b border-black/10 last:border-none flex items-center gap-4 cursor-pointer hover:bg-gray-200"
                      onClick={() => setSelectedOrder(order)}>
                        
                        <img
                          src={order.products[0].imageUrl}
                          alt={order.products[0].name}
                          className="w-20 h-20 object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{order.products[0].name}</p>
                          <p className="text-gray-500 text-sm">
                            Gender: {order.products[0].gender} | Size: {order.products[0].size}
                          </p>
                          {order.products.length > 1 && (
                            <p className="text-blue-950 text-sm">This order has +{order.products.length - 1} more items</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₱{order.total}</p>
                          <p className="text-gray-500 text-sm">
                            <span className="text-red-600">{order.status}</span>
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-120 my-5">
                    <FaShoppingCart className="text-blue-950 text-6xl" />
                    <p className="mt-3 text-gray-600">No cancelled orders yet</p>
                  </div>
                )
              ) : orderTab === "Completed" ? (
                orders.filter(order => order.status === "Completed").length > 0 ? (
                  orders
                    .filter(order => order.status === "Completed")
                    .map((order) => (
                      <div key={order.id} className="p-5 mx-2 border-b border-black/10 last:border-none flex items-center gap-4 cursor-pointer hover:bg-gray-200"
                      onClick={() => setSelectedOrder(order)}>
                        
                        <img
                          src={order.products[0].imageUrl}
                          alt={order.products[0].name}
                          className="w-20 h-20 object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{order.products[0].name}</p>
                          <p className="text-gray-500 text-sm">
                            Gender: {order.products[0].gender} | Size: {order.products[0].size}
                          </p>
                          {order.products.length > 1 && (
                            <p className="text-blue-950 text-sm">This order has +{order.products.length - 1} more items</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₱{order.total}</p>
                          <p className="text-gray-500 text-sm">
                            <span className="text-green-600">{order.status}</span>
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-120 my-5">
                    <FaShoppingCart className="text-blue-950 text-6xl" />
                    <p className="mt-3 text-gray-600">No completed orders yet</p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-120 my-5">
                  <FaShoppingCart className="text-blue-950 text-6xl" />
                  <p className="mt-3 text-gray-600">No orders yet</p>
                </div>
              )}
            </div>
            {selectedOrder && (
              <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50">
                <div className="bg-gray-200 p-8 shadow-lg max-w-200 w-full">
                  {/* Close Button */}
                  <div className="flex justify-between mb-5">
                  {selectedOrder && (
                    <p className="text-blue-950 text-lg font-bold opacity-100">
                      This order has been {selectedOrder.status}.
                    </p>
                  )}

                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-600 hover:text-gray-900 text-xl cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Order Progress */}
                  <div className="flex gap-4 mb-6">
                    <div
                      className={`flex-1 text-center p-2 border ${
                        selectedOrder?.status === "packed" ||
                        selectedOrder?.status === "shipped" ||
                        selectedOrder?.status === "completed"
                          ? "bg-blue-100 text-blue-950 border-blue-500"
                          : "bg-gray-100 text-gray-600 border-gray-300"
                      }`}
                    >
                      <p className="font-semibold">Packed</p>
                      <p className="text-sm">Complete packing</p>
                    </div>

                    <div
                      className={`flex-1 text-center p-2 border ${
                        selectedOrder?.status === "shipped" || selectedOrder?.status === "completed"
                          ? "bg-blue-100 text-blue-950 border-blue-500"
                          : "bg-gray-100 text-gray-600 border-gray-300"
                      }`}
                    >
                      <p className="font-semibold">Shipped</p>
                      <p className="text-sm">On delivery</p>
                    </div>

                    <div
                      className={`flex-1 text-center p-2 border ${
                        selectedOrder?.status === "completed"
                          ? "bg-blue-100 text-blue-950 border-blue-500"
                          : "bg-gray-100 text-gray-600 border-gray-300"
                      }`}
                    >
                      <p className="font-semibold">Completed</p>
                      <p className="text-sm">Order completed</p>
                    </div>
                  </div>


                  {/* Shipping Details */}
                  <div className="border-t border-black/20 pt-4 mb-4">
                    <p className="font-semibold mb-2">Shipping Details</p>
                    <p className="text-black/50">
                      <p>Name: {selectedOrder.customerName}</p> 
                    </p>
                    <p className="text-black/50">
                      <p>Address: {selectedOrder.customerAddress}</p>
                    </p>
                    <p className="text-black/50">
                      <p>Phone: {selectedOrder.customerPhone}</p>
                    </p>
                  </div>

                  {/* Product Details */}
                  <div className="border-t border-black/20 pt-4 mb-4">
                    <p className="font-semibold">Order Items</p>
                    {selectedOrder.products.map((product) => (
                      <div key={product.id} className="flex items-center gap-4 mt-2">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-20 h-20 object-cover"
                        />
                        <div className="flex gap-70">
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-black/50">
                              Gender: {product.gender} | Size: {product.size}
                            </p>
                            <p className="text-black/50">Quantity: {product.quantity}</p>
                          </div>
                          <div>
                            <p className="font-semibold">{product.unitPrice} x {product.quantity} = {product.totalPrice}</p>
                          </div>
                          </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t mb-2 border-black/20 pt-4">
                    <p className="font-semibold mb-2">Order Summary</p>
                    <div className="flex justify-between text-black/50">
                    <span>Product Price</span>
                    <span>₱{selectedOrder?.products?.[0]?.totalPrice ?? "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-black/50">
                      <span>Shipping Fee</span>
                      <span>₱{selectedOrder.shippingFee}</span>
                    </div>
                    <div className="flex justify-between font-semibold mt-10">
                      <span>Total:</span>
                      <span className="border-t">₱{selectedOrder.total}</span>
                    </div>
                  </div>
                  

                  {/* Cancel Order Button */}
                  
                  {selectedOrder && (
                    <p className={`mt-4 font-semibold ${selectedOrder.status === "Cancelled" ? "text-red-500" : "text-green-500"}`}>
                      Order is already {selectedOrder.status.toLowerCase()}.
                    </p>
                  )}
             
                </div>
              </div>
            )}
          </div>
        );


      case "Profile":
        return (
          <div className="p-6 bg-black/7 shadow rounded">
            <h2 className="text-xl font-semibold">My Profile</h2>
            <p className="text-gray-500 mb-6">Manage and protect your account.</p>
            <div className="gap-6 items-start">
              <div className="md:col-span-2 space-y-10">
                {/* Full Name */}
                <div>
                  <label className="block text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={userData.fullName}
                    onChange={(e) =>
                      setUserData({ ...userData, fullName: e.target.value })
                    }
                    className="w-full p-2 border border-black/30"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700">Email</label>
                  <p className="flex gap-10">
                    {user?.email && maskEmail(user.email)}
                  </p>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-gray-700">Gender</label>
                  <div className="flex space-x-4">
                    {["Male", "Female", "Others"].map((option) => (
                      <label key={option}>
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          checked={userData.gender === option}
                          onChange={() =>
                            setUserData({ ...userData, gender: option })
                          }
                          className="mr-2 cursor-pointer"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div  className="text-right">
                  <button
                    onClick={handleSave}
                    className="mt-4 bg-blue-950 text-white py-2 px-10 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "Addresses":
        return (
          <div className="p-6 bg-black/7">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">My Addresses</h2>
                <p className="text-gray-500">Manage and track your address.</p>
              </div>
              {/* Add New Address */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-950 text-sm text-white py-2 px-6 cursor-pointer hover:bg-blue-800 transition"
              >
                <TiLocation className="text-white text-lg" />
                Add New Address
              </button>

              {isModalOpen && (
                <AddressModal onClose={() => setIsModalOpen(false)} 
                onAddressAdded={fetchUserAddresses}
                setDefaultAddress={setDefaultAddress}/>
              )}
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
                  address && ( // Ensure address is not undefined
                    <div
                      key={address.id}
                      className="border-b border-black/20 p-4 space-y-2"
                    >
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
                          onClick={() => setDefaultAddress(address.id)}
                          className={`px-2 py-1 text-xs border ${
                            address.defaultAddress
                              ? "text-white bg-blue-950 border-blue-950"
                              : "text-blue-950 border-blue-950 cursor-pointer"
                          }`}
                        >
                          {address.defaultAddress ? "Default" : "Set as Default"}
                        </button>

                        <button
                          onClick={() => confirmRemoveAddress(address.id)}
                          className="px-2 py-1 text-xs text-red-500 border border-red-500 cursor-pointer hover:bg-red-500 hover:text-white transition"
                        >
                          Remove
                        </button>

                        {showConfirmModal && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                            <div className="bg-white p-6 shadow-lg">
                              <p className="text-lg font-medium mb-3">Are you sure you want to delete this address?</p>
                              <div className="flex justify-end mt-6">
                                <button onClick={() => setShowConfirmModal(false)} className="mr-2 flex-1 hover:bg-black/20 cursor-pointer">Cancel</button>
                                <button
                                  onClick={handleRemoveAddress}
                                  disabled={loadings} // Disable button while deleting
                                  className={`bg-blue-950 hover:bg-blue-950/90 text-white flex-1 py-2 cursor-pointer flex justify-center items-center ${
                                    loadings ? "cursor-not-allowed opacity-70" : ""
                                  }`}
                                >
                                  {loadings ? (
                                    <span>Deleting...</span>
                                  ) : (
                                    "Delete"
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>


                    </div>
                  )
                ))
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <img src="/path-to-your-logo.png" alt="Loading..." className="w-20 h-20 animate-pulse" />
        </div>
      )}
  
      <div className="min-h-screen p-20 mt-10 flex flex-col md:flex-row bg-white">
        <ToastContainer autoClose={1000} />
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white">
          <div className="flex items-center space-x-3 mb-6 pb-7 mr-10 border-b border-black/20">
            {userData.photoURL}
            <div>
              <h2 className="text-lg font-semibold">
                {userData.fullName || "User"}
              </h2>
              <button
                onClick={() => setActiveTab("Profile")}
                className="text-blue-950 text-sm cursor-pointer"
              >
                Edit profile
              </button>
            </div>
          </div>
  
          {/* Navigation */}
          <nav className="space-y-2 my-10">
            {["My Purchases", "Profile", "Addresses"].map((section) => (
              <button
                key={section}
                className={`block w-full text-left font-semibold px-2 py-1 rounded cursor-pointer ${
                  activeTab === section ? "text-blue-950" : "text-gray-500"
                }`}
                onClick={() => setActiveTab(section)}
              >
                {section}
              </button>
            ))}
          </nav>
  
          {/* Logout Button */}
          <button onClick={() => setShowConfirmLogout(true)} className="text-red-500 cursor-pointer">
            Log out
          </button>

          {showConfirmLogout && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-white p-6 shadow-lg">
                <p className="text-lg">Are you sure you want to log out?</p>
                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowConfirmLogout(false)} className="mr-2 flex-1 hover:bg-black/20 cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleLogout} className="bg-blue-950 hover:bg-blue-950/90 text-white flex-1 py-2 cursor-pointer">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
  
        {/* Main Content */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </>
  );
  
};

export default Profile;
