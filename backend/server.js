require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow frontend to access the backend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Ensure "uploads" folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 'uploads' folder created.");
}
app.use("/uploads", express.static(uploadDir));

// MongoDB Connection
const mongoURI = process.env.ConnectionString;
if (!mongoURI) {
  console.error("❌ MongoDB Connection String is missing! Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Routes
const OwnerRoutes = require("./routes/OwnerRoutes");
const UserRoutes = require("./routes/userRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/owners", OwnerRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/auth", authRoutes);

// Sample Route
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