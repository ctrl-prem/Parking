import React, { useState } from "react";
import UserCard from "../../components/UserCard.jsx";
import { useAuth } from "../../context/ContextProvider.jsx";
import RealTimeStatusCard from "../../components/RealTimeStatusCard.jsx";

export default function AdminDashboard() {
  const [showUsers, setShowUsers] = useState(false);

  const { admin, allUsers, logout, parking } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <nav className="flex items-center gap-4">
          <p className="text-2xl font-bold">{admin.username}</p>
          <button
            className={`px-4 py-2 rounded ${
              showUsers ? "bg-blue-800" : "bg-blue-500 hover:bg-blue-700"
            } transition, cursor-pointer`}
            onClick={() => {
              setShowUsers(prev => !prev);
            }}
          >
            Users
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow transition cursor-pointer"
            onClick={logout}
          >
            Logout
          </button>
        </nav>
      </header>

      <RealTimeStatusCard totalParking={parking? parking.totalSlots : 100} vacantSlot={parking ? parking.vacantSlots : 100} help={true} />

      {showUsers &&
        allUsers &&
        allUsers.map((user) => <UserCard key={user.id} user={user} />)}
    </div>
  );
}
