import User from "../models/user.js";
import mailSender from "../utils/mailSender.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

//  SEND RESET TOKEN 
export const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not registered",
      });
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");

    const expiry = Date.now() + 5 * 60 * 1000;

    // store token + expiry
    user.token = token;
    user.resetPasswordTokenExpires = expiry;
    await user.save();

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:3000";

    const url = `${frontendUrl}/update-password/${token}`;

    await mailSender(
      email,
      "Password Reset Link",
      `Click here to reset your password: ${url}`
    );

    return res.status(200).json({
      success: true,
      message: "Reset link sent to email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  RESET PASSWORD 
export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (user.resetPasswordTokenExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.token = undefined;
    user.resetPasswordTokenExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};