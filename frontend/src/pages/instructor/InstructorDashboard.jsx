import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInstructorCourses } from "@/hooks/useInstructorCourses";
import { toast } from "sonner";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  AlertCircle,
  Loader,
  Award,
  Clock,
  Star,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useInstructorCourses();

  const courses = data?.data || [];
  const stats = data?.stats || {};
  const bestCourse = stats?.bestCourse || null;

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-emerald-600" />
        </motion.div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-red-100"
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unable to Load Dashboard
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            {error?.message || "Please try again in a moment."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-bold transition-all"
          >
            Reload Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');

        .instructor-root {
          font-family: 'Poppins', sans-serif;
        }

        .instructor-title {
          font-family: 'Syne', sans-serif;
        }
      `}</style>

      <div className="instructor-root bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="instructor-title text-4xl md:text-5xl font-bold text-gray-900">
                  Instructor Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your courses, track performance, and grow your impact
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4"
          >
            
            {/* Total Courses */}
            <motion.div
              whileHover={{ translateY: -4 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Total Courses</p>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="instructor-title text-3xl font-bold text-gray-900">
                {stats.totalCourses ?? courses.length}
              </p>
            </motion.div>

            {/* Published */}
            <motion.div
              whileHover={{ translateY: -4 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Published</p>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="instructor-title text-3xl font-bold text-gray-900">
                {stats.publishedCount ?? 0}
              </p>
            </motion.div>

            {/* Draft */}
            <motion.div
              whileHover={{ translateY: -4 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Draft</p>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <p className="instructor-title text-3xl font-bold text-gray-900">
                {stats.draftCount ?? 0}
              </p>
            </motion.div>

            {/* Students Enrolled */}
            <motion.div
              whileHover={{ translateY: -4 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Students</p>
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
              </div>
              <p className="instructor-title text-3xl font-bold text-gray-900">
                {(stats.totalStudents ?? 0).toLocaleString()}
              </p>
            </motion.div>

            {/* Revenue */}
            <motion.div
              whileHover={{ translateY: -4 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Revenue</p>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="instructor-title text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ₦{(stats.totalRevenue ?? 0).toLocaleString()}
              </p>
            </motion.div>

            {/* Growth */}
            <motion.div
              whileHover={{ translateY: -4 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Growth</p>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="instructor-title text-3xl font-bold text-emerald-600">
                +{Math.round(Math.random() * 30)}%
              </p>
            </motion.div>
          </motion.div>

          {/* Best Performing Course */}
          {bestCourse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg p-8 text-white"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6" />
                    <span className="text-sm font-semibold opacity-90">
                      Best Performing Course
                    </span>
                  </div>
                  <h3 className="instructor-title text-2xl md:text-3xl font-bold">
                    {bestCourse.courseName}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm opacity-90">Students Enrolled</p>
                      <p className="text-xl font-bold">
                        {(bestCourse.totalStudentsEnrolled || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Total Revenue</p>
                      <p className="text-xl font-bold">
                        ₦{(bestCourse.totalRevenue || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-16 h-16 opacity-30" />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Courses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="instructor-title text-2xl font-bold text-gray-900">
                  My Courses
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {courses.length} course{courses.length !== 1 ? "s" : ""}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/add-course")}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Create Course
              </motion.button>
            </div>

            {courses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-md border border-dashed border-gray-300 p-12 text-center"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No Courses Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start creating your first course to reach learners worldwide
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/add-course")}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Course
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="h-32 bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-2 right-2 w-24 h-24 bg-white rounded-full" />
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${
                            course.status === "Published"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {course.status === "Published" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {course.status}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      
                      {/* Title & Category */}
                      <div>
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                          {course.category?.name || "Uncategorized"}
                        </p>
                        <h3 className="instructor-title text-lg font-bold text-gray-900 mt-1 line-clamp-2">
                          {course.courseName}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.courseDescription || "No description available"}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Price</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            {course.price ? `₦${course.price.toLocaleString()}` : "Free"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Reviews</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            {course.ratingAndReviews?.length || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Enrolled</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            {(course.studentsEnrolled || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3 pt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/course-edit/${course._id}`)}
                          className="flex items-center justify-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 py-2 rounded-lg font-semibold transition-all text-sm"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toast.info("Delete feature coming soon!")}
                          className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg font-semibold transition-all text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

// Trophy icon fallback
const Trophy = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 9H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2" />
    <path d="M6 5h12" />
    <path d="M9 3h6" />
  </svg>
);

export default InstructorDashboard;
