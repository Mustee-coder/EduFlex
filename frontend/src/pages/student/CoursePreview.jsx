import { useParams, Link } from "react-router-dom";
import { useGetCourseDetails } from "@/hooks/useGetCourseDetails";
import { useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
} from "lucide-react";

const CoursePreview = () => {
  const { courseId } = useParams();
  const { data, isLoading } = useGetCourseDetails(courseId);
  const navigate = useNavigate();

  const course = data?.data?.courseDetails;

  const [openSections, setOpenSections] = useState({});

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoading) {
  return (
    <div className="h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Course not found
      </div>
    );
  }
  
  

const handleEnroll = () => {
  navigate(`/checkout/${courseId}`);
};

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

          {/* LEFT */}
          <div>
            <h1 className="text-3xl font-bold">
              {course.courseName}
            </h1>

            <p className="text-gray-300 mt-3">
              {course.courseDescription}
            </p>

            <p className="mt-4 text-sm text-gray-400">
              👨‍🏫 Instructor:{" "}
              {course.instructor?.firstName}{" "}
              {course.instructor?.lastName}
            </p>

            <div className="mt-4 text-yellow-400">
              ⭐ {course.rating || 4.5} Rating
            </div>
          </div>

          {/* RIGHT - ENROLL BOX */}
          <div className="bg-white text-black rounded-xl p-4 shadow-lg">

            <div className="h-44 bg-gray-200 rounded mb-3 overflow-hidden">
              <img
                src={course.thumbnail}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-2xl font-bold text-purple-600">
              ₦{course.price || 0}
            </h2>

            <button
  onClick={handleEnroll}
  className="w-full bg-purple-600 text-white py-2 rounded mt-4 hover:bg-purple-700"
>
  Enroll Now
</button>

            <button className="w-full border mt-2 py-2 rounded">
              Add to Wishlist
            </button>

            <p className="text-xs text-gray-500 mt-3">
              🔒 Lifetime access after enrollment
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-6">

          {/* WHAT YOU'LL LEARN */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-2">
              What you'll learn
            </h2>

            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Build real world projects</li>
              <li>Understand full stack development</li>
              <li>Master backend APIs</li>
            </ul>
          </div>

          {/* COURSE CONTENT */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-3">
              Course Content
            </h2>

            {course.sections?.map((section) => (
              <div key={section._id} className="border-b">

                <div
                  onClick={() => toggleSection(section._id)}
                  className="flex justify-between items-center p-3 cursor-pointer bg-gray-50"
                >
                  <p className="font-medium">
                    {section.sectionName}
                  </p>

                  {openSections[section._id] ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </div>

                {openSections[section._id] && (
                  <div className="p-3 space-y-2">
                    {section.subSections?.map((lesson) => (
                      <div
                        key={lesson._id}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <PlayCircle size={14} />
                        {lesson.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-white p-4 rounded shadow h-fit">

          <h3 className="font-bold mb-3">
            This course includes:
          </h3>

          <ul className="text-sm text-gray-600 space-y-2">
            <li>📹 Video lessons</li>
            <li>📂 Downloadable resources</li>
            <li>⏱ Lifetime access</li>
            <li>📱 Mobile access</li>
          </ul>

        </div>

      </div>

    </div>
  );
};

export default CoursePreview;