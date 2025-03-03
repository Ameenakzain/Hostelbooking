const multer = require("multer");
const path = require("path");
const Hostel = require('../models/Hostel');
const { ObjectId } = require("mongodb");
const { verifyOwner } = require("../middleware/auth");

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Store in 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp as the filename
    },
  });
  
  // Initialize multer with storage configuration
  const upload = multer({ storage: storage }).array("images", 5); // Limit to 5 images for now
  exports.uploadMiddleware = upload; 
  


// Controller for adding a hostel
exports.addHostel = async (req, res) => {
  try {
    console.log("📥 Received Form Data:", req.body);
    console.log("🖼 Received Files:", req.files);
    console.log("🔑 Extracted Owner ID:", req.ownerId);

    const { name, location, price, type, amenities } = req.body;

    // Ensure required fields exist
    if (!name || !location || !price || !type || !amenities) {
      return res.status(400).json({ message: "❌ All fields are required." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "❌ No images uploaded." });
    }

    if (!req.ownerId) {
      console.error("❌ Unauthorized: Owner ID missing.");
      return res.status(403).json({ message: "Unauthorized: Owner ID missing." });
    }

    // Convert amenities from string to an array
    const amenitiesArray = Array.isArray(amenities) ? amenities : amenities.split(",");

    // Convert uploaded file paths to an array
    const imagePaths = req.files.map((file) => file.filename); // Store filenames only

    // Create new hostel object
    const newHostel = new Hostel({
      name,
      location,
      price,
      type,
      amenities: amenitiesArray,
      images: imagePaths, // Store uploaded image paths
      ownerId: new ObjectId(req.ownerId),
    });

    console.log("🚀 Hostel Data Before Saving:", newHostel);

    // Save hostel to MongoDB
    const savedHostel = await newHostel.save();
    console.log("✅ Hostel Saved Successfully:", savedHostel);
    
    res.status(201).json({ message: "✅ Hostel added successfully!", hostel: savedHostel });
  } catch (error) {
    console.error("❌ Database Save Error:", error);
    res.status(500).json({ message: "Error adding hostel", error });
  }
};


// Controller for searching hostels
exports.searchHostels = async (req, res) => {
  const { location, amenities, status } = req.query;

  try {
    const query = {};

    if (location) {
      query.location = location;
    }

    if (amenities) {
      query.amenities = { $in: amenities.split(",").map((a) => a.trim()) }; // Filter by multiple amenities
    }

    if (status) {
      query.status = status;
    }

    const hostels = await Hostel.find(query);
    res.status(200).json(hostels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hostels", error });
  }
};

// Controller for fetching hostels added by the owner
exports.getOwnerHostels = async (req, res) => {
  try {
    console.log("🔑 Owner ID Received:", req.ownerId);
    const hostels = await Hostel.find({ ownerId: req.ownerId });

    if (hostels.length === 0) {
      console.warn("⚠️ No hostels found for this owner.");
    }

    res.status(200).json(hostels);
  } catch (error) {
    console.error("❌ Error fetching owner's hostels:", error);
    res.status(500).json({ message: "Error fetching hostels", error });
  }
};
