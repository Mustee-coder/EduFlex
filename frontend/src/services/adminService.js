import api, { adminEndpoints } from "../api/apis";


export const getAdminStats = async () => {
  try {
    const res = await api.get(
      adminEndpoints.GET_ADMIN_STATS
    );

    return res.data;

  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const getAllStudents = async () => {
  try {
    const res = await api.get(
      adminEndpoints.GET_ALL_STUDENTS
    );

    return res.data;

  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllInstructors = async () => {
  try {
    const res = await api.get(
      adminEndpoints.GET_ALL_INSTRUCTORS
    );

    return res.data;

  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const approveInstructor = async (instructorId) => {
  const res = await api.patch(adminEndpoints.APPROVE_INSTRUCTOR(instructorId));
  return res.data;
};

export const rejectInstructor = async (instructorId) => {
  const res = await api.patch(adminEndpoints.REJECT_INSTRUCTOR(instructorId));
  return res.data;
};
