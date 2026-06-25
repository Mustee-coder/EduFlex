import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit2 } from 'lucide-react';
import { useFullCourseDetails } from '@/hooks/useFullCourseDetails';
import { useCreateSection } from '@/hooks/useCreateSection';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const CourseBuilder = () => {
  const { courseId } = useParams();
  const { data: courseData, isLoading } = useFullCourseDetails(courseId);
  const { mutate: createSection, isPending } = useCreateSection();

  const [sectionName, setSectionName] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const course = courseData?.data;

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
        }
      }
    );
  };

  const toggleSectionExpand = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // if (isLoading) {
  //   return <LoadingSpinner />;
  // }

  if (!course) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Course not found</h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{course.courseName}</h1>
        <p className="text-gray-600">{course.courseDescription}</p>
      </div>

      {/* Create Section Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Section</h2>
        <form onSubmit={handleCreateSection} className="flex gap-3">
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2 transition"
          >
            <Plus size={18} />
            {isPending ? 'Creating...' : 'Add Section'}
          </button>
        </form>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Course Sections</h2>
        
        {course.courseContent && course.courseContent.length > 0 ? (
          course.courseContent.map((section) => (
            <div
              key={section._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Section Header */}
              <div
                onClick={() => toggleSectionExpand(section._id)}
                className="p-6 bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center justify-between transition"
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
                    <h3 className="text-lg font-semibold text-gray-800">
                      {section.sectionName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {section.subSection ? section.subSection.length : 0} lessons
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                    title="Edit section"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                    title="Delete section"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Subsections */}
              {expandedSections[section._id] && (
                <div className="border-t p-6 bg-gray-50">
                  {section.subSection && section.subSection.length > 0 ? (
                    <div className="space-y-3">
                      {section.subSection.map((subSection) => (
                        <div
                          key={subSection._id}
                          className="bg-white p-4 rounded-md border border-gray-200 flex items-center justify-between hover:shadow-md transition"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">
                              {subSection.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {subSection.timeDuration || 'No duration'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                              title="Edit lesson"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                              title="Delete lesson"
                            >
                              <Trash2 size={16} />
                            </button>
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
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              No sections yet. Create one above to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseBuilder;
