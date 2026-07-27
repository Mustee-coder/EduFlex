import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetCourseDetails } from "@/hooks/useGetCourseDetails";
import { useInitializePayment } from "@/hooks/useInitializePayment";
import { Loading } from "@/components/Loader";
import { toast } from "sonner";
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Star,
  Users,
  Clock,
  Shield,
  Zap,
  AlertCircle,  
  Loader,
  BookOpen,
} from "lucide-react";
import "@/index.css";

const CourseCheckout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetCourseDetails(courseId);
  const { mutate, isPending } = useInitializePayment();

  const [paymentError, setPaymentError] = useState("");

  const course = data?.data?.courseDetails;

  // Handle payment
  const handlePayment = () => {
    if (!courseId) {
      setPaymentError("Course ID is missing");
      return;
    }

    setPaymentError("");

    mutate(
      { coursesId: [courseId] },
      {
        onSuccess: (res) => {
          const url = res?.data?.authorization_url;

          if (url) {
            window.location.href = url;
          } else {
            toast.error("Failed to initialize payment. Please try again.");
            setPaymentError("Failed to get payment URL");
          }
        },

        onError: (error) => {
          const errorMsg =
            error?.response?.data?.message ||
            "Payment initialization failed. Please try again.";
          toast.error(errorMsg);
          setPaymentError(errorMsg);
        },
      }
    );
  };


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

  return (
    <>
     

      <div className="checkout-root min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="max-w-6xl mx-auto flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </motion.button>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            
            {/* Left - Course Summary (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Course Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="grid sm:grid-cols-3 gap-6 p-6">
                  
                  {/* Thumbnail */}
                  <div className="sm:col-span-1">
                    <div className="relative h-40 sm:h-full rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500">
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
                          <BookOpen className="w-8 h-8 text-white opacity-50" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="sm:col-span-2 space-y-4">
                    
                    <div>
                      <h1 className="checkout-title text-2xl sm:text-3xl font-bold text-gray-900">
                        {course.courseName}
                      </h1>
                      <p className="text-gray-600 mt-2">
                        by{" "}
                        <span className="font-semibold text-gray-900">
                          {course.instructor?.firstName || "Instructor"}{" "}
                          {course.instructor?.lastName || ""}
                        </span>
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 line-clamp-3">
                      {course.courseDescription}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-gray-900">
                          {course.rating || 4.8}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ({course.reviewsCount || 0})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <span className="text-gray-700 text-sm">
                          {(course.studentsEnrolled || 0).toLocaleString()} students
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-700 text-sm">
                          {course.duration || "Self-paced"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What You'll Learn */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="checkout-title text-xl font-bold text-gray-900 mb-4">
                  What You'll Learn
                </h2>
                <ul className="space-y-3">
                  {[
                    "Master the core concepts and fundamentals",
                    "Work on real-world projects and assignments",
                    "Get lifetime access to course materials",
                    "Access exclusive resources and downloads",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Money-Back Guarantee */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4"
              >
                <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-emerald-900 mb-1">
                    30-Day Money-Back Guarantee
                  </h3>
                  <p className="text-sm text-emerald-800">
                    Not happy with the course? Get your full refund within 30 days, no questions asked.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right - Payment Summary (1/3) */}
            <div className="lg:col-span-1">
              
              {/* Sticky Payment Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8 space-y-6"
              >
                
                {/* Order Summary */}
                <div className="space-y-3">
                  <h3 className="checkout-title font-bold text-gray-900">
                    Order Summary
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Price</span>
                      <span className="font-semibold">₦{price.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Discount</span>
                      <span className="font-semibold text-emerald-600">₦0</span>
                    </div>

                    <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ₦{price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {paymentError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{paymentError}</p>
                  </motion.div>
                )}

                {/* Payment Button */}
                <motion.button
                  whileHover={!isPending ? { scale: 1.02 } : {}}
                  whileTap={!isPending ? { scale: 0.98 } : {}}
                  onClick={handlePayment}
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Pay & Enroll Now
                    </>
                  )}
                </motion.button>

                {/* Security Info */}
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    <span>Secure payment with Paystack</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Instant enrollment after payment</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Lifetime access to materials</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-3">Trusted by</p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                      Paystack
                    </div>
                    <div className="flex-1 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                      SSL Secure
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CourseCheckout;
