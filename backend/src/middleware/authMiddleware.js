// middleware/authMiddleware.js
import { verifyToken } from '../utils/jwt.js';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // If no token, consider as "not logged in"
  if (!authHeader) {
    req.user = null; // explicitly set user as null
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    console.error("Invalid token:", err);
    // Also consider as "not logged in" if token invalid
    req.user = null;
    next();
  }
};

export const adminProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.admin = null;
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      req.admin = null;
      return next();
    }

    if (decoded.role !== "admin") {
      req.admin = null;
      return next();
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.error("Invalid token:", err);
    req.admin = null;
    next();
  }
};


