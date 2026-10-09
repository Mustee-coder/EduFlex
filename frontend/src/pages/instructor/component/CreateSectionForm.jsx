import React from "react";
import { motion as Motion } from "framer-motion";
import { Plus, Loader } from "lucide-react";

const CreateSectionForm = ({
  sectionName,
  setSectionName,
  isPending,
  handleCreateSection,
}) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
          <Plus className="h-5 w-5 text-emerald-600" />
        </div>

        <div>
          <h2 className="builder-title text-lg font-bold text-gray-900 sm:text-xl">
            Create Section
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Organize your course by adding a new section.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleCreateSection}
        className="flex flex-col gap-4 md:flex-row"
      >
        <input
          type="text"
          placeholder="e.g. Introduction to React"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          disabled={isPending}
          className="input-animate w-full flex-1 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        />

        <Motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white transition-all hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:min-w-[180px]"
        >
          {isPending ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Add Section</span>
            </>
          )}
        </Motion.button>
      </form>
    </Motion.div>
  );
};

export default CreateSectionForm;
