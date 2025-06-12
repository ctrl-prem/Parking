import { Router } from "express";
import { adminProtect } from "../middleware/authMiddleware.js";
import prisma from "../utils/prisma.js";
import { adminLogin, adminRegister } from "../controllers/adminController.js";

const router = Router();

router.post("/login", adminLogin);

router.post("/register", adminRegister);

router.post("/verify", adminProtect, async (req, res) => {
  if (!req.admin) {
    return res.json({ success: false, message: "Not logged in", admin: null });
  }

  const adminFromDB = await prisma.admin.findUnique({
    where: { id: req.admin.id },
  });

  if (!adminFromDB) {
    return res.status(404).json({ success: false, message: "Admin not found" });
  }

  // Get all users without vehicles
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  const parking = await prisma.parking.findFirst();

  const { password, ...adminWithoutPassword } = adminFromDB;

  res.json({
    success: true,
    admin: adminWithoutPassword,
    users, // Just the basic user info
    parking,
  });
});

export default router;
