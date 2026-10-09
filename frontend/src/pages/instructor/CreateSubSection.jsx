import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useCreateSubSection } from "@/hooks/useCreateSubSection";
import { toast } from "sonner";
import {
  Plus,
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader,
  ArrowRight,
  Video,
  FileText,
  Play,
  X,
  HardDrive,
} from "lucide-react";

const CreateSubSection = () => {
  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const { mutate: createSubSection, isPending } = useCreateSubSection();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);

  // Validation
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Lesson title is required";
        } else if (value.trim().length < 3) {
          newErrors.title = "Title must be at least 3 characters";
        } else if (value.trim().length > 100) {
          newErrors.title = "Title must be less than 100 characters";
        } else {
          delete newErrors.title;
        }
        break;

      case "description":
        if (!value.trim()) {
          newErrors.description = "Description is required";
        } else if (value.trim().length < 10) {
          newErrors.description = "Description must be at least 10 characters";
        } else if (value.trim().length > 1000) {
          newErrors.description = "Description must be less than 1000 characters";
        } else {
          delete newErrors.description;
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

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file size (max 500MB)
      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Video must be less than 500MB");
        return;
      }

      // Validate file type
      const validVideoTypes = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
      ];
      if (!validVideoTypes.includes(file.type)) {
        toast.error("Please select a valid video file (MP4, WebM, OGG, MOV)");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        video: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Get video info
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        setVideoInfo({
          duration: `${minutes}m ${seconds}s`,
          size: (file.size / (1024 * 1024)).toFixed(2),
          name: file.name,
        });
      };
      video.src = reader.result;
    }
  };

  const handleRemoveVideo = () => {
    setFormData((prev) => ({
      ...prev,
      video: null,
    }));
    setVideoPreview(null);
    setVideoInfo(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      if (key !== "video") {
        validateField(key, formData[key]);
      }
    });

    // Validate video
    if (!formData.video) {
      toast.error("Video is required");
      return;
    }

    // Check for errors
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    // Create FormData
    const submitData = new FormData();
    submitData.append("courseId", courseId);
    submitData.append("sectionId", sectionId);
    submitData.append("title", formData.title.trim());
    submitData.append("description", formData.description.trim());
    submitData.append("video", formData.video);

    createSubSection(submitData, {
      onSuccess: () => {
        toast.success("Lesson created successfully!");
        setTimeout(() => {
          navigate(`/course-builder/${courseId}`);
        }, 1000);
      },
      onError: (error) => {
        const errorMsg =
          error?.response?.data?.message ||
          "Failed to create lesson. Please try again.";
        toast.error(errorMsg);
      },
    });
  };

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.video &&
    Object.keys(errors).length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');

        .subsection-root {
          font-family: 'Poppins', sans-serif;
        }

        .subsection-title {
          font-family: 'Syne', sans-serif;
        }

        .input-field {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .input-field:focus {
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
      `}</style>

      <div className="subsection-root bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="subsection-title text-4xl md:text-5xl font-bold text-gray-900">
                  Create Lesson
                </h1>
                <p className="text-gray-600 mt-2">
                  Add a new lesson with video content to your course
                </p>
              </div>
            </div>
          </Motion.div>

          {/* Form Card */}
          <Motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-8"
          >
            
            {/* Section: Basic Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h2 className="subsection-title font-bold text-lg text-gray-900">
                  Lesson Information
                </h2>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                  Lesson Title
                  <span className="text-red-600">*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., Introduction to React Hooks"
                  maxLength="100"
                  className={`input-field w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none transition-all ${
                    touched.title && errors.title
                      ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : touched.title && !errors.title
                      ? "border-emerald-500 bg-emerald-50 focus:ring-2 focus:ring-emerald-200"
                      : "border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  }`}
                />

                <div className="flex justify-between items-start">
                  {touched.title && errors.title && (
                    <Motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-xs font-semibold flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {errors.title}
                    </Motion.p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.title.length}/100
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                  Description
                  <span className="text-red-600">*</span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="5"
                  placeholder="Describe what students will learn in this lesson..."
                  maxLength="1000"
                  className={`input-field w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none transition-all resize-none ${
                    touched.description && errors.description
                      ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : touched.description && !errors.description
                      ? "border-emerald-500 bg-emerald-50 focus:ring-2 focus:ring-emerald-200"
                      : "border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  }`}
                />

                <div className="flex justify-between items-start">
                  {touched.description && errors.description && (
                    <Motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-xs font-semibold flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {errors.description}
                    </Motion.p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.description.length}/1000
                  </p>
                </div>
              </div>
            </div>

            {/* Section: Video */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <Video className="w-5 h-5 text-emerald-600" />
                <h2 className="subsection-title font-bold text-lg text-gray-900">
                  Lesson Video
                </h2>
              </div>

              {/* Video Preview */}
              {videoPreview && videoInfo && (
                <Motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-xl overflow-hidden border-2 border-emerald-200 bg-emerald-50 p-4"
                >
                  <video
                    src={videoPreview}
                    className="w-full h-48 bg-black rounded-lg"
                    controls
                  />

                  {/* Video Info */}
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 mb-1">Duration</p>
                      <p className="font-bold text-emerald-600">
                        {videoInfo.duration}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 mb-1">File Size</p>
                      <p className="font-bold text-emerald-600">
                        {videoInfo.size} MB
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 mb-1 line-clamp-1">
                        File
                      </p>
                      <p className="font-bold text-emerald-600 text-xs line-clamp-1">
                        {videoInfo.name.split(".")[0]}
                      </p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={handleRemoveVideo}
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </Motion.button>
                </Motion.div>
              )}

              {/* File Input */}
              {!videoPreview && (
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="video-input"
                  />

                  <label
                    htmlFor="video-input"
                    className="block cursor-pointer border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center hover:bg-emerald-50 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Upload className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Drop your video here or click to browse
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          MP4, WebM, OGG, MOV • Max 500MB
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {/* Upload Tips */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <p className="text-xs text-blue-900 font-semibold mb-2">
                  📝 Video Upload Tips:
                </p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Recommended resolution: 1920x1080 (Full HD)</li>
                  <li>• Recommended format: MP4 with H.264 codec</li>
                  <li>• Keep videos between 3-30 minutes</li>
                  <li>• Ensure clear audio without background noise</li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <Motion.button
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              type="submit"
              disabled={!isFormValid || isPending}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-lg"
            >
              {isPending ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Uploading Video...
                </>
              ) : (
                <>
                  Create Lesson
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Motion.button>

            {/* Helper Text */}
            <p className="text-center text-xs text-gray-600">
              Uploading may take a few minutes depending on video size. Please
              don't close this page.
            </p>
          </Motion.form>
        </div>
      </div>
    </>
  );
};

export default CreateSubSection;
