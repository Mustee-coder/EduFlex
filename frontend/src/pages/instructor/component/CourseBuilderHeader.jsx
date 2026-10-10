import React from "react";
import { motion as Motion } from "framer-motion";
import {
  Layers,
  CheckCircle2,
  Clock,
  Loader,
  X,
} from "lucide-react";

const CourseBuilderHeader = ({
  course,
  isPublishing,
  publishCourse,
  courseId,
}) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8"
    >
      {/* Title Section */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 sm:mb-6">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#8577F4]">
            <Layers className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="builder-title break-words text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl">
            {course.courseName}
          </h1>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600 sm:mt-2 sm:text-base">
            {course.courseDescription}
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {/* Status & Stats */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold sm:px-4 sm:py-2 sm:text-sm ${
              course.status === "Published"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {course.status === "Published" ? (
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
            {course.status}
          </span>

          <span className="text-xs font-semibold text-gray-600 sm:text-sm">
            {course.sections?.length || 0} sections •{" "}
            {course.sections?.reduce(
              (acc, s) => acc + (s.subSections?.length || 0),
              0
            ) || 0}{" "}
            lessons
          </span>
        </div>

        {/* Publish Button */}
        <Motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            publishCourse({
              courseId,
              status:
                course.status === "Published" ? "Draft" : "Published",
            })
          }
          disabled={isPublishing}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold transition-all sm:w-auto sm:px-6 sm:py-3 ${
            course.status === "Published"
              ? "bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 text-white text-sm sm:text-base"
              : "bg-gradient-to-r from-[#6C5CE7] to-[#8577F4] hover:from-[#5749C8] hover:to-[#7464E8] disabled:cursor-not-allowed disabled:opacity-60 text-white text-sm sm:text-base"
          }`}
        >
          {isPublishing ? (
            <>
              <Loader className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Updating...</span>
              <span className="sm:hidden">Loading</span>
            </>
          ) : course.status === "Published" ? (
            <>
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Unpublish</span>
              <span className="sm:hidden">Unpub</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Publish</span>
              <span className="sm:hidden">Pub</span>
            </>
          )}
        </Motion.button>
      </div>
    </Motion.div>
  );
};

export default CourseBuilderHeader;
