// src/pages/AdminSignUp.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api"; // Using the same API service

function AdminSignUp() {
  const [secretKey, setSecretKey] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/admin/register", {
        secretKey,
        username,
        email,
        password,
      });

      const { success, message } = response.data;

      if (success) {
        toast.success(message || "Admin account created successfully!");
        navigate("/admin/login");
      } else {
        toast.error(message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating admin account");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-400 via-gray-600 to-gray-800">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6 tracking-wide">
          Admin Sign Up
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="secretKey" className="block text-gray-700 font-semibold mb-1">
              Secret Key
            </label>
            <input
              id="secretKey"
              name="secretKey"
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 transition duration-200"
              placeholder="Enter the secret key"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 transition duration-200"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 transition duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 transition duration-200"
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminSignUp;
