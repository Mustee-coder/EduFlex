import api, { courseEndpoints } from "../api/apis";


export const getCourseDetails = async (courseId) => {
  const res = await api.get(
    `${courseEndpoints.COURSE_DETAILS}/${courseId}`
  );

  return res.data;
};


export const updateCourseProgress = async (courseId, subSectionId) => {
  const res = await api.patch(courseEndpoints.UPDATE_PROGRESS, {
    courseId,
    subSectionId,
  });

  return res.data.data;
};

export const getAllCourses = async () => {
  const res = await api.get(courseEndpoints.GET_ALL_COURSES);
  return res.data;
};




export const getFullCourseDetails = async (courseId) => {
  const res = await api.get(
    `${courseEndpoints.FULL_COURSE_DETAILS}/${courseId}`
  );

  return res.data;
};


