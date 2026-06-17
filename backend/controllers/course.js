import Course from "../models/course.js";
import User from "../models/user.js";
import Category from "../models/category.js";
import CourseProgress from "../models/courseProgress.js";
import mongoose from "mongoose"
import Section from "../models/section.js";
import SubSection from "../models/subSection.js";

import { uploadImageToCloudinary } from "../utils/imageUploader.js";
import { deleteResourceFromCloudinary } from "../utils/imageUploader.js";
import { convertSecondsToDuration,calculateCourseDuration } from "../utils/secToDuration.js";
import { roleFilter } from "../utils/roleFilter.js";

//  CREATE COURSE 
export const createCourse = async (req, res) => {
  try {
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      instructions,
      status,
      tags,
    } = req.body;

    const instructorId = req.user?.id || req.user?._id;

    //  AUTH CHECK
    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - login required",
      });
    }

    if (req.user.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can create courses",
      });
    }

    //  BASIC VALIDATION
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    //  SAFE TAG PARSING
    try {
      tags = typeof tags === "string"
        ? JSON.parse(tags || "[]")
        : tags || [];
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid tags format",
      });
    }

    //  SAFE INSTRUCTIONS PARSING
    try {
      instructions = typeof instructions === "string"
        ? JSON.parse(instructions || "[]")
        : instructions || [];
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid instructions format",
      });
    }

    // THUMBNAIL CHECK
    const thumbnail = req.files?.thumbnailImage;

    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail is required",
      });
    }

    //  DUPLICATE CHECK
    const existingCourse = await Course.findOne({
      courseName,
      instructor: instructorId,
    });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course already exists",
      });
    }

    //  STATUS DEFAULT
    if (!status) status = "Draft";

    //  CATEGORY LOGIC (AUTO CREATE SAFE)
    let categoryDetails;

    if (
      typeof category === "string" &&
      category.match(/^[0-9a-fA-F]{24}$/)
    ) {
      categoryDetails = await Category.findById(category);
    }

    if (!categoryDetails) {
      categoryDetails = await Category.findOne({ name: category });
    }

    if (!categoryDetails) {
      categoryDetails = await Category.create({
        name: category,
        description: `${category} category`,
      });
    }

    //  UPLOAD THUMBNAIL
    const thumbnailDetails = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //  CREATE COURSE
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      instructions,
      tags,
      status,
      instructor: instructorId,
      thumbnail: thumbnailDetails.secure_url,
    });

    //  ATTACH TO INSTRUCTOR
    await User.findByIdAndUpdate(instructorId, {
      $push: { courses: newCourse._id },
    });

    //  RESPONSE
    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });

  } catch (error) {
    console.log("CREATE COURSE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


//   show all courses  


export const getAllCourses = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const filter = roleFilter(req.user);

    const allCourses = await Course.find(filter)
      .select("courseName courseDescription price thumbnail instructor ratingAndReviews status createdAt")
      .populate({
        path: "instructor",
        select: "firstName lastName email image",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCourses = await Course.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: allCourses,
      pagination: {
        total: totalCourses,
        page,
        pages: Math.ceil(totalCourses / limit),
      },
      message: "Courses fetched successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



//   Get Course Details  
export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const courseDetails = await Course.findById(courseId)
  .populate({
    path: "instructor",
    select: "-password -token",
  })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "sections",
        populate: {
          path: "subSections"
        },
      });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ROLE CHECK
    const userId = req.user?.id;

    const isOwner =
      userId &&
      courseDetails.instructor?._id?.toString() === userId;

    const isInstructor = req.user?.accountType === "Instructor";
    const isAdmin = req.user?.accountType === "Admin";

    if (
      courseDetails.status === "Draft" &&
      !isOwner &&
      !isInstructor &&
      !isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Access to draft course is forbidden",
      });
    }

    // TOTAL DURATION (FIXED)
    const totalDurationInSeconds = (courseDetails.sections || []).reduce(
  (acc, section) => {
    return (
      acc +
      section.subSections.reduce((subAcc, sub) => {
        return subAcc + Number(sub.timeDuration || 0);
      }, 0)
    );
  },
  0
);

return res.status(200).json({
  success: true,
  data: {
    courseDetails,
    totalDurationInSeconds,
    totalDuration: convertSecondsToDuration(totalDurationInSeconds),
  },
  message: "Course details fetched successfully",
});
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching course details",
      error: error.message,
    });
  }
};


