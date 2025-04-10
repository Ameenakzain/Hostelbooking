const multer = require("multer");
const path = require("path");
const Hostel = require('../models/Hostel');
const { ObjectId } = require("mongodb");
const { verifyOwner } = require("../middleware/auth");
const Notification = require("../models/Notification");

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

    const { name, location, price, type, amenities, availableRooms } = req.body;

    // Ensure required fields exist
    if (!name || !location || !price || !type || !amenities || !availableRooms) {
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

    // ✅ Parse availableRooms JSON
    const parsedAvailableRooms = JSON.parse(availableRooms); // Expecting [{ roomType, count }, ...]

    // Create new hostel object
    const newHostel = new Hostel({
      name,
      location,
      price,
      type,
      amenities: amenitiesArray,
      images: imagePaths,
      ownerId: new ObjectId(req.ownerId),
      availableRooms: parsedAvailableRooms,
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
  const { search, type, maxPrice, location, amenities, status } = req.query;

  try {
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive name search
    }

    if (location) {
      query.location = location;
    }

    if (type) {
      query.type = type; // Filter by type
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) }; // Price filter
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

// ✅ Fetch Saved Hostels
exports.getSavedHostels = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(403).json({ message: "❌ Unauthorized: User ID missing." });
    }

    const user = await User.findById(req.userId).populate("savedHostels");
    res.status(200).json({ savedHostels: user.savedHostels });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching saved hostels", error });
  }
};

// ✅ Fetch Notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching notifications", error });
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

    res.status(200).json({hostels});
  } catch (error) {
    console.error("❌ Error fetching owner's hostels:", error);
    res.status(500).json({ message: "Error fetching hostels", error });
  }
};

// ✅ Get hostel by ID (for edit form)
exports.getHostelById = async (req, res) => {
  console.log("📥 GET /hostel/:id called with ID:", req.params.id);
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: "❌ Hostel not found" });
    }
    res.status(200).json({ hostel });
  } catch (error) {
    console.error("❌ Error fetching hostel by ID:", error);
    res.status(500).json({ message: "Error fetching hostel", error });
  }
};

// ✅ Update hostel by ID
exports.updateHostel = async (req, res) => {
  try {
    console.log("📥 PUT /hostel/:id called");
    console.log("📦 Request body:", req.body);
    console.log("🖼 Uploaded files:", req.files);
    const { name, location, price, type, amenities, availableRooms } = req.body;

    const amenitiesArray = Array.isArray(amenities) 
    ? amenities
    : amenities?.split(",").map((item) => item.trim());
    let parsedAvailableRooms;
    if (typeof availableRooms === "string") {
      try {
        parsedAvailableRooms = JSON.parse(availableRooms);
      } catch (err) {
        return res.status(400).json({ message: "Invalid JSON in availableRooms" });
      }
    } else {
      parsedAvailableRooms = availableRooms || [];
    }
    const updateData = {
      name,
      location,
      price,
      type,
      amenities: amenitiesArray,
      availableRooms: parsedAvailableRooms,
    };

    // Only update images if new ones are uploaded
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.filename);
    }

    const updatedHostel = await Hostel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedHostel) {
      return res.status(404).json({ message: "❌ Hostel not found" });
    }

    res.status(200).json({ message: "✅ Hostel updated successfully", hostel: updatedHostel });
  } catch (error) {
    console.error("❌ Error updating hostel:", error);
    res.status(500).json({ message: "Error updating hostel", error });
  }
};

