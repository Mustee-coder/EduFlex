import React from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useInstructorCourses } from "@/hooks/useInstructorCourses";
import {
  BookOpen,
  Users,
  DollarSign,
  Plus,
  AlertCircle,
  Loader,
  Award,
  Clock,
  Edit3,
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-[#6C5CE7]" />
        </Motion.div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Motion.div
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
            className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#8577F4] hover:from-[#5749C8] hover:to-[#7464E8] text-white py-3 rounded-xl font-bold transition-all"
          >
            Reload Dashboard
          </button>
        </Motion.div>
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

      <div className="instructor-root min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 md:py-8">
        
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#F0EDFF] rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#6C5CE7]" />
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
          </Motion.div>

          {/* Stats Grid */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
          >
            
            {/* Total Courses */}
            <Motion.div
              whileHover={{ translateY: -4 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Total Courses</p>
                <div className="w-10 h-10 bg-[#F0EDFF] rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#6C5CE7]" />
                </div>
              </div>
              <p className="instructor-title text-3xl font-bold text-gray-900">
                {stats.totalCourses ?? courses.length}
              </p>
            </Motion.div>

            {/* Published */}
            <Motion.div
              whileHover={{ translateY: -4 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Published</p>
                <div className="w-10 h-10 bg-[#F0EDFF] rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#6C5CE7]" />
                </div>
              </div>
              <p className="instructor-title text-3xl font-bold text-gray-900">
                {stats.publishedCount ?? 0}
              </p>
            </Motion.div>

            {/* Draft */}
            <Motion.div
              whileHover={{ translateY: -4 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
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
            </Motion.div>

            {/* Students Enrolled */}
            <Motion.div
              whileHover={{ translateY: -4 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Course enrollments</p>
                <div className="w-10 h-10 bg-[#F0EDFF] rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#6C5CE7]" />
                </div>
              </div>
              <p className="instructor-title text-3xl font-bold text-gray-900">
                {(stats.totalStudents ?? 0).toLocaleString()}
              </p>
            </Motion.div>

            {/* Revenue */}
            <Motion.div
              whileHover={{ translateY: -4 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Estimated revenue</p>
                <div className="w-10 h-10 bg-[#F0EDFF] rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#6C5CE7]" />
                </div>
              </div>
              <p className="instructor-title text-3xl font-bold bg-gradient-to-r from-[#6C5CE7] to-[#8577F4] bg-clip-text text-transparent">
                ₦{(stats.totalRevenue ?? 0).toLocaleString()}
              </p>
            </Motion.div>

          </Motion.div>

          {/* Best Performing Course */}
          {bestCourse && (
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EDFF] text-[#6C5CE7]"><Award className="w-5 h-5" /></span>
                    <span className="text-sm font-semibold text-slate-500">
                      Best Performing Course
                    </span>
                  </div>
                  <h3 className="instructor-title text-2xl md:text-3xl font-bold">
                    {bestCourse.courseName}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm opacity-90">Course enrollments</p>
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
                <Motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-10 h-10 text-[#6C5CE7]" />
                </Motion.div>
              </div>
            </Motion.div>
          )}

          {/* Courses Section */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="instructor-title text-2xl font-bold text-gray-900">
                  My Courses
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {courses.length} course{courses.length !== 1 ? "s" : ""}
                </p>
              </div>

              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/add-course")}
                className="flex items-center gap-2 bg-gradient-to-r from-[#6C5CE7] to-[#8577F4] hover:from-[#5749C8] hover:to-[#7464E8] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Create Course
              </Motion.button>
            </div>

            {courses.length === 0 ? (
              <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-md border border-dashed border-gray-300 p-12 text-center"
              >
                <div className="w-16 h-16 bg-[#F0EDFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-[#6C5CE7]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No Courses Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start creating your first course to reach learners worldwide
                </p>
                <Motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/add-course")}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6C5CE7] to-[#8577F4] hover:from-[#5749C8] hover:to-[#7464E8] text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Course
                </Motion.button>
              </Motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course, index) => (
                  <Motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {/* Card Header */}
                    <div className="relative h-40 overflow-hidden bg-[#F0EDFF]">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.courseName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#6C5CE7]"><BookOpen className="h-10 w-10" /></div>
                      )}
                      
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
                        <p className="text-xs font-semibold text-[#6C5CE7] uppercase tracking-wide">
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
                            {(course.studentsCount ?? course.studentsEnrolled?.length ?? 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4">
                        <Motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/course-builder/${course._id}`)}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6C5CE7] py-2.5 font-semibold text-white transition-colors hover:bg-[#5749C8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7] focus-visible:ring-offset-2 text-sm"
                        >
                          <Edit3 className="w-4 h-4" />
                          Manage course
                        </Motion.button>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </div>
            )}
          </Motion.div>
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