//   Get Full Course Details  
export const getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const userId = req.user.id;

    const course = await Course.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(courseId),
        },
      },

      // instructor
      {
        $lookup: {
          from: "users",
          localField: "instructor",
          foreignField: "_id",
          as: "instructor",
        },
      },
      { $unwind: "$instructor" },

      // category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // sections
      {
        $lookup: {
          from: "sections",
          localField: "sections",
          foreignField: "_id",
          as: "sections",
        },
      },

      // subsections inside sections
      {
        $lookup: {
          from: "subsections",
          localField: "sections.subSections",
          foreignField: "_id",
          as: "allSubSections",
        },
      },

      // calculate total duration in DB
      {
        $addFields: {
          totalSeconds: {
            $sum: "$allSubSections.timeDuration",
          },
        },
      },
    ]);

    if (!course.length) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const courseDetails = course[0];

    // ACCESS CONTROL
    const isOwner =
      userId &&
      courseDetails.instructor._id.toString() === userId;

    const isInstructor =
      req.user.accountType === "Instructor" && isOwner;

    const isAdmin = req.user.accountType === "Admin";

    if (
      courseDetails.status === "Draft" &&
      !isOwner &&
      !isInstructor &&
      !isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Access to draft course is forbidden",
      });
    }

    // progress (still needed separately)
    const courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    });

    const completedLessons =
      courseProgress?.completedLessons || [];

    const totalVideos = courseDetails.allSubSections.length;

    const progressPercentage =
      totalVideos === 0
        ? 0
        : Math.round((completedLessons.length / totalVideos) * 100);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration: convertSecondsToDuration(
          courseDetails.totalSeconds || 0
        ),
        completedLessons,
        progressPercentage,
      },
      message: "Course details fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching course details",
      error: error.message,
    });
  }
};
//   Edit Course Details  
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updates = req.body;

    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    //  ownership check (IMPORTANT)
    if (course.instructor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this course",
      });
    }

    //  restrict allowed fields
    const allowedFields = [
      "courseName",
      "courseDescription",
      "whatYouWillLearn",
      "price",
      "status",
      "tag",
      "instructions",
    ];

    // thumbnail update
    if (req.files?.thumbnailImage) {
      const thumbnail = req.files.thumbnailImage;

      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );

      course.thumbnail = thumbnailImage.secure_url;
    }

    //  safe update loop
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        if (key === "tag" || key === "instructions") {
          try {
            course[key] = JSON.parse(updates[key]);
          } catch {
            return res.status(400).json({
              success: false,
              message: `Invalid JSON format for ${key}`,
            });
          }
        } else {
          course[key] = updates[key];
        }
      }
    }

    course.updatedAt = Date.now();

    await course.save();

    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "sections",
        populate: { path: "subSections" },
      });

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating course",
      error: error.message,
    });
  }
};


//   Get a list of Course for a given Instructor  
export const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user?.id || req.user?._id;

    // ROLE CHECK
    if (!req.user || req.user.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can access this data",
      });
    }

    // FETCH COURSES (Instructor Dashboard View → includes Draft + Published)
    const instructorCourses = await Course.find({
      instructor: instructorId,
    })
      .select("courseName price status createdAt thumbnail category ratingAndReviews")
      .populate({
        path: "category",
        select: "name",
      })
      .populate("ratingAndReviews")
      .sort({ createdAt: -1 })
      .lean();

    // TOTAL COURSES
    const totalCourses = instructorCourses.length;

    // OPTIONAL STATS (better dashboard UX)
    const publishedCount = instructorCourses.filter(
      (c) => c.status === "Published"
    ).length;

    const draftCount = instructorCourses.filter(
      (c) => c.status === "Draft"
    ).length;

    return res.status(200).json({
      success: true,
      data: instructorCourses,
      stats: {
        totalCourses,
        publishedCount,
        draftCount,
      },
      message: "Instructor courses fetched successfully",
    });
  } catch (error) {
    console.error("GET INSTRUCTOR COURSES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};

//   Delete the Course  
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    //  ownership check
    if (course.instructor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this course",
      });
    }

    //  remove course from students
    await User.updateMany(
      { courses: courseId },
      { $pull: { courses: courseId } }
    );

    // delete thumbnail
    if (course.thumbnail) {
      await deleteResourceFromCloudinary(course.thumbnail);
    }

    // delete sections + subsections
 const courseSections = course.sections || [];

    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);

      if (section) {
const subSections = section.subSections || [];

        for (const subSectionId of subSections) {
          const subSection = await SubSection.findById(subSectionId);

          if (subSection?.videoUrl) {
            await deleteResourceFromCloudinary(subSection.videoUrl);
          }

          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      await Section.findByIdAndDelete(sectionId);
    }

    // delete course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);

    return res.status(500).json({
      success: false,
      message: "Error while deleting course",
      error: error.message,
    });
  }
};

// publishCourse

export const publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ownership check
    if (!req.user || course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    course.status = "Published";
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course published successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


