import React from "react";
import { motion as Motion } from "framer-motion";
import { useAdminStats } from "@/hooks/admin/hooks";
import StatCard from "./component/StatCard";
import {
  Users,
  GraduationCap,
  BookOpen,
  Wallet,
  AlertCircle,
  Loader,
} from "lucide-react";


const AdminDashboard = () => {
  const { data, isLoading, isError, error } = useAdminStats();

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex flex-col items-center gap-4"
        >
          <Loader className="w-12 h-12 text-red-600" />
          <p className="text-lg font-semibold text-gray-700">
            Loading dashboard...
          </p>
        </Motion.div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-red-100"
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            {error?.message || "An error occurred while loading dashboard data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            Try Again
          </button>
        </Motion.div>
      </div>
    );
  }

  const stats = data?.data || {};

  const dashboardStats = [
    {
      title: "Total Students",
      value: stats.totalStudents || 0,
      icon: Users,
      color: "from-blue-600 to-blue-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Total Instructors",
      value: stats.totalInstructors || 0,
      icon: GraduationCap,
      color: "from-emerald-600 to-teal-600",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
    {
      title: "Total Courses",
      value: stats.totalCourses || 0,
      icon: BookOpen,
      color: "from-purple-600 to-pink-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: `₦${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: Wallet,
      color: "from-amber-600 to-orange-600",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
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
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex flex-col gap-2">
            <h1 className="admin-title text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Monitor and manage the EduFlex platform
            </p>
          </div>
        </Motion.div>

        {/* Stats Grid */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {dashboardStats.map((item, index) => (
            <Motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard
                title={item.title}
                value={item.value}
                icon={item.icon}
                color={item.color}
                bgColor={item.bgColor}
                textColor={item.textColor}
              />
            </Motion.div>
          ))}
        </Motion.div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
