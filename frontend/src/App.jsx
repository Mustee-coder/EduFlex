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

// Pages
import Dashboard from "@/pages/student/Dashboard";
import InstructorDashboard from "@/pages/instructor/InstructorDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";

const App = () => {
  return (
    <Routes>

      {/* AUTH ROUTES */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/send-otp" element={<SendOtp />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* UNAUTHORIZED */}
      <Route path="/unauthorized" element={<h1>Access Denied 🚫</h1>} />

      {/* PROTECTED DASHBOARD AREA (WITH LAYOUT + ROLES) */}
      <Route
        element={
          <RoleRoute allowedRoles={["Student", "Admin", "Instructor"]} />
        }
      >
        <Route element={<DashboardLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/instructor" element={<InstructorDashboard />} />

        </Route>
      </Route>

      {/* DEFAULT ROUTE */}
      <Route path="/" element={<Navigate to="/login" replace />} />

    </Routes>
  );
};

export default App;