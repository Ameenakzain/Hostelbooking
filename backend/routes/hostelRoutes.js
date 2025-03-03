const express = require("express");
const router = express.Router();
const { addHostel, searchHostels, getOwnerHostels, uploadMiddleware } = require("../controllers/hostelController");
const { verifyOwner } = require("../middleware/auth"); // Middleware to check if the user is an owner

// ✅ Route to add a new hostel
router.post("/add-hostel", verifyOwner, uploadMiddleware, addHostel);

// ✅ Route to search hostels
router.get("/search", searchHostels);

// ✅ Route to get hostels added by the owner
router.get("/owner-hostels", verifyOwner, getOwnerHostels);

module.exports = router;
