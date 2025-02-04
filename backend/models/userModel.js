const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name field
  email: { type: String, required: true, unique: true }, // Email field
  password: { type: String, required: true }, // Password field
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); // Hash password before saving
  }
  next();
});

const User = mongoose.model("User", userSchema); // Create User model
module.exports = User;
