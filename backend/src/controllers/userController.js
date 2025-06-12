import prisma from "../utils/prisma.js";

export const addMoney = async (req, res) => {
  const { id } = req.user; // Assuming this is the user's ID from JWT
  const { amount } = req.body;
  // console.log(typeof(amount))
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount. Must be a positive number.",
    });
  }

  try {
    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if 24 hours have passed since last money update
    if (user.lastMoneyUpdate) {
      const now = new Date();
      const diff = now - new Date(user.lastMoneyUpdate);

      if (diff <  60 * 1000) { // 24 * 60 * 60 * 1000
        return res.status(200).json({
          success: false,
          message: "You can only add money once every 24 hours.",
        });
      }
    }

    // Update the user's balance and last update time
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        money: {
          increment: parseFloat(amount),
        },
        lastMoneyUpdate: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Money added successfully.",
      balance: updatedUser.money,
    });
  } catch (err) {
    console.error("Error in addMoney:", err);
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: err.message,
    });
  }
};
