
const Owner = require("../models/Owner");
//const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



// 📌 Register a New Owner (with File Upload)
exports.registerOwner = async (req, res) => {
  

    try {
      // Check if all required fields are provided
      const { fullName, email, contact, password, confirmPassword, hostelName, hostelAddress } = req.body;
  
      if (!fullName || !email || !contact || !password || !confirmPassword || !hostelName || !hostelAddress ) {
        return res.status(400).json({ message: "All fields are required." });
      }

      /*const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: "Owner already exists" });
    }*/

    const hashedPassword = await bcrypt.hash(password, 10);

  
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }
  
      // ✅ Check if email already exists
      const existingOwner = await Owner.findOne({ email });
      if (existingOwner) {
        return res.status(400).json({ message: "Email already registered." });
      }
  
      // ✅ Handle File Upload (Ensure file exists)
      if (!req.file) {
        return res.status(400).json({ message: "License file is required." });
      }
  
      // ✅ Hash password before storing
     // const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Create a new owner object
    const newOwner = new Owner({
        fullName,
        email,
        contact,
        password:hashedPassword,
        hostelName,
        hostelAddress,
        licenseFile: req.file.filename, // ✅ Store only the filename, not full path
      });
  

    // Save to database
    await newOwner.save();
    res.status(201).json({ message: "Owner registered successfully!" });
  } catch (error) {
    console.error("Error registering owner:", error);
    res.status(500).json({ error: error.message });
  }
};



// 📌 Owner Login
exports.ownerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if email and password are provided
        if (!email || !password) {
           return res.status(400).json({ message: "All fields are required." });
        }


        // Check if owner exists
        const owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(400).json({ message: "Invalid email or password." });
        }


        // Check password
        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Generate JWT token
        const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful",token,
            ownerId: owner._id,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

  

// 📌 Get All Owners
exports.getAllOwners = async (req, res) => {
  try {
    const owner = await Owner.find();
    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get a Single Owner by ID
exports.getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }
    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Delete an Owner by ID
exports.deleteOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndDelete(req.params.id);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }
    res.status(200).json({ message: "Owner deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if the owner exists
    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(404).json({ message: "Owner not found with this email" });
    }

    // Generate reset token (mock implementation; replace with actual logic if needed)
    const resetToken = Math.random().toString(36).substring(2, 15);

    // Mock sending email (implement real email logic)
    console.log(`Send this reset token to the owner: ${resetToken}`);

    res.status(200).json({ message: "Password reset instructions sent" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Reset Password Function
exports.resetPassword = async (req, res) => {
  const { emailOrPhone, newPassword } = req.body;

  try {
    const owner = await Owner.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found." });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    owner.password = await bcrypt.hash(newPassword, salt);

    await owner.save();

    res.json({ message: "Password has been successfully reset." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};