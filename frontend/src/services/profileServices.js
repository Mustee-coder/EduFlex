import api, { profileEndpoints } from "../api/apis";

export const getUserDetails = async () => {
  const res = await api.get(profileEndpoints.GET_USER_DETAILS);
  return res.data;
};

export const getEnrolledCourses = async () => {
  const res = await api.get(profileEndpoints.GET_ENROLLED_COURSES);
  return res.data;
};

export const getMyLearning = async () => {
  const res = await api.get(profileEndpoints.GET_MYLEARNING);
  return res.data;
};