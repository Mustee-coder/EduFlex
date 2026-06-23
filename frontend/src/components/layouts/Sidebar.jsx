import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { roleTheme } from "@/utils/roleTheme";
import { motion } from "framer-motion";

const Sidebar = ({ closeSidebar }) => {
  const { user } = useAuth();

  const role = user?.accountType || user?.role || user?.type;
  const theme = roleTheme[role] || roleTheme.default;

  const linkStyle = ({ isActive }) =>
    isActive
      ? `${theme.active} px-4 py-2 rounded-lg block shadow`
      : `text-gray-600 ${theme.hover} px-4 py-2 rounded-lg block`;

  const linksMap = {
    Student: [
      { path: "/dashboard", label: "🏠 Dashboard" },
      { path: "/my-courses", label: "📚 My Courses" },
      { path: "/my-learning", label: "🎓 My Learning" },
      { path: "/browse-courses", label: "🔍 Browse Courses" },
      { path: "/profile", label: "👤 Profile" },
    ],

    Instructor: [
  { path: "/instructor", label: "🎓 Dashboard" },
  { path: "/courses", label: "📚 My Courses" },
  { path: "/add-course", label: "➕ Create Course" },
  { path: "/analytics", label: "📊 Analytics" },
  { path: "/revenue", label: "💰 Revenue" },
  { path: "/students", label: "👨‍🎓 Students" },
],

    Admin: [
      { path: "/admin", label: "⚙️ Admin Dashboard" },
      { path: "/admin/users", label: "👥 Users" },
      { path: "/admin/courses", label: "📚 Courses" },
      { path: "/admin/settings", label: "⚙️ Settings" },
      { path: "/profile", label: "👤 Profile" },
    ],
  };

  const links = linksMap[role] || [];

  if (!user) return null;

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full flex flex-col bg-white shadow-lg p-4"
    >

      {/* HEADER */}
      <div
        className={`p-4 rounded-lg mb-6 bg-gradient-to-r ${theme.gradient} text-white`}
      >
        <h1 className="text-xl font-bold">EduFlex</h1>
        <p className="text-xs opacity-90">
          {theme.name} Panel
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={closeSidebar}
            className={linkStyle}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

    </motion.aside>
  );
};

export default Sidebar;