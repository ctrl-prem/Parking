import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext();

function ContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (user) => setUser(user);

  const verifyUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify`, {
        headers: {
          Authorization: token ? `Bearer ${localStorage.getItem("token")}` : undefined,
        },
      });
      if (res.data.success) {
        setUser(res.data.user);
      } else setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(authContext);
export default ContextProvider;
