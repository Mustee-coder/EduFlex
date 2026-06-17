import mongoose from "mongoose";

import paystack from "../config/paystack.js";
import mailSender from "../utils/mailSender.js";
import { courseEnrollmentEmail} from "../mail/templates/courseEnrollmentEmail.js";

import User from "../models/user.js";
import Course from "../models/course.js";
import CourseProgress from "../models/courseProgress.js";


// ─────────────────────────────
//  INITIALIZE PAYMENT
// ─────────────────────────────
export const initializePayment = async (req, res) => {
  try {
    const { coursesId } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(coursesId) || coursesId.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No courses provided.",
      });
    }

    // Fetch all courses at once (FASTER)
    const courses = await Course.find({
      _id: { $in: coursesId },
    });

    if (courses.length !== coursesId.length) {
      return res.status(404).json({
        success: false,
        message: "One or more courses not found.",
      });
    }

    let totalAmount = 0;
    const validCourses = [];

    for (const course of courses) {
      const alreadyEnrolled = course.studentsEnrolled.some(
        (sid) => sid.toString() === userId
      );

      if (alreadyEnrolled) {
        return res.status(400).json({
          success: false,
          message: `Already enrolled in "${course.courseName}".`,
        });
      }

      totalAmount += course.price;
      validCourses.push(course._id);
    }

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount.",
      });
    }

    const response = await paystack.post("/transaction/initialize", {
      email: req.user.email,
      amount: totalAmount * 100,
      metadata: {
        userId,
        coursesId: validCourses,
      },
    });

    return res.status(200).json({
      success: true,
      data: response.data,
    });

  } catch (error) {
    console.error("[initializePayment]", error);
    return res.status(500).json({
      success: false,
      message: "Payment initialization failed.",
    });
  }
};



//  VERIFY PAYMENT

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required.",
      });
    }

    // Prevent duplicate verification
    const existingPayment = await Payment.findOne({ reference });
    if (existingPayment) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified.",
      });
    }

    // Verify with Paystack
    const response = await paystack.get(
      `/transaction/verify/${reference}`
    );

    const paymentData = response.data.data;

    if (paymentData.status !== "success") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful.",
      });
    }

    const { userId, coursesId } = paymentData.metadata || {};

    if (!userId || !Array.isArray(coursesId) || !coursesId.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment metadata.",
      });
    }

    // Save payment record (VERY IMPORTANT)
    await Payment.create({
      userId,
      reference,
      coursesId,
      amount: paymentData.amount / 100,
      status: "success",
    });

    // Enroll student safely
    await enrollStudents(coursesId, userId);

    return res.status(200).json({
      success: true,
      message: "Payment verified & enrollment successful.",
    });

  } catch (error) {
    console.error(
      "[PAYSTACK ERROR]",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
};



//  ENROLLMENT ENGINE

 const enrollStudents = async (coursesId, userId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    if (!user.email) throw new Error("User email missing");

    const courses = await Course.find({
      _id: { $in: coursesId },
    }).session(session);

    const enrolledCourses = [];

    for (const course of courses) {
      const alreadyEnrolled = course.studentsEnrolled.includes(userId);

      if (alreadyEnrolled) continue;

      // Add student to course
      await Course.findByIdAndUpdate(
        course._id,
        {
          $addToSet: { studentsEnrolled: userId },
        },
        { session }
      );

      // Create progress
      const [progress] = await CourseProgress.create(
  [
    {
      courseId: course._id, 
      userId,
      completedVideos: [],
    },
  ],
  { session }
);

      // Link user
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            courses: course._id,
            courseProgress: progress._id,
          },
        },
        { session }
      );

      enrolledCourses.push(course);
    }

    await session.commitTransaction();
    session.endSession();

    // Send emails AFTER commit (safe side effect)
    for (const course of enrolledCourses) {
      try {
        await mailSender(
          user.email,
          `You're enrolled in ${course.courseName}!`,
          courseEnrollmentEmail(course.courseName, user.firstName)
        );
      } catch (err) {
        console.error("[EMAIL ERROR]", err.message);
      }
    }

    return true;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};




// ─────────────────────────────
//  PAYMENT SUCCESS EMAIL
// ─────────────────────────────
export const sendPaymentSuccessEmail = async (req, res) => {
  try {
    const { reference, amount } = req.body;
    const userId = req.user.id;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await mailSender(
      user.email,
      "Payment Successful 🎉",
      `Hi ${user.firstName},<br/><br/>
      Your payment was successful.<br/>
      <strong>Reference:</strong> ${reference}<br/>
      ${
        amount
          ? `<strong>Amount:</strong> ₦${amount.toLocaleString()}`
          : ""
      }
      <br/><br/>Thank you for learning with us!`
    );

    return res.status(200).json({
      success: true,
      message: "Payment success email sent.",
    });

  } catch (error) {
    console.error("[sendPaymentSuccessEmail]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send payment email.",
    });
  }
};
