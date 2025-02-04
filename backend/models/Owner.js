const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ownerSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, // ✅ Changed `name` to `fullName`
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true }, // ✅ Changed `phone` to `contact`
  hostelName: { type: String, required: true },
  hostelAddress: { type: String, required: true },
  password: { type: String, required: true },
  licenseFile: { type: String } // Store file path
});

// Hash password before saving
ownerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Owner = mongoose.model("Owner", ownerSchema);
module.exports = Owner;

