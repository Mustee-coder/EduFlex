import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useInstructorCourses } from "@/hooks/useInstructorCourses"

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
        <div className="bg-white p-8 rounded-3xl shadow-md text-center max-w-md w-full">
          <h2 className="text-2xl font-semibold text-red-600 mb-3">
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
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
            <p className="mt-2 text-gray-500">
              Manage your courses, track performance, and review your published content.
            </p>
          </div>
          
          
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-center">
            
            
            <div className="bg-purple-50 border border-purple-100 rounded-3xl p-5">
  <p className="text-sm text-gray-500">Total Courses</p>
  <p className="text-3xl font-bold text-purple-700">
    {stats.totalCourses ?? courses.length}
  </p>
</div>
            
            
  <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5">
    <p className="text-sm text-gray-500">Published</p>
    <p className="text-3xl font-bold text-indigo-700">
      {stats.publishedCount ?? 0}
    </p>
  </div>
  

  <div className="bg-white border border-gray-200 rounded-3xl p-5">
    <p className="text-sm text-gray-500">Draft</p>
    <p className="text-3xl font-bold text-gray-900">
      {stats.draftCount ?? 0}
    </p>
  </div>

  <div className="bg-white border border-gray-200 rounded-3xl p-5">
    <p className="text-sm text-gray-500">Instructor Courses</p>
    <p className="text-3xl font-bold text-gray-900">
      {stats.totalCourses ?? courses.length}
    </p>
  </div>

  <div className="bg-green-50 border border-green-100 rounded-3xl p-5">
    <p className="text-sm text-gray-500">Students Enrolled</p>
    <p className="text-3xl font-bold text-green-700">
      {stats.totalStudents ?? 0}
    </p>
  </div>

  <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-5">
    <p className="text-sm text-gray-500">Total Revenue</p>
    <p className="text-3xl font-bold text-yellow-700">
      ${stats.totalRevenue ?? 0}
    </p>
  </div>
</div>
        <section className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
           
            
           <Link
  to="/courses"
  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition"
>
  Manage Courses
</Link>
          </div>

          {courses.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="text-gray-500 text-lg">
                You have not created any courses yet. Start building your first course to reach learners.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4 p-5">
                    <div>
                      <p className="text-sm text-gray-500">
                        {course.category?.name || "Uncategorized"}
                      </p>
                      <h3 className="text-xl font-semibold text-gray-900 mt-1">
                        {course.courseName}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                        {course.courseDescription || "No course description available."}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        course.status === "Published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 px-5 py-4 sm:px-6 sm:py-5">
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <div className="rounded-2xl bg-gray-100 px-3 py-2">
                        {course.price ? `$${course.price}` : "Free"}
                      </div>
                      <div className="rounded-2xl bg-gray-100 px-3 py-2">
                        {course.ratingAndReviews?.length || 0} reviews
                      </div>
                      <div className="rounded-2xl bg-gray-100 px-3 py-2">
                        Created {new Date(course.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default InstructorDashboard;
