const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { authenticateUser } = require("../middleware/auth"); // Ensure auth is handled

// ✅ Add route to get user notifications
router.get("/", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

module.exports = router;
