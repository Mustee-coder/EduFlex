import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useFullCourseDetails } from "@/hooks/useFullCourseDetails";
import { useUpdateCourseProgress } from "@/hooks/useUpdateCourseProgress";
import { toast } from "sonner";
import { AlertCircle, Loader } from "lucide-react";
import { Loading } from "@/components/Loader";

// Sub-components
import CoursePlayerSidebar from "./coursePlayer/CoursePlayerSidebar";
import VideoPlayerSection from "./coursePlayer/VideoPlayerSection";
import LessonContent from "./coursePlayer/LessonContent";
import ProgressBar from "./coursePlayer/ProgressBar";
import LessonNavigation from "./coursePlayer/LessonNavigation";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useFullCourseDetails(courseId);
  const queryClient = useQueryClient();
  const { mutate: updateProgress } = useUpdateCourseProgress();

  const course = data?.data?.courseDetails;
  const completedLessonsFromServer = data?.data?.completedLessons || [];
  const progressFromServer = data?.data?.progressPercentage ?? 0;

  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(
    completedLessonsFromServer
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState(null);
  const videoRef = useRef(null);

  // Initialize lesson
  useEffect(() => {
    if (!course?.allSubSections?.length) return;

    const savedLessonId = localStorage.getItem(`lastLesson-${courseId}`);
    const startLesson =
      course.allSubSections.find((lesson) => lesson._id === savedLessonId) ||
      course.allSubSections[0];

    setCurrentLesson(startLesson);
    setCompletedLessons(completedLessonsFromServer);
    setExpandedSection(startLesson.section);
  }, [course, courseId, completedLessonsFromServer]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  // Sync progress to server
  const syncProgress = (type, lessonId) => {
    if (!courseId || !lessonId) return;

    updateProgress(
      { courseId, subSectionId: lessonId },
      {
        onSuccess: (data) => {
          const nextCompleted = data?.completedLessons || [];
          const nextPercentage = data?.progressPercentage ?? 0;

          setCompletedLessons(nextCompleted);
          queryClient?.setQueryData(
            ["full-course-details", courseId],
            (oldData) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                data: {
                  ...oldData.data,
                  completedLessons: nextCompleted,
                  progressPercentage: nextPercentage,
                },
              };
            }
          );
        },
        onError: (error) => {
          console.error("Progress sync failed", error);
          toast.error("Failed to sync progress");
        },
      }
    );
  };

  // Select lesson
  const handleSelectLesson = (lesson) => {
    setCurrentLesson(lesson);
    localStorage.setItem(`lastLesson-${courseId}`, lesson._id);
    syncProgress("watching", lesson._id);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Mark as complete
  const markAsCompleted = (lessonId) => {
    if (completedLessons.includes(lessonId)) return;

    const updated = [...completedLessons, lessonId];
    setCompletedLessons(updated);
    toast.success("Lesson marked as completed!");
    syncProgress("completed", lessonId);
  };

  // Navigation
  const currentIndex =
    course?.allSubSections?.findIndex(
      (lesson) => lesson._id === currentLesson?._id
    ) ?? 0;

  const goToNextLesson = () => {
    const nextLesson = course?.allSubSections?.[currentIndex + 1];
    if (nextLesson) {
      handleSelectLesson(nextLesson);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousLesson = () => {
    const previousLesson = course?.allSubSections?.[currentIndex - 1];
    if (previousLesson) {
      handleSelectLesson(previousLesson);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleVideoEnd = () => {
    markAsCompleted(currentLesson._id);
    const nextLesson = course?.allSubSections?.[currentIndex + 1];
    if (nextLesson) {
      setTimeout(() => handleSelectLesson(nextLesson), 1000);
    }
  };

  // Calculate progress
  const progress =
    progressFromServer ??
    (course?.allSubSections?.length
      ? (completedLessons.length / course.allSubSections.length) * 100
      : 0);

  // Loading state
  if (isLoading) {
    return <Loading />;
  }
  
  
  // Error state
  if (isError || !course) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gray-800 rounded-2xl p-8 text-center border border-red-500/20"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Course Not Found</h2>
          <p className="text-gray-400 mb-6">Unable to load course details.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition-all"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="player-root flex flex-col md:flex-row w-full h-screen bg-gray-900 text-white overflow-hidden">
      
      {/* Sidebar */}
      <CoursePlayerSidebar
        course={course}
        currentLesson={currentLesson}
        completedLessons={completedLessons}
        expandedSection={expandedSection}
        setExpandedSection={setExpandedSection}
        handleSelectLesson={handleSelectLesson}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        progress={progress}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Video Player */}
        <VideoPlayerSection
          ref={videoRef}
          currentLesson={currentLesson}
          handleVideoEnd={handleVideoEnd}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-900 p-4 md:p-8 space-y-6">
          
          {/* Lesson Info */}
          <LessonContent
            currentLesson={currentLesson}
            currentIndex={currentIndex}
            course={course}
            completedLessons={completedLessons}
            markAsCompleted={markAsCompleted}
          />

          {/* Navigation */}
          <LessonNavigation
            goToPreviousLesson={goToPreviousLesson}
            goToNextLesson={goToNextLesson}
            currentIndex={currentIndex}
            totalLessons={course?.allSubSections?.length}
            isFirstLesson={currentIndex === 0}
            isLastLesson={currentIndex === course?.allSubSections?.length - 1}
          />

          {/* Progress Bar */}
          <ProgressBar
            progress={progress}
            completedLessons={completedLessons.length}
            totalLessons={course?.allSubSections?.length}
          />
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
