import React from "react";
import { motion as Motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Loader,
  Save,
  X,
} from "lucide-react";

const SectionHeader = ({
  section,
  expandedSections,
  toggleSectionExpand,
  editingSection,
  setEditingSection,
  editSectionName,
  setEditSectionName,
  handleUpdateSection,
  handleDeleteSection,
  isUpdatingSection,
  completedCount,
  totalCount,
}) => {
  return (
    <Motion.div
      onClick={() => toggleSectionExpand(section._id)}
      className="flex cursor-pointer flex-col gap-3 bg-gradient-to-r from-gray-50 to-gray-100 p-3 transition-all hover:from-[#F8F6FF] hover:to-[#F8F6FF] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-6"
    >
      <div className="flex min-w-0 flex-1 items-start gap-2 sm:items-center sm:gap-4">
        {/* Chevron Icon */}
        <Motion.div
          className="flex-shrink-0 text-[#6C5CE7]"
          initial={{ rotate: 0 }}
          animate={{
            rotate: expandedSections[section._id] ? 180 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {expandedSections[section._id] ? (
            <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </Motion.div>

        {/* Section Info */}
        <div className="flex-1 min-w-0">
          {editingSection === section._id ? (
            <Motion.input
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              type="text"
              value={editSectionName}
              onChange={(e) => setEditSectionName(e.target.value)}
              className="input-animate w-full rounded-lg border-2 border-[#8577F4] px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none sm:text-base"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <h3 className="builder-title whitespace-normal break-words text-sm font-bold leading-5 text-gray-900 sm:text-lg sm:leading-6">
                {section.sectionName}
              </h3>
              <p className="mt-1 text-xs text-gray-600 sm:mt-1.5 sm:text-sm">
                {completedCount}/{totalCount} lessons
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className="flex shrink-0 self-end gap-1 sm:self-auto sm:gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {editingSection === section._id ? (
          <>
            <Motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => handleUpdateSection(section._id)}
              disabled={isUpdatingSection}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[#6C5CE7] p-2 text-white transition-all hover:bg-[#5749C8] disabled:cursor-not-allowed disabled:opacity-60 sm:p-2.5"
              title="Save"
            >
              {isUpdatingSection ? (
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
                setEditingSection(null);
                setEditSectionName("");
              }}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-gray-300 p-2 text-gray-900 transition-all hover:bg-gray-400 sm:p-2.5"
              title="Cancel"
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
                setEditingSection(section._id);
                setEditSectionName(section.sectionName);
              }}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-[#6C5CE7] transition-all hover:bg-[#F0EDFF] sm:p-2.5"
              title="Edit"
            >
              <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Motion.button>

            <Motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => handleDeleteSection(section._id)}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-red-600 transition-all hover:bg-red-100 sm:p-2.5"
              title="Delete"
            >
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Motion.button>
          </>
        )}
      </div>
    </Motion.div>
  );
};

export default SectionHeader;
