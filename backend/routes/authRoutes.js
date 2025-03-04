const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
//const User = require("../models/userModel"); // Ensure correct path to User model
const Owner = require("../models/Owner");
router.get("/verify-email/:token", async (req, res) => {
    const { token } = req.params;
    console.log("Received Token:", token);

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //const user = await User.findOne({ email: decoded.email });
        let owner = await Owner.findOne({ email: decoded.email });

        if (!owner) {
            return res.status(404).json({ message: "owner not found" });
        }

if (owner) {
    if (owner.isVerified) {
        return res.status(400).json({ message: "Owner email already verified" });
    }
    owner.isVerified = true;
    await owner.save();
    return res.json({ message: "Owner email verified successfully!" });
}

} catch (error) {
console.error("Verification Error:", error.message);
res.status(400).json({ message: "Invalid or expired token" });
}
});

module.exports = router;



