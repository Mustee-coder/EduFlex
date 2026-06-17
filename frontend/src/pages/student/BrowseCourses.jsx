import { useState } from "react";
import { useGetAllCourses } from "@/hooks/useGetAllCourses";
import { Link } from "react-router-dom";

const CourseSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow animate-pulse">
    <div className="h-40 bg-gray-300" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-300 rounded w-1/3 mt-2" />
    </div>
  </div>
);

const BrowseCourses = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllCourses(page, search);

  const courses = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* SEARCH */}
      <div className="p-4 bg-white border-b flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full border p-2 rounded"
        />

        <button
          onClick={() => setPage(1)}
          className="bg-purple-600 text-white px-4 rounded"
        >
          Search
        </button>
      </div>

      {/* GRID */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <CourseSkeleton key={i} />
            ))
          : courses.map((course) => (
             <Link to={`/course-preview/${course._id}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition group">

                  {/* THUMBNAIL */}
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />

                    {/* BADGE */}
                    {course.rating >= 4.5 && (
                      <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded font-bold">
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 space-y-1">

                    <h2 className="font-bold line-clamp-1">
                      {course.courseName}
                    </h2>

                    <p className="text-xs text-gray-500">
                      By {course.instructor?.firstName} {course.instructor?.lastName}
                    </p>

                    <p className="text-sm text-gray-500 line-clamp-2">
                      {course.courseDescription}
                    </p>

                    {/* RATING */}
                    <div className="flex items-center gap-1 text-sm">
                      ⭐ <span className="font-medium">
                        {course.rating || 4.2}
                      </span>
                      <span className="text-gray-400">
                        ({course.reviewsCount || 120})
                      </span>
                    </div>

                    {/* PRICE */}
                    <p className="text-purple-600 font-bold mt-2">
                      ₦{course.price || 0}
                    </p>

                  </div>

                </div>
              </Link>
            ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 p-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          Page {pagination?.page || 1} of {pagination?.pages || 1}
        </span>

        <button
          disabled={page === pagination?.pages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default BrowseCourses;