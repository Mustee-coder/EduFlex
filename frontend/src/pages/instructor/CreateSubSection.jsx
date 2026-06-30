import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateSubSection } from "@/hooks/useCreateSubSection";



const CreateSubSection = () => {
  const { courseId, sectionId } = useParams();
  const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [video, setVideo] = useState(null);
  
  const navigate = useNavigate();
  
const { mutate: createSubSection, isPending } = useCreateSubSection();
  
  const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("courseId", courseId);
  formData.append("sectionId", sectionId);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("video", video);

  createSubSection(formData, {
    onSuccess: () => {
      navigate(`/course-builder/${courseId}`);
    },
  });
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Create Lesson</h1>
     <form onSubmit={handleSubmit} className="space-y-4 mt-6">
  <input
    type="text"
    placeholder="Lesson title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="w-full border rounded-md p-3"
    required
  />

  <textarea
    placeholder="Lesson description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    rows={5}
    className="w-full border rounded-md p-3"
    required
  />

  <input
    type="file"
    accept="video/*"
    onChange={(e) => setVideo(e.target.files[0])}
    className="w-full border rounded-md p-2"
    required
  />

  <button
    type="submit"
    disabled={isPending}
    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
  >
    {isPending ? "Uploading..." : "Create Lesson"}
  </button>
</form>
    </div>
  );
};

export default CreateSubSection;