const multer = require("multer");
const path = require("path");
const Hostel = require('../models/Hostel');
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
  


// Controller for adding a hostel
exports.addHostel = async (req, res) => {
  upload(req, res, async (err) => {
      if (err) {
          return res.status(500).json({ message: "Image upload failed", error: err });
      }

      const { name, location, amenities } = req.body;
      const imagePaths = req.files ? req.files.map(file => file.path) : [];
      if (imagePaths.length === 0) {
        return res.status(400).json({ message: "No images were uploaded." });
    }

      try {
          const newHostel = new Hostel({
              name,
              location,
              amenities,
              images: imagePaths, // Store uploaded image paths
              ownerId: req.ownerId, // Get ownerId from the verified token
          });

          await newHostel.save();
          res.status(201).json(newHostel);
      } catch (error) {
          res.status(500).json({ message: "Error adding hostel", error });
      }
  });
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
      query.amenities = { $in: amenities.split(',') }; // Filter by multiple amenities
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
