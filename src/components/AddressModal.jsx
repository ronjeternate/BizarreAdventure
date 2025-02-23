import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db, auth } from "../firebase/firebase"; // Make sure to import your Firebase setup
import { collection, getDocs, updateDoc, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";


const AddressModal = ({ onClose, onAddressAdded }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    region: "",
    postalCode: "",
    street: "",
    additionalInfo: "",
    defaultAddress: false,
  });

  const [disabled, setDisabled] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("✅ User authenticated:", user.uid);
      // You can now perform Firestore operations
    } else {
      console.log("❌ User not authenticated");
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
  
    if (!user) {
      console.error("User not authenticated");
      return;
    }
  
    try {
      setDisabled(true);
      await addDoc(collection(db, `users/${user.uid}/addresses`), formData);
      console.log("Address Added:", formData);
      toast.success("Address added successfully!",  {
        autoClose: 2000, 
        className:"mt-15",
        onClose: () => {
          onAddressAdded(); 
          onClose();
        },
      });
    } catch (error) {
      console.error("Error adding address:", error.message);
      toast.error("Failed to add address.", {
        className:"mt-15",
      });
      setDisabled(false);
    }
  };
  
  // After adding the new address successfully
  const handleAddAddress = async (newAddress) => {
    const addressCollection = collection(db, `users/${user.uid}/addresses`);
    const snapshot = await getDocs(addressCollection);
  
    // Check if this is the first address
    const isFirstAddress = snapshot.empty;
  
    // If it's the first address, set it as default automatically
    const addressToAdd = {
      ...newAddress,
      defaultAddress: isFirstAddress ? true : false,
    };
  
    // Add the new address
    await addDoc(addressCollection, addressToAdd);
  
    // Refresh the address list
    fetchUserAddresses();
  };

  

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 shadow-lg w-full max-w-lg">
        <ToastContainer/>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My New Address</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-500 hover:text-black cursor-pointer" />
          </button>
        </div>

        {/* Address Form */}
        <div className="space-y-7">
          <div className="flex gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Fullname"
              value={formData.fullName}
              onChange={handleChange}
              className="w-1/2 p-2 border border-black/30"
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-1/2 p-2 border border-black/30"
            />
          </div>

          <input
            type="text"
            name="region"
            placeholder="Region, Province, City, Barangay"
            value={formData.region}
            onChange={handleChange}
            className="w-full p-2 border border-black/30"
          />

          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full p-2 border border-black/30"
          />

          <input
            type="text"
            name="street"
            placeholder="Street Name, Building, House No."
            value={formData.street}
            onChange={handleChange}
            className="w-full p-2 border border-black/30"
          />

          <input
            type="text"
            name="additionalInfo"
            placeholder="Additional Information (optional)"
            value={formData.additionalInfo}
            onChange={handleChange}
            className="w-full p-2 border border-black/30"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={disabled ? null : onClose}
              className={`px-12 py-2 bg-gray-100 text-black text-sm cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={disabled}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-7 py-2 bg-blue-950 text-white text-sm cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={disabled}
            >
              Add Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
