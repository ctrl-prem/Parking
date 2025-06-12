import parkingImg from "../assets/parkingImg.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/ContextProvider";
import { useState } from "react";
import AddMoneyCard from "./AddMoneyCard";


const RealTimeStatusCard = ({totalParking, vacantSlot, help=false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const {user} = useAuth();

  const handleClick = () => {
    console.log("hoe");
    setIsModalOpen(true);
  }
  const closeModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg flex flex-col items-center text-center">
      <img
        src={parkingImg}
        alt="Parking Area"
        className="w-full max-w-full h-64 object-cover rounded-lg mb-6 opacity-90 shadow-md"
      />

      <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4">
        Real-Time Parking Details
      </h1>
          <p className="text-gray-900 text-2xl font-semibold mb-2">
            Total Parking Slots:{" "}
            <span className="text-indigo-600">{totalParking}</span>
          </p>
          <p className="text-gray-900 text-2xl font-semibold mb-6">
            Vacant Parking Slots:{" "}
            <span className="text-green-600">{vacantSlot}</span>
          </p>

      {!user ? (
        <>
          <p className="text-gray-600 mb-6">
            You haven't created or logged in to your account yet. Let’s get
            started!
          </p>
          <button
            onClick={() => !help ? navigate("/login") : handleClick()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            + {help ? 'Total' : 'Start' } Parking
          </button>
        </>
      ) : (
        <p className="text-gray-700 mb-6">
          Welcome back, <span className="font-bold">{user.name}</span>! You can
          check your parking history or add money to your wallet.
        </p>
      )}
      {
        isModalOpen && <AddMoneyCard closeModal={closeModal} addParking = {true} />
      }
    </div>
  );
};

export default RealTimeStatusCard;
