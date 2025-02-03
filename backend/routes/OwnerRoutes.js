const express = require("express");
const multer = require("multer");
const {
  registerOwner,
  getAllOwners,
  getOwnerById,
  deleteOwner
} = require("../controllers/OwnerController");
const path = require("path");
const Owner = require("../models/Owner");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure the folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});


const upload = multer({ 
  storage, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  }
});

// 🛠 Owner Registration Route with File Upload
router.post("/signup", upload.single("licenseFile"), async (req, res) => {
  try {
    const { fullName, email, contact, password, confirmPassword, hostelName, hostelAddress } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // File Upload Validation
    if (!req.file) {
      return res.status(400).json({ message: "License file is required" });
    }

    const newOwner = new Owner({
      fullName,
      email,
      contact,
      password,
      hostelName,
      hostelAddress,
      licenseFile: req.file.path, // Save file path in database
    });

    await newOwner.save();
    res.status(201).json({ message: "Owner registered successfully!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Signup failed. Try again." });
  }
});

module.exports = router;