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
  origin: "http://localhost:3000",  // ✅ Allow frontend running on 3001 to access the backend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//app.use("/uploads", express.static(uploadDir));


// ✅ Ensure "uploads" folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 'uploads' folder created.");
}

// 🔗 Connect to MongoDB
mongoose.connect(process.env.ConnectionString)
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

const OwnerRoutes = require("./routes/OwnerRoutes");
app.use("/api/owners", OwnerRoutes); // Mount the routes for handling owner-related requests

const userRoutes = require("./routes/userRoutes"); // Ensure this path is correct
app.use("/api/users", userRoutes); // Mount user-related routes

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