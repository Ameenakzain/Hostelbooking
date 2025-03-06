const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");
const { ObjectId } = require("mongoose").Types;

const verifyOwner = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
    console.log("📌 Received Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    // Ensure the decoded ID is a valid ObjectId
    if (!ObjectId.isValid(decoded.id)) {
      return res.status(401).json({ message: "Invalid owner ID in token" });
    }

    // Ensure the owner exists
    const owner = await Owner.findById(decoded.id);
    if (!owner) {
      console.log("🚨 Owner not found in database!");
      return res.status(404).json({ message: "Owner not found" });
    }

    console.log("✅ Verified Owner:", owner.email);
    req.ownerId = owner._id; // Attach owner ID to request
    next();
  } catch (error) {
    console.error("❌ Token verification error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { verifyOwner };