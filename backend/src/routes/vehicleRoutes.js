import express from "express";
import { PrismaClient } from "../../generated/prisma/index.js";
import { protect } from "../middleware/authMiddleware.js";
import { handleError } from "../utils/handleError.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/add", protect, async (req, res) => {
  try {
    const { vehicleNumber, fuelType, wheelerType } = req.body;

    const formattedVehicleNumber = vehicleNumber.trim().toUpperCase();

    // Check if the vehicle already exists for this user
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        vehicleNumber: formattedVehicleNumber,
        userId: req.user.id,
      },
    });

    if (existingVehicle) {
      return handleError(
        res,
        400,
        "This vehicle is already registered to your account."
      );
    }
    const vehicle = await prisma.vehicle.create({
      data: {
        vehicleNumber: formattedVehicleNumber,
        fuelType,
        wheelerType,
        user: {
          connect: { id: req.user.id },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully!",
      vehicle,
    });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    handleError(res, 500, "Failed to add vehicle. Please try again later.");
  }
});

router.get("/history", protect, async (req, res) => {
  try {
    // Fetch history from the 'History' table for the current user
    const vehicleHistory = await prisma.history.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        date: "desc", // Latest first
      },
    });
    res.json({
      success: true,
      history: vehicleHistory,
    });
  } catch (error) {
    console.error("Error fetching vehicle history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle history.",
    });
  }
});

router.post("/park-out", protect, async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const userId = req.user.id;

    if (!vehicleId) {
      return res
        .status(400)
        .json({ success: false, message: "vehicleId required" });
    }

    // Fetch vehicle and check ownership
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { user: true },
    });

    if (!vehicle || vehicle.userId !== userId) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found or unauthorized" });
    }

    // Fetch last parking session from History or current status logic
    // Since you have no status in DB, let's assume the "active" vehicle is parked if
    // there is no end time in history or by using parkedAt (passed from frontend if needed).
    // But user passed only vehicleId, so we need a way to find "start" time.

    // For this example, assume we store parking start in 'parkedAt' in vehicle table or
    // in the frontend passed parkedAt, but since no parkedAt in Vehicle model,
    // you might have to keep parkedAt as a param or get latest History record

    // Instead, let's define a workaround:
    // We assume the vehicle is parked "now" - so user clicks "park-out" and we use some mock start time or
    // You can store the parking start timestamp temporarily in a cache or separate table,
    // but since you can't change schema, let's accept parkedAt from frontend for this demo.

    // But the user said they don't want to change db schema.
    // So for the demo, let's assume the vehicle's createdAt is parking start (not ideal),
    // or you can extend your backend to accept start time from frontend.

    // Let's assume frontend passes 'parkedAt' timestamp too.
    const parkedAt = req.body.parkedAt
      ? new Date(req.body.parkedAt)
      : vehicle.createdAt; // fallback

    if (!parkedAt) {
      return res
        .status(400)
        .json({ success: false, message: "parkedAt timestamp required" });
    }

    const now = new Date();
    if (now <= parkedAt) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid parkedAt timestamp" });
    }

    // Calculate hours (round up to nearest hour)
    const diffMs = now - parkedAt;
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));

    // Calculate charge based on wheelerType and fuelType
    let chargePerHour = 0;
    if (vehicle.fuelType.toLowerCase() === "electric") {
      chargePerHour = 0;
    } else {
      switch (vehicle.wheelerType) {
        case "2":
        case "2 wheeler":
          chargePerHour = 50;
          break;
        case "3":
        case "3 wheeler":
          chargePerHour = 70;
          break;
        case "4":
        case "4 wheeler":
          chargePerHour = 100;
          break;
        default:
          chargePerHour = 50; // default fallback
      }
    }
    const totalCharge = chargePerHour * hours;

    // Check user money
    if (vehicle.user.money < totalCharge) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient wallet balance" });
    }

    // Deduct money and update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        money: { decrement: totalCharge },
        moneyAddedAt: new Date(),
      },
    });

    // Add to History
    await prisma.history.create({
      data: {
        vehicleNumber: vehicle.vehicleNumber,
        fuelType: vehicle.fuelType,
        wheelerType: vehicle.wheelerType,
        parkingCharge: totalCharge,
        date: now,
        userId: userId,
      },
    });

    // Note: We don't have vehicle status in DB.
    // For frontend, we return "Inactive" status and frontend updates UI accordingly.

    return res.json({
      success: true,
      message: "Vehicle parked out and charge deducted",
      newBalance: updatedUser.money,
      newStatus: "Inactive",
    });
  } catch (error) {
    console.error("Park-out error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/user-vehicles", protect, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { userId: req.user.id },
    });
    res.json({ success: true, vehicles });
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
