const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { authenticateUser } = require("../middleware/auth"); // Ensure auth is handled

// ✅ Add route to get user-specific bookings
router.get("/user-bookings", authenticateUser, async (req, res) => {
  try {
    console.log("✅ Middleware Passed: User ID:", req.userId); // Debug log
    const userId = req.user.id;
    const bookings = await Booking.find({ userId }).populate("hostelId");
    res.json({ bookings });
  } catch (error) {
    console.error("❌ Error fetching user bookings:", error);
    res.status(500).json({ message: "Error fetching user bookings" });
  }
});

module.exports = router;
