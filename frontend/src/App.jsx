import { Routes, Route, Navigate } from "react-router-dom";
import RoleRoute from "@/components/RoleRoute";

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
import CourseDetails from "@/pages/student/CourseDetails";

// Instructor Pages
import InstructorDashboard from "@/pages/instructor/InstructorDashboard";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";

const App = () => {
return (
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
        path="/course/:courseId"
        element={<CourseDetails />}
      />

      {/* Instructor */}
      <Route
        path="/instructor"
        element={<InstructorDashboard />}
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={<AdminDashboard />}
      />
    </Route>
  </Route>
</Routes>

);
};

export default App;