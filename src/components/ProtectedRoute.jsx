import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
  const { currentUser } = useAuth();
  console.log("ProtectedRoute - currentUser:", currentUser); // Debug log

  if (!currentUser) {
    console.log("User is NOT authenticated, redirecting to /login"); // Debug
    return <Navigate to="/login" replace />;
  }

  console.log("User is authenticated, showing page"); // Debug
  return <Outlet />;
};

export default ProtectedRoute;
