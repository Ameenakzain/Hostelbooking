const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");

/*const verifyOwner = (req, res, next) => {
const token = req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null;
console.log("Received Token:", token);
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
    
  }*/
    const verifyOwner = (req, res, next) => {
      const authHeader = req.header("Authorization");
      console.log("Authorization Header:", authHeader);  
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided, authorization denied" });
      }
    
      const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
      console.log("Received Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token with the secret key
    req.ownerId = decoded.id;  // Attach owner ID to request object
    next();  // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};
// Middleware to verify users
const verifyUser = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
  console.log("Received User Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.userId = decoded.id; // Attach user ID to request
    console.log("Decoded User ID:", req.userId);
    next();
  } catch (error) {
    console.error("User Token verification error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { verifyOwner, verifyUser };


