import { Link } from "react-router-dom";
import { useUserDetails, useEnrolledCourses } from "@/hooks/useProfile";

const Dashboard = () => {
  const { data: user, isLoading: userLoading, isError: userError } =
    useUserDetails();

  const {
    data: courses,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useEnrolledCourses();

  const loading = userLoading || coursesLoading;
  const error = userError || coursesError;

  const enrolledCourses = courses?.data || [];

  // 🧠 SMART SORT: incomplete first
  const sortedCourses = [...enrolledCourses].sort(
    (a, b) => (b.progressPercentage || 0) - (a.progressPercentage || 0)
  );

  const completedCount = enrolledCourses.filter(
    (c) => c.progressPercentage === 100
  ).length;

  const avgProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce(
            (acc, c) => acc + (c.progressPercentage || 0),
            0
          ) / enrolledCourses.length
        )
      : 0;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">
          Loading your learning dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-red-500 text-2xl font-bold">
            Something went wrong ⚠️
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">
          Welcome back 👋 {user?.data?.firstName}
        </h1>
        <p className="text-gray-500">
          Continue learning where you left off
        </p>
      </div>

      {/* STATS (UDACITY / UDEMY STYLE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-sm text-gray-500">Enrolled</p>
          <h2 className="text-2xl font-bold">
            {enrolledCourses.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-2xl font-bold">
            {completedCount}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-sm text-gray-500">Avg Progress</p>
          <h2 className="text-2xl font-bold">
            {avgProgress}%
          </h2>
        </div>
      </div>

      {/* CONTINUE LEARNING (🔥 UDEMY STYLE CORE FEATURE) */}
      <div>
        <h2 className="text-xl font-semibold mb-3">
          Continue Learning 🚀
        </h2>

        {sortedCourses.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-xl shadow">
            <p className="text-gray-500">
              You haven't enrolled in any course yet
            </p>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded">
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {sortedCourses.map((course) => (
              <Link
                key={course._id}
                to={`/course/${course._id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                {/* HEADER BANNER */}
                <div className="h-28 bg-gradient-to-r from-purple-500 to-indigo-500" />

                <div className="p-4 space-y-2">

                  <h3 className="font-semibold">
                    {course.courseName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {course.courseDescription?.slice(0, 60)}...
                  </p>

                  {/* PROGRESS BAR */}
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-purple-600 h-2 rounded"
                      style={{
                        width: `${course.progressPercentage || 0}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      {course.progressPercentage || 0}% completed
                    </p>

                    <button className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      Continue
                    </button>
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