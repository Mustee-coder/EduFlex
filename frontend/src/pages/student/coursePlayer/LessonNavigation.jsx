import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from "lucide-react";

const LessonNavigation = ({
  goToPreviousLesson,
  goToNextLesson,
  currentIndex,
  totalLessons,
  isFirstLesson,
  isLastLesson,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-2 gap-3 md:flex md:gap-3"
    >
      {/* Previous Button */}
      <motion.button
        whileHover={!isFirstLesson ? { scale: 1.05 } : {}}
        whileTap={!isFirstLesson ? { scale: 0.95 } : {}}
        onClick={goToPreviousLesson}
        disabled={isFirstLesson}
        className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-600 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
        <span className="hidden sm:inline text-sm font-semibold">Previous</span>
      </motion.button>

      {/* Lesson Counter - Mobile Only */}
      <div className="md:hidden flex items-center justify-center px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg">
        <span className="text-xs font-bold text-gray-300">
          {currentIndex + 1} / {totalLessons}
        </span>
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={!isLastLesson ? { scale: 1.05 } : {}}
        whileTap={!isLastLesson ? { scale: 0.95 } : {}}
        onClick={goToNextLesson}
        disabled={isLastLesson}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all group md:col-span-1 col-span-2"
      >
        <span className="hidden sm:inline text-sm">Next Lesson</span>
        <span className="sm:hidden text-sm">Next</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-[2px] transition-transform" />
      </motion.button>

      {/* End Course Button - Desktop */}
      {isLastLesson && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
        >
          <SkipForward className="w-4 h-4" />
          Course Complete
        </motion.button>
      )}
    </motion.div>
  );
};

export default LessonNavigation;
