import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { roleTheme } from "@/utils/roleTheme";
import useClickOutside from "@/hooks/useClickOutside";
import { motion, AnimatePresence } from "framer-motion";

const Topbar = ({ openSidebar }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const role = user?.accountType || user?.role || user?.type;
  const theme = roleTheme[role] || roleTheme.default;

  useClickOutside(dropdownRef, () => setOpen(false));

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  if (!user) return null;

  return (
    <header className="relative bg-white border-b px-4 py-3 flex justify-between items-center">

      {/* ROLE BAR */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`} />

      {/* MENU */}
      <button onClick={openSidebar} className="md:hidden text-2xl">
        ☰
      </button>

      {/* SEARCH */}
      <input
        placeholder="Search courses..."
        className="hidden md:block w-1/2 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200"
      />

      {/* RIGHT */}
      <div className="relative flex items-center gap-3">

        {/* ROLE BADGE */}
        <span className={`text-xs px-2 py-1 rounded-full ${theme.bg} text-white`}>
          {role || "User"}
        </span>

        {/* AVATAR */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="focus:outline-none"
        >
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
            className={`w-9 h-9 rounded-full border-2 ${theme.text} hover:scale-105 transition`}
          />
        </button>

        {/* DROPDOWN (ANIMATED) */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-52 bg-white border shadow-xl rounded-xl z-50 overflow-hidden"
            >
              {/* USER INFO */}
              <div className="p-3 border-b">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {/* ITEMS */}
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Profile
              </button>

              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Settings
              </button>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};

export default Topbar;