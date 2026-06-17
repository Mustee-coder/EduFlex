import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useFullCourseDetails } from "@/hooks/useFullCourseDetails";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const { data, isLoading, error } = useFullCourseDetails(courseId);

  const courseDetails = data?.data?.courseDetails;
  const sections = courseDetails?.sections || [];

  // flatten lessons while keeping section info
  const lessons = sections.flatMap((sec) =>
    (sec.subSections || []).map((s) => ({ ...s, sectionTitle: sec.title }))
  );

  const initialCompleted = data?.data?.completedLessons || [];
  const progressPercentage = data?.data?.progressPercentage || 0;

  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(initialCompleted);
  const [showSidebar, setShowSidebar] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (lessons.length > 0 && !currentLesson) {
      setCurrentLesson(lessons[0]);
    }
  }, [lessons, currentLesson]);

  useEffect(() => {
    setCompletedLessons(initialCompleted || []);
  }, [initialCompleted]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4">Error: {error.message}</div>;

  const handleSelectLesson = (lesson) => {
    setCurrentLesson(lesson);
    if (window.innerWidth < 1024) setShowSidebar(false);
  };

  const handleMarkCompleted = (lessonId) => {
    setCompletedLessons((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
  };

  const currentIndex = lessons.findIndex((l) => l._id === currentLesson?._id);

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentLesson(lessons[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-6">
          {/* Video + controls */}
          <div className="flex-1">
            <div className="bg-black rounded-lg overflow-hidden">
              {currentLesson?.videoUrl ? (
                <video
                  ref={videoRef}
                  controls
                  src={currentLesson.videoUrl}
                  className="w-full h-[60vh] lg:h-[70vh] bg-black"
                  onEnded={() => handleMarkCompleted(currentLesson._id)}
                />
              ) : (
                <div className="flex items-center justify-center h-[60vh] lg:h-[70vh] text-white">
                  No video available for this lesson
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex <= 0}
                  className="px-3 py-2 bg-white border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= lessons.length - 1}
                  className="px-3 py-2 bg-white border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              <div className="text-sm text-gray-600">Progress: {progressPercentage}%</div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className={`w-full lg:w-96 bg-white border rounded-lg p-3 ${showSidebar ? "block" : "hidden"}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Lessons</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{completedLessons.length}/{lessons.length} completed</span>
                <button
                  className="lg:hidden px-2 py-1 text-sm bg-gray-100 rounded"
                  onClick={() => setShowSidebar(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[70vh] overflow-auto">
              {sections.map((sec) => (
                <div key={sec._id} className="border-b pb-2">
                  <div className="font-medium text-gray-700 mb-1">{sec.title}</div>
                  <div className="space-y-1">
                    {(sec.subSections || []).map((sub) => {
                      const completed = completedLessons.includes(sub._id);
                      return (
                        <button
                          key={sub._id}
                          onClick={() => handleSelectLesson(sub)}
                          className={`w-full text-left px-2 py-2 rounded flex items-center justify-between ${currentLesson?._id === sub._id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                        >
                          <div>
                            <div className="text-sm font-medium">{sub.title}</div>
                            <div className="text-xs text-gray-500">{sub.timeDuration ? `${sub.timeDuration}s` : "—"}</div>
                          </div>
                          <div className="text-sm">
                            {completed ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkCompleted(sub._id);
                                }}
                                className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                              >
                                Mark
                              </button>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Mobile toggle */}
          {!showSidebar && (
            <div className="fixed bottom-6 right-6 lg:hidden">
              <button
                onClick={() => setShowSidebar(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg"
              >
                Lessons
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
