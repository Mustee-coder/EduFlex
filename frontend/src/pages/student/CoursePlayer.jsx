
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFullCourseDetails } from "@/hooks/useFullCourseDetails";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const CoursePlayer = () => {
const { courseId } = useParams();

const { data, isLoading, isError } =
useFullCourseDetails(courseId);

const course = data?.data?.courseDetails;

const [currentLesson, setCurrentLesson] = useState(null);
const [completedLessons, setCompletedLessons] = useState([]);
const [sidebarOpen, setSidebarOpen] = useState(false);

// Resume lesson
useEffect(() => {
if (!course?.allSubSections?.length) return;

const savedLessonId = localStorage.getItem(
  `lastLesson-${courseId}`
);

const startLesson =
  course.allSubSections.find(
    (lesson) => lesson._id === savedLessonId
  ) || course.allSubSections[0];

setCurrentLesson(startLesson);
setCompletedLessons(course.completedLessons || []);

}, [course, courseId]);

// Prevent background scroll
useEffect(() => {
document.body.style.overflow = sidebarOpen
? "hidden"
: "auto";

return () => {
  document.body.style.overflow = "auto";
};

}, [sidebarOpen]);

if (isLoading) return <LoadingSpinner />;
if (isError) return <p>Failed to load course</p>;

const syncProgress = (type, lessonId) => {
console.log("sync:", type, lessonId);
};

const handleSelectLesson = (lesson) => {
setCurrentLesson(lesson);

localStorage.setItem(
  `lastLesson-${courseId}`,
  lesson._id
);

syncProgress("watching", lesson._id);

setSidebarOpen(false);

};

const markAsCompleted = (lessonId) => {
if (completedLessons.includes(lessonId)) return;

const updated = [...completedLessons, lessonId];

setCompletedLessons(updated);

syncProgress("completed", lessonId);

};

const currentIndex =
course?.allSubSections?.findIndex(
(lesson) => lesson._id === currentLesson?._id
) ?? 0;

const goToNextLesson = () => {
const nextLesson =
course?.allSubSections?.[currentIndex + 1];

if (nextLesson) {
  handleSelectLesson(nextLesson);
}

};

const goToPreviousLesson = () => {
const previousLesson =
course?.allSubSections?.[currentIndex - 1];

if (previousLesson) {
  handleSelectLesson(previousLesson);
}

};

const handleVideoEnd = () => {
markAsCompleted(currentLesson._id);

const nextLesson =
  course?.allSubSections?.[currentIndex + 1];

if (nextLesson) {
  handleSelectLesson(nextLesson);
}

};

const progress =
course?.progressPercentage ??
(course?.allSubSections?.length
? (completedLessons.length /
course.allSubSections.length) *
100
: 0);

const LessonSidebar = () => (
<div className="h-full overflow-y-auto">
<h2 className="p-4 text-lg font-bold border-b">
{course?.courseName}
</h2>

  {course?.sections?.map((section) => (
    <div key={section._id}>
      <h3 className="px-4 py-2 font-semibold bg-gray-50">
        {section.sectionName}
      </h3>

      {course?.allSubSections
        ?.filter(
          (lesson) => lesson.section === section._id
        )
        .map((lesson) => {
          const isActive =
            currentLesson?._id === lesson._id;

          const isCompleted =
            completedLessons.includes(lesson._id);

          return (
            <div
              key={lesson._id}
              onClick={() =>
                handleSelectLesson(lesson)
              }
              className={`px-4 py-3 flex items-center justify-between cursor-pointer
              ${
                isActive
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <span>{lesson.title}</span>

              {isCompleted && (
                <span>✔</span>
              )}
            </div>
          );
        })}
    </div>
  ))}
</div>

);

return (
<div className="flex flex-col md:flex-row h-screen bg-gray-100">
{/* MOBILE HEADER */}
<div className="md:hidden flex items-center justify-between p-3 bg-white border-b">
<h2 className="font-bold truncate">
{course?.courseName}
</h2>

    <button
      onClick={() => setSidebarOpen(true)}
      className="px-3 py-1 rounded bg-blue-500 text-white"
    >
      Lessons
    </button>
  </div>

  {/* DESKTOP SIDEBAR */}
  <div className="hidden md:block md:w-1/3 lg:w-1/4 bg-white border-r">
    <LessonSidebar />
  </div>

  {/* MOBILE SIDEBAR */}
  {sidebarOpen && (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-2/3 bg-white shadow-lg">
        <LessonSidebar />
      </div>

      <div
        className="flex-1 bg-black/50"
        onClick={() =>
          setSidebarOpen(false)
        }
      />
    </div>
  )}

  {/* MAIN CONTENT */}
  <div className="flex-1 flex flex-col">
    {/* VIDEO */}
    <div className="bg-black aspect-video md:h-[60%]">
      {currentLesson?.videoUrl ? (
        <video
          src={currentLesson.videoUrl}
          controls
          onEnded={handleVideoEnd}
          className="w-full h-full"
        />
      ) : (
        <div className="h-full flex items-center justify-center text-white">
          No video selected
        </div>
      )}
    </div>

    {/* CONTENT */}
    <div className="flex-1 overflow-y-auto bg-white p-4">
      <h1 className="text-xl font-bold">
        {currentLesson?.title}
      </h1>

      <p className="mt-2 text-gray-600">
        {currentLesson?.description}
      </p>

      <div className="flex gap-3 mt-4">
        <button
          onClick={goToPreviousLesson}
          disabled={currentIndex === 0}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={goToNextLesson}
          disabled={
            currentIndex ===
            course?.allSubSections?.length - 1
          }
          className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
        >
          Next Lesson
        </button>
      </div>

      {!completedLessons.includes(
        currentLesson?._id
      ) && (
        <button
          onClick={() =>
            markAsCompleted(
              currentLesson._id
            )
          }
          className="mt-4 px-4 py-2 rounded bg-green-500 text-white"
        >
          Mark Completed
        </button>
      )}

      <div className="mt-6">
        <div className="w-full h-2 rounded bg-gray-200">
          <div
            className="h-2 rounded bg-green-500 transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Progress: {progress.toFixed(0)}%
        </p>

        <p className="text-sm text-gray-500">
          Lesson {currentIndex + 1} of{" "}
          {course?.allSubSections?.length}
        </p>
      </div>
    </div>
  </div>
</div>

);
};

export default CoursePlayer;
