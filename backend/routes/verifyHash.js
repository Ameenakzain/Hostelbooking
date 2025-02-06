const bcrypt = require("bcryptjs");

const hashedPassword = "$2a$10$56It8pLEimGmPpJpuvj/kOvp5kf2Zjqnd2Qukusl05d6P9AxZT5si"; // Replace with the hash from your database
const plainPassword = "yourPlainPassword"; // Replace with the password you're testing

async function verifyPassword() {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  if (isMatch) {
    console.log("✅ Password match!");
  } else {
    console.log("❌ Password mismatch.");
  }
}

verifyPassword();
