const express = require("express");
const User = require("../models/userModel");
const Booking = require("../models/Booking"); // ✅ Add if not already imported
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { userSignup, userLogin, verifyEmail } = require("../controllers/userController");
const { authenticateUser } = require("../middleware/auth"); 
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL; // Example: http://localhost:5000

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// User Signup with Email Verification
router.post("/signup", async (req, res) => {
  console.log("Signup route hit");
  try {
    const { name, email, phone, password } = req.body;
    console.log("Received Data:", req.body);
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with `isVerified: false`
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: false, // User needs to verify email
    });

    await newUser.save();
    console.log("User created:", newUser);
    // Generate verification token
    const token = jwt.sign({ userId: newUser._id }, SECRET_KEY, { expiresIn: "1h" });

    // Send verification email
    const verificationLink = `${BASE_URL}/api/users/verify/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email - BookMyHostel",
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationLink}">${verificationLink}</a>
             <p>This link will expire in 1 hour.</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ message: "Failed to send verification email" });
      }
      console.log("Email sent:", info.response);
      res.status(201).json({ message: "Signup successful! Please verify your email." });
    });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Email Verification Route
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.isVerified = true;
    await user.save();

    res.send("Email verified successfully! You can now log in.");
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// User Login (Restrict login if email not verified)
// ✅ Login Route
router.post("/login", async (req, res) => {
  console.log("🔍 Received login request with email:", req.body.email);

  try {
    console.log("📌 Login request received with data:", req.body); 

    const { email, password } = req.body;

    // 🔎 Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("🚨 User not found!");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 🔑 Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("🚨 Incorrect password!");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("✅ User logged in successfully:", user.email);
    res.json({ token, user: { id: user._id, email: user.email } });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ✅ GET user profile
router.get("/profile", authenticateUser, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select("-password"); // Exclude password
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});
 
// ✅ GET recent bookings
router.get("/recent-bookings", authenticateUser, async (req, res) => {
  try {
      const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(5);
      res.json(bookings);
  } catch (error) {
      res.status(500).json({ message: "Error fetching bookings" });
  }
});
 
// ✅ GET saved hostels
router.get("/saved-hostels", authenticateUser, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).populate("savedHostels");
      res.json({ savedHostels: user.savedHostels || [] });
  } catch (error) {
      res.status(500).json({ message: "Error fetching saved hostels" });
  }
});

// ✅ GET user notifications
router.get("/notifications", authenticateUser, async (req, res) => {
  try {
      const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
      res.json({notifications});
  } catch (error) {
      res.status(500).json({ message: "Error fetching notifications" });
  }
});

module.exports = router;
