const express = require("express");
const multer = require("multer");
const uploads = multer({ dest: "uploads/" });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const OwnerController = require("../controllers/OwnerController");

/*const {
  registerOwner,
  ownerLogin,
  getAllOwners,
  getOwnerById,
  deleteOwner,
  resetPassword,
} = require("../controllers/OwnerController");*/
const path = require("path");
dotenv.config();
const Owner = require("../models/Owner");
const router = express.Router();
const fs = require("fs");

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 'uploads' folder created.");
}


// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,uploadDir); // Ensure the folder exists
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

router.post("/owner-signup", upload.single("licenseFile"), async (req, res) => {
  console.log("Owner registration route hit");
  try {
    const { fullName, email, contact, password, confirmPassword, hostelName, hostelAddress } = req.body;

    // Validate required fields
    if (!fullName || !email || !contact || !password || !confirmPassword || !hostelName || !hostelAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if the owner already exists
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: "Owner already registered with this email" });
    }

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ message: "License file is required" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new owner
    const newOwner = new Owner({
      fullName,
      email,
      contact,
      password: hashedPassword,
      hostelName,
      hostelAddress,
      licenseFile: req.file.filename, // Save the uploaded file name
    });

    // Save the owner to the database
    await newOwner.save();
    res.status(201).json({ message: "Owner registered successfully!" });
  } catch (error) {
    console.error("Error registering owner:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});



router.post("/owner-login", async (req, res) => {
  console.log("Login route hit"); // Debug log

  try {
    const { email, password } = req.body;
    console.log("Request body:", req.body); // Log the incoming data

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists in the database
    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log("🔹 Owner found:", owner);

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token for authentication
    //const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send the success response with user details (excluding password)
    //const { password: _, ...userWithoutPassword } = user.toObject(); // Exclude password from response
    res.status(200).json({
      message: "Login successful",
      owner
    });

  } catch (error) {
    console.error("Error in /login route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", OwnerController.forgotPassword);

router.post("/reset-password", OwnerController.resetPassword); 


module.exports = router;