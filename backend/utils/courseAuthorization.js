import Course from "../models/course.js";

export const getAuthorizedCourse = async (req, courseId) => {
  if (!courseId) {
    return {
      error: {
        status: 404,
        message: "Course not found",
      },
    };
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return {
      error: {
        status: 404,
        message: "Course not found",
      },
    };
  }

  const isAdmin = req.user?.accountType === "Admin";
  const isOwner = String(course.instructor) === String(req.user?.id);

  if (!isAdmin && !isOwner) {
    return {
      error: {
        status: 403,
        message: "Not authorized",
      },
    };
  }

  return { course };
};
