import Course from "../models/course.js";
import Section from "../models/section.js";
import SubSection from "../models/subSection.js";
import { calculateCourseDuration } from "../utils/secToDuration.js";
import { getAuthorizedCourse } from "../utils/courseAuthorization.js";
import { sendInternalError } from "../utils/errorResponse.js";



// CREATE SECTION

export const createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const authorization = await getAuthorizedCourse(req, courseId);

    if (authorization.error) {
      return res.status(authorization.error.status).json({
        success: false,
        message: authorization.error.message,
      });
    }

    const { course } = authorization;

    // create section
    const newSection = await Section.create({ sectionName });

    // attach to course
    await Course.findByIdAndUpdate(courseId, {
      $push: { sections: newSection._id },
    });

    // recalculate duration AFTER update
    await calculateCourseDuration(courseId);

    const updatedCourse = await Course.findById(courseId).populate({
      path: "sections",
      populate: { path: "subSections" },
    });

    return res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Section created successfully",
    });

  } catch (error) {
    return sendInternalError(res, error);
  }
};



// UPDATE SECTION

export const updateSection = async (req, res) => {
  try {
    const { sectionId, sectionName, courseId } = req.body;

    if (!sectionId || !sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const authorization = await getAuthorizedCourse(req, courseId);

    if (authorization.error) {
      return res.status(authorization.error.status).json({
        success: false,
        message: authorization.error.message,
      });
    }

    const { course } = authorization;
    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    if (!course.sections.some((id) => String(id) === String(sectionId))) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    section.sectionName = sectionName;
    await section.save();

    // recalc AFTER update
    await calculateCourseDuration(courseId);

    const updatedCourse = await Course.findById(courseId).populate({
      path: "sections",
      populate: { path: "subSections" },
    });

    return res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Section updated successfully",
    });

  } catch (error) {
    return sendInternalError(res, error);
  }
};



// DELETE SECTION

export const deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const authorization = await getAuthorizedCourse(req, courseId);

    if (authorization.error) {
      return res.status(authorization.error.status).json({
        success: false,
        message: authorization.error.message,
      });
    }

    const { course } = authorization;

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    if (!course.sections.some((id) => String(id) === String(sectionId))) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // delete subsections first
    if (section) {
      await SubSection.deleteMany({
        _id: { $in: section.subSections },
      });
    }

    // remove section from course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { sections: sectionId },
    });

    // delete section
    await Section.findByIdAndDelete(sectionId);

    // recalc AFTER deletion
    await calculateCourseDuration(courseId);

    const updatedCourse = await Course.findById(courseId).populate({
      path: "sections",
      populate: { path: "subSections" },
    });

    return res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Section deleted successfully",
    });

  } catch (error) {
    return sendInternalError(res, error);
  }
};
