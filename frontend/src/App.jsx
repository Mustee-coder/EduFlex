import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import RoleRoute from "@/components/RoleRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// Auth Pages
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import SendOtp from "@/pages/auth/SendOtp";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import UpdatePassword from "@/pages/auth/UpdatePassword";

// Shared Pages
import Profile from "@/pages/dashboard/Profile";
import Settings from "@/pages/dashboard/Settings";

// Student Pages
import Dashboard from "@/pages/student/Dashboard";
import BrowseCourses from "@/pages/student/BrowseCourses";
import MyLearning from "@/pages/student/MyLearning";
import MyCourses from "@/pages/student/MyCourses";
import CoursePlayer from "@/pages/student/CoursePlayer";
import CoursePreview from "@/pages/student/CoursePreview";
import CheckoutPage from "@/pages/student/CheckoutPage";
import VerifyPaymentPage from "@/pages/student/VerifyPaymentPage";

// Instructor Pages
import InstructorDashboard from "@/pages/instructor/InstructorDashboard";
import InstructorCourses from "@/pages/instructor/InstructorCourses";
import CreateCourse from "@/pages/instructor/CreateCourse";
import CourseBuilder from "@/pages/instructor/CourseBuilder";
import CreateSubSection from "@/pages/instructor/CreateSubSection";
import Students from "@/pages/instructor/Students";
import Analytics from "@/pages/instructor/Analytics";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";

const App = () => {
  return (
    <>
      <Routes>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/send-otp" element={<SendOtp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/update-password/:token"
          element={<UpdatePassword />}
        />

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={<h1>Access Denied 🚫</h1>}
        />

        {/* Protected Routes */}
        <Route
          element={
            <RoleRoute
              allowedRoles={[
                "Student",
                "Instructor",
                "Admin",
              ]}
            />
          }
        >
          <Route element={<DashboardLayout />}>

            {/* Shared */}
            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* Student */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/browse-courses"
              element={<BrowseCourses />}
            />

            <Route
              path="/my-learning"
              element={<MyLearning />}
            />

            <Route
              path="/my-courses"
              element={<MyCourses />}
            />

            <Route
              path="/course/:courseId"
              element={<CoursePlayer />}
            />

            <Route
              path="/course-preview/:courseId"
              element={<CoursePreview />}
            />

            <Route
              path="/checkout/:courseId"
              element={<CheckoutPage />}
            />

            <Route
              path="/payment/verify"
              element={<VerifyPaymentPage />}
            />

            {/* Instructor */}
            <Route
              path="/instructor"
              element={<InstructorDashboard />}
            />

            <Route
              path="/courses"
              element={<InstructorCourses />}
            />

            <Route
              path="/add-course"
              element={<CreateCourse />}
            />

            <Route
              path="/course-builder/:courseId"
              element={<CourseBuilder />}
            />

            <Route
              path="/add-subsection/:courseId/:sectionId"
              element={<CreateSubSection />}
            />

            <Route
              path="/students"
              element={<Students />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

          </Route>
        </Route>

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </>
  );
};

export default App;