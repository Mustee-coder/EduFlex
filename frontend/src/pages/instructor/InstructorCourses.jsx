import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useInstructorCourses } from "@/hooks/useInstructorCourses";
import { useDeleteCourse } from "@/hooks/useDeleteCourse";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  AlertCircle,
  Loader,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";
import "@/index.css";
import CourseSkeleton from "@/components/skeletons/instructor";



const InstructorCourses = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useInstructorCourses();
  const { mutate: deleteCourse, isPending: deleteLoading } = useDeleteCourse();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState("");

  const courses = data?.data || [];

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.courseName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ? true : course.status === filter;

    return matchesSearch && matchesFilter;
  });

  // Delete handler
  const handleDeleteClick = (id, name) => {
    setSelectedCourseId(id);
    setSelectedCourseName(name);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteCourse(selectedCourseId, {
      onSuccess: () => {
        toast.success("Course deleted successfully");
        setDeleteModalOpen(false);
        setSelectedCourseId(null);
        setSelectedCourseName("");
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || "Failed to delete course"
        );
      },
    });
  };

 
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
            Failed to Load Courses
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Please try refreshing the page
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all"
          >
            Refresh Page
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
     
    
      <div className="instructor-courses-root bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="instructor-courses-title text-4xl md:text-5xl font-bold text-gray-900">
                My Courses
              </h1>
              <p className="text-gray-600 mt-2">
                {courses.length} total • {filteredCourses.length} shown
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/add-course")}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Course
            </motion.button>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          >
            
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all appearance-none bg-white"
              >
                <option value="All">All Courses</option>
                <option value="Published">Published</option>
                <option value="Draft">Drafts</option>
              </select>
            </div>
          </motion.div>

          {/* Empty State */}
          {filteredCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="instructor-courses-title text-2xl font-bold text-gray-900 mb-2">
                No Courses Found
              </h3>
              <p className="text-gray-600 mb-6">
                {courses.length === 0
                  ? "Start creating your first course to reach learners"
                  : "Try adjusting your search or filter"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/add-course")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
              >
                <Plus className="w-5 h-5" />
                Create First Course
              </motion.button>
            </motion.div>
          ) : isLoading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CourseSkeleton key={i} />
              ))}
            </div>
          ) : (
            // Courses Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
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

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                          course.status === "Published"
                            ? "bg-emerald-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {course.status === "Published" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {course.status}
                      </motion.span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    
                    {/* Title */}
                    <div>
                      <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide">
                        {course.category?.name || "Uncategorized"}
                      </p>
                      <h3 className="instructor-courses-title text-lg font-bold text-gray-900 mt-1 line-clamp-2">
                        {course.courseName}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {course.courseDescription || "No description"}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 py-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-bold text-emerald-600">
                            ₦{(course.price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-teal-600" />
                        <div>
                          <p className="text-xs text-gray-500">Students</p>
                          <p className="font-bold text-gray-900">
                            {course.totalStudentsEnrolled || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-2">
                      
                      {/* View */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/course/${course._id}`)}
                        className="flex items-center justify-center gap-1 border-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700 py-2.5 rounded-lg font-semibold transition-all text-sm"
                        title="View Course"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </motion.button>

                      {/* Edit */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/course-builder/${course._id}`)}
                        className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-semibold transition-all text-sm"
                        title="Edit Course"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </motion.button>

                      {/* Delete */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteClick(course._id, course.courseName)}
                        className="flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 py-2.5 rounded-lg font-semibold transition-all text-sm"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>

              <h2 className="instructor-courses-title text-2xl font-bold text-gray-900 mb-2">
                Delete Course?
              </h2>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-bold">"{selectedCourseName}"</span>?
                This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold transition-all"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


export default InstructorCourses;
