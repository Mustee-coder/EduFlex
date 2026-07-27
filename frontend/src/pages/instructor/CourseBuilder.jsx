import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Loader,
  CheckCircle2,
  Clock,
  BookOpen,
  Layers,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useGetCourseDetails } from "@/hooks/useGetCourseDetails";
import { useCreateSection } from "@/hooks/useCreateSection";
import { usePublishCourse } from "@/hooks/usePublishCourse";
import { useUpdateSection } from "@/hooks/useUpdateSection";
import { useDeleteSection } from "@/hooks/useDeleteSection";
import { useUpdateSubSection } from "@/hooks/useUpdateSubSection";
import { useDeleteSubSection } from "@/hooks/useDeleteSubSection";

const CourseBuilder = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data: courseData, isLoading } = useGetCourseDetails(courseId);
  const { mutate: createSection, isPending } = useCreateSection();
  const { mutate: updateSection, isPending: isUpdatingSection } =
    useUpdateSection();
  const { mutate: deleteSection } = useDeleteSection(courseId);
  const { mutate: updateSubSection, isPending: isUpdatingSubSection } =
    useUpdateSubSection();
  const { mutate: deleteSubSection } = useDeleteSubSection(courseId);
  const { mutate: publishCourse, isPending: isPublishing } =
    usePublishCourse();

  // Form States
  const [sectionName, setSectionName] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [editingSection, setEditingSection] = useState(null);
  const [editSectionName, setEditSectionName] = useState("");
  const [editingSubSection, setEditingSubSection] = useState(null);
  const [editSubSectionTitle, setEditSubSectionTitle] = useState("");
  const [editSubSectionDescription, setEditSubSectionDescription] =
    useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  const course = courseData?.data?.courseDetails;

  // Handlers
  const handleCreateSection = (e) => {
    e.preventDefault();

    if (!sectionName.trim()) {
      toast.error("Section name cannot be empty");
      return;
    }

    createSection(
      { courseId, sectionName },
      {
        onSuccess: () => {
          setSectionName("");
          toast.success("Section created successfully!");
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Failed to create section"
          );
        },
      }
    );
  };

  const handleUpdateSection = (sectionId) => {
    if (!editSectionName.trim()) {
      toast.error("Section name is required");
      return;
    }

    updateSection(
      {
        sectionId,
        sectionName: editSectionName,
        courseId,
      },
      {
        onSuccess: () => {
          setEditingSection(null);
          setEditSectionName("");
          toast.success("Section updated!");
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Failed to update section"
          );
        },
      }
    );
  };

  const handleDeleteSection = (sectionId) => {
    setPendingDelete({ sectionId, courseId });
    setDeleteType("section");
    setDeleteModalOpen(true);
  };

  const confirmDeleteSection = () => {
    if (!pendingDelete) return;

    deleteSection(pendingDelete, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setPendingDelete(null);
        toast.success("Section deleted!");
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || "Failed to delete section"
        );
      },
    });
  };

  const handleUpdateSubSection = (subSectionId) => {
    updateSubSection(
      {
        subSectionId,
        title: editSubSectionTitle,
        description: editSubSectionDescription,
      },
      {
        onSuccess: () => {
          setEditingSubSection(null);
          setEditSubSectionTitle("");
          setEditSubSectionDescription("");
          toast.success("Lesson updated!");
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Failed to update lesson"
          );
        },
      }
    );
  };

  const handleDeleteSubSection = (subSectionId, sectionId) => {
    setPendingDelete({ subSectionId, sectionId });
    setDeleteType("lesson");
    setDeleteModalOpen(true);
  };

  const confirmDeleteSubSection = () => {
    if (!pendingDelete) return;

    deleteSubSection(pendingDelete, {
      onSuccess: () => {
        toast.success("Lesson deleted!");
        setDeleteModalOpen(false);
        setPendingDelete(null);
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || "Failed to delete lesson"
        );
      },
    });
  };

  const toggleSectionExpand = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-emerald-600" />
        </motion.div>
      </div>
    );
  }

  // Not Found State
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-red-100"
        >
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Course Not Found</h1>
          <button
            onClick={() => navigate("/instructor-courses")}
            className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            Back to Courses
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');

        .builder-root {
          font-family: 'Poppins', sans-serif;
        }

        .builder-title {
          font-family: 'Syne', sans-serif;
        }

        .input-animate {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .input-animate:focus {
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
      `}</style>

      <div className="builder-root bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="builder-title text-4xl md:text-5xl font-bold text-gray-900">
                  {course.courseName}
                </h1>
                <p className="text-gray-600 mt-2 max-w-2xl line-clamp-2">
                  {course.courseDescription}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                    course.status === "Published"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {course.status === "Published" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  {course.status}
                </span>

                <span className="text-sm font-semibold text-gray-600">
                  {course.sections?.length || 0} sections •{" "}
                  {course.sections?.reduce(
                    (acc, s) => acc + (s.subSections?.length || 0),
                    0
                  ) || 0}{" "}
                  lessons
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  publishCourse({
                    courseId,
                    status:
                      course.status === "Published" ? "Draft" : "Published",
                  })
                }
                disabled={isPublishing}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  course.status === "Published"
                    ? "bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white"
                }`}
              >
                {isPublishing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : course.status === "Published" ? (
                  <>
                    <X className="w-4 h-4" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Publish Course
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Create Section Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8"
          >
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <Plus className="w-5 h-5 text-emerald-600" />
              <h2 className="builder-title font-bold text-xl text-gray-900">
                Create Section
              </h2>
            </div>

            <form
              onSubmit={handleCreateSection}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                placeholder="e.g., Introduction to React"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                disabled={isPending}
                className="input-animate flex-1 border-2 border-gray-200 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:opacity-50 font-medium"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isPending}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all w-full sm:w-auto"
              >
                {isPending ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Section
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Sections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="builder-title text-2xl font-bold text-gray-900 mb-6">
              Course Structure
            </h2>

            {course.sections && course.sections.length > 0 ? (
              <AnimatePresence>
                {course.sections.map((section, sectionIndex) => (
                  <motion.div
                    key={section._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.05 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100"
                  >
                    {/* Section Header */}
                    <motion.div
                      onClick={() => toggleSectionExpand(section._id)}
                      className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-teal-50 cursor-pointer transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <motion.button
                          type="button"
                          className="flex-shrink-0 text-emerald-600"
                          initial={{ rotate: 0 }}
                          animate={{
                            rotate: expandedSections[section._id] ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {expandedSections[section._id] ? (
                            <ChevronUp size={24} />
                          ) : (
                            <ChevronDown size={24} />
                          )}
                        </motion.button>

                        <div className="min-w-0">
                          {editingSection === section._id ? (
                            <motion.input
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              type="text"
                              value={editSectionName}
                              onChange={(e) =>
                                setEditSectionName(e.target.value)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="input-animate border-2 border-emerald-500 px-3 py-2 rounded-lg w-full font-bold text-gray-900 focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            <h3 className="builder-title text-lg font-bold text-gray-900 truncate">
                              {section.sectionName}
                            </h3>
                          )}
                          <p className="text-sm text-gray-600">
                            {section.subSections?.length || 0} lesson
                            {section.subSections?.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div
                        className="flex gap-2 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {editingSection === section._id ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() =>
                                handleUpdateSection(section._id)
                              }
                              disabled={isUpdatingSection}
                              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg font-semibold transition-all text-sm"
                            >
                              {isUpdatingSection ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => {
                                setEditingSection(null);
                                setEditSectionName("");
                              }}
                              className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 text-gray-900 px-3 py-2 rounded-lg font-semibold transition-all text-sm"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </>
                        ) : (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => {
                                setEditingSection(section._id);
                                setEditSectionName(section.sectionName);
                              }}
                              className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"
                              title="Edit Section"
                            >
                              <Edit2 size={18} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() =>
                                handleDeleteSection(section._id)
                              }
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                              title="Delete Section"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </>
                        )}
                      </div>
                    </motion.div>

                    {/* Subsections */}
                    <AnimatePresence>
                      {expandedSections[section._id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 p-6 bg-gray-50 space-y-3"
                        >
                        {section.subSections &&
                          section.subSections.length > 0 ? (
                            <div className="space-y-3">
                              {section.subSections.map((subSection, idx) => (
                                <motion.div
                                  key={subSection._id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="bg-white p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-200 transition-all"
                                >
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1 min-w-0">
                                        {editingSubSection ===
                                        subSection._id ? (
                                          <motion.div
                                            className="space-y-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                          >
                                            <input
                                              type="text"
                                              value={editSubSectionTitle}
                                              onChange={(e) =>
                                                setEditSubSectionTitle(
                                                  e.target.value
                                                )
                                              }
                                              className="input-animate w-full border-2 border-emerald-500 px-3 py-2 rounded-lg font-bold text-gray-900 focus:outline-none"
                                              placeholder="Lesson title"
                                              autoFocus
                                            />

                                            <textarea
                                              value={
                                                editSubSectionDescription
                                              }
                                              onChange={(e) =>
                                                setEditSubSectionDescription(
                                                  e.target.value
                                                )
                                              }
                                              className="input-animate w-full border-2 border-emerald-500 px-3 py-2 rounded-lg text-gray-900 focus:outline-none resize-none"
                                              placeholder="Lesson description"
                                              rows="3"
                                            />
                                          </motion.div>
                                        ) : (
                                          <>
                                            <h4 className="builder-title font-bold text-gray-900 truncate">
                                              {subSection.title}
                                            </h4>

                                            <p className="text-sm text-gray-600 line-clamp-2">
                                              {subSection.description ||
                                                "No description"}
                                            </p>

                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                              <Clock className="w-3 h-3" />
                                              {subSection.timeDuration ||
                                                "No duration set"}
                                            </p>
                                          </>
                                        )}
                                      </div>

                                      {/* Lesson Actions */}
                                      <div
                                        className="flex gap-1 flex-shrink-0"
                                        onClick={(e) =>
                                          e.stopPropagation()
                                        }
                                      >
                                        {editingSubSection ===
                                        subSection._id ? (
                                          <>
                                            <motion.button
                                              whileHover={{
                                                scale: 1.1,
                                              }}
                                              whileTap={{ scale: 0.9 }}
                                              type="button"
                                              onClick={() =>
                                                handleUpdateSubSection(
                                                  subSection._id
                                                )
                                              }
                                              disabled={
                                                isUpdatingSubSection
                                              }
                                              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-2 py-2 rounded-lg text-sm"
                                            >
                                              {isUpdatingSubSection ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                              ) : (
                                                <Save className="w-4 h-4" />
                                              )}
                                            </motion.button>

                                            <motion.button
                                              whileHover={{
                                                scale: 1.1,
                                              }}
                                              whileTap={{ scale: 0.9 }}
                                              type="button"
                                              onClick={() => {
                                                setEditingSubSection(
                                                  null
                                                );
                                                setEditSubSectionTitle(
                                                  ""
                                                );
                                                setEditSubSectionDescription(
                                                  ""
                                                );
                                              }}
                                              className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 text-gray-900 px-2 py-2 rounded-lg text-sm"
                                            >
                                              <X className="w-4 h-4" />
                                            </motion.button>
                                          </>
                                        ) : (
                                          <>
                                            <motion.button
                                              whileHover={{
                                                scale: 1.1,
                                              }}
                                              whileTap={{ scale: 0.9 }}
                                              type="button"
                                              onClick={() => {
                                                setEditingSubSection(
                                                  subSection._id
                                                );
                                                setEditSubSectionTitle(
                                                  subSection.title
                                                );
                                                setEditSubSectionDescription(
                                                  subSection.description ||
                                                    ""
                                                );
                                              }}
                                              className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"
                                              title="Edit Lesson"
                                            >
                                              <Edit2 size={16} />
                                            </motion.button>

                                            <motion.button
                                              whileHover={{
                                                scale: 1.1,
                                              }}
                                              whileTap={{ scale: 0.9 }}
                                              type="button"
                                              onClick={() =>
                                                handleDeleteSubSection(
                                                  subSection._id,
                                                  section._id
                                                )
                                              }
                                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                                              title="Delete Lesson"
                                            >
                                              <Trash2 size={16} />
                                            </motion.button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-center py-6"
                            >
                              <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600">
                                No lessons yet. Add one to get started!
                              </p>
                            </motion.div>
                          )}

                          {/* Add Lesson Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() =>
                              navigate(
                                `/add-subsection/${courseId}/${section._id}`
                              )
                            }
                            className="w-full mt-4 py-3 px-4 border-2 border-dashed border-emerald-300 rounded-xl text-emerald-700 hover:bg-emerald-50 font-bold transition-all flex items-center justify-center gap-2"
                          >
                            <Plus className="w-5 h-5" />
                            Add Lesson
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md border-2 border-dashed border-gray-300 p-12 text-center"
              >
                <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="builder-title text-xl font-bold text-gray-900 mb-2">
                  No Sections Yet
                </h3>
                <p className="text-gray-600">
                  Create a section above to start building your course structure
                </p>
              </motion.div>
            )}
          </motion.div>
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

              <h2 className="builder-title text-2xl font-bold text-gray-900 mb-2">
                Delete {deleteType === "section" ? "Section" : "Lesson"}?
              </h2>

              <p className="text-gray-600 mb-6">
                {deleteType === "section"
                  ? "This section and all its lessons will be permanently removed."
                  : "This lesson will be permanently removed from the section."}
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
                  onClick={
                    deleteType === "section"
                      ? confirmDeleteSection
                      : confirmDeleteSubSection
                  }
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CourseBuilder;