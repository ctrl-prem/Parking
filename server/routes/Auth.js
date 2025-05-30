import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import middleware from "../middleware/middleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ success: false, message: "User Already Exists" });
    }

    // Hash the password before saving it to the database
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });

    // Save the new user
    await newUser.save();

    // Send success response
    return res
      .status(200)
      .json({ success: true, message: "Account Created Successfully" });
  } catch (err) {
    console.log(err);
    // Catch errors and send failure response
    return res
      .status(500)
      .json({ success: false, message: "Error In Adding User" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user do not exists
    const user = await User.findOne({ email }); // return the user or undefined
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Username or Password" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Username or Password" });
    }

    const token = jwt.sign({ id: user._id }, `${import.meta.env.JWT_SECRET_KEY}`, {
      expiresIn: "5h",
    });

    return res
      .status(200)
      .json({
        success: true,
        token,
        user: { name: user.name },
        message: "Login Successfully",
      });
  } catch (err) {
    console.log(err);
    // Catch errors and send failure response
    return res
      .status(500)
      .json({ success: false, message: "Error In Adding User" });
  }
});

router.get('/verify', middleware, (req, res) => {
  return res.status(200).json({success: true, user: req.user})
})

export default router;
