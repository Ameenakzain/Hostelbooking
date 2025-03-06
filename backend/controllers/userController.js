require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/emailService"); // Correct import

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("🔍 Received token:", token);

    // ✅ Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    // ✅ Find user by ID and update `isVerified` to true
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    user.isVerified = true;
    await user.save();
    console.log("✅ Email verified successfully!");

    // ✅ Redirect to login page
    return res.redirect("http://localhost:3000/login"); // Update for production
  } catch (error) {
    console.error("❌ Email Verification Error:", error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Controller function to handle user signup
const userSignup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Signup Error: User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed successfully");

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
    });

    await newUser.save();

    // ✅ Generate verification token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // ✅ Send verification email
    await sendVerificationEmail(email, token, "user");

    res.status(201).json({ message: "User registered successfully! Please verify your email." });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller function to handle user login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Login request received:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Incorrect password for:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ Password matched successfully");

    // ✅ Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("✅ JWT Token generated");

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { userSignup, userLogin, verifyEmail };
