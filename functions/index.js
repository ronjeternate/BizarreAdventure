const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// ✅ Replace with your Gmail credentials (use an App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ropo.ternate.swu@phinmaed.com", // Your Gmail
    pass: "xqpp kjli easm nawb", // App Password from Google
  },
});

// 📩 Send Welcome Email when a new user signs up
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: user.email,
    subject: "Welcome to BIZARRE!",
    html: `
      <h2>Welcome, ${user.fullName || "User"}!</h2>
      <p>Thank you for signing up for <b>BIZARRE</b>. We’re excited to have you on board!</p>
      <p>Enjoy shopping with us!</p>
      <br>
      <p>- The BIZARRE Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to:", user.email);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
});
