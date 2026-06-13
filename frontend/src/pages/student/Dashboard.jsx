import { Link } from "react-router-dom";
import { useUserDetails, useEnrolledCourses } from "@/hooks/useProfile";

const Dashboard = () => {
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useUserDetails();

  const {
    data: courses,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useEnrolledCourses();

  const loading = userLoading || coursesLoading;
  const error = userError || coursesError;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-red-500 text-2xl font-bold">
            Something went wrong ⚠️
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const enrolledCourses = courses?.data || [];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">
          Welcome back 👋 {user?.data?.firstName}
        </h1>
        <p className="text-gray-500">
          Continue your learning journey
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Enrolled Courses</p>
          <h2 className="text-2xl font-bold">
            {enrolledCourses.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Completed</p>
          <h2 className="text-2xl font-bold">
            {enrolledCourses.filter(c => c.progressPercentage === 100).length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Avg Progress</p>
          <h2 className="text-2xl font-bold">
            {enrolledCourses.length
              ? Math.round(
                  enrolledCourses.reduce(
                    (acc, c) => acc + (c.progressPercentage || 0),
                    0
                  ) / enrolledCourses.length
                )
              : 0}%
          </h2>
        </div>

      </div>

      {/* COURSES */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          My Courses 📚
        </h2>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <h3 className="text-lg font-semibold">
              No courses yet 📚
            </h3>
            <p className="text-gray-500 mt-2">
              Start learning by enrolling in a course
            </p>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg">
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {enrolledCourses.map((course) => (
              <Link
                key={course._id}
                to={`/course/${course._id}`}
                className="block"
              >
                <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">

                  <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-500" />

                  <div className="p-4 space-y-2">

                    <h3 className="font-semibold">
                      {course.courseName}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {course.courseDescription?.slice(0, 60)}...
                    </p>

                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${course.progressPercentage || 0}%`,
                        }}
                      />
                    </div>

                    <p className="text-xs text-gray-500">
                      {course.progressPercentage || 0}% completed
                    </p>

                  </div>

                </div>
              </Link>
            ))}

          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;