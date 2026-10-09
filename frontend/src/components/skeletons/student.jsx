import { motion as Motion } from "framer-motion";

export const CourseSkeleton = () => {
  return (
    <Motion.div
      className="bg-white rounded-2xl overflow-hidden shadow animate-pulse"
    >
      <div className="h-48 bg-gradient-to-br from-gray-300 to-gray-200" />

      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-300 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />

        <div className="flex gap-2 mt-4">
          <div className="h-4 bg-gray-300 rounded w-1/4" />
          <div className="h-4 bg-gray-300 rounded w-1/4" />
        </div>

        <div className="h-4 bg-purple-300 rounded w-1/3 mt-4" />
      </div>
    </Motion.div>
  );
};


export const CourseSkeletons = () => {
  return (
    <Motion.div
      className="bg-white rounded-2xl overflow-hidden shadow animate-pulse"
    >
      <div className="h-48 bg-gradient-to-br from-gray-300 to-gray-200" />

      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-2 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-1/3" />
      </div>
    </Motion.div>
  );
};