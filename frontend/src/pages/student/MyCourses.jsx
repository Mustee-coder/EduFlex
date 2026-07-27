import React, { useState } from "react";
import { useMyLearning } from "@/hooks/useMyLearning";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loading } from "@/components/Loader";
import { CourseSkeletons } from "@/components/skeletons/student";

import {
  Search,
  Filter,
  SortAsc,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  AlertCircle,
  Loader,
  TrendingUp,
  Star,
} from "lucide-react";
import "@/index.css";



const MyCourses = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useMyLearning();

  const courses = data?.data || [];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("progress");

  // Filter + Search
  const filteredCourses = courses.filter((course) => {
    const matchSearch =
      course.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      course.courseDescription?.toLowerCase().includes(search.toLowerCase());

    const progress =
      course.progress?.progressPercent ?? course.progressPercentage ?? 0;

    const matchFilter =
      filter === "all"
        ? true
        : filter === "completed"
        ? progress === 100
        : progress < 100;

    return matchSearch && matchFilter;
  });

  // Sort
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sort === "progress") {
      return (
        (b.progress?.progressPercent ?? b.progressPercentage ?? 0) -
        (a.progress?.progressPercent ?? a.progressPercentage ?? 0)
      );
    }

    if (sort === "name") {
      return a.courseName.localeCompare(b.courseName);
    }

    return 0;
  });

  // Loading State
  if (isLoading) {
    return <Loading />;
  }
  

  // Empty State
  if (!courses.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100"
        >
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Courses Yet
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't enrolled in any courses yet. Start learning today!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/browse-courses")}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold transition-all"
          >
            Browse Courses
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (

      <div className="mycourses-root bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="mycourses-title text-4xl md:text-5xl font-bold text-gray-900">
              My Courses
            </h1>
            <p className="text-gray-600 mt-2">
              {courses.length} enrolled • {sortedCourses.length} courses shown
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all appearance-none bg-white"
              >
                <option value="all">All Courses</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all appearance-none bg-white"
              >
                <option value="progress">By Progress</option>
                <option value="name">By Name</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="bg-white rounded-xl border-2 border-gray-200 px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {sortedCourses.length} courses
              </span>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
          </motion.div>

          {/* No Results */}
          {sortedCourses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
            >
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                  setSort("progress");
                }}
                className="inline-flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          {/* Courses Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CourseSkeletons key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCourses.map((course, index) => {
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
                    className="group h-full"
                  >
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
                      
                      {/* Thumbnail */}
                      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden">
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
                            className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Completed
                          </motion.div>
                        )}

                        {/* Progress Indicator */}
                        {!isCompleted && (
                          <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold">
                            {progress}%
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col space-y-3">
                        
                        {/* Title */}
                        <h2 className="mycourses-title font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {course.courseName}
                        </h2>

                        {/* Description */}
                        <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                          {course.courseDescription}
                        </p>

                        {/* Progress Section */}
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                            />
                          </div>

                          {/* Progress Text */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700">
                              {progress}% complete
                            </span>
                            {isCompleted ? (
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Done
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                In Progress
                              </span>
                            )}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/course/${course._id}`)}
                          className="w-full mt-2 bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 text-indigo-700 font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <Play className="w-4 h-4" />
                          {isCompleted ? "Review Course" : "Continue Learning"}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    
  );
};

export default MyCourses;
