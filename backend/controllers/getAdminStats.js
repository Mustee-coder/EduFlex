import User from "../models/user.js";
import Course from "../models/course.js";
import Payment from "../models/payment.js";
import { sendInternalError } from "../utils/errorResponse.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({
      accountType: "Student",
    });

    const totalInstructors = await User.countDocuments({
      accountType: "Instructor",
    });

    const totalCourses = await Course.countDocuments();

    const totalRevenue = await Payment.aggregate([
      {
        $match: {
          status: "success",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalInstructors,
        totalCourses,
        totalRevenue:
          totalRevenue[0]?.total || 0,
      },
    });

  } catch (error) {
    return sendInternalError(res, error);
  }
};
