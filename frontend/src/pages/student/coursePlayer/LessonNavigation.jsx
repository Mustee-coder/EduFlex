import React from "react";
// eslint-disable-next-line no-unused-vars -- Core ESLint does not count JSX member references.
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
        <span className="hidden sm:inline text-sm font-semibold">Previous</span>
      </motion.button>

      {/* Lesson Counter - Mobile Only */}
      <div className="md:hidden flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="text-xs font-semibold text-slate-600">
          {currentIndex + 1} / {totalLessons}
        </span>
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={!isLastLesson ? { scale: 1.05 } : {}}
        whileTap={!isLastLesson ? { scale: 0.95 } : {}}
        onClick={goToNextLesson}
        disabled={isLastLesson}
        className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50 group md:col-span-1 col-span-2"
      >
        <span className="hidden sm:inline text-sm">Next Lesson</span>
        <span className="sm:hidden text-sm">Next</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-[2px] transition-transform" />
      </motion.button>

    </motion.div>
  );
};

export default LessonNavigation;
