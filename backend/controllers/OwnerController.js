const Owner = require("../models/Owner");

const bcrypt = require("bcryptjs");

// 📌 Register a New Owner (with File Upload)
exports.registerOwner = async (req, res) => {
    try {
      // Check if all required fields are provided
      const { fullName, email, contact, hostelName, hostelAddress, password, confirmPassword } = req.body;
  
      if (!fullName || !email || !contact || !hostelName || !hostelAddress || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
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
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Create a new owner object
    const newOwner = new Owner({
        name: fullName,
        email: email,
        phone: contact,
        hostelName: hostelName,
        address: hostelAddress,
        password: hashedPassword,
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


  

// 📌 Get All Owners
exports.getAllOwners = async (req, res) => {
  try {
    const owners = await Owner.find();
    res.status(200).json(owners);
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
