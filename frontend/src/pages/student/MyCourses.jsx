import { useState } from "react";
import { useMyLearning } from "@/hooks/useMyLearning";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const MyCourses = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useMyLearning();

  const courses = data?.data || [];

  // UI STATES
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("progress");

  
  // LOADING
 
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  
  // FILTER + SEARCH
 
  const filteredCourses = courses.filter((course) => {
    const matchSearch =
      course.courseName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      course.courseDescription
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const progress = course.progress?.progressPercent ?? course.progressPercentage ?? 0;

    const matchFilter =
      filter === "all"
        ? true
        : filter === "completed"
        ? progress === 100
        : progress < 100;

    return matchSearch && matchFilter;
  });

  
  // SORT
  
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sort === "progress") {
      return (
        (b.progress?.progressPercent ?? b.progressPercentage ?? 0) -
        (a.progress?.progressPercent ?? a.progressPercentage ?? 0)
      );
    }

    if (sort === "name") {
      return a.courseName.localeCompare(b.courseName);
    }

    return 0;
  });

  
  // EMPTY STATE
  
  if (!courses.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500 text-center px-4">
        <h2 className="text-xl font-semibold">
          No Courses Found 📚
        </h2>
        <p className="text-sm mt-2">
          You have not enrolled in any course yet.
        </p>

        <button
          onClick={() => navigate("/browse-courses")}
          className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-purple-700"
        >
          Browse Courses
        </button>
      </div>
    );
  }

 
  // UI
 
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      {/* HEADER */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        My Courses
      </h1>

      {/* CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />

        {/* FILTER */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="progress">Sort by Progress</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {sortedCourses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >

            {/* THUMBNAIL */}
            <div className="h-40">
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">

              <h2 className="font-bold text-lg">
                {course.courseName}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {course.courseDescription?.slice(0, 70)}
              </p>

              {/* PROGRESS */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-blue-600 h-2 rounded"
                    style={{
                      width: `${course.progress?.progressPercent ?? course.progressPercentage ?? 0}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {course.progress?.progressPercent ?? course.progressPercentage ?? 0}% completed
                </p>
              </div>

              {/* ACTION */}
              <button
                onClick={() =>
                  navigate(`/course/${course._id}`)
                }
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                Continue Course
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
