import React, { useState, useEffect } from "react";
import { useCart } from "../components/CartItems";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, removeFromCart } = useCart(); 
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false); // Loader state

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleCheckboxChange = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]); 
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const grandTotal = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please log in to proceed.", { position: "top-right" });
      return;
    }

    if (selectedItems.length === 0) {
      toast.error("Select at least one product to proceed.", { position: "top-right" });
      return;
    }

    setIsCheckingOut(true); // Start loader

    const defaultAddress = await fetchDefaultAddress(user.uid);
    if (!defaultAddress) {
      setIsCheckingOut(false); // Stop loader
      toast.error("Please set a default address before proceeding to checkout.", { position: "top-right" });
      return;
    }

    const selectedProducts = cartItems
      .filter((item) => selectedItems.includes(item.id))
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

    try {
      const deletePromises = selectedItems.map(async (cartItemId) => {
        const itemRef = doc(db, "users", user.uid, "cart", cartItemId);
        return deleteDoc(itemRef);
      });

      await Promise.all(deletePromises);

      setSelectedItems([]);
    } catch (error) {
      console.error("Error removing items after checkout:", error);
      toast.error("Something went wrong while updating the cart.");
      setIsCheckingOut(false); // Stop loader
      return;
    }

    navigate("/checkout", {
      state: {
        user: {
          uid: user.uid,
          fullName: defaultAddress.fullName,
          contact: defaultAddress.phoneNumber,
          address: `${defaultAddress.region}, ${defaultAddress.street}, ${defaultAddress.postalCode}`,
        },
        products: selectedProducts,
      },
    });

    setIsCheckingOut(false); // Stop loader after navigating
  };

  return (
    <div className="min-h-screen p-20 py-30">
      <header className="mb-5">
        <h1 className="text-blue-950 font-[Bebas] text-[100px] leading-none">
          WELCOME TO YOUR CART!
        </h1>
      </header>
      <table className="min-w-full bg-black/5 shadow-md mt-6">
        <thead>
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
          {cartItems.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                Your cart is empty.
              </td>
            </tr>
          ) : (
            cartItems.map((item) => (
              <tr key={item.id} className="border-t border-black/10">
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                </td>
                <td className="px-4 py-4 flex items-center">
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 mr-4" />
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">Gender: {item.gender}</div>
                    <div className="text-sm text-gray-600">Size: {item.size}</div>
                  </div>
                </td>
                <td className="px-4 py-2 text-center">₱ {item.unitPrice}</td>
                <td className="px-4 py-2 text-center">{item.quantity}</td>
                <td className="px-4 py-2 text-center">₱ {item.unitPrice * item.quantity}</td>
                <td
                  className="px-4 py-2 text-center text-red-500 cursor-pointer hover:text-red-700 transition-colors duration-200"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-end items-center mt-4">
        <div className="text-lg font-normal m-10">
          Total: <span className="text-blue-950 font-semibold">₱ {grandTotal.toFixed(2)}</span>
        </div>
        <button
          onClick={handleBuyNow}
          className={`bg-blue-950 text-white text-[15px] px-15 py-3 flex items-center 
            ${selectedItems.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          disabled={isCheckingOut || selectedItems.length === 0}
        >
          {isCheckingOut && (
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="10" fill="none" />
            </svg>
          )}
          {isCheckingOut ? "Processing..." : "Check out"}
        </button>

        <ToastContainer position="top-right" autoClose={1000} />
      </div>
    </div>
  );
}

export default Cart;
