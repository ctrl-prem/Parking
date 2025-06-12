import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useAuth } from "../../context/ContextProvider";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/admin/login", {
        email,
        password,
        secretKey,
      });
      const { success, admin, token, message } = res.data;

      if (success) {
        login(admin, token, true);
        toast.success(message || "Admin login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error(message || "Login failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-400 via-gray-600 to-gray-800">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6 tracking-wide">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="secret-key"
              className="block text-gray-700 font-semibold mb-1"
            >
              Secret Key
            </label>
            <input
              id="secret-key"
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 transition duration-200"
              placeholder="Secret Key"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 transition duration-200"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 transition duration-200"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
