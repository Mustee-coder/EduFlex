import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useInstructorCourses } from "@/hooks/useInstructorCourses";

const InstructorDashboard = () => {
  const { data, isLoading, isError, error } = useInstructorCourses();
  const courses = data?.data || [];
  const stats = data?.stats || {};

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center px-4">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md text-center max-w-md w-full">
          <h2 className="text-xl sm:text-2xl font-semibold text-red-600 mb-3">
            Unable to load your instructor dashboard
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {error?.message || "Please try again in a moment."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Instructor Dashboard
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-500">
                Manage your courses, track performance, and review your published content.
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Total courses
              </p>
              <p className="text-4xl font-bold text-purple-600 mt-1">
                {stats.totalCourses ?? courses.length}
              </p>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Published</p>
            <p className="text-3xl font-bold text-indigo-700 mt-1">
              {stats.publishedCount ?? 0}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-3xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Draft</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats.draftCount ?? 0}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-3xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide">My Courses</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {courses.length}
            </p>
          </div>
        </div>

        {/* COURSES SECTION */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Your Courses
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {courses.length === 0
                  ? "You have no courses yet."
                  : `${courses.length} course${courses.length === 1 ? "" : "s"} found.`}
              </p>
            </div>
            <Link
              to="/my-courses"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition"
            >
              View Student Courses
            </Link>
          </div>

          {/* EMPTY STATE */}
          {courses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 sm:p-12 text-center">
              <p className="text-4xl mb-4">📚</p>
              <p className="text-gray-500 text-base">
                You have not created any courses yet.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Start building your first course to reach learners.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition flex flex-col"
                >
                  {/* Card Top */}
                  <div className="p-5 flex gap-4 justify-between flex-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        {course.category?.name || "Uncategorized"}
                      </p>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mt-1 truncate">
                        {course.courseName}
                      </h3>
                      <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">
                        {course.courseDescription || "No description available."}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 self-start inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        course.status === "Published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  {/* Card Footer */}
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      <span className="rounded-full bg-white border border-gray-200 px-3 py-1.5 font-medium">
                        {course.price ? `$${course.price}` : "Free"}
                      </span>
                      <span className="rounded-full bg-white border border-gray-200 px-3 py-1.5">
                        {course.ratingAndReviews?.length || 0} reviews
                      </span>
                      <span className="rounded-full bg-white border border-gray-200 px-3 py-1.5">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InstructorDashboard;