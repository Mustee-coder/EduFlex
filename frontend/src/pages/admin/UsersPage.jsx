import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Users, GraduationCap } from "lucide-react";
import StudentsTable from "@/pages/admin/StudentsTable";
import InstructorsTable from "@/pages/admin/InstructorsTable";

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState("students");

  const tabs = [
    {
      id: "students",
      label: "Students",
      icon: Users,
      color: "from-blue-600 to-blue-500",
    },
    {
      id: "instructors",
      label: "Instructors",
      icon: GraduationCap,
      color: "from-emerald-600 to-teal-600",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen py-6 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');

        .admin-root {
          font-family: 'Poppins', sans-serif;
        }

        .admin-title {
          font-family: 'Syne', sans-serif;
        }
      `}</style>

      <div className="admin-root max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="admin-title text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-2">
                Manage students and instructors on EduFlex
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-2 sm:gap-4 border-b-2 border-gray-200 overflow-x-auto pb-2 sm:pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-bold rounded-t-xl transition-all whitespace-nowrap text-sm sm:text-base ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "students" && <StudentsTable />}
            {activeTab === "instructors" && <InstructorsTable />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UsersPage;
