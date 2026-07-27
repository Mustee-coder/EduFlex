import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "@/index.css";
import {
  Search, Bell, LogOut, Settings, User, Menu, X,
  ChevronDown, Loader
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { roleTheme } from "@/utils/roleTheme";

const Topbar = ({ openSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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
    } catch (err) {
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
        {/* Role gradient line */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`}
        />

        <div className="max-w-full px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-4">
          
          {/* Left Section - Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={openSidebar}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            {/* Logo (hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                <span className="topbar-title text-white font-black text-sm">LM</span>
              </div>
              <h1 className="topbar-title font-black text-lg text-gray-900">EduFlex</h1>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="search-input w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm font-medium border border-gray-200 focus:outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Right Section - Icons & Profile */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Notifications */}
            <button
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

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
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
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
                      alt={fullName}
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
                    className="dropdown-menu absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
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
