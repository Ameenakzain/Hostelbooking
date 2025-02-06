const mongoose = require("mongoose");
const Owner = require("./models/Owner"); // Adjust the path to your 'Owner' model

// Function to check the owner data
async function checkOwnerData() {
  try {
    const ownerEmail = "johndoe@example.com"; // Replace with the email to test
    const owner = await Owner.findOne({ email: ownerEmail });

    if (owner) {
      console.log("Found Owner:", owner);
      console.log("Stored Password Hash:", owner.password);
    } else {
      console.log("Owner not found with this email.");
    }
  } catch (error) {
    console.error("Error fetching owner data:", error);
  }
}

// Connect to the MongoDB database
mongoose.connect("mongodb+srv://dbuser:Hostel321@cluster1.zdf3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1", { // Replace 'yourdbname' with your actual database name
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to the database");
  checkOwnerData();  // Call the function to check owner data
})
.catch((err) => {
  console.error("Database connection error:", err);
});
