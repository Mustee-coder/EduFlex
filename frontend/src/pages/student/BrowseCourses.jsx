import React, { useState } from "react";
import { useGetAllCourses } from "@/hooks/useGetAllCourses";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Star, Users, Clock, Filter, X, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import "@/index.css";
import { CourseSkeleton } from "@/components/skeletons/student";




const BrowseCourses = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data, isLoading } = useGetAllCourses(page, search, category, sortBy);

  const courses = data?.data || [];
  const pagination = data?.pagination;

  const categories = [
    { id: "all", label: "All Courses" },
    { id: "programming", label: "Programming" },
    { id: "design", label: "Design" },
    { id: "business", label: "Business" },
    { id: "personal", label: "Personal Development" },
  ];

  const sortOptions = [
    { id: "newest", label: "Newest" },
    { id: "popular", label: "Most Popular" },
    { id: "rating", label: "Highest Rated" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
  ];

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
   
   
      <div className="browse-root bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <h1 className="browse-title text-3xl sm:text-4xl font-bold text-gray-900">
                  Explore Courses
                </h1>
                <p className="text-gray-600 mt-1">
                  Discover thousands of courses to advance your skills
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search courses by name, topic, or instructor..."
                  className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm sm:text-base"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-gray-700 font-semibold hover:text-indigo-600 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  {showFilters ? "Hide" : "Show"} Filters
                </button>
                <span className="text-sm text-gray-600">
                  {pagination?.total || 0} courses found
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Filters Sidebar */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="filter-panel lg:col-span-1 space-y-6"
              >
                {/* Category Filter */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="browse-title font-bold text-gray-900 mb-4">
                    Category
                  </h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategory(cat.id);
                          setPage(1);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium text-sm ${
                          category === cat.id
                            ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="browse-title font-bold text-gray-900 mb-4">
                    Sort By
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 font-medium text-sm"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {(search || category !== "all" || sortBy !== "newest") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                      setSortBy("newest");
                      setPage(1);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2.5 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}

            {/* Courses Grid */}
            <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
              {isLoading ? (
                // Loading Skeleton
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CourseSkeleton key={i} />
                  ))}
                </div>
              ) : courses.length === 0 ? (
                // Empty State
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
                >
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="browse-title text-xl font-bold text-gray-900 mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                      setSortBy("newest");
                      setPage(1);
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    <X className="w-4 h-4" />
                    Reset Filters
                  </button>
                </motion.div>
              ) : (
                // Courses Grid
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course, index) => (
                    <motion.div
                      key={course._id || course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/course-preview/${course._id}`}
                        className="block h-full group"
                      >
                        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100">
                          
                          {/* Thumbnail */}
                          <div className="h-48 sm:h-56 overflow-hidden relative bg-gradient-to-br from-indigo-500 to-purple-500">
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

                            {/* Badges */}
                            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                              {course.rating >= 4.5 && (
                                <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                                  ⭐ Bestseller
                                </span>
                              )}
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                              <p className="text-white font-bold text-sm">
                                View Details →
                              </p>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-1 flex flex-col space-y-3">
                            
                            {/* Title */}
                            <h2 className="browse-title font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                              {course.courseName}
                            </h2>

                            {/* Instructor */}
                            <p className="text-xs text-gray-600">
                              by{" "}
                              <span className="font-semibold text-gray-900">
                                {course.instructor?.firstName || "Instructor"}{" "}
                                {course.instructor?.lastName || ""}
                              </span>
                            </p>

                            {/* Description */}
                            <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                              {course.courseDescription || "No description available"}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-xs text-gray-600 pt-2 border-t border-gray-100">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-semibold text-gray-900">
                                  {course.rating || 4.2}
                                </span>
                                <span className="text-gray-500">
                                  ({course.reviewsCount || 0})
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{course.studentsEnrolled || 0}</span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="pt-3 border-t border-gray-100">
                              <p className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                ₦{(course.amount || course.price || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {courses.length > 0 && pagination && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 flex items-center justify-center gap-2"
                >
                  <button
                    disabled={page === 1 || isLoading}
                    onClick={() => setPage(page - 1)}
                    className="p-2 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, pagination.pages) }).map(
                      (_, i) => {
                        const pageNum =
                          pagination.pages > 5
                            ? Math.max(1, page - 2) + i
                            : i + 1;
                        if (pageNum > pagination.pages) return null;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-bold transition-all ${
                              page === pageNum
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                                : "border-2 border-gray-200 text-gray-700 hover:border-indigo-500"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    disabled={page === pagination.pages || isLoading}
                    onClick={() => setPage(page + 1)}
                    className="p-2 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <span className="text-sm text-gray-600 ml-4">
                    Page {pagination.page || 1} of {pagination.pages || 1}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default BrowseCourses;
