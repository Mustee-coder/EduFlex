import api, { profileEndpoints } from "../api/apis";


export const getUserDetails = () =>
  api.get(profileEndpoints.GET_USER_DETAILS).then(res => res.data);

export const getEnrolledCourses = () =>
  api.get(profileEndpoints.GET_ENROLLED_COURSES).then(res => res.data);
  
  
  