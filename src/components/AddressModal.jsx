import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db, auth } from "../firebase/firebase"; // Make sure to import your Firebase setup
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";


const handleAddAddress = async () => {
    try {
      const addressCollection = collection(db, `users/${user.uid}/addresses`);
      const newAddress = {
        fullName,
        street,
        region,
        postalCode,
        phoneNumber,
        defaultAddress: false,
      };
      const docRef = await addDoc(addressCollection, newAddress);
  
      // Pass the new address back to the parent component immediately
      onAddressAdded({ id: docRef.id, ...newAddress });
  
      toast.success("Address added successfully!");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error adding address:", error.message);
      toast.error("Failed to add address.");
    }
  };

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
      // Add the address to Firestore under the authenticated user
      await addDoc(collection(db, `users/${user.uid}/addresses`), formData);
      console.log("Address Added:", formData);
      onClose();
      onAddressAdded();
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 shadow-lg w-full max-w-lg">
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

          {/* Set as Default Checkbox */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="defaultAddress"
              checked={formData.defaultAddress}
              onChange={handleChange}
              className="border-gray-400"
            />
            Set as default
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={onClose}
              className="px-12 py-2 bg-gray-100 text-black text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-7 py-2 bg-blue-950 text-white text-sm cursor-pointer"
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
