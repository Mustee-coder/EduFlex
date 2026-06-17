import { useMyLearning } from "@/hooks/useMyLearning";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const MyLearning = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useMyLearning();

  const courses = data?.data || [];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500">
        <h2 className="text-xl font-semibold">No courses yet 📚</h2>
        <p className="text-sm mt-2">Start learning by enrolling in a course</p>

        <button
          onClick={() => navigate("/browse-courses")}
          className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8">My Learning</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            {/* THUMBNAIL */}
            <div className="h-40">
              <img
                src={course.thumbnail}
                className="w-full h-full object-cover"
                alt={course.courseName}
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h2 className="font-bold text-lg">
                {course.courseName}
              </h2>

              {/* PROGRESS */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${course.progressPercent || 0}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {course.progressPercent || 0}% completed
                </p>
              </div>

              {/* ACTION */}
              <button
                onClick={() =>
                  navigate(`/course/${course._id}`)
                }
                className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                Continue Learning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLearning;