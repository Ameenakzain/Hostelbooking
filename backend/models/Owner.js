const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  hostelName: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true }
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

