import { useParams } from "react-router-dom";

const CourseBuilder = () => {
  const { courseId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Course Builder
      </h1>

      <p className="text-gray-500 mt-2">
        Course ID: {courseId}
      </p>
    </div>
  );
};

export default CourseBuilder;