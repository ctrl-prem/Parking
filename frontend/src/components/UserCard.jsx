import React from "react";

const UserCard = ({ user }) => {
  return (
    <div className="max-w-3xl mt-10 bg-white w-full mx-auto p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 flex flex-row items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {user.username.toUpperCase() || user.email}
        </h2>
        <p className="text-gray-500 text-sm">
          Registered: {new Date(user.createdAt).toLocaleString()}
        </p>
      </div>
      <p className="text-gray-600">Email: {user.email}</p>
    </div>
  );
};

export default UserCard;
