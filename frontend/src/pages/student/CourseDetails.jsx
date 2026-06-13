import { useParams } from "react-router-dom";
import { useCourseDetails } from "@/hooks/useCourseDetails";
import { useUpdateCourseProgress } from "@/hooks/useUpdateCourseProgress";
import { useMemo, useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, CheckCircle, PlayCircle } from "lucide-react";

const CourseDetails = () => {
  const { courseId } = useParams();
  const { data, isLoading } = useCourseDetails(courseId);

  //  Use the hook — NOT direct service call
  const { mutate: markProgress, isPending: isMarkingProgress } = useUpdateCourseProgress();

  const course = data?.data?.courseDetails;
  const courseProgress = data?.data?.courseProgress;

  const allLessons = useMemo(() => {
    return course?.sections?.flatMap((s) => s.subSections) || [];
  }, [course]);

  const [activeLesson, setActiveLesson] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);

  //  INIT — set active lesson, progress, completed, and open all sections
  const initialized = useRef(false); 


useEffect(() => {
  if (!course?.sections?.length) return;
  if (initialized.current) return; 
  //  Don't re-run after first init
  initialized.current = true;

  // Open all sections
  const allOpen = {};
  course.sections.forEach((s) => { allOpen[s._id] = true; });
  setOpenSections(allOpen);

  // Set active lesson
  const firstLesson = allLessons?.[0];
  const lastWatchedId = courseProgress?.lastWatched;
  const lastLesson = allLessons.find((l) => l._id === lastWatchedId) || firstLesson;
  if (lastLesson) setActiveLesson(lastLesson);

  // Set progress from server
  setProgress(Number(courseProgress?.progressPercentage || 0));
  setCompletedLessons((courseProgress?.completedLessons || []).map(String));

}, [course, courseProgress, allLessons]);

  // ✅ HANDLE VIDEO END — uses hook, updates cache + local state
  const handleVideoEnd = () => {
    if (!activeLesson?._id || !course?._id) return;

    markProgress(
      { courseId: course._id, subSectionId: activeLesson._id },
      {
        onSuccess: (data) => {
          // Update local state from response
          setProgress(Number(data?.progressPercentage || 0));
          setCompletedLessons((data?.completedLessons || []).map(String));

          // Auto advance to next lesson
          const index = allLessons.findIndex((l) => l._id === activeLesson._id);
          if (index !== -1 && index < allLessons.length - 1) {
            setActiveLesson(allLessons[index + 1]);
          }
        },
        onError: (err) => {
          console.error("Progress update failed:", err.message);
        },
      }
    );
  };

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isLessonCompleted = (lessonId) =>
    completedLessons.includes(String(lessonId));

  // ─── Loading ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading course...</p>
        </div>
      </div>
    );
  }

  // ─── Not found ─────────────────────────────────────────────
  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 font-semibold">Course not found</p>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-gray-50">

      {/* HEADER */}
      <div className="bg-white px-5 py-4 border-b shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 truncate">
          {course.courseName}
        </h1>
        <p className="text-gray-500 text-sm mt-0.5 truncate">
          {course.courseDescription}
        </p>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {progress}% Complete
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        {/* VIDEO PANEL */}
        <div className="flex-1 bg-black flex flex-col overflow-hidden">
          {activeLesson ? (
            <>
              <video
                key={activeLesson._id}
                src={activeLesson.videoUrl}
                controls
                onEnded={handleVideoEnd}
                className="w-full aspect-video"
              />

              {/* Lesson info + manual complete button */}
              <div className="bg-white p-4 border-t flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    {activeLesson.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {activeLesson.description}
                  </p>
                </div>

                {/* ✅ Backup button if onEnded doesn't fire */}
                {!isLessonCompleted(activeLesson._id) && (
                  <button
                    onClick={handleVideoEnd}
                    disabled={isMarkingProgress}
                    className="shrink-0 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    {isMarkingProgress ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Mark Complete
                      </>
                    )}
                  </button>
                )}

                {isLessonCompleted(activeLesson._id) && (
                  <span className="shrink-0 flex items-center gap-1 text-green-600 text-sm font-medium">
                    <CheckCircle size={16} />
                    Completed
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              <PlayCircle size={32} className="mr-2" />
              Select a lesson to start
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="w-full lg:w-[380px] bg-white border-l flex flex-col overflow-hidden">
          <div className="p-4 font-semibold text-gray-900 border-b shrink-0">
            Course Content
          </div>

          <div className="overflow-y-auto flex-1">
            {course.sections?.map((section) => {
              const sectionLessons = section.subSections || [];
              const completedCount = sectionLessons.filter((l) =>
                isLessonCompleted(l._id)
              ).length;

              return (
                <div key={section._id} className="border-b">

                  {/* Section header */}
                  <div
                    onClick={() => toggleSection(section._id)}
                    className="p-3 cursor-pointer bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">
                        {section.sectionName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {completedCount}/{sectionLessons.length} lessons
                      </p>
                    </div>
                    {openSections[section._id] ? (
                      <ChevronDown size={16} className="text-gray-400 shrink-0" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    )}
                  </div>

                  {/* Lessons list */}
                  {openSections[section._id] && (
                    <div className="py-1">
                      {sectionLessons.map((lesson) => {
                        const isCompleted = isLessonCompleted(lesson._id);
                        const isActive = activeLesson?._id === lesson._id;

                        return (
                          <div
                            key={lesson._id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`px-4 py-3 cursor-pointer flex items-start justify-between gap-3 transition-colors ${
                              isActive
                                ? "bg-purple-50 border-l-4 border-purple-600"
                                : "hover:bg-gray-50 border-l-4 border-transparent"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-sm font-medium truncate ${
                                  isActive ? "text-purple-700" : "text-gray-800"
                                }`}
                              >
                                ▶ {lesson.title}
                              </p>
                              {lesson.description && (
                                <p className="text-xs text-gray-400 mt-0.5 truncate">
                                  {lesson.description}
                                </p>
                              )}
                            </div>

                            {isCompleted && (
                              <CheckCircle
                                size={16}
                                className="text-green-500 shrink-0 mt-0.5"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseDetails;
