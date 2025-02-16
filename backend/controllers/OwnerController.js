require("dotenv").config();
const Owner = require("../models/Owner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");



// 📌 Nodemailer Transport Configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email provider
  auth: {
    user: process.env.EMAIL_ADDRESS, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

// 📌 Send Email Function
const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_ADDRESS, to, subject, html: htmlContent });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// 📌 Send Verification Email
exports.sendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate email verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Create a verification link
    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Send verification email
    await sendEmail(email, "Verify Your Email", `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`);

    console.log(`📧 Sending verification email to ${email}`);

    res.status(200).json({ message: "Verification email sent successfully." });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// 📌 Owner Signup
exports.ownerSignup = async (req, res) => {
  try {
    const { fullName, email, contact, password, confirmPassword, hostelName, hostelAddress } = req.body;

    // Normalize email (trim & lowercase)
    const cleanedEmail = email.trim().toLowerCase();
    
    // Check if owner already exists
    if (await Owner.findOne({ email: cleanedEmail })) {
      return res.status(400).json({ message: "Owner already registered." });
    }

    console.log("🔑 Raw Password Before Hashing:", password);
    const cleanedPassword = password.trim();


    // Hash the password
    const hashedPassword = await bcrypt.hash(cleanedPassword, 10);

    // Create new owner
    const newOwner = new Owner({
      fullName,
      email: cleanedEmail,
      contact,
      password: hashedPassword,
      hostelName,
      hostelAddress,
      licenseFile: req.file ? `/uploads/${req.file.filename}` : null, // Save uploaded file
    });

    await newOwner.save();
    
    
    // Generate email confirmation token
    const token = jwt.sign({ id: newOwner._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Send email confirmation link
    const confirmLink = `${process.env.CLIENT_URL}/confirm-email/${token}`;

    await sendEmail(cleanedEmail, "Confirm Your Email", `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`);
    
    res.status(201).json({ message: "Owner registered. Check email for confirmation." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};


// 📌 Confirm Email
exports.confirmEmail = async (req, res) => {
  try {
  const { token } = req.params;
  
  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // Find the owner by ID
  const owner = await Owner.findById(decoded.id);
  if (!owner) {
    return res.status(404).json({ message: "Owner not found." });
  }
  
  // Update the owner's email confirmation status
  owner.isEmailConfirmed = true;
  await owner.save();
  
  res.status(200).json({ message: "Email confirmed successfully! You can now log in." });
  } catch (error) {
  console.error("Error confirming email:", error);
  res.status(500).json({ message: "Invalid or expired token." });
  }
  };
  


// 📌 Owner Login
exports.ownerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Received login request with email:", email);

    const cleanedEmail = email.trim().toLowerCase();
    const cleanedPassword = password.trim();

    const owner = await Owner.findOne({ email: cleanedEmail });
    if (!owner) { 
      console.log("❌ Owner not found in database");
       return res.status(400).json({ message: "Invalid email or password" });
    }
    //console.log("Stored hash password:", owner.password);

    console.log("📌 Entered Password:", cleanedPassword);
    console.log("📌 Stored Hashed Password:", owner.password);


    const isPasswordValid = await bcrypt.compare(cleanedPassword , owner.password);
    console.log("🔑 Password match result:", isPasswordValid);

    if (!isPasswordValid) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    

    res.status(200).json({ message: "Login successful", token, ownerId: owner._id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Get All Owners
exports.getAllOwners = async (req, res) => {
  try {
    const owners = await Owner.find();
    res.status(200).json(owners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get a Single Owner by ID
exports.getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Delete an Owner by ID
exports.deleteOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndDelete(req.params.id);
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    res.status(200).json({ message: "Owner deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Forgot Password (without email)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanedEmail = email.trim().toLowerCase();

    const owner = await Owner.findOne({ email: cleanedEmail });
    if (!owner) return res.status(404).json({ message: "Owner not found with this email" });

    // Instead of sending an email, return a reset token
    const resetToken = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Use this token to reset password", resetToken });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const owner = await Owner.findById(decoded.id);

    if (!owner) return res.status(404).json({ message: "Owner not found." });

    // Hash the new password before saving
    owner.password = await bcrypt.hash(newPassword.trim(), 10);
    await owner.save();

    res.json({ message: "Password has been successfully reset." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Invalid or expired token." });
  }
};
