import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useFullCourseDetails } from "@/hooks/useFullCourseDetails";
import { useUpdateCourseProgress } from "@/hooks/useUpdateCourseProgress";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Loading } from "@/components/Loader";
import CoursePlayerSidebar from "./coursePlayer/CoursePlayerSidebar";
import VideoPlayerSection from "./coursePlayer/VideoPlayerSection";
import LessonContent from "./coursePlayer/LessonContent";
import ProgressBar from "./coursePlayer/ProgressBar";
import LessonNavigation from "./coursePlayer/LessonNavigation";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useFullCourseDetails(courseId);
  const course = data?.data?.courseDetails;

  if (isLoading) return <Loading />;
  if (isError || !course) return (
    <div className="student-page mx-auto flex min-h-[60vh] max-w-5xl items-center px-4 py-8 sm:px-6">
      <div className="student-panel w-full p-6 sm:p-8" role="alert">
        <AlertCircle className="mb-3 text-rose-600" aria-hidden="true" />
        <h1 className="text-xl font-semibold text-slate-900">This course isn’t available</h1>
        <p className="mt-2 text-sm text-slate-600">We couldn’t load the course. Return to your dashboard and try again.</p>
        <button type="button" onClick={() => navigate("/dashboard")} className="student-button-primary mt-5">Back to dashboard</button>
      </div>
    </div>
  );

  return <CoursePlayerExperience key={courseId} courseId={courseId} course={course} initialCompletedLessons={data?.data?.completedLessons ?? EMPTY_COMPLETED_LESSONS} progressFromServer={data?.data?.progressPercentage ?? 0} />;
};

const EMPTY_COMPLETED_LESSONS = [];

const CoursePlayerExperience = ({ courseId, course, initialCompletedLessons, progressFromServer }) => {
  const queryClient = useQueryClient();
  const { mutate: updateProgress } = useUpdateCourseProgress();
  const videoRef = useRef(null);
  const [currentLesson, setCurrentLesson] = useState(() => {
    const lessons = course.allSubSections || [];
    const savedLessonId = localStorage.getItem(`lastLesson-${courseId}`);
    return lessons.find((lesson) => lesson._id === savedLessonId) || lessons[0] || null;
  });
  const [completedLessons, setCompletedLessons] = useState(initialCompletedLessons);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [expandedSection, setExpandedSection] = useState(() => currentLesson?.section || null);

  useEffect(() => {
    if (window.innerWidth >= 768) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = sidebarOpen ? "hidden" : previousOverflow;
    return () => { document.body.style.overflow = previousOverflow; };
  }, [sidebarOpen]);

  const syncProgress = (lessonId) => {
    if (!courseId || !lessonId) return;
    updateProgress({ courseId, subSectionId: lessonId }, {
      onSuccess: (response) => {
        const nextCompleted = response?.completedLessons || [];
        const nextPercentage = response?.progressPercentage ?? 0;
        setCompletedLessons(nextCompleted);
        queryClient.setQueryData(["full-course-details", courseId], (oldData) => {
          if (!oldData) return oldData;
          return { ...oldData, data: { ...oldData.data, completedLessons: nextCompleted, progressPercentage: nextPercentage } };
        });
      },
      onError: () => toast.error("Your progress couldn’t sync. Please try again."),
    });
  };

  const handleSelectLesson = (lesson) => {
    setCurrentLesson(lesson);
    localStorage.setItem(`lastLesson-${courseId}`, lesson._id);
    syncProgress(lesson._id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const markAsCompleted = (lessonId) => {
    if (completedLessons.includes(lessonId)) return;
    setCompletedLessons((previous) => [...previous, lessonId]);
    toast.success("Lesson marked as completed");
    syncProgress(lessonId);
  };

  const lessonList = course.allSubSections || [];
  const currentIndex = lessonList.findIndex((lesson) => lesson._id === currentLesson?._id);
  const progress = progressFromServer ?? (lessonList.length ? (completedLessons.length / lessonList.length) * 100 : 0);

  const goToLesson = (lesson) => {
    if (!lesson) return;
    handleSelectLesson(lesson);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goToNextLesson = () => goToLesson(lessonList[currentIndex + 1]);
  const goToPreviousLesson = () => goToLesson(lessonList[currentIndex - 1]);
  const handleVideoEnd = () => {
    if (!currentLesson) return;
    markAsCompleted(currentLesson._id);
    const nextLesson = lessonList[currentIndex + 1];
    if (nextLesson) window.setTimeout(() => goToLesson(nextLesson), 800);
  };

  return (
    <div className="player-root flex min-h-[calc(100vh-4rem)] w-full min-w-0 flex-col bg-slate-950 text-white md:flex-row">
      <CoursePlayerSidebar course={course} currentLesson={currentLesson} completedLessons={completedLessons} expandedSection={expandedSection} setExpandedSection={setExpandedSection} handleSelectLesson={handleSelectLesson} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} progress={progress} />
      <div className="flex min-w-0 flex-1 flex-col">
        <VideoPlayerSection ref={videoRef} currentLesson={currentLesson} handleVideoEnd={handleVideoEnd} />
        <div className="min-w-0 flex-1 space-y-5 bg-white p-4 sm:p-6 md:p-8">
          <LessonContent currentLesson={currentLesson} currentIndex={currentIndex} course={course} completedLessons={completedLessons} markAsCompleted={markAsCompleted} />
          <LessonNavigation goToPreviousLesson={goToPreviousLesson} goToNextLesson={goToNextLesson} currentIndex={currentIndex} totalLessons={lessonList.length} isFirstLesson={currentIndex <= 0} isLastLesson={currentIndex < 0 || currentIndex >= lessonList.length - 1} />
          <ProgressBar progress={progress} completedLessons={completedLessons.length} totalLessons={lessonList.length} />
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
