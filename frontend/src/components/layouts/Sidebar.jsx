import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Sidebar = ({ closeSidebar }) => {
  const { user } = useAuth();

  const role = user?.accountType || user?.role || user?.type;

  const linkStyle = ({ isActive }) =>
    isActive
      ? "bg-purple-600 text-white px-4 py-2 rounded-lg block"
      : "text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg block";

  const studentLinks = [
  { path: "/dashboard", label: "🏠 Dashboard" },
  { path: "/my-courses", label: "📚 my Courses" },
  { path: "/my-learning", label: "🎓 My Learning" },
  { path: "/browse-courses", label: "🔍 Browse Courses" },
  { path: "/profile", label: "👤 Profile" },
];

  const instructorLinks = [
    { path: "/instructor", label: "🎓 Instructor Dashboard" },
    { path: "/courses", label: "📚 My Courses" },
    { path: "/profile", label: "👤 Profile" },
  ];

  const adminLinks = [
    { path: "/admin", label: "⚙️ Admin Dashboard" },
    { path: "/admin/users", label: "👥 Users" },
    { path: "/admin/courses", label: "📚 Courses" },
    { path: "/admin/settings", label: "⚙️ Settings" },
    { path: "/profile", label: "👤 Profile" },
  ];

  const links =
    role === "Student"
      ? studentLinks
      : role === "Instructor"
      ? instructorLinks
      : role === "Admin"
      ? adminLinks
      : [];

  return (
    <aside>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-600">EduFlex</h1>
        <p className="text-sm text-gray-500 mt-1">{role}</p>
      </div>

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
    </aside>
  );
};

export default Sidebar;
