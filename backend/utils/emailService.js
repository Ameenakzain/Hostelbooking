const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

const sendVerificationEmail = async (recipientEmail) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: recipientEmail,
      subject: "Email Verification",
      text: "Please verify your email for our platform.",
    });
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = { sendVerificationEmail };
