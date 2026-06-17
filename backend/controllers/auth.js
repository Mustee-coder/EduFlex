import User from "../models/user.js";
import Profile from "../models/profile.js";
import otpGenerator from "otp-generator";
import OTP from "../models/OTP.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import mailSender from "../utils/mailSender.js";
import otpTemplate from "../mail/templates/emailVerificationTemplate.js";
import passwordUpdated from "../mail/templates/passwordUpdate.js";

dotenv.config();

//  SEND OTP 
export const sendOTP = async (req, res) => {
  try {
    // 1. Get email
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 2. Normalize email
    email = email.toLowerCase().trim();

    // 3. Check if user already exists
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    // 4. Prevent OTP spam (1 minute rule)
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (recentOtp && Date.now() - recentOtp.createdAt < 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: "Please wait 1 minute before requesting another OTP",
      });
    }

    // 5. Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("Generated OTP:", otp);

    // 6. Create name from email
    const name = email
      .split("@")[0]
      .replace(/[0-9]/g, "")
      .split(".")
      .join(" ");

    // 7. Send email
    await mailSender(
      email,
      "OTP Verification Email",
      otpTemplate(otp, name)
    );

    // 8. Save OTP in DB
    await OTP.create({
      email,
      otp,
      createdAt: Date.now(),
    });

    // 9. Response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log("OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error while generating OTP",
      error: error.message,
    });
  }
};



// verfiOtp 
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const latestOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!latestOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }
    
    

    const isExpired =
      Date.now() - new Date(latestOtp.createdAt).getTime() > 5 * 60 * 1000;

    if (isExpired) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (latestOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    if (latestOtp.otp === otp) {
  await User.updateOne(
    { email },
    { isVerified: true }
  );
}

    // mark verified
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

//  signup 


export const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
    } = req.body;

    // 1. Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // 3. Check existing user
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create profile safely
    const profile = await Profile.create({
      gender: "",
      dateOfBirth: "",
      about: "",
      contactNumber: "",
    });

    // 6. Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      accountType,
      additionalDetails: profile._id,
      approved: accountType === "Instructor" ? false : true,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
      isVerified: false,
    });

    // 7. Remove password before sending response
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      message: "Account created successfully 🚀",
      user: userObj,
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error); // 🔥 important for debugging

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};



//export LOGIN
 export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email })
  .select("+password")
  .populate("additionalDetails");
    
    

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    //   create clean user object
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.token;

    res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "strict",
  maxAge: 3 * 24 * 60 * 60 * 1000,
})
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: userObj,
      });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
//  CHANGE PASSWORD 
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userDetails = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, userDetails.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password incorrect",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { password: hashedPassword },
      { new: true }
    );

    await mailSender(
      updatedUser.email,
      "Password Updated",
      passwordUpdated(updatedUser.email, updatedUser.firstName)
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Password change failed",
      error: error.message,
    });
  }
};



export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
