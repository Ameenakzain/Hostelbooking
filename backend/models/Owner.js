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
// Pre-save hook to hash the password before saving
ownerSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // Replace the plaintext password with the hashed one
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
// Hash password before saving
/*ownerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});*/

const Owner = mongoose.model("Owner", ownerSchema);
module.exports = Owner;
