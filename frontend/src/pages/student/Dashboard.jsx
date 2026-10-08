import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserDetails, useEnrolledCourses } from "@/hooks/useProfile";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { BookOpen, CheckCircle2, TrendingUp, ArrowRight, Play, AlertCircle, Search } from "lucide-react";
import "@/index.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } =
    useUserDetails();

  const {
    data: courses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useEnrolledCourses();

  const loading = userLoading || coursesLoading;
  const error = userError || coursesError;

  const enrolledCourses = courses?.data || [];

  // Smart sort (in-progress first)
  const sortedCourses = [...enrolledCourses].sort((a, b) => {
    const aProgress = a.progress?.progressPercent ?? a.progressPercentage ?? 0;
    const bProgress = b.progress?.progressPercent ?? b.progressPercentage ?? 0;
    return bProgress - aProgress;
  });

  // Stats
  const completedCount = enrolledCourses.filter(
    (c) => (c.progress?.progressPercent ?? c.progressPercentage ?? 0) === 100
  ).length;

  const avgProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce(
            (acc, c) => acc + (c.progress?.progressPercent ?? c.progressPercentage ?? 0),
            0
          ) / enrolledCourses.length
        )
      : 0;

  // Loading
  if (loading) return <DashboardSkeleton />;

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Something went wrong ⚠️
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            We couldn't load your courses. Please try again.
          </p>
          <div className="mb-6 rounded-lg bg-gray-100 p-3 text-left text-xs text-gray-800">
            <p className="mb-2 font-bold">DEBUG: Query errors</p>
            {userError && (
              <pre className="mb-3 whitespace-pre-wrap break-words">
                {`userError: ${JSON.stringify(
                  {
                    status: userError.response?.status,
                    message: userError.message,
                    data: userError.response?.data,
                  },
                  null,
                  2
                )}`}
              </pre>
            )}
            {coursesError && (
              <pre className="whitespace-pre-wrap break-words">
                {`coursesError: ${JSON.stringify(
                  {
                    status: coursesError.response?.status,
                    message: coursesError.message,
                    data: coursesError.response?.data,
                  },
                  null,
                  2
                )}`}
              </pre>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      

      <div className="dashboard-root bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="dashboard-title text-3xl sm:text-4xl font-bold text-gray-900">
                Welcome back 👋
              </h1>
              <p className="text-gray-600 mt-2">
                {user?.data?.firstName ? `${user.data.firstName}, ` : ""}continue your learning journey
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/browse-courses")}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
            >
              <Search className="w-4 h-4" />
              Browse Courses
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {/* Enrolled Card */}
          <motion.div
            whileHover={{ translateY: -4 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Enrolled Courses</p>
                <h3 className="dashboard-title text-3xl font-bold text-gray-900 mt-2">
                  {enrolledCourses.length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </motion.div>

          {/* Completed Card */}
          <motion.div
            whileHover={{ translateY: -4 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <h3 className="dashboard-title text-3xl font-bold text-gray-900 mt-2">
                  {completedCount}
                </h3>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          {/* Progress Card */}
          <motion.div
            whileHover={{ translateY: -4 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Progress</p>
                <h3 className="dashboard-title text-3xl font-bold text-gray-900 mt-2">
                  {avgProgress}%
                </h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Continue Learning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          <div className="mb-6">
            <h2 className="dashboard-title text-2xl font-bold text-gray-900">
              Continue Learning 🚀
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Pick up where you left off
            </p>
          </div>

          {sortedCourses.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="dashboard-title text-xl font-bold text-gray-900 mb-2">
                No courses yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-xs mx-auto">
                Start learning today by exploring our collection of courses
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/browse-courses")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
              >
                <Search className="w-4 h-4" />
                Explore Courses
              </motion.button>
            </motion.div>
          ) : (
            // Course Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full"
                >
                  <Link
                    to={`/course/${course._id}`}
                    className="block h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 group"
                  >
                    {/* Course Banner/Thumbnail */}
                    <div className="h-40 sm:h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.courseName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-white opacity-50" />
                        </div>
                      )}

                      {/* Resume Badge */}
                      {course.lastWatched && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" />
                          Resume
                        </motion.div>
                      )}

                      {/* Play Icon Overlay */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ArrowRight className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-5 space-y-4">
                      {/* Title */}
                      <div>
                        <h3 className="dashboard-title font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {course.courseName}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {course.courseDescription || "No description available"}
                      </p>

                      {/* Progress Section */}
                      <div className="space-y-2">
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${course.progress?.progressPercent ?? course.progressPercentage ?? 0}%`,
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                          />
                        </div>

                        {/* Progress Text */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">
                            {course.progress?.progressPercent ?? course.progressPercentage ?? 0}% completed
                          </span>

                          {(course.progress?.progressPercent ?? course.progressPercentage ?? 0) === 100 ? (
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Complete
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-indigo-600">In Progress</span>
                          )}
                        </div>
                      </div>

                      {/* Continue Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full mt-2 bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 text-indigo-700 font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <Play className="w-3 h-3" />
                        Continue
                      </motion.button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;
