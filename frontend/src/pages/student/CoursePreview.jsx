import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetCourseDetails } from "@/hooks/useGetCourseDetails";
import { toast } from "sonner";
import { Loading } from "@/components/Loader";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Star,
  Users,
  Clock,
  BookOpen,
  Download,
  Smartphone,
  Award,
  Heart,
  Share2,
  AlertCircle,
  Loader,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import "@/index.css";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetails(courseId);

  const course = data?.data?.courseDetails;

  const [openSections, setOpenSections] = useState({});
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEnroll = () => {
    if (!courseId) {
      toast.error("Course ID is missing");
      return;
    }
    navigate(`/checkout/${courseId}`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist"
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.courseName,
        text: course.courseDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Loading State
  if (isLoading) {
    return <Loading />;
  }

  // Error State
  if (isError || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-red-100"
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            We couldn't load the course details. Please try again.
          </p>
          <button
            onClick={() => navigate("/browse-courses")}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold transition-all"
          >
            Back to Courses
          </button>
        </motion.div>
      </div>
    );
  }

  const price = course.amount || course.price || 0;
  const rating = course.rating || 4.5;
  const reviewsCount = course.reviewsCount || 0;
  const studentsEnrolled = course.studentsEnrolled || 0;

  return (
    <>
     

      <div className="detail-root bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="fixed top-4 left-4 z-40 flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left - Course Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-4"
            >
              <h1 className="detail-title text-4xl sm:text-5xl font-bold">
                {course.courseName}
              </h1>

              <p className="text-lg text-indigo-100">
                {course.courseDescription}
              </p>

              {/* Instructor */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {course.instructor?.firstName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">
                    {course.instructor?.firstName}{" "}
                    {course.instructor?.lastName}
                  </p>
                  <p className="text-sm text-indigo-100">Instructor</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-300" />
                  <span className="font-semibold">{rating}</span>
                  <span className="text-indigo-100">({reviewsCount})</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{(studentsEnrolled || 0).toLocaleString()} students</span>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>Bestseller</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Thumbnail & Enroll Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-gray-300 to-gray-200 overflow-hidden">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Price</p>
                  <p className="detail-title text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ₦{price.toLocaleString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEnroll}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  Enroll Now
                </motion.button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleWishlist}
                    className={`py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      isWishlisted
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-700" : ""}`} />
                    Wishlist
                  </button>

                  <button
                    onClick={handleShare}
                    className="py-2.5 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                {/* Benefits */}
                <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Lifetime access</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left - Course Content (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* What You'll Learn */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
              >
                <h2 className="detail-title text-2xl font-bold text-gray-900 mb-6">
                  What you'll learn
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Master the core fundamentals and concepts",
                    "Build real-world projects from scratch",
                    "Understand best practices and industry standards",
                    "Get hands-on experience with modern tools",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Course Content - Curriculum */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="p-8 border-b border-gray-100">
                  <h2 className="detail-title text-2xl font-bold text-gray-900">
                    Course Curriculum
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {course.sections?.length || 0} sections •{" "}
                    {course.sections?.reduce(
                      (acc, s) => acc + (s.subSections?.length || 0),
                      0
                    ) || 0}{" "}
                    lessons
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {course.sections?.map((section, idx) => (
                    <motion.div
                      key={section._id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <button
                        onClick={() => toggleSection(section._id)}
                        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {section.sectionName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {section.subSections?.length || 0} lessons
                            </p>
                          </div>
                        </div>

                        {openSections[section._id] ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>

                      {openSections[section._id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50 px-6 pb-4 space-y-2"
                        >
                          {section.subSections?.map((lesson) => (
                            <div
                              key={lesson._id}
                              className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                              <PlayCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                              <span className="text-sm">{lesson.title}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1 space-y-6"
            >
              
              {/* Course Includes */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
                <h3 className="detail-title font-bold text-gray-900">
                  This course includes:
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <PlayCircle className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-700">Video lessons</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-700">
                      Downloadable resources
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-700">
                      {course.duration || "Self-paced learning"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-700">Mobile access</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-700">Certificate of completion</span>
                  </div>
                </div>
              </div>

              {/* Sticky Enroll Card for Mobile */}
              <div className="lg:hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-3 sticky bottom-4">
                <button
                  onClick={handleEnroll}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold transition-all"
                >
                  Enroll Now
                </button>
                <p className="text-xs text-gray-600 text-center">
                  30-day money-back guarantee
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
