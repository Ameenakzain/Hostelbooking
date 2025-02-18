const express = require('express');
const router = express.Router();
const { addHostel, searchHostels } = require("../controllers/hostelController");
const { verifyOwner } = require('../middleware/auth'); // Middleware to check if the user is an owner
const multer = require("multer");
const path = require("path");

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
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  }).array("images", 5);

// Route to add a hostel
router.post('/add-hostel', verifyOwner,upload, addHostel);

// Route to get all hostels (can be filtered by location, amenities, etc.)
router.get("/search", searchHostels);
module.exports = router;
