import React, { useState } from "react";

function VehicleModal({ closeModal, addVehicle }) {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [wheelerType, setWheelerType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(closeModal, 1500);
    addVehicle(vehicleNumber, fuelType, wheelerType);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Add New Vehicle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
            placeholder="Vehicle Number"
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
            autoFocus
          />

          <select
            id="fuelType"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className={`border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              !fuelType ? "text-gray-400" : "text-black"
            }`}
            required
          >
            <option value="" disabled>
              Select Fuel Type
            </option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
            <option value="Electric">Electric</option>
          </select>

          <select
            id="wheelerType"
            value={wheelerType}
            onChange={(e) => setWheelerType(e.target.value)}
            className={`border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              !wheelerType ? "text-gray-400" : "text-black"
            }`}
            required
          >
            <option value="" disabled>
              Select Wheeler Type
            </option>
            <option value="2">2 Wheeler</option>
            <option value="3">3 Wheeler</option>
            <option value="4">4 Wheeler</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition duration-300 cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Vehicle"}
          </button>
        </form>

        {/* Close Icon Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition duration-300 font-semibold cursor-pointer"
          onClick={closeModal}
          aria-label="Close modal"
          type="button"
        >
          ✕
        </button>

        {/* Cancel Button */}
        <button
          className="mt-4 text-center w-full text-red-600 hover:text-red-700 font-semibold transition duration-300 cursor-pointer"
          onClick={closeModal}
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default VehicleModal;
