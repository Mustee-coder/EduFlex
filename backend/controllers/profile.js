import Profile from "../models/profile.js";
import User from "../models/user.js";
import Course from "../models/course.js";
import CourseProgress from "../models/courseProgress.js";
import mongoose from "mongoose"
import { deleteResourceFromCloudinary, uploadImageToCloudinary } from "../utils/imageUploader.js";
import { convertSecondsToDuration } from "../utils/secToDuration.js";
import Payment from "../models/payment.js";




//  UPDATE PROFILE 
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      gender,
      dateOfBirth,
      about,
      contactNumber,
      firstName,
      lastName,
    } = req.body;

console.log("USER:", req.user);
console.log("BODY:", req.body);
    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileDetails = await Profile.findById(
      userDetails.additionalDetails
    );

    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    if (firstName) userDetails.firstName = firstName.trim();
    if (lastName) userDetails.lastName = lastName.trim();

    await userDetails.save();

    if (gender !== undefined)
      profileDetails.gender = gender;

    if (dateOfBirth !== undefined)
      profileDetails.dateOfBirth = dateOfBirth;

    if (about !== undefined)
      profileDetails.about = about;

    if (contactNumber !== undefined)
      profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    const updatedUser = await User.findById(userId)
      .populate("additionalDetails")
      .select("-password -token -resetPasswordTokenExpires");

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

