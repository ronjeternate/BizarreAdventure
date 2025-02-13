import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { CartProvider } from "./components/CartItems";

function App() {
  return (
    <CartProvider>
      <div>
        <RouterProvider router={router} />
      </div>
    </CartProvider>
  );
}

export default App;
