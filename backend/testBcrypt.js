const bcrypt = require("bcryptjs");

const enteredPassword = "Raj@123"; // The password you entered
const storedHash = "$2a$10$0Sj2ER4brLpGmkZWRHCU1OezHm7Pef3sKk0tNcFABkA1xO4OsJu3m"; // The hash from MongoDB

bcrypt.compare(enteredPassword, storedHash, (err, result) => {
  if (err) {
    console.error("❌ Error comparing password:", err);
  } else {
    console.log("🔑 Password match result:", result ? "✅ MATCH" : "❌ NO MATCH");
  }
});
