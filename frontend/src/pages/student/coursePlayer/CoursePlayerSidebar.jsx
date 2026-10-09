import React from "react";
// eslint-disable-next-line no-unused-vars -- Core ESLint does not count JSX member references.
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, CheckCircle2, Play } from "lucide-react";

const CoursePlayerSidebar = ({
  course,
  currentLesson,
  completedLessons,
  expandedSection,
  setExpandedSection,
  handleSelectLesson,
  sidebarOpen,
  setSidebarOpen,
  progress,
}) => {
  return (
    <>
      {/* Mobile Toggle Button */}
     <motion.button
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  onClick={() => setSidebarOpen(!sidebarOpen)}
  type="button"
  aria-label={sidebarOpen ? "Close lesson list" : "Open lesson list"}
  aria-expanded={sidebarOpen}
  className="md:hidden fixed top-[4.5rem] left-3 z-[60] inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-slate-900/90 shadow-lg transition-colors hover:bg-slate-800"
>
        {sidebarOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </motion.button>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-30"
            />

            {/* Sidebar Content */}
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ duration: 0.3 }}
              className="fixed md:sticky top-16 md:top-16 left-0 z-40 h-[calc(100dvh-4rem)] w-[min(21rem,88vw)] shrink-0 overflow-y-auto border-r border-slate-700 bg-slate-900 md:h-[calc(100vh-4rem)] md:w-[19rem]">
              <div className="p-6 space-y-6">
                
                {/* Progress Summary Card */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-xl p-4 border border-emerald-500/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-white">Course Progress</h3>
                    <span className="text-xs font-bold text-emerald-400">
                      {progress.toFixed(0)}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <motion.div
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-emerald-600 to-teal-600"
                    />
                  </div>

                  <p className="text-xs text-gray-400">
                    {completedLessons.length} of {course?.allSubSections?.length} lessons
                  </p>
                </motion.div>

                {/* Lessons List */}
                <div className="space-y-3">
                  {course?.sections?.map((section, sectionIdx) => (
                    <motion.div
                      key={section._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sectionIdx * 0.05 }}
                    >
                      {/* Section Header */}
                      <button
                        onClick={() =>
                          setExpandedSection(
                            expandedSection === section._id ? null : section._id
                          )
                        }
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 transition-colors text-left group"
                      >
                        <span className="font-semibold text-sm text-white group-hover:text-emerald-400 transition-colors">
                          {section.sectionName}
                        </span>
                        <span className="text-xs text-emerald-400 font-bold">
                          {
                            course?.allSubSections?.filter(
                              (l) =>
                                l.section === section._id &&
                                completedLessons.includes(l._id)
                            ).length
                          }
                          /
                          {
                            course?.allSubSections?.filter(
                              (l) => l.section === section._id
                            ).length
                          }
                        </span>
                      </button>

                      {/* Lessons */}
                      <AnimatePresence>
                        {expandedSection === section._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2 pl-2 mt-2"
                          >
                            {course?.allSubSections
                              ?.filter((lesson) => lesson.section === section._id)
                              .map((lesson, lessonIdx) => {
                                const isActive = currentLesson?._id === lesson._id;
                                const isCompleted = completedLessons.includes(
                                  lesson._id
                                );

                                return (
                                  <motion.button
                                    key={lesson._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: lessonIdx * 0.03 }}
                                    onClick={() => handleSelectLesson(lesson)}
                                    whileHover={{ x: 4 }}
                                    className={`w-full text-left p-3 rounded-lg transition-all ${
                                      isActive
                                        ? "bg-emerald-600/30 border border-emerald-500 shadow-lg shadow-emerald-600/20"
                                        : "border border-gray-700 hover:bg-gray-700/30"
                                    }`}
                                  >
                                    <div className="flex items-start gap-2">
                                      {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                      ) : (
                                        <Play className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                      )}
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-white line-clamp-2">
                                          {lesson.title}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                          {lesson.timeDuration ? `${lesson.timeDuration} min` : "Lesson"}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.button>
                                );
                              })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CoursePlayerSidebar;
