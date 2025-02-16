import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { CartProvider } from "./components/CartItems";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div>
          <RouterProvider router={router} />
        </div>
      </CartProvider>
    </AuthProvider>
    
  );
}

export default App;
