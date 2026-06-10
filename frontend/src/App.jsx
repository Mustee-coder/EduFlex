import { Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import SendOtp from "@/pages/auth/SendOtp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";

import StudentDashboard from "@/pages/student/StudentDashboard";
import RoleRoute from "@/components/RoleRoute";

const App = () => {
return (
<Routes>

{/* DEFAULT ROUTE 
  <Route path="/" element={<Navigate to="/login" />} />  */}  

  {/* AUTH ROUTES */}  
  <Route path="/signup" element={<Signup />} />  
  <Route path="/verify-email" element={<VerifyEmail />} />  
  <Route path="/login" element={<Login />} />  
  <Route path="/forgot-password" element={<ForgotPassword />} />  
  <Route path="/send-otp" element={<SendOtp />} />  

  {/* STUDENT PROTECTED ROUTE   */}  
  <Route element={<RoleRoute allowedRoles={["Student"]} />}>  
    <Route path="/dashboard" element={<StudentDashboard />} />  
  </Route>

</Routes>

);
};

export default App;

