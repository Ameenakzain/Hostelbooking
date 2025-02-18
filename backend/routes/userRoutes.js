const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { userSignup, userLogin } = require("../controllers/userController");

const router = express.Router();
//const userController = require("../controllers/userController");

// POST route to register a user

/*router.post("/signup", async (req, res) => {
  console.log("Login route hit");
  try {
    const { name, email,phone, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
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
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// POST route for user login
router.post("/login", async (req, res) => {
  console.log("Login route hit"); // Debug log
  try {
    const { email, password } = req.body;
    console.log("Request body:", req.body); // Log the incoming data

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error in /login route:", error);
    res.status(500).json({ message: "Server error" });
  }
});*/
router.post("/signup", userSignup);
router.post("/login", userLogin);



 
  

module.exports = router;