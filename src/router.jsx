import { createBrowserRouter } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Perfume from "./components/Perfume";
import OrderTracking from "./components/OrderTracking";
import CustomerService from "./components/CustomerService";
import Cart from "./components/Cart";
import Profile from "./components/Profile"
import ProtectedRoute from "./components/ProtectedRoute"; // Import the protected route
import Checkout from "./components/Checkout";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Nav />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Home /> },
      { path: "/cart", element: <Cart /> },
      { path: "/perfume", element: <Perfume /> },


      // Protected routes
      {
        element: <ProtectedRoute />, // Wrap protected pages
        children: [
          { path: "/orderTracking", element: <OrderTracking /> },
          { path: "/profile", element: <Profile /> },
          { path: "/checkout", element: <Checkout /> }
        ],
      },
    ],
  },
]);

export default router;
