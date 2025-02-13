import { createBrowserRouter } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Perfume from "./components/Perfume";
import OrderTracking from "./components/OrderTracking";
import CustomerService from "./components/CustomerService";
import Cart from "./components/Cart";
import Login from "./components/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Nav />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/perfume",
        element: <Perfume />,
      },
      {
        path: "/orderTracking",
        element: <OrderTracking />,
      },
      {
        path: "/customerService",
        element: <CustomerService />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
