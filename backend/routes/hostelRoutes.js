const express = require("express");
const router = express.Router();
const { addHostel, searchHostels, getOwnerHostels,getSavedHostels, 
    getNotifications,  uploadMiddleware,getHostelById, updateHostel } = require("../controllers/hostelController");
const { verifyOwner, verifyUser } = require("../middleware/auth");

// ✅ Route to add a new hostel
router.post("/add-hostel", verifyOwner, uploadMiddleware, addHostel);

// ✅ Route to search hostels
router.get("/search", searchHostels);

// ✅ Route to get hostels added by the owner
router.get("/owner-hostels", verifyOwner, getOwnerHostels);
// ✅ Route to get saved hostels for a user
router.get("/saved", verifyUser, getSavedHostels);

// ✅ Route to fetch notifications for a user
router.get("/notifications", verifyUser, getNotifications);

router.get("/hostel/:id", verifyOwner, getHostelById);
router.put("/hostel/:id", verifyOwner, uploadMiddleware, updateHostel);


module.exports = router;
