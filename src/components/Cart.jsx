import React, { useState } from "react";
import { useCart } from "../components/CartItems";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);

  // Toggle individual item selection
  const handleCheckboxChange = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
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
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-xl">Your cart is empty.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md mt-6">
          <thead>
            <tr className="text-gray-400">
              <th className="px-4 py-2">
                <input
                  type="checkbox"
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
            {cartItems.map((item) => (
              <tr key={item.productId} className="border-t border-black/10">
                {/* Checkbox */}
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.productId)}
                    onChange={() => handleCheckboxChange(item.productId)}
                  />
                </td>
                
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
                  className="px-4 py-2 text-center text-red-500 cursor-pointer"
                  onClick={() => removeFromCart(item.productId)}
                >
                  Remove
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Checkout Section */}
      <div className="flex justify-between items-center mt-4">
        {/* Grand Total */}
        <div className="text-lg font-normal">
          Total: <span className="text-blue-950 font-semibold ">₱ {grandTotal.toFixed(2)}</span>
        </div>

        {/* Checkout Button */}
        <button
          className="bg-blue-950 text-white text-[15px] px-15 py-3 disabled:opacity-50"
          disabled={selectedItems.length === 0}
        >
          Check out
        </button>
      </div>
    </div>
  );
}

export default Cart;
