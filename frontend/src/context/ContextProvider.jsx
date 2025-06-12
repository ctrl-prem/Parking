import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function ContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [parking, setParking] = useState({});
  const [userVehicles, setUserVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  const login = (userOrAdmin, token, isAdmin = false) => {
    localStorage.setItem("token", token);
    if (isAdmin) {
      localStorage.setItem("mode", "admin");
      setAdmin(userOrAdmin);
    } else {
      localStorage.setItem("mode", "user");
      setUser(userOrAdmin);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mode");
    setUser(null);
    setAdmin(null);
  };

  const verifyUserOrAdmin = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      const mode = localStorage.getItem("mode") || "user";
      const endpoint = mode === "admin" ? "/api/admin/verify" : "/api/auth/verify";
      const res = await api.post(endpoint);

      if (res.data.success) {
        if (mode === "admin") {
          setAdmin(res.data.admin);
          setAllUsers(res.data.users);
          setParking(res.data.parking);
          navigate('/admin/dashboard');
        } else {
          setUser(res.data.user);
          setUserVehicles(res.data.user?.vehicles || []);
          setParking(res.data.parking || {});
        }
      }
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    verifyUserOrAdmin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        login,
        logout,
        allUsers,
        parking,
        setParking,
        userVehicles,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default ContextProvider;
