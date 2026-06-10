import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = () => {
  const { user, token, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || !token) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoute;



