
import CourseProgress from "../models/courseProgress.js";
import SubSection from "../models/subSection.js";
import Course from "../models/course.js";
import mongoose from "mongoose";

export const updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subSectionId } = req.body;
    const userId = req.user.id;

    // validation
    if (!courseId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "courseId and subSectionId are required",
      });
    }

    // check subsection exists
    const subsection = await SubSection.findById(subSectionId);
    if (!subsection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    // fetch course with sections
    const course = await Course.findById(courseId).populate({
      path: "sections",
      populate: {
        path: "subSections",
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // validate subsection belongs to course
    const validSubsection = course.sections.some((section) =>
      section.subSections.some(
        (sub) => sub._id.toString() === subSectionId
      )
    );

    if (!validSubsection) {
      return res.status(400).json({
        success: false,
        message: "Invalid subsection for this course",
      });
    }

    // find or create progress (ATOMIC FIX)
    let courseProgress = await CourseProgress.findOneAndUpdate(
      { courseId, userId },
      {
        $setOnInsert: {
          courseId,
          userId,
          completedVideos: [],
        },
      },
      { new: true, upsert: true }
    );

    // add progress safely (NO duplicates)
    await CourseProgress.updateOne(
      { courseId, userId },
      {
        $addToSet: {
          completedVideos: subSectionId,
        },
      }
    );

    // refresh updated progress
    courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    });

    // calculate progress
    const totalVideos = course.sections.reduce(
      (acc, section) => acc + section.subSections.length,
      0
    );

    const completed = courseProgress.completedVideos.length;

    const progressPercentage =
      totalVideos === 0
        ? 0
        : Math.round((completed / totalVideos) * 100);

    return res.status(200).json({
      success: true,
      message: "Course progress updated successfully",
      data: {
        completedVideos: courseProgress.completedVideos,
        progressPercentage,
      },
    });

  } catch (error) {
    console.log("Error updating course progress:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};