import React from "react";
// eslint-disable-next-line no-unused-vars -- Core ESLint does not count JSX member references.
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
    <div className="space-y-5 text-slate-900">
      
      {/* Lesson Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              {currentLesson?.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
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
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-800"
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
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-semibold text-emerald-800">Completed</span>
          </motion.div>
        )}
      </motion.div>

      {/* Description */}
      {currentLesson?.description && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4"
        >
          <p className="text-sm leading-7 text-slate-700 md:text-base">
            {currentLesson.description}
          </p>
        </motion.div>
      )}

      {/* Learning Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-indigo-100 bg-indigo-50 p-4"
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700" />
          <div>
            <p className="text-sm font-semibold text-indigo-900">Pro Tip</p>
            <p className="mt-1 text-sm leading-6 text-indigo-900/80">
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