import { motion as Motion } from "framer-motion";
const CourseSkeleton = () => {
  return (
    <Motion.div className="bg-white rounded-2xl overflow-hidden shadow animate-pulse">
      <div className="h-48 bg-gray-300" />

      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-300 rounded w-3/4" />

        <div className="h-3 bg-gray-200 rounded w-full" />

        <div className="flex gap-2">
          <div className="h-4 bg-gray-300 rounded flex-1" />
          <div className="h-4 bg-gray-300 rounded flex-1" />
        </div>
      </div>
    </Motion.div>
  );
};

export default CourseSkeleton;