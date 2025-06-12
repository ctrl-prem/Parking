// controllers/authController.js
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma.js";
import { generateToken } from "../utils/jwt.js";
import { handleError } from "../utils/handleError.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists by email (unique in DB)
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return handleError(res, 400, "User already exists");
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user record in DB
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        money: 0, // default
      },
    });

    // Success response
    res.status(201).json({
      success: true,
      message: "Account created successfully!",
    });
  } catch (err) {
    // Log and send server error
    return handleError(res, 500, "Server error", err);
  }
};

export const login = (req, res) => {
  try {
    const user = req.user;

    // Sanitize user object (exclude password)
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      money: user.money,
      lastMoneyUpdate: user.lastMoneyUpdate,
    };

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: safeUser,
      message: "Successfully logged in",
    });
  } catch (err) {
    console.error("Login error:", err);
    return handleError(res, 500, "Server error during login");
  }
};
