import { useParams, useNavigate } from "react-router-dom";
import { useGetCourseDetails } from "@/hooks/useGetCourseDetails";
import { useInitializePayment } from "@/hooks/useInitializePayment";

const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetCourseDetails(courseId);
  const { mutate, isPending } = useInitializePayment();

  const course = data?.data?.courseDetails;

  const handlePayment = () => {
    if (!courseId) return;

    mutate(
      { coursesId: [courseId] },
      {
        onSuccess: (res) => {
          const url = res?.data?.authorization_url;

          if (url) {
            window.location.href = url;
          }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading checkout...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Course not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT - ORDER SUMMARY */}
        <div className="p-6 space-y-4">

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500"
          >
            ← Back
          </button>

          <h2 className="text-xl font-bold">Order Summary</h2>

          <div className="flex gap-4 items-center">
            <img
              src={course.thumbnail}
              className="w-20 h-20 object-cover rounded"
              alt="course"
            />

            <div>
              <h3 className="font-semibold">
                {course.courseName}
              </h3>
              <p className="text-sm text-gray-500">
                By {course.instructor?.firstName}
              </p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Price</span>
              <span>₦{course.price}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span>₦0</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₦{course.price}</span>
            </div>

          </div>
        </div>

        {/* RIGHT - PAYMENT */}
        <div className="bg-gray-50 p-6 flex flex-col justify-center">

          <h2 className="text-xl font-bold mb-4">
            Secure Checkout 🔒
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            You will be redirected to Paystack to complete your payment securely.
          </p>

          <button
            onClick={handlePayment}
            disabled={isPending}
            className={`w-full py-3 rounded text-white transition ${
              isPending
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isPending ? "Processing..." : "Pay & Enroll"}
          </button>

          <div className="text-xs text-gray-500 mt-4 space-y-1">
            <p>🔒 Secure payment powered by Paystack</p>
            <p>📩 Instant enrollment after payment</p>
            <p>♾ Lifetime access included</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;