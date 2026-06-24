import { useState } from "react";
import { useCreateCourse } from "@/hooks/useCreateCourse";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



const CreateCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [whatYouWillLearn, setWhatYouWillLearn] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [status, setStatus] = useState("Draft");

  const { mutate, isPending } = useCreateCourse();
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
e.preventDefault();

if (
!courseName ||
!courseDescription ||
!whatYouWillLearn ||
!price ||
!category
) {
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
formData.append("status", status);

mutate(formData, {
onSuccess: () => {
  setCourseName("");
  setCourseDescription("");
  setWhatYouWillLearn("");
  setPrice("");
  setCategory("");
  setThumbnail(null);
  setStatus("Draft");

  navigate("/courses");
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
            
            <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className="w-full border rounded-lg px-4 py-3"
>
  <option value="Draft">Draft</option>
  <option value="Published">Published</option>
</select>

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
          {thumbnail && (
  <img
    src={URL.createObjectURL(thumbnail)}
    alt="preview"
    className="h-52 w-full object-cover rounded-lg"
  />
)}
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