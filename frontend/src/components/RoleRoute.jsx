import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RoleRoute = ({ allowedRoles }) => {
  const { user, token, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.accountType;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;