import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/ContextProvider";

function AddMoneyCard({ closeModal, onWalletUpdate, addParking = false }) {
  const [money, setMoney] = useState(0);
  const [changeParking, setChangeParking] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {setParking} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const amount = money;
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg("Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/api/user/add-money", { amount }); // No need to manually set headers
      if (res.data.success) {
        setSuccessMsg("Money added successfully!");
        onWalletUpdate(res.data.balance);
      } else {
        toast.error(res.data.message);
      }

      // Auto-close modal if present
      setTimeout(() => closeModal(), 1500);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleParking = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const tParking = changeParking;
    if (isNaN(tParking) || tParking <= 0) {
      setErrorMsg("Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/api/parking/add-parking", { tParking }); // No need to manually set headers
      if (res.data.success) {
        setSuccessMsg("Total parking changed successfully!");
        setParking(res.data.updatedParking)
      } else {
        toast.error(res.data.message);
      }

      // Auto-close modal if present
      setTimeout(() => closeModal(), 1500);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {addParking ? "Change Total Parking" : "Add Money"}
        </h2>

        <form
          onSubmit={addParking ? handleParking : handleSubmit}
          className="space-y-5"
        >
          <input
            id="money"
            type="number"
            min="0"
            step="0.01"
            onChange={
              addParking
                ? (e) => setChangeParking(Number(e.target.value))
                : (e) => setMoney(Number(e.target.value))
            }
            placeholder={addParking ? "Enter Total Parking" : "Enter Amount"}
            className="text-black border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
            disabled={loading}
          />

          {errorMsg && (
            <p className="text-red-600 text-sm font-semibold">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-green-600 text-sm font-semibold">{successMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition duration-300 cursor-pointer ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Adding..." : addParking ? "Change" : "Add Money"}
          </button>
        </form>

        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition duration-300 font-semibold cursor-pointer"
          onClick={closeModal}
          aria-label="Close modal"
        >
          ✕
        </button>

        <button
          className="mt-4 text-center w-full text-red-600 hover:text-red-700 font-semibold transition duration-300 cursor-pointer"
          onClick={closeModal}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AddMoneyCard;
