import React from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Layers, BookOpen } from "lucide-react";
import SectionHeader from "./SectionHeader";
import LessonsList from "./LessonsList";

const SectionsList = ({
  course,
  expandedSections,
  toggleSectionExpand,
  editingSection,
  setEditingSection,
  editSectionName,
  setEditSectionName,
  handleUpdateSection,
  handleDeleteSection,
  editingSubSection,
  setEditingSubSection,
  editSubSectionTitle,
  setEditSubSectionTitle,
  editSubSectionDescription,
  setEditSubSectionDescription,
  handleUpdateSubSection,
  handleDeleteSubSection,
  isUpdatingSection,
  isUpdatingSubSection,
  courseId,
}) => {
  if (!course.sections || course.sections.length === 0) {
    return (
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-md border-2 border-dashed border-gray-300 p-8 md:p-12 text-center"
      >
        <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="builder-title text-lg md:text-xl font-bold text-gray-900 mb-2">
          No Sections Yet
        </h3>
        <p className="text-gray-600 text-sm md:text-base">
          Create a section above to start building your course structure
        </p>
      </Motion.div>
    );
  }

  return (
    <AnimatePresence>
      {course.sections.map((section, sectionIndex) => (
        <Motion.div
          key={section._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionIndex * 0.05 }}
          className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100 mb-4"
        >
          {/* Section Header */}
          <SectionHeader
            section={section}
            expandedSections={expandedSections}
            toggleSectionExpand={toggleSectionExpand}
            editingSection={editingSection}
            setEditingSection={setEditingSection}
            editSectionName={editSectionName}
            setEditSectionName={setEditSectionName}
            handleUpdateSection={handleUpdateSection}
            handleDeleteSection={handleDeleteSection}
            isUpdatingSection={isUpdatingSection}
            completedCount={section.subSections?.length || 0}
            totalCount={section.subSections?.length || 0}
          />

          {/* Lessons */}
          <AnimatePresence>
            {expandedSections[section._id] && (
              <Motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-200 p-3 md:p-6 bg-gray-50 space-y-2 md:space-y-3"
              >
                <LessonsList
                  subSections={section.subSections}
                  sectionId={section._id}
                  courseId={courseId}
                  editingSubSection={editingSubSection}
                  setEditingSubSection={setEditingSubSection}
                  editSubSectionTitle={editSubSectionTitle}
                  setEditSubSectionTitle={setEditSubSectionTitle}
                  editSubSectionDescription={editSubSectionDescription}
                  setEditSubSectionDescription={setEditSubSectionDescription}
                  handleUpdateSubSection={handleUpdateSubSection}
                  handleDeleteSubSection={handleDeleteSubSection}
                  isUpdatingSubSection={isUpdatingSubSection}
                />
              </Motion.div>
            )}
          </AnimatePresence>
        </Motion.div>
      ))}
    </AnimatePresence>
  );
};

export default SectionsList;
