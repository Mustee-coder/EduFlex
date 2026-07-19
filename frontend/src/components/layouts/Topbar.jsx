import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { roleTheme } from "@/utils/roleTheme";
import useClickOutside from "@/hooks/useClickOutside";

const Topbar = ({ openSidebar }) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const role =
    user?.accountType ||
    user?.role ||
    user?.type;

  const theme =
    roleTheme[role] || roleTheme.default;

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`;

  useClickOutside(dropdownRef, () => setOpen(false));

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  if (!user) return null;

  return (
    <header className="relative bg-white border-b px-4 py-3 flex items-center justify-between">

      {/* Role Gradient */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`}
      />

      {/* Mobile Menu */}
      <button
        onClick={openSidebar}
        className="md:hidden text-2xl"
      >
        ☰
      </button>

      {/* Search */}
      <input
        type="text"
        placeholder="Search courses..."
        className="hidden md:block w-1/2 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200"
      />

      {/* Right */}
      <div className="relative flex items-center gap-3">

        {/* Role Badge */}
        <span
          className={`text-xs px-2 py-1 rounded-full ${theme.bg} text-white`}
        >
          {role || "User"}
        </span>

        {/* Avatar */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="focus:outline-none"
        >
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`}
            alt="Avatar"
            className={`w-10 h-10 rounded-full border-2 ${theme.text} hover:scale-105 transition`}
          />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={dropdownRef}
              initial={{
                opacity: 0,
                y: -10,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.95,
              }}
              transition={{
                duration: 0.15,
              }}
              className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-xl shadow-xl overflow-hidden z-50"
            >
              {/* User Info */}
              <div className="p-4 border-b">
                <p className="font-semibold text-sm">
                  {fullName}
                </p>

                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>

              {/* Profile */}
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
              >
                👤 Profile
              </button>

              {/* Settings */}
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/settings");
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
              >
                ⚙️ Settings
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition"
              >
                🚪 Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};

export default Topbar;