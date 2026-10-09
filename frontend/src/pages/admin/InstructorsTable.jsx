import React, { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Search,
  AlertCircle,
  Loader,
  Mail,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { useAllInstructors } from "@/hooks/admin/hooks";
import {
  approveInstructor,
  rejectInstructor,
} from "@/services/adminService";

const EMPTY_LIST = [];

const InstructorsTable = () => {
  const { data, isLoading, error } = useAllInstructors();
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState(null);

  const approvalMutation = useMutation({
    mutationFn: ({ instructorId, action }) =>
      action === "approve"
        ? approveInstructor(instructorId)
        : rejectInstructor(instructorId),
    onSuccess: (result) => {
      toast.success(result?.message || "Instructor status updated");
      queryClient.invalidateQueries({ queryKey: ["allInstructors"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Unable to update instructor status");
    },
    onSettled: () => setProcessingId(null),
  });

  const handleApproval = (instructor, action) => {
    const actionLabel = action === "approve" ? "approve" : "reject";
    if (
      !window.confirm(
        `Are you sure you want to ${actionLabel} ${instructor.firstName} ${instructor.lastName}?`
      )
    ) {
      return;
    }

    setProcessingId(instructor._id);
    approvalMutation.mutate({ instructorId: instructor._id, action });
  };

  const instructors = data?.data ?? EMPTY_LIST;

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  const filteredInstructors = useMemo(() => {
    return instructors.filter((instructor) => {
      const fullName =
        `${instructor.firstName} ${instructor.lastName}`.toLowerCase();

      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        instructor.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });
  }, [instructors, searchQuery]);

  const totalPages = Math.ceil(
    filteredInstructors.length / itemsPerPage
  );

  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Loading State
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-8 h-8 text-emerald-600" />
        </motion.div>
        <p className="mt-3 text-gray-600 font-medium text-sm sm:text-base">
          Loading instructors...
        </p>
      </motion.div>
    );
  }

  // Error State
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 sm:p-8 text-center"
      >
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="font-bold text-red-700 text-base sm:text-lg">
          Failed to Load Instructors
        </h2>
        <p className="text-red-600 text-sm mt-2">
          An error occurred while loading instructor data
        </p>
      </motion.div>
    );
  }

  // Empty State
  if (!instructors.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-12 text-center"
      >
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="font-bold text-lg sm:text-xl text-gray-900 mb-2">
          No Instructors Found
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          No instructors have joined the platform yet
        </p>
      </motion.div>
    );
  }

  // Filtered but empty
  if (filteredInstructors.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-12 text-center"
      >
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="font-bold text-lg sm:text-xl text-gray-900 mb-2">
          No Results Found
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          No instructors match your search. Try a different query.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                All Instructors
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {filteredInstructors.length} instructor
                {filteredInstructors.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 flex-shrink-0"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-sm sm:text-base transition-all"
              />
            </div>
          </div>
        </div>

        {/* Instructor Cards Grid */}
        <div className="p-4 sm:p-5 md:p-6 grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {paginatedInstructors.map((instructor, index) => (
              <motion.div
                key={instructor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all group"
              >
                {/* Avatar & Name */}
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  {instructor.image ? (
                    <img
                      src={instructor.image}
                      alt={instructor.firstName}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-emerald-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0 font-bold text-emerald-700 text-sm sm:text-base">
                      {instructor.firstName[0]}
                      {instructor.lastName[0]}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">
                      {instructor.firstName} {instructor.lastName}
                    </h3>
                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full inline-block mt-1">
                      👨‍🏫 Instructor
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm mb-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <Mail size={16} className="flex-shrink-0" />
                  <span className="truncate">
                    {instructor.email}
                  </span>
                </div>

                {/* Courses */}
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} className="text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    {instructor.courses?.length || 0} Course
                    {instructor.courses?.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Joined Date */}
                <div className="text-xs sm:text-sm text-gray-500 mb-4 px-2 py-1 bg-gray-50 rounded">
                  📅 Joined{" "}
                  {new Date(
                    instructor.createdAt
                  ).toLocaleDateString()}
                </div>

                <div className="mb-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
                      instructor.approvalStatus === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : instructor.approvalStatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {instructor.approvalStatus || (instructor.approved ? "approved" : "pending")}
                  </span>
                </div>

                {instructor.approvalStatus === "pending" && (
                  <div className="mb-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleApproval(instructor, "approve")}
                      disabled={approvalMutation.isPending}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {processingId === instructor._id && approvalMutation.variables?.action === "approve" ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproval(instructor, "reject")}
                      disabled={approvalMutation.isPending}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {processingId === instructor._id && approvalMutation.variables?.action === "reject" ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      Reject
                    </button>
                  </div>
                )}

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all shadow-md group-hover:shadow-lg"
                >
                  View Profile
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-5 md:p-6">
            {/* Mobile: Stacked */}
            <div className="flex flex-col gap-4 md:hidden">
              <p className="text-xs sm:text-sm text-gray-600 text-center">
                Showing{" "}
                <span className="font-bold">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredInstructors.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-bold">
                  {filteredInstructors.length}
                </span>
              </p>

              <div className="flex items-center justify-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                  title="Previous"
                >
                  <ChevronLeft size={18} />
                </motion.button>

                <span className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-sm">
                  {currentPage} / {totalPages}
                </span>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                  title="Next"
                >
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            </div>

            {/* Desktop: Horizontal */}
            <div className="hidden md:flex items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-bold">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredInstructors.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-bold">
                  {filteredInstructors.length}
                </span>
              </p>

              <div className="flex items-center gap-1 sm:gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base font-bold"
                >
                  Prev
                </motion.button>

                {/* Show limited page numbers on mobile */}
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNum = index + 1;
                  // Show first, last, and current ±1 pages
                  const isVisible =
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 &&
                      pageNum <= currentPage + 1);

                  if (!isVisible && totalPages > 5) return null;

                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                        currentPage === pageNum
                          ? "bg-emerald-600 text-white shadow-md"
                          : "border border-gray-200 text-gray-700 hover:bg-white"
                      }`}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base font-bold"
                >
                  Next
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InstructorsTable;
