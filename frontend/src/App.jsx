import { Routes, Route, Navigate } from "react-router-dom";
import RoleRoute from "@/components/RoleRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import SendOtp from "@/pages/auth/SendOtp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";

// Layout
import DashboardLayout from "@/components/layouts/DashboardLayout";

// Student Pages
import Dashboard from "@/pages/student/Dashboard";
import CoursePlayer from "@/pages/student/CoursePlayer";
import CoursePreview from "@/pages/student/CoursePreview";
import BrowseCourses from "@/pages/student/BrowseCourses";
import CheckoutPage from "@/pages/student/CheckoutPage";
import MyLearning from "@/pages/student/MyLearning";
import MyCourses from "@/pages/student/MyCourses";



// Instructor Pages
import InstructorDashboard from "@/pages/instructor/InstructorDashboard";
import InstructorCourses from "@/pages/instructor/InstructorCourses";
import CreateCourse from "@/pages/instructor/CreateCourse";
import Revenue from "@/pages/instructor/Revenue";
import Students from "@/pages/instructor/Students";
import Analytics from "@/pages/instructor/Analytics";
import CourseBuilder from "@/pages/instructor/CourseBuilder";
import CreateSubSection from "@/pages/instructor/CreateSubSection";















// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";

const App = () => {
return (
<>
<Routes>
{/* DEFAULT */}
<Route
path="/"
element={<Navigate to="/login" replace />}
/>

  {/* AUTH ROUTES */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/send-otp" element={<SendOtp />} />
  <Route path="/verify-email" element={<VerifyEmail />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />

  {/* UNAUTHORIZED */}
  <Route
    path="/unauthorized"
    element={<h1>Access Denied 🚫</h1>}
  />

  {/* PROTECTED ROUTES */}
  <Route
    element={
      <RoleRoute
        allowedRoles={["Student", "Instructor", "Admin"]}
      />
    }
  >
    <Route element={<DashboardLayout />}>
      {/* Student */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />
      <Route
        path="/my-learning"
        element={<MyLearning />}
      />
       <Route
        path="/browse-courses"
        element={<BrowseCourses />}
      />

      <Route
        path="/course/:courseId"
        element={<CoursePlayer />}
      />
     
<Route
  path="/course-preview/:courseId"
  element={<CoursePreview />}
/>
     
<Route path="/checkout/:courseId" element={<CheckoutPage />} />
    
    <Route path="/my-courses" element={<MyCourses />} />






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
        element={<CreateCourse/>}
      />
      
       <Route
        path="/revenue"
        element={<Revenue/>}
      />
       <Route
        path="/students"
        element={<Students/>}
      />
      <Route
        path="/analytics"
        element={<Analytics/>}
      />
      
      <Route
  path="/course-builder/:courseId"
  element={<CourseBuilder />}
/>
      <Route
  path="/add-subsection/:courseId/:sectionId"
  element={<CreateSubSection />}
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
