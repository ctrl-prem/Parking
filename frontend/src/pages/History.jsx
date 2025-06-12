import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import VehicleCard from "../components/VehicleCard.jsx";
import { useAuth } from "../context/ContextProvider";

const History = () => {
  const { user, loading, userVehicles } = useAuth();
  const [error, setError] = useState(null);

  // Example of setting error if needed
  useEffect(() => {
    if (!user && !loading) {
      setError("Not logged in.");
    } else {
      setError(null);
    }
  }, [user, loading]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-xl text-gray-700">
          Please log in to view your vehicle history.
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <h1 className="text-center text-4xl font-bold text-gray-800 my-10">
        History of Vehicles Parked
      </h1>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && userVehicles.length === 0 && (
        <p className="text-center text-gray-600">No vehicles found.</p>
      )}

      <div className="max-w-2xl mx-auto px-4 flex flex-col items-center">
        {userVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            id={vehicle.id}
            vehicleNumber={vehicle.vehicleNumber}
            fuelType={vehicle.fuelType}
            wheelerType={vehicle.wheelerType}
            isHistory = {true}
          />
        ))}
      </div>
    </div>
  );
};

export default History;
