import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import VehicleModal from "../components/VehicleModal";
import { useAuth } from "../context/ContextProvider";
import api from "../services/api";
import RealTimeStatusCard from "../components/RealTimeStatusCard";
import { toast } from "react-toastify";
import VehicleCard from "../components/VehicleCard";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const { userVehicles, user, parking, setParking } = useAuth();

  const handleClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // fetch the parking data
  const fetchingParkingData = async () => {
    try {
      const res = await api.get("api/parking/status");
      if (res.data.success) {
        setParking({
          totalSlots: res.data.totalParking,
          vacantSlots: res.data.vacantSlot,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Load selected vehicles from local storage on page load
  useEffect(() => {
    fetchingParkingData();
    const storedVehicles = localStorage.getItem("selectedVehicles");
    if (storedVehicles) {
      setSelectedVehicles(JSON.parse(storedVehicles));
    }
  }, []);

  // Save selected vehicles to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("selectedVehicles", JSON.stringify(selectedVehicles));
  }, [selectedVehicles]);

  const addVehicle = async (vehicleNumber, fuelType, wheelerType) => {
    try {
      const response = await api.post("/api/vehicle/add", {
        vehicleNumber,
        fuelType,
        wheelerType,
      });
      const { success, vehicle, message } = response.data;

      if (success) {
        toast.success(message || "Vehicle added successfully!");
        closeModal();
        userVehicles.push(vehicle);
      } else {
        toast.error(message || "Failed to add vehicle");
      }
    } catch (err) {
      console.error("Error adding vehicle:", err);
    }
  };

  const handleVehicleSelect = (e) => {
    const vehicleId = parseInt(e.target.value);
    const vehicle = userVehicles.find((v) => v.id === vehicleId);

    if (vehicle && !selectedVehicles.find((v) => v.id === vehicleId)) {
      setSelectedVehicles((prev) => [
        ...prev,
        { ...vehicle, startTime: new Date() },
      ]);

      // Reduce vacant slot count by 1
      setParking((prevParking) => ({
        ...prevParking,
        vacantSlots: prevParking.vacantSlots - 1,
      }));
    }
  };

  const handleDelistVehicle = async (vehicleId) => {
    const vehicleData = selectedVehicles.find((v) => v.id === vehicleId);
    if (!vehicleData) return;

    const { startTime, fuelType, wheelerType } = vehicleData;
    const endTime = new Date();

    const minutes = Math.ceil(
      (endTime - new Date(startTime)) / (1000 * 60 * 60)
    );

    let charge = 0;
    if (fuelType.toLowerCase() !== "electric") {
      switch (wheelerType) {
        case "2":
        case "2 wheeler":
          charge = 50 * minutes;
          break;
        case "3":
        case "3 wheeler":
          charge = 70 * minutes;
          break;
        case "4":
        case "4 wheeler":
          charge = 100 * minutes;
          break;
        default:
          charge = 50 * minutes;
      }
    }

    if (user.money < charge) {
      alert("You need to add money!");
      return;
    }

    if (charge > 0) {
      try {
        const response = await api.post("/api/user/deduct-money", {
          amount: charge,
        });

        if (response.data.success) {
          toast.success(
            `Vehicle delisted! ₹${charge} deducted. Updated balance: ₹${response.data.balance}`
          );
          user.money = response.data.balance;
        } else {
          toast.error("Failed to deduct money. Try again.");
          return;
        }
      } catch (err) {
        console.error("Error deducting money:", err);
        toast.error("Error while deducting money.");
        return;
      }
    } else {
      toast.success("Vehicle delisted (no charge for electric)!");
    }

    setSelectedVehicles((prev) => prev.filter((v) => v.id !== vehicleId));

    // Increase vacant slots by 1 since vehicle is leaving
    setParking((prevParking) => ({
      ...prevParking,
      vacantSlots: prevParking.vacantSlots + 1,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100">
      <Navbar />

      <main className="flex-1 w-full">
        <div className="max-w-3xl mx-auto">
          <RealTimeStatusCard
            totalParking={parking.totalSlots}
            vacantSlot={parking.vacantSlots}
          />

          {user &&
            selectedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicleNumber={vehicle.vehicleNumber}
                fuelType={vehicle.fuelType}
                wheelerType={vehicle.wheelerType}
                onButtonClick={() => handleDelistVehicle(vehicle.id)}
              />
            ))}

          {user && (
            <div className="my-5 bg-white rounded-lg shadow-md p-6">
              <label
                htmlFor="vehicleSelect"
                className="text-xl block mb-2 text-gray-700"
              >
                Select Vehicle for Parking:
              </label>
              <select
                id="vehicleSelect"
                onChange={handleVehicleSelect}
                className="p-2 border border-gray-300 rounded w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  -- Select a vehicle --
                </option>
                {userVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicleNumber} ({vehicle.fuelType},{" "}
                    {vehicle.wheelerType} Wheeler)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </main>

      {user && (
        <button
          onClick={handleClick}
          className="fixed right-4 bottom-4 text-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-3 px-6 rounded-full shadow-xl transition-transform duration-300 hover:scale-110 hover:shadow-2xl hover:from-teal-600 hover:to-teal-700 cursor-pointer"
        >
          + Add Vehicle
        </button>
      )}

      {isModalOpen && (
        <VehicleModal closeModal={closeModal} addVehicle={addVehicle} />
      )}
    </div>
  );
}

export default Home;
