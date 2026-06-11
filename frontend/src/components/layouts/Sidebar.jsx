import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Sidebar = ({ closeSidebar }) => {
  const { user } = useAuth();

  const role = user?.accountType || user?.role || user?.type;

  const linkStyle = ({ isActive }) =>
    isActive
      ? "bg-purple-600 text-white px-4 py-2 rounded-lg block"
      : "text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg block";

  return (
    <aside>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-600">EduFlex</h1>
        <p className="text-sm text-gray-500 mt-1">{role}</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {role === "Student" && (
          <NavLink to="/dashboard" onClick={closeSidebar} className={linkStyle}>
            🏠 Dashboard
          </NavLink>
        )}

        {role === "Instructor" && (
          <NavLink to="/instructor" onClick={closeSidebar} className={linkStyle}>
            🎓 Instructor Dashboard
          </NavLink>
        )}

        {role === "Admin" && (
          <NavLink to="/admin" onClick={closeSidebar} className={linkStyle}>
            ⚙️ Admin Dashboard
          </NavLink>
        )}

        <NavLink to="/courses" onClick={closeSidebar} className={linkStyle}>
          📚 My Courses
        </NavLink>

        <NavLink to="/profile" onClick={closeSidebar} className={linkStyle}>
          👤 Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;