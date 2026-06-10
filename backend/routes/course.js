import express from "express";
const router = express.Router();

//  Controllers 

// course controllers
import {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    publishCourse,
    editCourse,
    deleteCourse,
    getInstructorCourses
} from "../controllers/course.js";
import { updateCourseProgress } from "../controllers/courseProgress.js";

// category controllers
import {
    createCategory,
    showAllCategories,
    getCategoryPageDetails,
    deleteCategory,
} from "../controllers/category.js";

// section controllers
import {
    createSection,
    updateSection,
    deleteSection,
} from "../controllers/section.js";

// subsection controllers
import {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} from "../controllers/subSection.js";

// rating controllers
import {
    createRating,
    getAverageRating,
    getAllRatingReview,
} from "../controllers/ratingAndReview.js";

// middleware
import {
    auth,
    isAdmin,
    isInstructor,
    isStudent,
} from "../middleware/auth.js";







// Sections
router.post("/createSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);

// SubSections
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// Courses
router.post("/createCourse", auth, isInstructor, createCourse);

router.get("/getAllCourses", auth, getAllCourses);

router.get("/getCourseDetails/:courseId", auth, getCourseDetails);

router.get("/getFullCourseDetails/:courseId", auth, getFullCourseDetails);
router.patch("/editCourse/:courseId", auth, isInstructor, editCourse);

router.delete("/deleteCourse/:courseId", auth, isInstructor, deleteCourse);
router.patch(
  "/course-progress",
  auth,
  isStudent,
  updateCourseProgress
);
router.get("/instructor/courses", auth, isInstructor, getInstructorCourses);



router.patch("/publishCourse/:courseId", auth, isInstructor, publishCourse);










// category 

router.post("/createCategory", auth, isAdmin, createCategory);
router.delete("/deleteCategory", auth, isAdmin, deleteCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", getCategoryPageDetails);




router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingReview);


// Export router
export default router;
