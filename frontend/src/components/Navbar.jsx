import { Link } from "react-router-dom";
import { useAuth } from "../context/ContextProvider";
import { useState } from "react";

const Navbar = ({ setQuery }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-wide">
          <Link to="/" className="hover:text-teal-400 transition duration-300">
            NoteApp
          </Link>
        </div>

        {/* Desktop Search - hidden on small */}
        {user && (
          <div className="hidden md:block w-1/3">
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Search Notes..."
              className="w-full bg-gray-700 text-white placeholder-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}

        {/* Hamburger menu button - visible on small */}
        {user && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            {/* Hamburger icon */}
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        )}

        {/* Desktop Auth buttons */}
        <div className={`${user ? "hidden" : ""} md:flex items-center gap-4`}>
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
              <span className="font-medium text-teal-300">{user.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile drawer menu */}
      {isOpen && (
        <div className="flex flex-col gap-3 md:hidden mt-4 px-4 pb-4 bg-gray-900 rounded-lg shadow-lg">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search Notes..."
            className="w-full bg-gray-700 text-white placeholder-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400 mt-4"
            onChange={(e) => setQuery(e.target.value)}
          />
          {/* Auth buttons */}
          <span className="text-center font-medium text-teal-300">
            {user.name}
          </span>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
