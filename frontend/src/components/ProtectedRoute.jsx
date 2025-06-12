import { useAuth } from "../context/ContextProvider.jsx";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user, admin } = useAuth();

  // Check if logged in
  const isLoggedIn = !!(user || admin); // (!!) = it's converting the value to boolean

  if (!isLoggedIn) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />;
  }

  // Role-based access
  if (role === "admin" && !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (role === "user" && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;