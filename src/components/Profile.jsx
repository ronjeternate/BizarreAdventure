import React, { useState } from "react";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Ensure React Router is set up

const Profile = () => {
  const [activeTab, setActiveTab] = useState("All");
  const auth = getAuth();
  const navigate = useNavigate(); // Used for redirection

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div className="min-h-screen p-20 mt-10 flex flex-col md:flex-row bg-white">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white p-6 border-r">
        <div className="flex items-center space-x-3 mb-6">
          <FaUser className="text-gray-600 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold">tracyreyesph</h2>
            <a href="#" className="text-blue-950 text-sm">Edit profile</a>
          </div>
        </div>
        <nav className="space-y-2">
          <a href="#" className="block text-blue-950 font-semibold">My purchases</a>
          <a href="#" className="block text-gray-500">My Account</a>
          <a href="#" className="block text-gray-500 font-semibold">Profile</a>
          <a href="#" className="block text-gray-500">Addresses</a>
        </nav>
        <button onClick={handleLogout} className="mt-6 text-red-500">
          Log out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Tabs */}
        <div className="flex justify-center">
          {["All", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 font-semibold ${
                activeTab === tab
                  ? "border-b-2 border-blue-950 text-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* No Orders Section */}
        <div className="flex flex-col items-center justify-center h-80">
          <FaShoppingCart className="text-blue-950 text-6xl" />
          <p className="mt-3 text-gray-600">No orders yet</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
