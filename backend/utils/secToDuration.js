
import Course from "../models/course.js";

/* export function convertSecondsToDuration(totalSeconds) {
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
 */


export const convertSecondsToDuration = (seconds) => {
  seconds = Math.round(seconds); // 🔥 FIX FLOAT ISSUE

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }

  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }

  return `${secs}s`;
};


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
