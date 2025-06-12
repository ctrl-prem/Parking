const VehicleCard = ({
  vehicleNumber,
  wheelerType,
  fuelType,
  onButtonClick,
  isHistory = false,
}) => {
  return (
    <div className="mt-5 bg-white w-full mx-auto p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 flex flex-row items-center justify-between gap-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-800">{vehicleNumber}</h2>
      <div className="flex items-center">
        <p className="text-gray-600">
          {fuelType} | {wheelerType} Wheeler
        </p>
        {!isHistory && (
          <button
            onClick={onButtonClick}
            className=" ml-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-2 px-4 rounded-full shadow hover:from-red-600 hover:to-red-700 transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            Delist
          </button>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
