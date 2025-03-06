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

    res.json({ hostels });
  } catch (error) {
    console.error("Error fetching hostels:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Search hostels based on price range and type
router.get("/search", async (req, res) => {
    try {
      const { minPrice, maxPrice, type } = req.query;
  
      // Build the query object
      const query = { status: "active" }; // Only show active hostels
  
      if (minPrice && maxPrice) {
        query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }

    if (type) {
      query.type = type; // Filter by hostel type (girls/boys)
    }

    // Fetch hostels matching the query
    const hostels = await Hostel.find(query);
    res.json({ hostels });
  } catch (error) {
    console.error("Error searching hostels:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;