const express = require("express");
const router = express.Router();
const Hostel = require("../models/Hostel");
const authMiddleware = require("../middleware/auth");
const mongoose = require("mongoose");



// Fetch hostels for the logged-in owner
router.get("/owner-hostels", authMiddleware.verifyOwner, async (req, res) => {
  try {
    console.log("🔍 Owner verified:", req.ownerId);

    // Convert req.ownerId to ObjectId using the 'new' keyword
    const ownerId = new mongoose.Types.ObjectId(req.ownerId);

    // Fetch hostels owned by the logged-in owner
    const hostels = await Hostel.find({ ownerId: ownerId });
    console.log("Hostels found:", hostels);

    if (!hostels.length) {
      console.log("🚨 No hostels found for this owner.");
      return res.status(404).json({ message: "No hostels found for this owner" });
    }

    res.json({hostels});
  } catch (error) {
    console.error("Error fetching hostels:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get hostels with filters
router.get("/search", async (req, res) => {
  try {
    const { type, minPrice, maxPrice, location } = req.query;
    
    let filter = {};
    
    if (type) filter.type = new RegExp(`^${type}$`, "i"); // matches exactly but case-insensitive
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (location) filter.location = { $regex: new RegExp(location, "i") }; // Case-insensitive search
    
    console.log("🔍 Filter used:", filter);
    const hostels = await Hostel.find(filter);
    console.log("🏨 Matching hostels:", hostels);
    res.json({hostels});
  } catch (error) {
    console.error("Error fetching hostels:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get hostel details by ID
router.get("/:id", async (req, res) => {
  try {
    console.log("📥 Received request for hostel ID:", req.params.id);

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn("❗ Invalid ObjectId format");
      return res.status(400).json({ message: "Invalid hostel ID format" });
    }

    const hostel = await Hostel.findById(id);
    if (!hostel) {
      console.warn("🚫 Hostel not found for ID:", id);
      return res.status(404).json({ message: "Hostel not found" });
    }

    console.log("✅ Hostel found:", hostel.name);
    res.json(hostel);
  } catch (error) {
    console.error("❌ Error fetching hostel:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
