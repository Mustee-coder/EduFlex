import CourseProgress from "../models/courseProgress.js";
import SubSection from "../models/subSection.js";
import Course from "../models/course.js";

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

    // get course structure
    const course = await Course.findById(courseId).populate({
      path: "sections",
      populate: { path: "subSections" },
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

    // find or create progress
    let progress = await CourseProgress.findOne({
      courseId,
      userId,
    });

    if (!progress) {
      progress = await CourseProgress.create({
        courseId,
        userId,
        completedLessons: [],
        lastWatched: null,
        progressPercentage: 0,
      });
    }

    // update progress safely
    if (!progress.completedLessons.includes(subSectionId)) {
      progress.completedLessons.push(subSectionId);
    }

    // update last watched
    progress.lastWatched = subSectionId;

    // calculate total lessons
    const totalLessons = course.sections.reduce(
      (acc, section) => acc + section.subSections.length,
      0
    );

    const completedCount = progress.completedLessons.length;

    progress.progressPercentage =
      totalLessons === 0
        ? 0
        : Math.round((completedCount / totalLessons) * 100);

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Course progress updated successfully",
      data: {
        completedLessons: progress.completedLessons,
        progressPercentage: progress.progressPercentage,
        lastWatched: progress.lastWatched,
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