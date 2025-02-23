import { TiLocation } from "react-icons/ti";
import React, { useState, useEffect } from "react";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressModal from "./AddressModal";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("My Purchases");
  const [orderTab, setOrderTab] = useState("All");
  const [addresses, setAddresses] = useState([]);
  const [userData, setUserData] = useState({
    fullName: "",
    gender: "",
    phoneNumber: "",
  });

  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserAddresses();
    }
  }, [user]);

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
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
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
            <div className="flex flex-col items-center justify-center h-120 bg-black/7 my-5">
              <FaShoppingCart className="text-blue-950 text-6xl" />
              <p className="mt-3 text-gray-600">No orders yet</p>
            </div>
          </div>
        );

      case "Profile":
        return (
          <div className="p-6 bg-black/7 shadow rounded">
            <h2 className="text-xl font-semibold">My Profile</h2>
            <p className="text-gray-500 mb-6">Manage and protect your account.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
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
                    {user?.email}
                    <a href="#" className="text-blue-500 ml-2">Change</a>
                  </p>
                </div>

                {/* Phone Number */}
                <div className="flex gap-10">
                  <label className="block text-gray-700">Phone Number</label>
                  <a href="#" className="text-blue-500">Add</a>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-gray-700">Gender</label>
                  <div className="flex space-x-4">
                    {["Male", "Female", "Others"].map((option) => (
                      <label key={option}>
                        <input
                          type="radio"
                          value={option}
                          checked={userData.gender === option}
                          onChange={() =>
                            setUserData({ ...userData, gender: option })
                          }
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="mt-4 bg-blue-950 text-white py-2 px-10 cursor-pointer"
                >
                  Save
                </button>
              </div>
              {/* Right Side - Profile Image Upload */}
              <div className="flex flex-col items-center">
                <FaUser className="text-gray-400 text-6xl" />
                <button className="mt-5 border border-black/30 p-2 px-10 ">Select Image</button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  File size: max 1MB<br /> File extension: .JPEG, .PNG
                </p>
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
                onAddressAdded={(newAddress) => setAddresses((prev) => [...prev, newAddress])}/>
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
                      className="border-b border-black/20 p-4 rounded-lg space-y-2"
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
                      {address.defaultAddress && (
                        <span className="text-blue-950 border border-blue-950 px-2 py-1 text-xs">
                          Default
                        </span>
                      )}
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
    <div className="min-h-screen p-20 mt-10 flex flex-col md:flex-row bg-white">
      <ToastContainer />
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white">
        <div className="flex items-center space-x-3 mb-6 pb-7 mr-10 border-b border-black/20">
          <FaUser className="text-gray-600 text-3xl" />
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
        <button
          onClick={handleLogout}
          className="mt-6 text-red-500 cursor-pointer"
        >
          Log out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};

export default Profile;
