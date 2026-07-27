import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ progress, completedLessons, totalLessons }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="border-t border-gray-700 pt-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Overall Course Progress</h3>
        <p className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          {progress.toFixed(0)}%
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 rounded-full shadow-lg"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <p className="text-xs text-gray-400">Completed</p>
          <p className="text-lg font-bold text-emerald-400">{completedLessons}</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <p className="text-xs text-gray-400">Remaining</p>
          <p className="text-lg font-bold text-gray-300">{totalLessons - completedLessons}</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-lg font-bold text-gray-400">{totalLessons}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressBar;
