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
        console.error("Multer Error:", err);
        return res.status(500).json({ message: "Image upload failed", error: err });
      }

      console.log("Request Body:", req.body); 
      console.log("Uploaded Files:", req.files);
      console.log("🔑 Extracted Owner ID:", req.ownerId);
 


      const { name, location, amenities } = req.body;
      const imagePaths = req.files ? req.files.map(file => file.path) : [];
      
      if (!name || !location) {
        console.error("❌ Missing required fields (name/location).");
        return res.status(400).json({ message: "Name and location are required." });
      }

      if (imagePaths.length === 0) {
        console.error("❌ No images uploaded.");

        return res.status(400).json({ message: "No images were uploaded." });
    }

    if (!req.ownerId) {
      console.error("❌ Unauthorized: Owner ID missing.");
      return res.status(403).json({ message: "Unauthorized: Owner ID missing." });
    }

      try {
          const newHostel = new Hostel({
              name,
              location,
              amenities: Array.isArray(amenities) ? amenities : amenities.split(","),
              images: imagePaths, // Store uploaded image paths
              ownerId: req.ownerId, // Get ownerId from the verified token
          });

          const savedHostel = await newHostel.save();
          console.log("✅ Hostel Saved Successfully:", savedHostel);
          res.status(201).json({ message: "✅ Hostel added successfully!", hostel: savedHostel });

      } catch (error) {
          console.error("Database Save Error:", error);
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
