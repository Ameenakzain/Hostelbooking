
require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Controller function to handle user signup
const userSignup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if all required fields are present
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Signup Error: User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    //const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed successfully");

    // Create a new user
    const newUser = new User({
      name,
      email,
      phone,
      password:hashedPassword, // Password will be hashed in the model
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller function to handle user login
const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login request received:", req.body);

  
      // Check if all required fields are present
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        console.log("❌ User not found in database:", email);
        return res.status(400).json({ message: "Invalid email or password" });
      }

      console.log("Entered password:", password);
      console.log("Stored hashed password:", user.password);
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("❌ Login Error: Incorrect password for", email);
        return res.status(400).json({ message: "Invalid email or password" });
      }
      console.log("✅ Password matched successfully");
      
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
      console.log("✅ JWT Token generated");
  
      // Send response (excluding password)
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
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { userSignup, userLogin };


  
 