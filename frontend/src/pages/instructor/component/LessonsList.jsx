import React from "react";
import { motion as Motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  Loader,
  Save,
  X,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LessonsList = ({
  subSections,
  sectionId,
  courseId,
  editingSubSection,
  setEditingSubSection,
  editSubSectionTitle,
  setEditSubSectionTitle,
  editSubSectionDescription,
  setEditSubSectionDescription,
  handleUpdateSubSection,
  handleDeleteSubSection,
  isUpdatingSubSection,
}) => {
  const navigate = useNavigate();

  if (!subSections || subSections.length === 0) {
    return (
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-3 sm:space-y-4"
      >
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-8 sm:py-10">
          <BookOpen className="mb-3 h-10 w-10 text-gray-400 sm:mb-4 sm:h-12 sm:w-12" />
          <p className="text-center text-sm text-gray-600 sm:text-base">
            No lessons yet.
            <br />
            Create your first lesson!
          </p>
        </div>

        {/* Add Lesson Button - Empty State */}
        <Motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() =>
            navigate(`/add-subsection/${courseId}/${sectionId}`)
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#8577F4] px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:from-[#5749C8] hover:to-[#7464E8] sm:py-4 sm:text-base"
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
          Add First Lesson
        </Motion.button>
      </Motion.div>
    );
  }

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {subSections.map((subSection, idx) => (
        <Motion.div
          key={subSection._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="rounded-xl border-2 border-gray-100 bg-white p-3 transition-all hover:border-[#DDD6FF] hover:shadow-sm sm:p-4"
        >
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            {/* Lesson Info */}
            <div className="flex-1 min-w-0">
              {editingSubSection === subSection._id ? (
                <Motion.div
                  className="space-y-2.5 sm:space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <input
                    type="text"
                    value={editSubSectionTitle}
                    onChange={(e) =>
                      setEditSubSectionTitle(e.target.value)
                    }
                    className="input-animate w-full rounded-lg border-2 border-[#8577F4] px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none sm:text-base"
                    placeholder="Lesson title"
                    autoFocus
                  />

                  <textarea
                    value={editSubSectionDescription}
                    onChange={(e) =>
                      setEditSubSectionDescription(e.target.value)
                    }
                    className="input-animate w-full rounded-lg border-2 border-[#8577F4] px-3 py-2 text-sm text-gray-900 resize-none focus:outline-none sm:text-base"
                    placeholder="Lesson description"
                    rows="2"
                  />
                </Motion.div>
              ) : (
                <>
                  <h4 className="builder-title truncate text-base font-bold text-gray-900 sm:text-lg">
                    {subSection.title}
                  </h4>

                  <p className="mt-1 line-clamp-2 text-xs text-gray-600 sm:mt-1.5 sm:text-sm">
                    {subSection.description || "No description"}
                  </p>

                  <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 sm:mt-2.5">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span>
                      {subSection.timeDuration || "No duration set"}
                    </span>
                  </p>
                </>
              )}
            </div>

            {/* Lesson Actions */}
            <div className="flex flex-shrink-0 gap-1.5 sm:gap-2">
              {editingSubSection === subSection._id ? (
                <>
                  <Motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() =>
                      handleUpdateSubSection(subSection._id)
                    }
                    disabled={isUpdatingSubSection}
                    className="flex items-center justify-center rounded-lg bg-[#6C5CE7] p-2 text-white transition-all hover:bg-[#5749C8] disabled:cursor-not-allowed disabled:opacity-60 sm:p-2.5"
                  >
                    {isUpdatingSubSection ? (
                      <Loader className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                    ) : (
                      <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </Motion.button>

                  <Motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => {
                      setEditingSubSection(null);
                      setEditSubSectionTitle("");
                      setEditSubSectionDescription("");
                    }}
                    className="flex items-center justify-center rounded-lg bg-gray-300 p-2 text-gray-900 transition-all hover:bg-gray-400 sm:p-2.5"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Motion.button>
                </>
              ) : (
                <>
                  <Motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => {
                      setEditingSubSection(subSection._id);
                      setEditSubSectionTitle(subSection.title);
                      setEditSubSectionDescription(
                        subSection.description || ""
                      );
                    }}
                    className="p-2 text-[#6C5CE7] transition-all hover:bg-[#F0EDFF] rounded-lg sm:p-2.5"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Motion.button>

                  <Motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() =>
                      handleDeleteSubSection(subSection._id, sectionId)
                    }
                    className="p-2 text-red-600 transition-all hover:bg-red-100 rounded-lg sm:p-2.5"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Motion.button>
                </>
              )}
            </div>
          </div>
        </Motion.div>
      ))}

      {/* Add Lesson Button */}
      <Motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() =>
          navigate(`/add-subsection/${courseId}/${sectionId}`)
        }
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#C4B9FF] py-2.5 px-4 text-sm font-bold text-[#5749C8] transition-all hover:bg-[#F8F6FF] sm:mt-5 sm:py-3 sm:text-base"
      >
        <Plus className="h-4 w-4" />
        Add Lesson
      </Motion.button>
    </div>
  );
};

export default LessonsList;
