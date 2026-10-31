const { decodeAccessToken } = require("../services/jwtService");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Provide a Bearer access token.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = decodeAccessToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token.",
    });
  }
};

const requireRole = (role, message) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ success: false, message });
  }
  next();
};

const requireAdmin = requireRole("admin", "Admin access required.");
const requireEmployee = requireRole(
  "employee",
  "Only employees can access this route",
);
const requireUser = requireRole("user", "Only users can access this route");

const requireVerifiedEmail = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email first.",
    });
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireEmployee,
  requireUser,
  requireVerifiedEmail,
};
