require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 Connect to MongoDB
mongoose.connect(process.env.ConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
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
