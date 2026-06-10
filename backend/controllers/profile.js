import Profile from "../models/profile.js";
import User from "../models/user.js";
import Course from "../models/course.js";
import CourseProgress from "../models/courseProgress.js";
import { deleteResourceFromCloudinary } from "../utils/imageUploader.js";

//  UPDATE PROFILE 
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      gender = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      firstName,
      lastName,
    } = req.body;

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

    // update user safely
    if (firstName) userDetails.firstName = firstName;
    if (lastName) userDetails.lastName = lastName;

    await userDetails.save();

    //  update profile safely
    profileDetails.gender = gender;
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    const updatedUser = await User.findById(userId).populate(
      "additionalDetails"
    );

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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

    // delete avatar
    if (userDetails.image) {
      await deleteResourceFromCloudinary(userDetails.image);
    }

    //  remove user from all courses (fast bulk update)
    await Course.updateMany(
      { studentsEnrolled: userId },
      { $pull: { studentsEnrolled: userId } }
    );

    // delete course progress
    await CourseProgress.deleteMany({ userId });

    //  delete profile
    await Profile.findByIdAndDelete(
      userDetails.additionalDetails
    );

    //  delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//  GET USER DETAILS 
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate("additionalDetails")
      .select("-password -token");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: "User fetched successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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

    const uploadedImage = await uploadImageToCloudinary(
      profileImage,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: uploadedImage.secure_url },
      { new: true }
    ).populate("additionalDetails");

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile image updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  GET ENROLLED COURSES 
export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "courses",
      populate: {
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const enrichedCourses = await Promise.all(
      user.courses.map(async (course) => {
        let totalSeconds = 0;
        let lectureCount = 0;

        course.courseContent.forEach((section) => {
          section.subSection.forEach((sub) => {
            totalSeconds += Number(sub.timeDuration) || 0;
            lectureCount++;
          });
        });

        const progress = await CourseProgress.findOne({
          courseID: course._id,
          userId,
        });

        const completed = progress?.completedVideos.length || 0;

        const progressPercentage =
          lectureCount === 0
            ? 100
            : Math.round((completed / lectureCount) * 100);

        return {
          ...course.toObject(),
          totalDuration: convertSecondsToDuration(totalSeconds),
          progressPercentage,
        };
      })
    );

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
              "$price",
            ],
          },
        },
      },
    ]);

    const totalStudents = result.reduce(
      (acc, c) => acc + c.totalStudentsEnrolled,
      0
    );

    return res.status(200).json({
      success: true,
      data: result,
      stats: {
        totalCourses: result.length,
        totalStudents,
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
    // 🔐 role protection (recommended)
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