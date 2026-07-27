import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMyLearning } from "@/hooks/useMyLearning";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Play,
  CheckCircle2,
  BookOpen,
  Clock,
  AlertCircle,
  Loader,
  TrendingUp,
  Award,
  ArrowRight,
} from "lucide-react";

// Loading Skeleton
const CourseSkeleton = () => (
  <motion.div className="bg-white rounded-2xl overflow-hidden shadow animate-pulse">
    <div className="h-48 bg-gray-300" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-10 bg-gray-300 rounded" />
    </div>
  </motion.div>
);

const MyLearning = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useMyLearning();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("progress");

  const courses = data?.data || [];

  // Filter and search logic
  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch = course.courseName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const progress = course.progress?.progressPercent ?? course.progressPercentage ?? 0;
      const matchesFilter =
        filterStatus === "all"
          ? true
          : filterStatus === "completed"
          ? progress === 100
          : filterStatus === "inprogress"
          ? progress > 0 && progress < 100
          : progress === 0;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const progressA = a.progress?.progressPercent ?? a.progressPercentage ?? 0;
      const progressB = b.progress?.progressPercent ?? b.progressPercentage ?? 0;

      if (sortBy === "progress") return progressB - progressA;
      if (sortBy === "name")
        return a.courseName.localeCompare(b.courseName);
      return 0;
    });

  // Loading state
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

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-red-100"
        >
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to Load Courses
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Please try refreshing the page
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all"
          >
            Refresh
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');

        .mylearning-root {
          font-family: 'Poppins', sans-serif;
        }

        .mylearning-title {
          font-family: 'Syne', sans-serif;
        }
      `}</style>

      <div className="mylearning-root bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="mylearning-title text-4xl md:text-5xl font-bold text-gray-900">
                  My Learning
                </h1>
                <p className="text-gray-600 mt-2">
                  {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/browse-courses")}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
              >
                <BookOpen className="w-5 h-5" />
                Browse Courses
              </motion.button>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all appearance-none bg-white"
              >
                <option value="all">All Courses</option>
                <option value="completed">Completed</option>
                <option value="inprogress">In Progress</option>
                <option value="notstarted">Not Started</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all appearance-none bg-white"
              >
                <option value="progress">Progress</option>
                <option value="name">Name</option>
              </select>
            </div>
          </motion.div>

          {/* Empty State */}
          {courses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="mylearning-title text-2xl font-bold text-gray-900 mb-2">
                No Courses Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start your learning journey by enrolling in a course
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/browse-courses")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
              >
                <Play className="w-5 h-5" />
                Explore Courses
              </motion.button>
            </motion.div>
          ) : filteredCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
            >
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <CourseSkeleton key={i} />
                  ))
                : filteredCourses.map((course, index) => {
                    const progress =
                      course.progress?.progressPercent ??
                      course.progressPercentage ??
                      0;
                    const isCompleted = progress === 100;

                    return (
                      <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden group border border-gray-100"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-500">
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

                          {/* Completion Badge */}
                          {isCompleted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Completed
                            </motion.div>
                          )}

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                            {!isCompleted && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="bg-white text-emerald-600 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Play className="w-6 h-6" />
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                          
                          {/* Title */}
                          <h3 className="mylearning-title text-lg font-bold text-gray-900 line-clamp-2">
                            {course.courseName}
                          </h3>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-gray-600">
                                Progress
                              </p>
                              <p className="text-xs font-bold text-emerald-600">
                                {progress}%
                              </p>
                            </div>

                            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full"
                              />
                            </div>
                          </div>

                          {/* Stats */}
                          {progress > 0 && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                              <Clock className="w-4 h-4" />
                              <span>Keep learning!</span>
                            </div>
                          )}

                          {/* CTA Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/course/${course._id}`)}
                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Review Course
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4" />
                                Continue Learning
                              </>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyLearning;
