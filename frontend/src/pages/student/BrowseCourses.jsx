import React, { useState } from "react";
import { useGetAllCourses } from "@/hooks/useGetAllCourses";
import { Link, useSearchParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Search, X, ChevronLeft, ChevronRight, BookOpen, AlertCircle } from "lucide-react";
import "@/index.css";
import { CourseSkeleton } from "@/components/skeletons/student";




const BrowseCourses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const [sortBy, setSortBy] = useState("newest");

  const { data, isLoading, isFetching, isError } = useGetAllCourses(page);

  const courses = data?.data || [];
  const pagination = data?.pagination;
  const filteredCourses = courses.filter((course) =>
    `${course.courseName || ""} ${course.courseDescription || ""} ${course.instructor?.firstName || ""} ${course.instructor?.lastName || ""}`
      .toLowerCase().includes(search.trim().toLowerCase())
  );
  const visibleCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "price-low") return Number(a.price || 0) - Number(b.price || 0);
    if (sortBy === "price-high") return Number(b.price || 0) - Number(a.price || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const handleSearch = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("search", value); else next.delete("search");
    next.delete("page");
    setSearchParams(next, { replace: true });
  };
  const handlePageChange = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage > 1) next.set("page", String(nextPage)); else next.delete("page");
    setSearchParams(next);
  };

  return (
   
   
      <div className="browse-root student-page min-h-screen bg-slate-50">
        
        {/* Header */}
        <motion .div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-slate-200 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <h1 className="browse-title text-3xl sm:text-4xl font-bold text-gray-900">
                  Explore courses
                </h1>
                <p className="mt-2 text-sm text-slate-600">Find a course that fits what you want to learn.</p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search this page by course or instructor..."
                  aria-label="Search courses on this page"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-slate-600" aria-live="polite">{pagination?.total || 0} courses available · showing {visibleCourses.length} on this page</span>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">Sort this page
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500">
                    <option value="newest">Newest</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </motion .div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
              {isLoading ? (
                // Loading Skeleton
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CourseSkeleton key={i} />
                  ))}
                </div>
              ) : isError ? (
                <div className="student-panel flex items-start gap-3 p-6" role="alert"><AlertCircle className="mt-0.5 text-rose-600"/><div><h2 className="font-semibold text-slate-900">Courses couldn’t load</h2><p className="mt-1 text-sm text-slate-600">Please refresh and try again.</p><button type="button" onClick={() => window.location.reload()} className="student-button-secondary mt-4">Try again</button></div></div>
              ) : visibleCourses.length === 0 ? (
                // Empty State
                <motion .div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
                >
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="browse-title text-xl font-semibold text-gray-900 mb-2">
                    {search ? "No matching courses" : "No courses available"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {search ? "Try a different course or instructor name." : "Please check back later."}
                  </p>
                  <button
                    onClick={() => {
                      setSortBy("newest");
                      setSearchParams({}, { replace: true });
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    <X className="w-4 h-4" />
                    Reset Filters
                  </button>
                </motion .div>
              ) : (
                // Courses Grid
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleCourses.map((course, index) => (
                    <motion .div
                      key={course._id || course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/course-preview/${course._id}`}
                        className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      >
                        <div className="student-course-card h-full transition-all duration-200">
                          
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

                            {/* Price */}
                            <div className="pt-3 border-t border-gray-100">
                              <p className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                ₦{(course.amount || course.price || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion .div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {courses.length > 0 && pagination && (
                <motion .div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 flex items-center justify-center gap-2"
                >
                  <button
                    disabled={page === 1 || isFetching}
                    onClick={() => handlePageChange(page - 1)}
                    aria-label="Previous course page"
                    className="student-button-secondary min-w-11 px-3 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(3, pagination.pages) }).map(
                      (_, i) => {
                        const startPage = Math.min(Math.max(1, page - 1), pagination.pages - Math.min(3, pagination.pages) + 1);
                        const pageNum = startPage + i;
                        if (pageNum > pagination.pages) return null;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`min-h-11 min-w-11 rounded-lg font-semibold transition-all ${
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
                    disabled={page === pagination.pages || isFetching}
                    onClick={() => handlePageChange(page + 1)}
                    aria-label="Next course page"
                    className="student-button-secondary min-w-11 px-3 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <span className="hidden text-sm text-gray-600 sm:inline ml-4">
                    Page {pagination.page || 1} of {pagination.pages || 1}
                  </span>
                </motion .div>
              )}
          </div>
        </div>
      </div>
    
  );
};

export default BrowseCourses;
