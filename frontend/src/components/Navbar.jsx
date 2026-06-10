import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const dropdownRef = useRef();
  const location = useLocation();

  const role = user?.accountType || "student";

  const dashboardRoutes = {
    admin: "/admin/dashboard",
    instructor: "/instructor/dashboard",
    teacher: "/instructor/dashboard",
    student: "/student/dashboard",
  };

  const dashboardLink = dashboardRoutes[role] || "/";

  const menuConfig = {
    admin: [
      { label: "Dashboard", path: "/admin/dashboard" },
      { label: "Users", path: "/admin/users" },
      { label: "Courses", path: "/admin/courses" },
    ],
    instructor: [
      { label: "Dashboard", path: "/instructor/dashboard" },
      { label: "My Courses", path: "/instructor/courses" },
      { label: "Create Course", path: "/instructor/create" },
    ],
    student: [
      { label: "Home", path: "/student/home" },
      { label: "My Courses", path: "/student/courses" },
    ],
  };

  const menuItems = menuConfig[role] || [];

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    document.body.className = dark
      ? "bg-gray-900 text-white"
      : "bg-white text-black";
  }, [dark]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="h-14 flex items-center justify-between px-4 border-b bg-white fixed top-0 left-0 w-full z-50">

        <Link to="/" className="font-bold text-lg">
          EduCareer
        </Link>

        <nav className="hidden md:flex gap-6 text-sm">
          <Link
            to={dashboardLink}
            className={isActive(dashboardLink) ? "font-bold underline" : ""}
          >
            Dashboard
          </Link>

          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={isActive(item.path) ? "font-bold underline" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">

          <button onClick={() => setDark(!dark)}>
            {dark ? "☀️" : "🌙"}
          </button>

          <div className="relative" ref={dropdownRef}>
            <img
              src={user?.image || "https://i.pravatar.cc/40"}
              className="w-9 h-9 rounded-full cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            <div className={`absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg transition
              ${dropdownOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>

              <div className="px-3 py-2 border-b">
                <p className="text-sm font-semibold">
                  {user?.firstName}
                </p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>

              <Link to={dashboardLink} className="block px-3 py-2 text-sm">
                Dashboard
              </Link>

              <Link to="/profile" className="block px-3 py-2 text-sm">
                Profile
              </Link>

              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 text-red-500 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;