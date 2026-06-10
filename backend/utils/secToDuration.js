
import Course from "../models/course.js";

export function convertSecondsToDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}


export const calculateCourseDuration = async (courseId) => {
  const course = await Course.findById(courseId).populate({
    path: "sections",
    populate: {
      path: "subSections",
    },
  });
  

  if (!course) return 0;

  let total = 0;

  course.sections.forEach((section) => {
    section.subSections?.forEach((sub) => {
      total += Number(sub.timeDuration || 0);
    });
  });

  course.totalDuration = total;

  await course.save();

  console.log("UPDATED TOTAL DURATION:", total);

  return total;
};