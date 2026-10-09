import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "@/index.css";
import {
  Search, LogOut, Settings, User, Menu, X,
  ChevronDown, Loader
} from "lucide-react";
import { useAuth } from "@/context/useAuth";
import { toast } from "sonner";
import { roleTheme } from "@/utils/roleTheme";

const Topbar = ({ openSidebar, isSidebarOpen, menuButtonRef }) => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Role theme colors
  

  const role = user?.accountType || user?.role || "Student";
  const theme = roleTheme[role] || roleTheme.Student;
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Handlers
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully 👋");
      setIsDropdownOpen(false);
      navigate("/login");
    } catch {
      toast.error("Failed to logout");
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/browse-courses?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  if (!user) return null;

  return (
    <>
     

      <header className="topbar-root sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-4">
          
          {/* Left Section - Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={openSidebar}
              className="md:hidden inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100"
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
              aria-expanded={Boolean(isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
            </button>

            {/* Logo (hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                <span className="topbar-title text-white font-bold text-sm">EF</span>
              </div>
              <h1 className="topbar-title font-black text-lg text-gray-900">EduFlex</h1>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                aria-label="Search courses"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="search-input w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm font-medium border border-gray-200 focus:outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Right Section - Icons & Profile */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Role Badge */}
            <span
              className={`hidden sm:inline-block text-xs font-bold px-3 py-1.5 rounded-full ${theme.bg} text-white`}
            >
              {role}
            </span>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className="flex min-h-11 items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100"
                type="button"
                aria-label="Open account menu"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-controls={isDropdownOpen ? "account-menu" : undefined}
              >
                {isLoading ? (
                  <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                ) : (
                  <>
                    <img
                      src={
                        user?.image ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`
                      }
                      alt={fullName ? `${fullName} profile` : "Account profile"}
                      className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-gray-200 hover:border-indigo-500 transition-colors"
                    />
                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 hidden md:block transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    id="account-menu"
                    className="dropdown-menu absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                  >
                    {/* User Info */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                      <p className="topbar-title font-bold text-gray-900 text-sm">
                        {fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">{user?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {role} Account
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-3"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>

                      <button
                        onClick={() => handleNavigation("/settings")}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-3"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Topbar;
