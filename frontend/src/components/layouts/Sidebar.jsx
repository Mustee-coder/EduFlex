import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Zap,
  Search,
  BarChart3,
  Users,
  Plus,
  ChevronRight,
  FolderTree,
  Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const SidebarClean = ({ isOpen, closeSidebar }) => {
  const { user } = useAuth();

  if (!user) return null;

  const role = user?.accountType || user?.role || "Student";

  // Role themes
  const roleThemes = {
    Student: {
      gradient: "from-indigo-600 to-purple-600",
      active: "bg-indigo-100 text-indigo-700",
    },
    Instructor: {
      gradient: "from-emerald-600 to-teal-600",
      active: "bg-emerald-100 text-emerald-700",
    },
    Admin: {
      gradient: "from-red-600 to-pink-600",
      active: "bg-red-100 text-red-700",
    },
  };

  const theme = roleThemes[role] || roleThemes.Student;

  // Navigation links by role
  const navigationLinks = {
    Student: [
      {
        section: "Learning",
        links: [
          { path: "/dashboard", label: "Dashboard", icon: Home },
          { path: "/my-courses", label: "My Courses", icon: BookOpen },
          { path: "/my-learning", label: "Progress", icon: Zap },
          { path: "/browse-courses", label: "Explore", icon: Search },
        ],
      },
    ],

    Instructor: [
      {
        section: "Teaching",
        links: [
          { path: "/instructor", label: "Dashboard", icon: Home },
          { path: "/courses", label: "My Courses", icon: BookOpen },
          { path: "/add-course", label: "Create Course", icon: Plus },
        ],
      },
      {
        section: "Analytics",
        links: [
          { path: "/analytics", label: "Analytics", icon: BarChart3 },
          { path: "/students", label: "Students", icon: Users },
        ],
      },
    ],

    Admin: [
      {
        section: "Management",
        links: [
          { path: "/admin", label: "Dashboard", icon: Home },
          { path: "/admin/users", label: "Users", icon: Users },
          { path: "/admin/courses", label: "Courses", icon: BookOpen },
          {
            path: "/admin/categories",
            label: "Categories",
            icon: FolderTree,
          },
          { path: "/admin/reviews", label: "Reviews", icon: Star },
          { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
        ],
      },
    ],
  };

  const links = navigationLinks[role] || navigationLinks.Student;

  const handleNavClick = () => {
    closeSidebar?.();
  };

  // Helper component for individual nav links
  const NavLinkItem = ({ link }) => {
    const Icon = link.icon;

    return (
      <NavLink
        to={link.path}
        onClick={handleNavClick}
        className={({ isActive }) =>
          `nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            isActive
              ? `${theme.active} shadow-md`
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{link.label}</span>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');

        .sidebar-root {
          font-family: 'Poppins', sans-serif;
        }

        .sidebar-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
        }

        .nav-link {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: currentColor;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.3s ease;
        }

        .nav-link:hover::before {
          opacity: 0.05;
        }

        .nav-link.active {
          transform: translateX(4px);
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .sidebar-content {
          animation: slideIn 0.3s ease-out;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="sidebar-root fixed md:static top-16 md:top-0 left-0 z-40 w-72 h-[calc(100vh-4rem)] md:h-screen bg-white shadow-lg overflow-y-auto flex flex-col"
      >
        {/* Logo Section */}
        <div className="p-6 flex-shrink-0 border-b border-gray-100">
          <div
            className={`p-4 rounded-2xl bg-gradient-to-r ${theme.gradient} text-white`}
          >
            <h1 className="sidebar-title text-2xl font-black">EduFlex</h1>
            <p className="text-xs opacity-80 mt-1">Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-content flex-1 px-4 py-6 space-y-8 overflow-y-auto">
          {links.map((section, idx) => (
            <div key={idx} className="space-y-3">
              {/* Section Title */}
              <p className="section-title text-xs font-black text-gray-400 uppercase tracking-widest px-4">
                {section.section}
              </p>

              {/* Links */}
              <div className="space-y-2">
                {section.links.map((link) => (
                  <NavLinkItem key={link.path} link={link} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-shrink-0 h-4" />
      </motion.aside>
    </>
  );
};

export default SidebarClean;
