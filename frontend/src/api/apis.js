import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/* =========================
   AUTH ENDPOINTS
========================= */
export const authEndpoints = {
  SEND_OTP: "/auth/send-otp",
  VERIFY_OTP: "/auth/verify-otp",
  SIGNUP: "/auth/signup",
  LOGIN: "/auth/login",
  RESET_PASSWORD_TOKEN: "/auth/reset-password-token",
  RESET_PASSWORD: "/auth/reset-password",
  CHANGE_PASSWORD: "/auth/change-password",
};

/* =========================
   PROFILE ENDPOINTS
========================= */
export const profileEndpoints = {
  GET_USER_DETAILS: "/profile/getUserDetails",
  GET_ENROLLED_COURSES: "/profile/getEnrolledCourses",
  INSTRUCTOR_DASHBOARD: "/profile/instructorDashboard",
  UPDATE_PROFILE_IMAGE: "/profile/updateUserProfileImage",
  UPDATE_PROFILE: "/profile/updateProfile",
  DELETE_PROFILE: "/profile/deleteProfile",
};

/* =========================
   ADMIN ENDPOINTS
========================= */
export const adminEndpoints = {
  GET_ALL_STUDENTS: "/auth/all-students",
  GET_ALL_INSTRUCTORS: "/auth/all-instructors",
};

/* =========================
   PAYMENT ENDPOINTS
========================= */
export const paymentEndpoints = {
  CAPTURE_PAYMENT: "/payment/capturePayment",
  VERIFY_PAYMENT: "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL: "/payment/sendPaymentSuccessEmail",
};

/* =========================
   COURSE ENDPOINTS
========================= */
export const courseEndpoints = {
  GET_ALL_COURSES: "/course/getAllCourses",
  COURSE_DETAILS: "/course/getCourseDetails",
  CREATE_COURSE: "/course/createCourse",
  EDIT_COURSE: "/course/editCourse",
  DELETE_COURSE: "/course/deleteCourse",
  CREATE_SECTION: "/course/addSection",
  UPDATE_SECTION: "/course/updateSection",
  DELETE_SECTION: "/course/deleteSection",
  CREATE_SUBSECTION: "/course/addSubSection",
  UPDATE_SUBSECTION: "/course/updateSubSection",
  DELETE_SUBSECTION: "/course/deleteSubSection",
  COURSE_CATEGORIES: "/course/showAllCategories",
  CREATE_CATEGORY: "/course/createCategory",
  DELETE_CATEGORY: "/course/deleteCategory",
  INSTRUCTOR_COURSES: "/course/getInstructorCourses",
  FULL_COURSE_DETAILS: "/course/getFullCourseDetails",
  UPDATE_PROGRESS: "/course/updateCourseProgress",
  CREATE_RATING: "/course/createRating",
  CATEGORY_PAGE: "/course/getCategoryPageDetails",
  REVIEWS: "/course/getReviews",
};

/* =========================
   CONTACT
========================= */
export const contactEndpoints = {
  CONTACT_US: "/reach/contact",
};

export default api;