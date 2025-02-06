const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const Owner = require("../models/Owner"); // Import Owner model
dotenv.config();

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 'uploads' folder created.");
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Ensure the folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Multer file filter for PDF uploads
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
  console.log("File uploaded:", req.file);
  try {
    const { fullName, email, contact, password, confirmPassword, hostelName, hostelAddress } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email already exists
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // File upload validation
    if (!req.file) {
      return res.status(400).json({ message: "License file is required" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = new Owner({
      fullName,
      email,
      contact,
      hostelName,
      hostelAddress,
      password: hashedPassword,
      licenseFile: req.file.filename // Save file path in database
    });

    await newOwner.save();
    res.status(201).json({ message: "Owner registered successfully!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Signup failed. Try again." });
  }
});

// 🔑 Owner Login Route
router.post("/login", async (req, res) => {
  console.log("Login route hit"); // Debug log

  try {
    const { email, password } = req.body;
    console.log("Request body:", req.body); // Log the incoming data

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if owner exists in the database (use Owner model here)
    const owner = await Owner.findOne({ email });
    if (!owner) {
      console.log("Owner not found with email:", email);
      return res.status(404).json({ message: "Owner not found" });
    }
    console.log("🔹 Owner found:", owner);
    
    // Debug logs for password comparison
    console.log("Hash in DB:", owner.password);
    console.log("Password provided:", password);
    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT Token for authentication
    const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send the success response with owner details (excluding password)
    const { password: _, ...ownerWithoutPassword } = owner.toObject(); // Exclude password from response
    res.status(200).json({
      message: "Login successful",
      token,
      ownerId: owner._id,
      owner: ownerWithoutPassword,
    });

  } catch (error) {
    console.error("Error in /login route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
