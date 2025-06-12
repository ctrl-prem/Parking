import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/ContextProvider";
import { useState } from "react";
import parking from "../assets/parking.svg";
import AddMoneyCard from "./AddMoneyCard";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open modal handler
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleWalletUpdate = (updatedMoney) => {
    user.money = updatedMoney;
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
          <Link
            to="/"
            className="hover:text-teal-400 transition duration-300 flex items-center gap-2"
          >
            <img src={parking} alt="Logo" className="w-8 h-8" />
            Car Parking
          </Link>
        </div>

        {/* Auth Buttons & Info */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 mr-4"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <span
                onClick={() => navigate("/")}
                className="font-medium hover:text-teal-500 cursor-pointer text-teal-300"
              >
                {user?.username?.toUpperCase()}
              </span>

              <button
                onClick={() => navigate("/history")}
                className="hover:text-red-700 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 cursor-pointer border border-red-500"
              >
                History
              </button>

              <button
                onClick={openModal}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 cursor-pointer"
                title="Add Money to Wallet"
              >
                Wallet: ₹{user.money?.toFixed(2) || "0.00"}
              </button>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddMoneyCard
          closeModal={closeModal}
          onWalletUpdate={handleWalletUpdate}
        />
      )}
    </nav>
  );
};

export default Navbar;
