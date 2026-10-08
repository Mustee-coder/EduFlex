import React from "react";
import { motion } from "framer-motion";
import "@/index.css";
const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <>
     

      {/* Animated Background */}
      <div className="auth-background">
        <div className="blob" />
        <div className="blob" />
        <div className="blob" />
      </div>

      {/* Main Container */}
      <div className="auth-root min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 md:py-0 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="auth-card w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8"
        >
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10">
            
            {/* Logo */}
            <motion.div
              className="logo-float flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg">
                <span className="auth-title text-white font-black text-2xl sm:text-3xl">
                  E
                </span>
              </div>
            </motion.div>

            {/* Brand Name */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="auth-title text-3xl sm:text-4xl font-black text-gray-900"
            >
              EduFlex
            </motion.h1>

            {/* Page Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="auth-title text-xl sm:text-2xl font-bold text-gray-900 mt-4 sm:mt-6"
            >
              {title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed"
            >
              {subtitle}
            </motion.p>
          </div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {children}
          </motion.div>

          {/* Footer Accent */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-xs sm:text-xs text-gray-500 leading-relaxed">
              Your learning platform for success 🚀
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AuthLayout;
