
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";


const Dashboard = () => {
const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div>

      <h1 className="text-3xl font-bold">
        Student Dashboard
      </h1>

      <p className="mt-2 text-gray-500">
        Welcome back
      </p>
      <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>

    </div>
  );
};

export default Dashboard;




