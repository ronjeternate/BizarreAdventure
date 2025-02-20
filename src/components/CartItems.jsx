import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext"; // Auth for user session

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth(); // 🔥 FIXED: Use currentUser instead of user
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!currentUser) return; // 🔥 FIXED: Using currentUser instead of user

    const cartRef = collection(db, "users", currentUser.uid, "cart");
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      const cartData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCartItems(cartData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  console.log("Current user in CartContext:", currentUser); // 🔥 FIXED

  const addToCart = async (item) => {
    if (!currentUser) {
      alert("Please log in to add to cart.");
      return;
    }

    const cartRef = collection(db, "users", currentUser.uid, "cart");

    const existingItem = cartItems.find(
      (cartItem) => cartItem.productId === item.productId && cartItem.size === item.size
    );

    if (existingItem) {
      const itemRef = doc(db, "users", currentUser.uid, "cart", existingItem.id);
      await updateDoc(itemRef, {
        quantity: existingItem.quantity + item.quantity,
        totalPrice: existingItem.unitPrice * (existingItem.quantity + item.quantity),
      });
    } else {
      await addDoc(cartRef, item);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!currentUser) {
      alert("Please log in to remove items from the cart.");
      return;
    }
  
    try { 
      const itemRef = doc(db, "users", currentUser.uid, "cart", cartItemId);
      await deleteDoc(itemRef);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId)); // Update UI
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
