import prisma from "../utils/prisma.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "your-secret-key"; // Replace with your actual secret or env var

export const adminLogin = async (req, res) => {
  const { email, password, secretKey } = req.body;

  try {
    if (!email || !password || !secretKey) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (secretKey !== ADMIN_SECRET_KEY) {
      return res.status(401).json({ success: false, message: "Invalid secret key" });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(400).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate token (include admin id and role)
    const token = generateToken(admin, "admin");

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      admin: { id: admin.id, username: admin.username, email: admin.email },
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

export const adminRegister = async (req, res) => {
  const { username, email, password, secretKey } = req.body;

  try {
    // Validate input presence
    if (!username || !email || !password || !secretKey) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check secret key
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ success: false, message: "Invalid admin secret key" });
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    await prisma.admin.create({
      data: { username, email, password: hashedPassword },
    });

    return res.status(201).json({ success: true, message: "Admin registered successfully" });
  } catch (error) {
    console.error("Admin registration error:", error);
    return res.status(500).json({ success: false, message: "Server error during registration" });
  }
};