import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Lightbulb } from "lucide-react";

const LessonContent = ({
  currentLesson,
  currentIndex,
  course,
  completedLessons,
  markAsCompleted,
}) => {
  const isCompleted = completedLessons.includes(currentLesson?._id);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-900 p-4 md:p-8 space-y-6">
      
      {/* Lesson Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {currentLesson?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {currentLesson?.timeDuration || "5"} min
              </span>
              <span>Lesson {currentIndex + 1} of {course?.allSubSections?.length}</span>
            </div>
          </div>

          {!isCompleted && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => markAsCompleted(currentLesson._id)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg font-semibold text-sm whitespace-nowrap transition-all shadow-lg"
            >
              Mark Complete
            </motion.button>
          )}
        </div>

        {/* Completion Badge */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/50 px-3 py-1.5 rounded-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-400">Completed</span>
          </motion.div>
        )}
      </motion.div>

      {/* Description */}
      {currentLesson?.description && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
        >
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            {currentLesson.description}
          </p>
        </motion.div>
      )}

      {/* Learning Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-700/30 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-300 text-sm">Pro Tip</p>
            <p className="text-xs text-blue-200 mt-1 leading-relaxed">
              Take notes while watching to better retain the information. Don't forget to mark this lesson as complete before moving to the next one!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LessonContent;



61916927223