import React, { useState, useEffect } from "react";
import { useCart } from "../components/CartItems";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


function Cart() {
  const { cartItems, removeFromCart } = useCart(); // ✅ Get removeFromCart from context
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  
    useEffect(() => {
    const auth = getAuth();
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Toggle individual item selection
  const handleCheckboxChange = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const fetchDefaultAddress = async (uid) => {
    const addressCollection = collection(db, `users/${uid}/addresses`);
    const snapshot = await getDocs(addressCollection);
  
    let defaultAddress = null;
  
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.defaultAddress) {
        defaultAddress = data;
      }
    });
  
    return defaultAddress;
  };

  // Handle checkout process
  const handleBuyNow = async () => {
    if (!user) {
      console.log("Please log in to proceed.");
      return;
    }

    if (selectedItems.length === 0) {
      toast.error("Select at least one product to proceed.", { position: "top-right", className:"mt-15" });
      return;
    }

    const defaultAddress = await fetchDefaultAddress(user.uid);
    if (!defaultAddress) {
      toast.error("Please add or set a default address in your profile before proceeding to checkout.", {
        position: "top-right",
        className:"mt-15"
      });
      return;
    }

    // Prepare selected products
    const selectedProducts = cartItems
      .filter((item) => selectedItems.includes(item.productId))
      .map((item) => ({
        id: item.productId,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        size: item.size,
        totalPrice: item.unitPrice * item.quantity,
        gender: item.gender,
        imageUrl: item.imageUrl,
      }));

    // Navigate with order details
    navigate("/checkout", {
      state: {
        user: {
          uid: user.uid,
          name: user.displayName || "Unknown",
          contact: user.phoneNumber || "N/A",
          address: `${defaultAddress.region}, ${defaultAddress.street}, ${defaultAddress.postalCode}`,
        },
        products: selectedProducts,
      },
    });
  };


  // Toggle select all
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems(cartItems.map((item) => item.productId)); // Select all
    }
  };

  // Calculate grand total
  const grandTotal = cartItems
    .filter((item) => selectedItems.includes(item.productId))
    .reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  return (
    <div className="min-h-screen p-20">
      <header className="mb-5">
        <h1 className="text-blue-950 font-[Bebas] text-[100px] leading-none">
          WELCOME TO YOUR CART!
        </h1>
      </header>
      <table className="min-w-full bg-white shadow-md mt-6">
        <thead>
          {/* Table Header */}
          <tr className="text-black/50">
            <th className="px-4 py-2">
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={selectedItems.length === cartItems.length}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-4 py-2">Item</th>
            <th className="px-4 py-2">Unit Price</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Total Price</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Display cart items or message when cart is empty */}
          {cartItems.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                Your cart is empty.
              </td>
            </tr>
          ) : (
            cartItems.map((item) => (
              <tr key={`${item.productId}-${item.id}`} className="border-t border-black/10">
                {/* Checkbox */}
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={selectedItems.includes(item.productId)}
                    onChange={() => handleCheckboxChange(item.productId)}
                  />
                </td>

                {/* Item Data */}
                <td className="px-4 py-4 flex items-center">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/50"}
                    alt={item.name}
                    className="w-12 h-12 mr-4"
                  />
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">Gender: {item.gender}</div>
                    <div className="text-sm text-gray-600">Size: {item.size}</div>
                  </div>
                </td>

                <td className="px-4 py-2 text-center">₱ {item.unitPrice}</td>

                {/* Quantity Section */}
                <td className="px-4 py-2 text-center">
                  <span className="mx-2">{item.quantity}</span>
                </td>

                {/* Total Price */}
                <td className="px-4 py-2 text-center">₱ {item.unitPrice * item.quantity}</td>

                {/* Remove Item */}
                <td
                  className="px-4 py-2 text-center text-red-500 cursor-pointer hover:text-red-700 transition-colors duration-200"
                  onClick={() => {
                    console.log("Removing item ID:", item.id); // Debugging
                    removeFromCart(item.id);
                  }}
                >
                  Remove
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Checkout Section */}
      <div className="flex justify-end  items-center mt-4">
        {/* Grand Total */}
        <div className="text-lg font-normal m-10">
          Total: <span className="text-blue-950 font-semibold ">₱ {grandTotal.toFixed(2)}</span>
        </div>

        {/* Checkout Button */}
        <button
        onClick={handleBuyNow}
          className={`bg-blue-950 text-white text-[15px] px-15 py-3
            ${selectedItems.length === 0 ? 'disabled:opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          disabled={selectedItems.length === 0}
        >
          Check out
        </button>
        <ToastContainer position="top-right" autoClose={1000} />
      </div>
    </div>
  );
}

export default Cart;
