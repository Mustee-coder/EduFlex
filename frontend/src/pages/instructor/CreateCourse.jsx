import { useState } from "react";
import { useCreateCourse } from "@/hooks/useCreateCourse";
import { toast } from "react-toastify";

const CreateCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [whatYouWillLearn, setWhatYouWillLearn] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const { mutate, isPending } = useCreateCourse();

  const handleSubmit = (e) => {
    e.preventDefault();

    // VALIDATION
    if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category) {
      return toast.error("Please fill all required fields");
    }

    if (!thumbnail) {
      return toast.error("Thumbnail is required");
    }

    const formData = new FormData();

    formData.append("courseName", courseName);
    formData.append("courseDescription", courseDescription);
    formData.append("whatYouWillLearn", whatYouWillLearn);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("thumbnailImage", thumbnail);

    mutate(formData, {
      onSuccess: () => {
        // RESET FORM
        setCourseName("");
        setCourseDescription("");
        setWhatYouWillLearn("");
        setPrice("");
        setCategory("");
        setThumbnail(null);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow p-6">

        <h1 className="text-2xl font-bold mb-6">
          Create New Course
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Course Name */}
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Course Name"
          />

          {/* Description */}
          <textarea
            rows="5"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Course Description"
          />

          {/* What You Will Learn */}
          <textarea
            rows="4"
            value={whatYouWillLearn}
            onChange={(e) => setWhatYouWillLearn(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="What students will learn"
          />

          {/* Price */}
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Price ($)"
          />

          {/* Category */}
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Category"
          />

          {/* Thumbnail */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full border rounded-lg px-4 py-3"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 rounded-lg text-white ${
              isPending ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            {isPending ? "Saving..." : "Save Course"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateCourse;