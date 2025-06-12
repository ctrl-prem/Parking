import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addMoney } from "../controllers/userController.js";
import prisma from "../utils/prisma.js";

const router = Router();

router.post("/add-money", protect, addMoney);

router.post("/deduct-money", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        money: { decrement: parseFloat(amount) },
      },
    });

    res.json({
      success: true,
      balance: user.money,
    });
  } catch (error) {
    console.error("Error deducting money:", error);
    res
      .status(500)
      .json({ success: false, message: "Error while deducting money." });
  }
});

export default router;
