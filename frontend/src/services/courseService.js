import api, { courseEndpoints } from "../api/apis";


export const getCourseDetails = async (courseId) => {
  const res = await api.get(
    `${courseEndpoints.COURSE_DETAILS}/${courseId}`
  );

  return res.data;
};


export const updateCourseProgress = async (courseId, subSectionId) => {
  const res = await api.post(courseEndpoints.UPDATE_PROGRESS, {
    courseId,
    subSectionId,
  });

  // 🔥 safe return (handles all backend formats)
  return res?.data?.data || res?.data;
};