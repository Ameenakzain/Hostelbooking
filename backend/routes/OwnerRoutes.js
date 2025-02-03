const express = require("express");
const router = express.Router();
const Owner = require("../models/Owner");

// 📌 Add New Owner
router.post("/register", async (req, res) => {
  try {
    const newOwner = new Owner(req.body);
    await newOwner.save();
    res.status(201).json({ message: "Owner registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get All Owners
router.get("/", async (req, res) => {
  try {
    const owners = await Owner.find();
    res.status(200).json(owners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
