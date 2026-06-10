import express from "express";
const router = express.Router();

// middleware
import {
    auth,
    isInstructor
} from "../middleware/auth.js";

// controllers
import {
    updateProfile,
    updateUserProfileImage,
    getUserDetails,
    getEnrolledCourses,
    deleteAccount,
    instructorDashboard
} from "../controllers/profile.js";

// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount);

// Update profile
router.put("/updateProfile", auth, updateProfile);

// Get user details
router.get("/getUserDetails", auth, getUserDetails);

// Enrolled courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

// Update profile image
router.put("/updateUserProfileImage", auth, updateUserProfileImage);

// Instructor dashboard
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);


// Export router
export default router;