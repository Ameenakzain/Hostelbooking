const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { userSignup, userLogin, verifyEmail } = require("../controllers/userController");

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
router.post("/login", async (req, res) => {
  console.log("Login route hit");
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token for login
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "7d" });
    res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    console.error("Error in /login route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
