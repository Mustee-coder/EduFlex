import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  AlertCircle,
  Loader,
} from "lucide-react";
import { toast } from "sonner";

import { useGetCourseDetails } from "@/hooks/useGetCourseDetails";
import { useCreateSection } from "@/hooks/useCreateSection";
import { usePublishCourse } from "@/hooks/usePublishCourse";
import { useUpdateSection } from "@/hooks/useUpdateSection";
import { useDeleteSection } from "@/hooks/useDeleteSection";
import { useUpdateSubSection } from "@/hooks/useUpdateSubSection";
import { useDeleteSubSection } from "@/hooks/useDeleteSubSection";

// Sub-components
import CourseBuilderHeader from "./component/CourseBuilderHeader";
import CreateSectionForm from "./component/CreateSectionForm";
import SectionsList from "./component/SectionsList";
import DeleteConfirmModal from "./component/DeleteConfirmModal";

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-emerald-600" />
        </Motion.div>
      </div>
    );
  }

  // Not Found State
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Motion.div
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
        </Motion.div>
      </div>
    );
  }

  return (
  <>
    <style>{`
      @import url("https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap");

      .builder-root {
        font-family: "Poppins", sans-serif;
      }

      .builder-title {
        font-family: "Syne", sans-serif;
      }

      .input-animate {
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .input-animate:focus {
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
      }
    `}</style>

    <div className="builder-root min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-6 sm:px-6 lg:px-8 md:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">

        {/* Header */}
        <CourseBuilderHeader
          course={course}
          isPublishing={isPublishing}
          publishCourse={publishCourse}
          courseId={courseId}
        />

        {/* Create Section */}
        <CreateSectionForm
          sectionName={sectionName}
          setSectionName={setSectionName}
          isPending={isPending}
          handleCreateSection={handleCreateSection}
        />

        {/* Course Structure */}
        <Motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="builder-title text-2xl font-bold text-gray-900">
              Course Structure
            </h2>

            <span className="text-sm font-medium text-gray-500">
              {course.sections?.length || 0} Sections
            </span>
          </div>

          <SectionsList
            course={course}
            expandedSections={expandedSections}
            toggleSectionExpand={toggleSectionExpand}
            editingSection={editingSection}
            setEditingSection={setEditingSection}
            editSectionName={editSectionName}
            setEditSectionName={setEditSectionName}
            handleUpdateSection={handleUpdateSection}
            handleDeleteSection={handleDeleteSection}
            editingSubSection={editingSubSection}
            setEditingSubSection={setEditingSubSection}
            editSubSectionTitle={editSubSectionTitle}
            setEditSubSectionTitle={setEditSubSectionTitle}
            editSubSectionDescription={editSubSectionDescription}
            setEditSubSectionDescription={setEditSubSectionDescription}
            handleUpdateSubSection={handleUpdateSubSection}
            handleDeleteSubSection={handleDeleteSubSection}
            isUpdatingSection={isUpdatingSection}
            isUpdatingSubSection={isUpdatingSubSection}
            courseId={courseId}
          />
        </Motion.section>
      </div>
    </div>

    {/* Delete Confirmation */}
    <DeleteConfirmModal
      isOpen={deleteModalOpen}
      deleteType={deleteType}
      onCancel={() => {
        setDeleteModalOpen(false);
        setPendingDelete(null);
        setDeleteType(null);
      }}
      onConfirm={
        deleteType === "section"
          ? confirmDeleteSection
          : confirmDeleteSubSection
      }
      isDeleting={false}
    />
  </>
);
};

export default CourseBuilder;
