const jwt = require("jsonwebtoken");

const verifyOwner = (req, res, next) => {
const token = req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null;
console.log("Received Token:", token);
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
    
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token with the secret key
    req.ownerId = decoded.id;  // Attach owner ID to request object
    next();  // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { verifyOwner };
