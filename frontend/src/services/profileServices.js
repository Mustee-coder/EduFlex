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


export const getEnrollmentTrend = async () => {
  const res = await api.get(profileEndpoints.GET_ENROLLMENT_TREND);

  return res.data;
};




export const updateProfile = async (data) => {
  const res = await api.put(
    profileEndpoints.UPDATE_PROFILE,
    data
  );

  return res.data;
};

export const deleteProfile = async () => {
  const res = await api.delete(
    profileEndpoints.DELETE_PROFILE
  );

  return res.data;
};

export const updateProfileImage = async (formData) => {
  const res = await api.put(
    profileEndpoints.UPDATE_PROFILE_IMAGE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};


