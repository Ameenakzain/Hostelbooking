const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ownerSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, // ✅ Changed `name` to `fullName`
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true }, // ✅ Changed `phone` to `contact`
  password: { type: String, required: true },
  hostelName: { type: String, required: true },
  hostelAddress: { type: String, required: true },
  licenseFile: { type: String } ,// Store file path
  isEmailConfirmed: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
});


const Owner = mongoose.model("Owner", ownerSchema);
module.exports = Owner;