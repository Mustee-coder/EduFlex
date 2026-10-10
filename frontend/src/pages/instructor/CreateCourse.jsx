import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useCreateCourse } from "@/hooks/useCreateCourse";
import { toast } from "sonner";
import {
  BookOpen,
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader,
  ArrowRight,
  DollarSign,
  Tag,
  FileText,
  Lightbulb,
} from "lucide-react";

const CreateCourse = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateCourse();

  const [formData, setFormData] = useState({
    courseName: "",
    courseDescription: "",
    whatYouWillLearn: "",
    price: "",
    category: "",
    thumbnail: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const categories = [
    "Programming",
    "Design",
    "Business",
    "Marketing",
    "Personal Development",
    "Finance",
    "Health & Fitness",
    "Other",
  ];

  // Validation
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "courseName":
        if (!value.trim()) {
          newErrors.courseName = "Course name is required";
        } else if (value.trim().length < 5) {
          newErrors.courseName = "Course name must be at least 5 characters";
        } else {
          delete newErrors.courseName;
        }
        break;

      case "courseDescription":
        if (!value.trim()) {
          newErrors.courseDescription = "Description is required";
        } else if (value.trim().length < 20) {
          newErrors.courseDescription = "Description must be at least 20 characters";
        } else {
          delete newErrors.courseDescription;
        }
        break;

      case "whatYouWillLearn":
        if (!value.trim()) {
          newErrors.whatYouWillLearn = "Learning objectives are required";
        } else if (value.trim().length < 20) {
          newErrors.whatYouWillLearn =
            "Learning objectives must be at least 20 characters";
        } else {
          delete newErrors.whatYouWillLearn;
        }
        break;

      case "price":
        if (!value) {
          newErrors.price = "Price is required";
        } else if (isNaN(value) || parseFloat(value) < 0) {
          newErrors.price = "Please enter a valid price";
        } else {
          delete newErrors.price;
        }
        break;

      case "category":
        if (!value) {
          newErrors.category = "Category is required";
        } else {
          delete newErrors.category;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, value);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Thumbnail must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      if (key !== "thumbnail") {
        validateField(key, formData[key]);
      }
    });

    // Validate thumbnail
    if (!formData.thumbnail) {
      toast.error("Thumbnail is required");
      return;
    }

    // Check for errors
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    // Create FormData
    const submitData = new FormData();
    submitData.append("courseName", formData.courseName.trim());
    submitData.append("courseDescription", formData.courseDescription.trim());
    submitData.append("whatYouWillLearn", formData.whatYouWillLearn.trim());
    submitData.append("price", parseFloat(formData.price));
    submitData.append("category", formData.category);
    submitData.append("thumbnailImage", formData.thumbnail);
    submitData.append("status", "Draft");

    mutate(submitData, {
      onSuccess: (data) => {
        toast.success("Course created! Redirecting to builder...");
        setTimeout(() => {
          navigate(`/course-builder/${data.data._id}`);
        }, 1000);
      },

      onError: (error) => {
        const errorMsg =
          error?.response?.data?.message ||
          "Failed to create course. Please try again.";
        toast.error(errorMsg);
      },
    });
  };

  const isFormValid =
    formData.courseName &&
    formData.courseDescription &&
    formData.whatYouWillLearn &&
    formData.price &&
    formData.category &&
    formData.thumbnail &&
    Object.keys(errors).length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');

        .create-root {
          font-family: 'Poppins', sans-serif;
        }

        .create-title {
          font-family: 'Syne', sans-serif;
        }

        .input-field {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .input-field:focus {
          box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.14);
        }
      `}</style>

      <div className="create-root min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 md:py-8">
        
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6C5CE7] to-[#8577F4] rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="create-title text-3xl font-bold text-slate-950 sm:text-4xl">
                Create New Course
              </h1>
            </div>
            <p className="text-gray-600">
              Start your teaching journey by creating your first course
            </p>
          </div>

          {/* Form Card */}
          <Motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
          >
            
            {/* Section: Basic Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <BookOpen className="w-5 h-5 text-[#6C5CE7]" />
                <h2 className="create-title font-bold text-lg text-gray-900">
                  Basic Information
                </h2>
              </div>

              {/* Course Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                  Course Name
                  <span className="text-red-600">*</span>
                </label>

                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., Advanced React Mastery"
                  className={`input-field w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none transition-all ${
                    touched.courseName && errors.courseName
                      ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : touched.courseName && !errors.courseName
                      ? "border-[#8577F4] bg-[#F8F6FF] focus:ring-2 focus:ring-[#DDD6FF]"
                      : "border-gray-200 bg-gray-50 focus:border-[#8577F4] focus:ring-2 focus:ring-[#DDD6FF]"
                  }`}
                />

                {touched.courseName && errors.courseName && (
                  <Motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-xs font-semibold flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.courseName}
                  </Motion.p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                  Description
                  <span className="text-red-600">*</span>
                </label>

                <textarea
                  name="courseDescription"
                  value={formData.courseDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="4"
                  placeholder="Describe your course in detail. What will students learn? What makes your course unique?"
                  className={`input-field w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none transition-all resize-none ${
                    touched.courseDescription && errors.courseDescription
                      ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : touched.courseDescription && !errors.courseDescription
                      ? "border-[#8577F4] bg-[#F8F6FF] focus:ring-2 focus:ring-[#DDD6FF]"
                      : "border-gray-200 bg-gray-50 focus:border-[#8577F4] focus:ring-2 focus:ring-[#DDD6FF]"
                  }`}
                />

                {touched.courseDescription && errors.courseDescription && (
                  <Motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-xs font-semibold flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.courseDescription}
                  </Motion.p>
                )}
              </div>

              {/* Learning Objectives */}
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                  <Lightbulb className="w-4 h-4" />
                  What Students Will Learn
                  <span className="text-red-600">*</span>
                </label>

                <textarea
                  name="whatYouWillLearn"
                  value={formData.whatYouWillLearn}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="4"
                  placeholder="List the key skills and knowledge students will gain (e.g., Build full-stack apps, Master React hooks, Deploy to production)"
                  className={`input-field w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none transition-all resize-none ${
                    touched.whatYouWillLearn && errors.whatYouWillLearn
                      ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : touched.whatYouWillLearn && !errors.whatYouWillLearn
                      ? "border-[#8577F4] bg-[#F8F6FF] focus:ring-2 focus:ring-[#DDD6FF]"
                      : "border-gray-200 bg-gray-50 focus:border-[#8577F4] focus:ring-2 focus:ring-[#DDD6FF]"
                  }`}
                />

                {touched.whatYouWillLearn && errors.whatYouWillLearn && (
                  <Motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-xs font-semibold flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.whatYouWillLearn}
                  </Motion.p>
                )}
              </div>
            </div>

            {/* Section: Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <Tag className="w-5 h-5 text-[#6C5CE7]" />
                <h2 className="create-title font-bold text-lg text-gray-900">
                  Course Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Price */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                    <DollarSign className="w-4 h-4" />
                    Price (₦)
                    <span className="text-red-600">*</span>
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="5000"
                    step="100"
                    min="0"
                    className={`input-field w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none transition-all ${
                      touched.price && errors.price
                        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : touched.price && !errors.price
                        ? "border-[#8577F4] bg-[#F8F6FF] focus:ring-2 focus:ring-[#DDD6FF]"
                        : "border-gray-200 bg-gray-50 focus:border-[#8577F4] focus:ring-2 focus:ring-[#DDD6FF]"
                    }`}
                  />

                  {touched.price && errors.price && (
                    <Motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-xs font-semibold flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {errors.price}
                    </Motion.p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                    <Tag className="w-4 h-4" />
                    Category
                    <span className="text-red-600">*</span>
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none transition-all ${
                      touched.category && errors.category
                        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : touched.category && !errors.category
                        ? "border-[#8577F4] bg-[#F8F6FF] focus:ring-2 focus:ring-[#DDD6FF]"
                        : "border-gray-200 bg-gray-50 focus:border-[#8577F4] focus:ring-2 focus:ring-[#DDD6FF]"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {touched.category && errors.category && (
                    <Motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-xs font-semibold flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {errors.category}
                    </Motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Thumbnail */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <Upload className="w-5 h-5 text-[#6C5CE7]" />
                <h2 className="create-title font-bold text-lg text-gray-900">
                  Course Thumbnail
                </h2>
              </div>

              {/* Thumbnail Preview */}
              {thumbnailPreview && (
                <Motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-xl overflow-hidden border-2 border-[#DDD6FF] bg-[#F8F6FF] p-2"
                >
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 right-4 bg-[#6C5CE7] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Ready
                  </div>
                </Motion.div>
              )}

              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="thumbnail-input"
                />

                <label
                  htmlFor="thumbnail-input"
                  className="block cursor-pointer border-2 border-dashed border-[#C4B9FF] rounded-xl p-8 text-center hover:bg-[#F8F6FF] transition-colors"
                >
                  <Upload className="w-8 h-8 text-[#6C5CE7] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-900">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    PNG, JPG, WebP • Max 5MB • Recommended: 1280x720px
                  </p>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Motion.button
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              type="submit"
              disabled={!isFormValid || isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C5CE7] py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#5749C8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6C5CE7]/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating Course...
                </>
              ) : (
                <>
    Create Course
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Motion.button>

            {/* Helper Text */}
            <p className="text-center text-xs text-gray-600">
              After creating, you'll be able to add sections, lessons, and videos in the course builder.
            </p>
          </Motion.form>
        </Motion.div>
      </div>
    </>
  );
};

export default CreateCourse;
