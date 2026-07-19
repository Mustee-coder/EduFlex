import express from "express";
const router = express.Router();

// middleware
import {
    auth,
    isInstructor,
    isStudent 
} from "../middleware/auth.js";

// controllers
import {
    updateProfile,
    updateUserProfileImage,
    getUserDetails,
    deleteAccount,
    getEnrolledCourses, 
    instructorDashboard,
    getMyLearning,
    getEnrollmentTrend
    
} from "../controllers/profile.js";

// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount);

// Update profile
router.put("/updateProfile", auth, updateProfile);

// Get user details
router.get("/getUserDetails", auth, getUserDetails);

// Enrolled courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.get(
  "/enrollment-trend",
  auth,
  isInstructor,
  getEnrollmentTrend
);
// my learning 
router.get("/my-learning", auth, isStudent, getMyLearning);

// Update profile image
router.put("/updateUserProfileImage", auth, updateUserProfileImage);

// Instructor dashboard
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);


// Export router
export default router;
