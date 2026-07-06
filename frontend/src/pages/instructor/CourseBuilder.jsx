import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit2 } from 'lucide-react';

import { useGetCourseDetails } from "@/hooks/useGetCourseDetails";
import { useCreateSection } from '@/hooks/useCreateSection'
import { usePublishCourse } from "@/hooks/usePublishCourse";

import { useUpdateSection } from '@/hooks/useUpdateSection';
import { useDeleteSection } from '@/hooks/useDeleteSection';


import { useUpdateSubSection } from '@/hooks/useUpdateSubSection';
import { useDeleteSubSection } from '@/hooks/useDeleteSubSection';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ConfirmModal from '@/components/ConfirmModal';


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
  
  

  const [sectionName, setSectionName] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
const [editingSection, setEditingSection] = useState(null);
const [editSectionName, setEditSectionName] = useState("");
const [editingSubSection, setEditingSubSection] = useState(null);

const [editSubSectionTitle, setEditSubSectionTitle] = useState("");

const [editSubSectionDescription, setEditSubSectionDescription] = useState("");
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [pendingDelete, setPendingDelete] = useState(null);
const [deleteType, setDeleteType] = useState(null);

const course = courseData?.data?.courseDetails;

  const handleCreateSection = (e) => {
    e.preventDefault();

    if (!sectionName.trim()) {
      toast.error('Section name cannot be empty');
      return;
    }

    createSection(
      { courseId, sectionName },
      {
        onSuccess: () => {
          setSectionName('');
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

  deleteSection(
    pendingDelete,
    {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setPendingDelete(null);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to delete section");
      },
    }
  );
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

  deleteSubSection(
    pendingDelete,
    {
      onSuccess: () => {
        toast.success("Lesson deleted successfully");
        setDeleteModalOpen(false);
        setPendingDelete(null);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to delete lesson");
      },
    }
  );
};

  const toggleSectionExpand = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!course) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Course not found</h1>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
     
     {/* Header */}
<div className="mb-8">
  <h1 className="text-3xl font-bold mb-2">
    {course.courseName}
  </h1>

  <p className="text-gray-600">
    {course.courseDescription}
  </p>

  <div className="mt-3 flex items-center gap-3">
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        course.status === "Published"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {course.status}
    </span>

   <button
  onClick={() =>
    publishCourse({
      courseId,
      status:
        course.status === "Published"
          ? "Draft"
          : "Published",
    })
  }
  disabled={isPublishing}
  className={`px-4 py-2 rounded-lg text-white ${
    course.status === "Published"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  {isPublishing
    ? "Updating..."
    : course.status === "Published"
    ? "Unpublish"
    : "Publish Course"}
</button>
  </div>
</div>

      {/* Create Section Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Section</h2>
        <form
          onSubmit={handleCreateSection}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            placeholder="Enter section name"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            disabled={isPending}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition"
          >
            <Plus size={18} />
            {isPending ? 'Creating...' : 'Add Section'}
          </button>
        </form>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Course Sections</h2>

        {course.sections && course.sections.length > 0 ? (
          course.sections.map((section) => (
            <div
              key={section._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Section Header */}
              <div
                onClick={() => toggleSectionExpand(section._id)}
                className="p-4 sm:p-6 bg-gray-50 hover:bg-gray-100 cursor-pointer flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <button type="button" className="text-gray-600">
                    {expandedSections[section._id] ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                  <div>
                  {editingSection === section._id ? (
  <input
    type="text"
    value={editSectionName}
    onChange={(e) => setEditSectionName(e.target.value)}
    className="border rounded-md px-2 py-1 w-full"
    onClick={(e) => e.stopPropagation()}
  />
) : (
  <h3 className="text-lg font-semibold text-gray-800">
    {section.sectionName}
  </h3>
)}
                    <p className="text-sm text-gray-600">
                      {section.subSections ? section.subSections.length : 0} lessons
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
              <div className="flex justify-end gap-2 w-full sm:w-auto">
  {editingSection === section._id ? (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleUpdateSection(section._id);
        }}
        className="px-3 py-1 bg-blue-600 text-white rounded"
      >
        {isUpdatingSection ? "Saving..." : "Save"}
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setEditingSection(null);
          setEditSectionName("");
        }}
        className="px-3 py-1 bg-gray-500 text-white rounded"
      >
        Cancel
      </button>
    </>
  ) : (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setEditingSection(section._id);
          setEditSectionName(section.sectionName);
        }}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
      >
        <Edit2 size={18} />
      </button>

      <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    handleDeleteSection(section._id);
  }}
  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
>
  <Trash2 size={18} />
</button>
    </>
  )}
</div>
</div>

              {/* Subsections */}
              {expandedSections[section._id] && (
                <div className="border-t p-6 bg-gray-50">
                  {section.subSections && section.subSections.length > 0 ? (
                    <div className="space-y-3">
                      {section.subSections.map((subSection) => (
                        <div
  key={subSection._id}
  className="bg-white p-4 rounded-md border border-gray-200 flex flex-col sm:flex-row sm:items-center">
                         <div className="flex-1">
  {editingSubSection === subSection._id ? (
    <>
      <input
        type="text"
        value={editSubSectionTitle}
        onChange={(e) => setEditSubSectionTitle(e.target.value)}
        className="border rounded px-2 py-1 w-full"
      />

      <textarea
        value={editSubSectionDescription}
        onChange={(e) => setEditSubSectionDescription(e.target.value)}
        className="border rounded px-2 py-1 w-full mt-2"
      />
    </>
  ) : (
    <>
      <h4 className="font-medium text-gray-800">
        {subSection.title}
      </h4>

      <p className="text-sm text-gray-600">
        {subSection.description}
      </p>

      <p className="text-sm text-gray-500">
        {subSection.timeDuration || "No duration"}
      </p>
    </>
  )}
</div>
                          <div className="flex gap-2 self-end sm:self-auto">
                            {editingSubSection === subSection._id ? (
  <>
    <button
      type="button"
      onClick={() => handleUpdateSubSection(subSection._id)}
      className="px-3 py-1 bg-blue-600 text-white rounded"
    >
      {isUpdatingSubSection ? "Saving..." : "Save"}
    </button>

    <button
      type="button"
      onClick={() => {
        setEditingSubSection(null);
        setEditSubSectionTitle("");
        setEditSubSectionDescription("");
      }}
      className="px-3 py-1 bg-gray-500 text-white rounded"
    >
      Cancel
    </button>
  </>
) : (
  <>
    <button
      type="button"
      onClick={(e) => {
  e.stopPropagation();
  setEditingSubSection(subSection._id);
  setEditSubSectionTitle(subSection.title);
  setEditSubSectionDescription(subSection.description || "");
}}
      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
    >
      <Edit2 size={16} />
    </button>

    <button
      type="button"
      onClick={() => handleDeleteSubSection(subSection._id, section._id)}
      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
    >
      <Trash2 size={16} />
    </button>
  </>
)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No lessons in this section. Add one to get started!
                    </p>
                  )}

                  {/* Add SubSection Button */}
                  <button
                    type="button"
                    onClick={() => navigate(`/add-subsection/${courseId}/${section._id}`)}
                    className="mt-4 w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add Lesson
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-4 rounded-md border border-gray-200 flex items-center justify-center hover:shadow-md transition">
            <p className="text-gray-500">
              No sections yet. Create one above to get started!
            </p>
          </div>
        )}
      </div>

     <ConfirmModal
  isOpen={deleteModalOpen}
  title={
    deleteType === "section"
      ? "Delete section?"
      : "Delete lesson?"
  }
  message={
    deleteType === "section"
      ? "This section will be removed from the course."
      : "This lesson will be removed from the section."
  }
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
/>

    </div>
  );
};

export default CourseBuilder;
