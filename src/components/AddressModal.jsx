import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { Box, TextField } from "@mui/material";

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
    if (!user) {
      console.log("❌ User not authenticated");
    }
  });

  const validateForm = () => {
    for (let key in formData) {
      if (key !== "additionalInfo" && key !== "defaultAddress" && typeof formData[key] === "string" && !formData[key].trim()) {
        toast.error("Please fill in all required fields.", { className: "mt-15" });
        return false;
      }
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      setDisabled(true);
      const addressCollection = collection(db, `users/${user.uid}/addresses`);
      const snapshot = await getDocs(addressCollection);
      const isFirstAddress = snapshot.empty;

      await addDoc(addressCollection, {
        ...formData,
        defaultAddress: isFirstAddress ? true : formData.defaultAddress,
      });
      
      toast.success("Address added successfully!", {
        className: "mt-15",
        onClose: () => {
          onAddressAdded();
          onClose();
        },
      });
    } catch (error) {
      console.error("Error adding address:", error.message);
      toast.error("Failed to add address.", { className: "mt-15" });
      setDisabled(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 shadow-lg w-full max-w-lg">
        <ToastContainer autoClose={1000} />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My New Address</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-500 hover:text-black cursor-pointer" />
          </button>
        </div>

        <div className="space-y-7">
          <Box component="form" noValidate autoComplete="off" sx={{ width: "100%" }}>
            {/* Full Name & Phone Number */}
            <div className="flex gap-4">
              <TextField
                id="fullName"
                name="fullName"
                label="Full Name"
                type="text"
                variant="outlined"
                fullWidth
                value={formData.fullName}
                onChange={handleChange}
              />
              <TextField
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                type="tel"
                variant="outlined"
                fullWidth
                value={formData.phoneNumber}
                onChange={handleChange}
                inputProps={{
                  inputMode: "numeric", // Mobile-friendly numeric keyboard
                  pattern: "[0-9]*", // Restricts input to numbers
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Prevents non-numeric characters
                }}
              />
            </div>

            {/* Region */}
            <TextField
              id="region"
              name="region"
              label="Region, Province, City, Barangay"
              type="text"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.region}
              onChange={handleChange}
            />

            {/* Postal Code */}
            <TextField
              id="postalCode"
              name="postalCode"
              label="Postal Code"
              type="text"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.postalCode}
              onChange={handleChange}
            />

            {/* Street */}
            <TextField
              id="street"
              name="street"
              label="Street Name, Building, House No."
              type="text"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.street}
              onChange={handleChange}
            />

            {/* Additional Info */}
            <TextField
              id="additionalInfo"
              name="additionalInfo"
              label="Additional Information (optional)"
              type="text"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.additionalInfo}
              onChange={handleChange}
            />
          </Box>
          <div className="flex justify-end gap-4 mt-4">
            <button onClick={disabled ? null : onClose} className={`px-12 py-2 bg-gray-100 cursor-pointer text-black text-sm ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} disabled={disabled}>Cancel</button>
            <button onClick={handleSubmit} className={`px-7 py-2 bg-blue-950 text-white cursor-pointer text-sm ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} disabled={disabled}>Add Address</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
