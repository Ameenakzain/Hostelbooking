const Owner = require("../models/Owner");
const bcrypt = require("bcryptjs");

// 📌 Register a New Owner (with File Upload)
exports.registerOwner = async (req, res) => {
  try {
    // Check if the file is uploaded
    const licenseFilePath = req.file ? req.file.path : null;

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new owner object
    const newOwner = new Owner({
      name: req.body.fullName,
      email: req.body.email,
      phone: req.body.contact,
      hostelName: req.body.hostelName,
      address: req.body.hostelAddress,
      password: hashedPassword,
      licenseFile: licenseFilePath, // Store file path in database
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
