import React, { useState, useEffect } from "react";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 

const Profile = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [userName, setUserName] = useState(""); // State to hold user's name
  const auth = getAuth();
  const navigate = useNavigate(); // Used for redirection

  useEffect(() => {
    // Fetch user information on component mount
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || "User"); // Default to "User" if displayName is not available
    }
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div className="min-h-screen p-20  mt-10 flex flex-col md:flex-row bg-white">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white  ">
        <div className="flex items-center space-x-3 mb-6 mr-10 pb-7 border-b border-black/20">
          <FaUser className="text-gray-600 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold">{userName}</h2> {/* Display user's name */}
            <a href="#" className="text-blue-950 text-sm">Edit profile</a>
          </div>
        </div>
        <nav className="space-y-2 my-10">
          <a href="#" className="block text-blue-950 font-semibold">My purchases</a>
          <a href="#" className="block text-gray-500 font-semibold">Profile</a>
          <a href="#" className="block text-gray-500">Addresses</a>
        </nav>
        <button onClick={handleLogout} className="mt-6 text-red-500 cursor-pointer">
          Log out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Tabs */}
        <div className="flex justify-around bg-black/7">
          {["All", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              className={`w-full py-4 font-semibold cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-blue-950 text-blue-950"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* No Orders Section */}
        <div className="flex flex-col items-center justify-center h-120 bg-black/7 my-5">
          <FaShoppingCart className="text-blue-950 text-6xl" />
          <p className="mt-3 text-gray-600">No orders yet</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
