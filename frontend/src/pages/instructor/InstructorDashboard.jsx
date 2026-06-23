import { useNavigate } from "react-router-dom";
import { useInstructorCourses } from "@/hooks/useInstructorCourses";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useInstructorCourses();

  const stats = data?.stats ?? {
    totalCourses: 0,
    publishedCount: 0,
    draftCount: 0,
    totalStudents: 0,
    totalRevenue: 0,
  };

  const courses = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load instructor dashboard
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">

      {/* SIDEBAR (hidden on mobile) */}
      <aside className="hidden md:block w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-6">Instructor Panel</h2>

        <nav className="space-y-3 text-gray-600">
          <p className="font-semibold text-black">Dashboard</p>
          <p>Courses</p>
          <p>Analytics</p>
          <p>Revenue</p>
          <p>Settings</p>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-6 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back 👋 Instructor
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Here is your performance overview
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-xs md:text-sm">Total Courses</p>
            <h2 className="text-xl md:text-2xl font-bold">
              {stats.totalCourses}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-xs md:text-sm">Students</p>
            <h2 className="text-xl md:text-2xl font-bold text-blue-600">
              {stats.totalStudents}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-xs md:text-sm">Revenue</p>
            <h2 className="text-xl md:text-2xl font-bold text-green-600">
              ${stats.totalRevenue}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-xs md:text-sm">Draft</p>
            <h2 className="text-xl md:text-2xl font-bold text-yellow-600">
              {stats.draftCount}
            </h2>
          </div>

        </div>

        {/* ACTION BAR */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <h2 className="text-lg font-semibold">
            Your Courses
          </h2>

          <button
            onClick={() => navigate("/add-course")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg w-full md:w-auto"
          >
            + Create Course
          </button>
        </div>

        {/* ANALYTICS BOX */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">
            Performance Overview
          </h3>

          <div className="h-32 md:h-40 flex items-center justify-center text-gray-400 border rounded-lg text-sm">
            📊 Chart Area (Revenue / Students Growth)
          </div>
        </div>

        {/* COURSES */}
        {courses.length === 0 ? (
          <div className="bg-white p-8 md:p-10 text-center rounded-xl shadow">
            <p className="text-3xl md:text-4xl">📚</p>
            <h3 className="text-lg font-semibold mt-2">
              No courses yet
            </h3>
            <p className="text-gray-500 text-sm md:text-base">
              Create your first course to start earning
            </p>

            <button
              onClick={() => navigate("/add-course")}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded w-full md:w-auto"
            >
              Create Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">

            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >

                {/* Thumbnail */}
                <img
                  src={course.thumbnail}
                  className="h-36 md:h-40 w-full object-cover"
                />

                {/* Content */}
                <div className="p-4 space-y-2">

                  <h3 className="font-bold text-sm md:text-base">
                    {course.courseName}
                  </h3>

                  <p className="text-xs md:text-sm text-gray-500">
                    {course.category?.name}
                  </p>

                  <div className="flex justify-between text-xs md:text-sm text-gray-600">
                    <span>👨‍🎓 {course.studentsEnrolled?.length || 0}</span>
                    <span className="font-semibold">
                      {course.status}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 pt-2">

                    <button
                      onClick={() => navigate(`/course/${course._id}`)}
                      className="text-xs md:text-sm px-3 py-1 border rounded w-full"
                    >
                      View
                    </button>

                    <button
                      onClick={() => navigate(`/edit-course/${course._id}`)}
                      className="text-xs md:text-sm px-3 py-1 bg-blue-500 text-white rounded w-full"
                    >
                      Edit
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
};

export default InstructorDashboard;