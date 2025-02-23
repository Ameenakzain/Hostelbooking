const express = require("express");
const router = express.Router();
const { addHostel, searchHostels } = require("../controllers/hostelController");
const { verifyOwner } = require("../middleware/auth"); // Middleware to check if the user is an owner
const multer = require("multer");
const Hostel = require("../models/Hostel");

// ✅ Temporarily use memory storage for debugging
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).array("images", 5);

// ✅ Debugging Middleware
router.post("/add-hostel", verifyOwner, upload, async (req, res) => {
  try {
    console.log("✅ Received Form Data:", req.body);
    console.log("✅ Received Files:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "❌ No images uploaded." });
    }

    // Proceed with storing hostel data...
    res.status(200).json({ message: "✅ Hostel added successfully!" });

  } catch (error) {
    console.error("❌ Multer error:", error);
    res.status(500).json({ message: "Error processing request." });
  }
});

// Route to get all hostels
router.get("/search", searchHostels);

// Route to get hostels added by the owner
router.get("/owner-hostels", verifyOwner, async (req, res) => {
  try {
    console.log("🔑 Owner ID Received:", req.ownerId);
    const hostels = await Hostel.find({ ownerId: req.ownerId });
    console.log("🏠 Fetched Hostels:", hostels);

    if (hostels.length === 0) {
      console.warn("⚠️ No hostels found for this owner.");
  }
    res.status(200).json(hostels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hostels", error });
  }
});

module.exports = router;
