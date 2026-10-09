import React from "react";
// eslint-disable-next-line no-unused-vars -- Core ESLint does not count JSX member references.
import { motion } from "framer-motion";

const ProgressBar = ({ progress, completedLessons, totalLessons }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="space-y-4 border-t border-slate-200 pt-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Overall Course Progress</h3>
        <p className="text-sm font-semibold text-indigo-700">
          {progress.toFixed(0)}%
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Course progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full bg-indigo-600"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center sm:gap-3">
        <div className="rounded-lg border border-slate-200 bg-white p-2.5 sm:p-3">
          <p className="text-xs text-slate-500">Completed</p>
          <p className="text-lg font-semibold text-emerald-700">{completedLessons}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-2.5 sm:p-3">
          <p className="text-xs text-slate-500">Remaining</p>
          <p className="text-lg font-semibold text-slate-700">{Math.max(0, totalLessons - completedLessons)}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-2.5 sm:p-3">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-lg font-semibold text-slate-700">{totalLessons}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressBar;
