import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/ContextProvider";
import api from "../services/api";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { success, message, user, token } = res.data;

      if (success) {
        login(user, token);
        toast.success(message || "Login successful!");
        navigate("/");
      } else {
        toast.error(message || "Login failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6 tracking-wide">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit}>
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
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              placeholder="you@example.com"
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            Log In
          </button>

          <p className="text-center text-sm text-gray-700 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-pink-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
