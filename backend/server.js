require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3001",  // ✅ Allow frontend running on 3001 to access the backend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

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
app.use("/owners", OwnerRoutes); // Mount the routes for handling owner-related requests


// 📌 Sample Route
app.get("/", (req, res) => {
  res.send("Welcome to Hostel Booking API!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
