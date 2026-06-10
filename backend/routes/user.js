import express from "express";
const router = express.Router();

// Controllers
import {   
    sendOTP,
    verifyOTP,
    signup,
    login,
    changePassword,
    logout
} from "../controllers/auth.js";

// Reset password controllers
import {
    resetPasswordToken,
    resetPassword,
} from "../controllers/resetPassword.js";

// Middleware
import {
    auth,
    isAdmin
} from "../middleware/auth.js";

// Profile controllers (admin only)
import {
    getAllStudents,
    getAllInstructors
} from "../controllers/profile.js";







// Send OTP
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);
router.post("/logout", logout);


// Change password
router.post("/changepassword", auth, changePassword);



// Generate reset token
router.post("/reset-password-token", resetPasswordToken);

// Reset password
router.post("/reset-password", resetPassword);



// Get all students
router.get("/all-students", auth, isAdmin, getAllStudents);

// Get all instructors
router.get("/all-instructors", auth, isAdmin, getAllInstructors);


// Export router
export default router;
