import prisma from "../utils/prisma.js";

export const getParkingData = async (req, res) => {
  try {
    const parkingData = await prisma.parking.findFirst();

    if (!parkingData) {
      // No record found, return default values
      return res.status(200).json({
        success: true,
        totalParking: 100,
        vacantSlot: 100,
      });
    }

    // Record found
    return res.status(200).json({
      success: true,
      totalParking: parkingData.totalSlots,
      vacantSlot: parkingData.vacantSlots,
    });
  } catch (error) {
    console.error("Error fetching parking status:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching parking status",
    });
  }
};

export const updateParking = async (req, res) => {
  const { id } = req.admin; // Assuming this is the user's ID from JWT
  const { tParking } = req.body;
  // console.log(typeof(amount))
  if (!tParking || isNaN(tParking) || tParking <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount. Must be a positive number.",
    });
  }

  try {
    // Fetch the user
    const admin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Invalid admin",
      });
    }

    // Fetch current parking
    const parking = await prisma.parking.findFirst();

    // Then update
    const updatedParking = await prisma.parking.update({
      where: { id: parking.id }, // make sure parking is not null
      data: {
        totalSlots: parseFloat(tParking),
        vacantSlots: Math.max(
          0,
          parseFloat(tParking) - (parking.totalSlots - parking.vacantSlots)
        ),
      },
    });

    res.status(200).json({
      success: true,
      message: "Parking updated successfully.",
      updatedParking,
    });
  } catch (err) {
    console.error("Error in updating Parking:", err);
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: err.message,
    });
  }
};
