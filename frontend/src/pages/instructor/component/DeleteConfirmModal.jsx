import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Trash2, Loader } from "lucide-react";

const DeleteConfirmModal = ({
  isOpen,
  deleteType,
  onCancel,
  onConfirm,
  isDeleting,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-xl sm:p-8"
          >
            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>

            {/* Content */}
            <h2 className="builder-title mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
              Delete {deleteType === "section" ? "Section" : "Lesson"}?
            </h2>

            <p className="mb-6 text-sm text-gray-600 sm:text-base">
              {deleteType === "section"
                ? "This section and all its lessons will be permanently removed. This action cannot be undone."
                : "This lesson will be permanently removed from the section. This action cannot be undone."}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="flex-1 rounded-xl border-2 border-gray-200 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 sm:py-3 sm:text-base"
              >
                Cancel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:py-3 sm:text-base"
              >
                {isDeleting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Deleting...</span>
                    <span className="sm:hidden">Wait</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Delete
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
