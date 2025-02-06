
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
// Controller function to handle user signup
const { userSignup } = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if all required fields are present
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //const salt = await bcrypt.genSalt(10);

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
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller function to handle user login
const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if all required fields are present
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Send user data (excluding sensitive info like password)
      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  
  // Exporting both controller functions
  module.exports = { userSignup, userLogin };