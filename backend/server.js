require("dotenv").config();
const express = require("express");
//const OwnerRoutes = require("backend/routes/OwnerRoutes");  // Check this import

const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
//Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",  // ✅ Allow frontend running on 3001 to access the backend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


//app.use("/uploads", express.static(uploadDir));


// ✅ Ensure "uploads" folder exists
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 'uploads' folder created.");
}
app.use("/uploads", express.static(uploadDir));
const mongoURI = process.env.ConnectionString;

if (!mongoURI) {
  console.error("❌ MongoDB Connection String is missing! Check your .env file.");
  process.exit(1);
}

// 🔗 Connect to MongoDB
mongoose.connect(mongoURI)  
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
const OwnerRoutes = require("./routes/OwnerRoutes");
app.use("/api/owners", OwnerRoutes); // Mount the routes for handling owner-related requests

const userRoutes = require("./routes/userRoutes"); // Ensure this path is correct
app.use("/api/users", userRoutes); // Mount user-related routes

const hostelRoutes = require("./routes/hostelRoutes"); // Add the hostel routes
app.use("/api/hostels", hostelRoutes);  // Add this line for hostel-related routes

const authRoutes = require("./routes/authRoutes"); // Import auth routes
app.use("/api/auth", authRoutes); // Mount authentication routes


// 📌 Sample Route
app.get("/", async (req, res) => {
  try {
    res.send("Welcome to Hostel Booking API!");
  } catch (error) {
    console.error("Error in / route:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});