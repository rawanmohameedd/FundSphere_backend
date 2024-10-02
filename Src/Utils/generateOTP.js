require('dotenv').config()
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")


const secretKey = process.env.SECRET;
let otpStore = {}; // Store OTPs temporarily

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendOTP(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP
  const token = jwt.sign({ otp }, secretKey, { expiresIn: '10m' });
  otpStore[email] = token;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'FundSphere OTP Verfication',
    text: `Your OTP code is ${otp}`
  };

  try {
    // Send the email and await for the result
    await transporter.sendMail(mailOptions);
    console.log(otp)
    return otp; // return the OTP if mail was sent successfully
  } catch (error) {
    console.error('Error sending email:', error);
    return null; // return null in case of error
  }
}

async function verifyOTP({ email, otp }) {
  const token = otpStore[email];

  if (!token) {
      return { success: false, message: 'OTP not found' };
  }

  try {
      const decoded = jwt.verify(token, secretKey); // Verify the token
      if (decoded.otp === otp) {
        console.log(otp , decoded.otp)
          return { success: true, message: 'OTP verified successfully' };
      } else {
          return { success: false, message: 'Invalid OTP' };
      }
  } catch (err) {
      return { success: false, message: 'OTP expired' };
  }
}


module.exports = {
  sendOTP,
  verifyOTP
}