//  DELETE ACCOUNT 
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userDetails.image) {
      await deleteResourceFromCloudinary(userDetails.image);
    }

    await Course.updateMany(
      { studentsEnrolled: userId },
      { $pull: { studentsEnrolled: userId } }
    );

    await CourseProgress.deleteMany({ userId });

    await Profile.findByIdAndDelete(
      userDetails.additionalDetails
    );

    await User.findByIdAndDelete(userId);

    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (error) {
    console.error("DELETE ACCOUNT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};

//  GET USER DETAILS 
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate("additionalDetails")
      .select("-password -token -resetPasswordTokenExpires");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: "User details fetched successfully",
    });

  } catch (error) {
    console.error("GET USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};
//  UPDATE PROFILE IMAGE 
export const updateUserProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    const profileImage = req.files?.profileImage;

    if (!profileImage) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.image) {
      await deleteResourceFromCloudinary(user.image);
    }

    const uploadedImage = await uploadImageToCloudinary(
      profileImage,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        image: uploadedImage.secure_url,
      },
      {
        new: true,
      }
    )
      .populate("additionalDetails")
      .select("-password -token -resetPasswordTokenExpires");

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile image updated successfully",
    });

  } catch (error) {
    console.error("UPDATE IMAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile image",
    });
  }
};
//  GET ENROLLED COURSES 
export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get user + courses
    const user = await User.findById(userId).populate("courses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Enrich courses
    const enrichedCourses = await Promise.all(
      user.courses.map(async (course) => {

        // 🔥 FULL POPULATE (IMPORTANT FIX)
        const fullCourse = await Course.findById(course._id).populate({
          path: "sections",
          populate: {
            path: "subSections",
          },
        });

        let totalSeconds = 0;
        let lectureCount = 0;

        // 3. SAFE LOOP
        (fullCourse.sections || []).forEach((section) => {
          (section.subSections || []).forEach((sub) => {
            totalSeconds += Number(sub.timeDuration || 0);
            lectureCount++;
          });
        });

        // 4. Progress
        const progress = await CourseProgress.findOne({
          courseId: course._id,
          userId,
        });

        const completed = progress?.completedLessons?.length || 0;

        const progressPercent =
          lectureCount === 0
            ? 100
            : Math.round((completed / lectureCount) * 100);

        // 5. Return clean object
        return {
          ...fullCourse.toObject(),
          totalDuration: convertSecondsToDuration(totalSeconds),
          progressPercentage: progressPercent,
          progress: {
            completed,
            totalVideos: lectureCount,
            progressPercent,
          },
        };
      })
    );

    // 6. Response
    return res.status(200).json({
      success: true,
      data: enrichedCourses,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//   INSTRUCTOR DASHBOARD  
export const instructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user.id;

    if (req.user.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can access dashboard",
      });
    }

    const result = await Course.aggregate([
      {
        $match: {
          instructor: new mongoose.Types.ObjectId(instructorId),
        },
      },
      {
        $project: {
          courseName: 1,
          price: 1,
          totalStudentsEnrolled: {
            $size: { $ifNull: ["$studentsEnrolled", []] },
          },
          totalRevenue: {
  $multiply: [
    { $size: { $ifNull: ["$studentsEnrolled", []] } },
    { $ifNull: ["$price", 0] },
  ],
},
        },
      },
    ]);
    
    const bestCourse =
  result.length > 0
    ? result.reduce((best, course) =>
        course.totalStudentsEnrolled > best.totalStudentsEnrolled
          ? course
          : best
      )
    : null;
        
    console.log(bestCourse);

    const totalStudents = result.reduce(
      (acc, c) => acc + c.totalStudentsEnrolled,
      0
    );
    
    const  totalRevenue = result.reduce(
  (acc, c) => acc + c.totalRevenue,
  0
);

    return res.status(200).json({
  success: true,
  data: result,
  stats: {
    totalCourses: result.length,
    totalStudents,
    totalRevenue,
    bestCourse
  },
});

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//   ALL STUDENTS  
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find(
      { accountType: "Student" },
      {
        password: 0,
        token: 0,
        resetPasswordTokenExpires: 0,
      }
    )
      .populate("additionalDetails")
      .populate({
        path: "courses",
        select: "courseName price thumbnail",
      })
      .sort({ createdAt: -1 });

    const count = await User.countDocuments({
      accountType: "Student",
    });

    return res.status(200).json({
      success: true,
      count,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//   ALL INSTRUCTORS  

export const getAllInstructors = async (req, res) => {
  try {
    //  role protection (recommended)
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can access instructors list",
      });
    }

    const instructors = await User.find(
      { accountType: "Instructor" },
      {
        password: 0,
        token: 0,
        resetPasswordTokenExpires: 0,
      }
    )
      .populate("additionalDetails")
      .populate({
        path: "courses",
        select: "courseName price thumbnail",
      })
      .sort({ createdAt: -1 });

    const count = await User.countDocuments({
      accountType: "Instructor",
    });

    return res.status(200).json({
      success: true,
      count,
      data: instructors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getMyLearning = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "sections",
          populate: {
            path: "subSections",
            select: "title timeDuration videoUrl",
          },
        },
      })
      .populate("courseProgress");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const courses = user.courses || [];

    const enriched = courses.map((course) => {
      const totalVideos = course.sections?.reduce(
        (acc, sec) => acc + (sec.subSections?.length || 0),
        0
      );

      const progress = user.courseProgress?.find(
        (p) =>
          p.courseId?.toString() === course._id.toString()
      );

      const completed = progress?.completedLessons?.length || 0;

      const progressPercent =
        totalVideos === 0
          ? 0
          : Math.round((completed / totalVideos) * 100);

      return {
        _id: course._id,
        courseName: course.courseName,
        thumbnail: course.thumbnail,
        instructor: course.instructor,
        price: course.price,
        status: course.status,

        progress: {
          completed,
          totalVideos,
          progressPercent,
        },
      };
    });

    return res.status(200).json({
      success: true,
      data: enriched,
    });

  } catch (error) {
    console.error("[MY_LEARNING_ERROR]", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch My Learning",
    });
  }
};



export const getEnrollmentTrend = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const trend = await Payment.aggregate([
      {
        $unwind: "$coursesId",
      },

      {
        $lookup: {
          from: "courses",
          localField: "coursesId",
          foreignField: "_id",
          as: "course",
        },
      },

      {
        $unwind: "$course",
      },

      {
        $match: {
          "course.instructor": new mongoose.Types.ObjectId(instructorId),
          status: "success",
        },
      },

      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          enrollments: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },

      {
        $project: {
          _id: 0,
          month: {
            $arrayElemAt: [
              [
                "",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              "$_id.month",
            ],
          },
          year: "$_id.year",
          enrollments: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: trend,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
