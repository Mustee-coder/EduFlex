import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 🔐 INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// AUTH ENDPOINTS

export const authEndpoints = {
  SEND_OTP: "/auth/send-otp",
  VERIFY_OTP: "/auth/verify-otp",
  SIGNUP: "/auth/signup",
  LOGIN: "/auth/login",
  RESET_PASSWORD_TOKEN: "/auth/reset-password-token",
  RESET_PASSWORD: "/auth/reset-password",
  CHANGE_PASSWORD: "/auth/change-password",
};


 //  PROFILE ENDPOINTS

export const profileEndpoints = {
  GET_USER_DETAILS: "/profile/getUserDetails",
  GET_ENROLLED_COURSES: "/profile/getEnrolledCourses",
  INSTRUCTOR_DASHBOARD: "/profile/instructorDashboard",
  UPDATE_PROFILE_IMAGE: "/profile/updateUserProfileImage",
  UPDATE_PROFILE: "/profile/updateProfile",
  DELETE_PROFILE: "/profile/deleteProfile",
  GET_MYLEARNING: "/profile/my-learning",
  GET_ENROLLMENT_TREND: "/enrollment-trend",
};

// ADMIN ENDPOINTS
export const adminEndpoints = {
  GET_ALL_STUDENTS: "/auth/all-students",
  GET_ALL_INSTRUCTORS: "/auth/all-instructors",
};

//PAYMENT ENDPOINTS
   

export const paymentEndpoints = {
  INITIALIZE_PAYMENT: "/payment/initialize",
  VERIFY_PAYMENT: "/payment/verify",
  SEND_PAYMENT_SUCCESS_EMAIL: "/payment/payment-success-email",
};
//COURSE ENDPOINTS
   


export const courseEndpoints = {
  GET_ALL_COURSES: "/course/getAllCourses",
  COURSE_DETAILS: "/course/getCourseDetails",
  
  CREATE_COURSE: "/course/createCourse",
  
  EDIT_COURSE: "/course/editCourse",

  DELETE_COURSE: (courseId) => `/course/deleteCourse/${courseId}`,
  PUBLISHED_COURSE: "/course/publishCourse",

  CREATE_SECTION: "/course/createSection",
  UPDATE_SECTION: "/course/updateSection",
  DELETE_SECTION: "/course/deleteSection",

  CREATE_SUBSECTION: "/course/addSubSection",
  UPDATE_SUBSECTION: "/course/updateSubSection",
  DELETE_SUBSECTION: "/course/deleteSubSection",
  

  COURSE_CATEGORIES: "/course/showAllCategories",
  CREATE_CATEGORY: "/course/createCategory",
  DELETE_CATEGORY: "/course/deleteCategory",

  INSTRUCTOR_COURSES: "/course/instructor/courses",
  
  FULL_COURSE_DETAILS: "/course/getFullCourseDetails",

  UPDATE_PROGRESS: "/course/course-progress",

  CREATE_RATING: "/course/createRating",
  CATEGORY_PAGE: "/course/getCategoryPageDetails",
  REVIEWS: "/course/getReviews",
};
//contact 
   
export const contactEndpoints = {
  CONTACT_US: "/reach/contact",
};

export default api;
