const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const Owner = require("../models/Owner");
const OwnerController = require("../controllers/OwnerController");

dotenv.config();
const router = express.Router();

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 'uploads' folder created.");
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

router.post("/send-verification", OwnerController.sendVerification);
router.post("/verify-email/:token", OwnerController.verifyEmail);

// Owner Signup Route
router.post("/owner-signup", upload.single("licenseFile"), OwnerController.ownerSignup);

// Owner Login Route
router.post("/login", OwnerController.ownerLogin);
//router.post("/send-verification", OwnerController.sendVerification);


// Password Reset Routes
router.post("/forgot-password", OwnerController.forgotPassword);
router.post("/reset-password", OwnerController.resetPassword);

module.exports = router;
