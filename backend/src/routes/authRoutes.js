// routes/authRoutes.js
import { Router } from "express";
import passport from "passport";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import prisma from "../utils/prisma.js";
import "../config/passport.js";

const router = Router();

router.post("/register", register);

router.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({
          success: false,
          message: info?.message || "Login failed",
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  login
);

router.post("/verify", protect, async (req, res) => {
  if (!req.user) {
    return res.json({
      success: false,
      message: "Not logged in",
      user: null,
    });
  }

  try {
    // Fetch user details (excluding password)
    const userFromDB = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        vehicles: true,
      },
    });

    if (!userFromDB) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        user: null,
      });
    }

    // Remove password field
    const { password, ...userWithoutPassword } = userFromDB;

    // Fetch parking status
    const parkingStatus = await prisma.parking.findFirst();
    const parkingInfo = parkingStatus
      ? {
          totalSlots: parkingStatus.totalSlots,
          vacantSlots: parkingStatus.vacantSlots,
        }
      : { totalSlots: 100, vacantSlots: 100 };

    // Send response with both user details and parking status
    res.json({
      success: true,
      message: "You have access to this protected route!",
      user: userWithoutPassword,
      parking: parkingInfo, // included here
    });
  } catch (error) {
    console.error("Error in /verify route:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
