const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Match with .env
    pass: process.env.EMAIL_PASS, // Match with .env
  },
});

const sendVerificationEmail = async (recipientEmail, token, userType) => {
  try {
    // Decide verification URL based on userType
    const verificationPath = userType === "owner" ? "/api/owners/verify" : "/api/users/verify";
    const verificationLink = `${process.env.BASE_URL}/api/users/verify/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: "Verify Your Email - BookMyHostel",
      html: `
        <h2>Welcome to BookMyHostel!</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}" target="_blank">${verificationLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${recipientEmail} (${userType})`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

module.exports = { sendVerificationEmail };
