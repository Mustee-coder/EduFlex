import { useNavigate } from "react-router-dom";
import { useInstructorCourses } from "@/hooks/useInstructorCourses";
import { useDeleteCourse } from "@/hooks/useDeleteCourse";
import ConfirmModal from "@/components/ConfirmModal";
import {Link} from "react-router-dom"
import { useState } from "react";

const InstructorCourses = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useInstructorCourses();
  const { mutate: deleteCourse, isPending } = useDeleteCourse();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const courses = data?.data || [];

  // loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading courses...
      </div>
    );
  }

  // error
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load courses
      </div>
    );
  }

  // filter logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.courseName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ? true : course.status === filter;

    return matchesSearch && matchesFilter;
  });

  // delete handler
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    deleteCourse(selectedId, {
      onSuccess: () => {
        setIsModalOpen(false);
        setSelectedId(null);
      },
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            My Courses
          </h1>
          <p className="text-gray-500">
            Manage all your courses
          </p>
        </div>

        <button
          onClick={() => navigate("/add-course")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + Create Course
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="All">All</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* EMPTY STATE */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <p className="text-5xl">📚</p>
          <h2 className="text-xl font-semibold mt-3">
            No courses found
          </h2>
          <p className="text-gray-500 mt-2">
            Try changing search or filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <img
                src={course.thumbnail}
                className="h-44 w-full object-cover"
                alt={course.courseName}
              />

              <div className="p-4 space-y-3">

                <h3 className="font-bold text-lg">
                  {course.courseName}
                </h3>

                <p className="text-sm text-gray-500">
                  {course.category?.name}
                </p>

                <div className="flex justify-between">
                  <span className="text-green-600 font-semibold">
                    ${course.price}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      course.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 pt-2">

                  <button
                    onClick={() =>
                      navigate(`/course/${course._id}`)
                    }
                    className="flex-1 border rounded-lg py-2 text-sm"
                  >
                    View
                  </button>

                 <button
  onClick={() =>
    navigate(`/course-builder/${course._id}`)
  }
  className="flex-1 bg-green-500 text-white rounded-lg py-2 text-sm"
>
  {course.sections?.length > 0 ? "Edit" : "Build"}
</button>

                  <button
                    onClick={() => handleDeleteClick(course._id)}
                    className="px-3 py-2 bg-red-500 text-white rounded text-sm"
                  >
                    Delete
                  </button>

                </div>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Course?"
        message="This action cannot be undone. The course and all content will be removed."
        loading={isPending}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default InstructorCourses;
