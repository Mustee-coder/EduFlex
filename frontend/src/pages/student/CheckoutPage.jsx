import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars -- Core ESLint does not count JSX member references.
import { motion } from "framer-motion";
import { useGetCourseDetails } from "@/hooks/useGetCourseDetails";
import { useInitializePayment } from "@/hooks/useInitializePayment";
import { Loading } from "@/components/Loader";
import { toast } from "sonner";
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
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
      <div className="student-page flex min-h-[60vh] items-center justify-center bg-slate-50 p-4">
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

  const price = course.amount ?? course.price ?? 0;

  return (
    <>
     

      <div className="checkout-root student-page min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        
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
              <div className="student-panel overflow-hidden">
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

                    <p className="text-sm text-slate-500">{course.sections?.length || 0} sections · {(course.sections || []).reduce((count, section) => count + (section.subSections?.length || 0), 0)} lessons</p>
                  </div>
                </div>
              </div>

              {course.whatYouWillLearn && (
                <div className="student-panel p-5 sm:p-6">
                  <h2 className="font-semibold text-slate-900">What you’ll learn</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{course.whatYouWillLearn}</p>
                </div>
              )}
            </div>

            {/* Right - Payment Summary (1/3) */}
            <div className="lg:col-span-1">
              
              {/* Sticky Payment Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="student-panel space-y-6 p-5 sm:p-6 lg:sticky lg:top-24"
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

                    <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
                      <span>Total</span>
                      <span className="text-indigo-700">
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
                  className="student-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
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
                    <span>Enrollment follows payment confirmation</span>
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
