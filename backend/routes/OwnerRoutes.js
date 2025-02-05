const express = require("express");
const multer = require("multer");
const uploads = multer({ dest: "uploads/" });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {
  registerOwner,
  ownerLogin,
  getAllOwners,
  getOwnerById,
  deleteOwner
} = require("../controllers/OwnerController");
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

// 🛠 Owner Registration Route with File Upload
router.post("/signup", upload.single("licenseFile"), async (req, res) => {
  console.log("File uploaded:", req.file);
  try {
    console.log("Received body:", req.body); 
    const { fullName, email, contact, password, confirmPassword, hostelName, hostelAddress } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
     // ✅ Check if email already exists
     const existingOwner = await Owner.findOne({ email });
     if (existingOwner) {
       return res.status(400).json({ message: "Email already registered" });
     }

    // File Upload Validation
    if (!req.file) {
      return res.status(400).json({ message: "License file is required" });
    }


    // ✅ Hash password before saving
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
/*router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const owner = await Owner.findOne({ email });

    if (!owner) {
      return res.status(400).json({ message: "Invalid credentials (Email not found)" });
    }
    console.log("🔹 Owner found:", owner);

    // ✅ Compare hashed password
    //const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      //return res.status(400).json({ message: "Invalid credentials (Password incorrect)" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    //res.json({ token, ownerId: owner._id });
  } catch (error) {
    //res.status(500).json({ message: "Server error" });
  }
});*/
router.post("/login", async (req, res) => {
  console.log("Login route hit"); // Debug log

  try {
    const { email, password } = req.body;
    console.log("Request body:", req.body); // Log the incoming data

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log("🔹 User found:", user);

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token for authentication
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send the success response with user details (excluding password)
    const { password: _, ...userWithoutPassword } = user.toObject(); // Exclude password from response
    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error("Error in /login route:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;