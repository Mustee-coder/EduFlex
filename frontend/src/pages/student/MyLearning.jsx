import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars -- Core ESLint does not count JSX member references.
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMyLearning } from "@/hooks/useMyLearning";
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
      <div className="mylearning-root student-page min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="student-heading">
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
                className="student-button-primary"
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
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500" aria-label="Search enrolled courses"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
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
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
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
              className="student-panel p-7 text-center sm:p-10"
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
              className="student-panel p-7 text-center sm:p-10"
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
                        className="student-course-card overflow-hidden transition-all duration-200"
                      >
                        {/* Thumbnail */}
                        <div className="student-course-image relative">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.courseName}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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

                            <div className="w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${course.courseName} progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
                              <div className="h-2.5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full rounded-full bg-indigo-600"
                              />
                              </div>
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
                          <Link
                            to={`/course/${course._id}`}
                            className="student-button-primary w-full"
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
                          </Link>
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
