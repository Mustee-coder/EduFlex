import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Loader,
  Mail,
  BookOpen,
} from "lucide-react";
import { useAllStudents } from "@/hooks/admin/hooks";

const StudentsTable = () => {
  const { data, isLoading } = useAllStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("firstName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const students = data?.data || [];

  // Search and Sort
  const filteredAndSortedStudents = useMemo(() => {
    let result = students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const email = student.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });

    // Sort
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "courses") {
        aValue = a.courses?.length || 0;
        bValue = b.courses?.length || 0;
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [students, searchQuery, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage);
  const paginatedStudents = filteredAndSortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8"
      >
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="w-8 h-8 text-emerald-600" />
          </motion.div>
          <p className="ml-3 text-gray-600 font-medium">
            Loading students...
          </p>
        </div>
      </motion.div>
    );
  }

  // Empty State
  if (students.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center"
      >
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="admin-title text-lg font-bold text-gray-900 mb-2">
          No Students Found
        </h3>
        <p className="text-gray-600">
          No students have enrolled yet. Check back later.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 md:mt-12"
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="admin-title text-xl md:text-2xl font-bold text-gray-900">
                All Students
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredAndSortedStudents.length} total student
                {filteredAndSortedStudents.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("firstName")}
                    className="flex items-center gap-2 font-bold text-gray-900 hover:text-emerald-600 transition-colors"
                  >
                    <span>Name</span>
                    {sortField === "firstName" && (
                      <>
                        {sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                </th>

                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("email")}
                    className="flex items-center gap-2 font-bold text-gray-900 hover:text-emerald-600 transition-colors"
                  >
                    <span>Email</span>
                    {sortField === "email" && (
                      <>
                        {sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                </th>

                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("courses")}
                    className="flex items-center gap-2 font-bold text-gray-900 hover:text-emerald-600 transition-colors"
                  >
                    <span>Courses</span>
                    {sortField === "courses" && (
                      <>
                        {sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                </th>

                <th className="px-6 py-4 text-left">
                  <span className="font-bold text-gray-900">Joined</span>
                </th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {paginatedStudents.map((student, idx) => (
                  <motion.tr
                    key={student._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        {student.email}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-semibold text-gray-900">
                          {student.courses?.length || 0}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {student.createdAt
                        ? new Date(student.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Cards - Mobile */}
        <div className="md:hidden p-4 space-y-3">
          <AnimatePresence>
            {paginatedStudents.map((student, idx) => (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all"
              >
                <div className="mb-3">
                  <h4 className="font-bold text-gray-900 mb-1">
                    {student.firstName} {student.lastName}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {student.email}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm text-gray-600">
                      {student.courses?.length || 0} course
                      {student.courses?.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {student.createdAt
                      ? new Date(student.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredAndSortedStudents.length)} of{" "}
              {filteredAndSortedStudents.length}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-200 rounded-lg font-bold text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg font-bold transition-all ${
                        currentPage === pageNum
                          ? "bg-emerald-600 text-white"
                          : "border border-gray-200 text-gray-700 hover:bg-white"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-200 rounded-lg font-bold text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StudentsTable;
