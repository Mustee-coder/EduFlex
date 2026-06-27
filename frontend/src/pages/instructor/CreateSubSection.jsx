import { useParams } from "react-router-dom";

const CreateSubSection = () => {
  const { courseId, sectionId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Create Lesson</h1>

      <p>Course ID: {courseId}</p>
      <p>Section ID: {sectionId}</p>
    </div>
  );
};

export default CreateSubSection;