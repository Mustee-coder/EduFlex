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




// INSTRUCTOR COURSES
export const getInstructorCourses = async () => {
  const res = await api.get(courseEndpoints.INSTRUCTOR_COURSES);
  return res.data;
};


export const deleteCourse = async (courseId) => {
  const res = await api.delete(
    courseEndpoints.DELETE_COURSE(courseId)
  );
  return res.data;
};



export const createCourse = async (formData) => {
  const res = await api.post(
    courseEndpoints.CREATE_COURSE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};



export const createSection = async (data) => {
  const res = await api.post(courseEndpoints.CREATE_SECTION, data);
  return res.data;
};

export const createSubSection = async (formData) => {
  const res = await api.post(
    courseEndpoints.CREATE_SUBSECTION,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log(res.data);

  return res.data;
};




export const updateSection = async (data) => {
  const res = await api.post(
    courseEndpoints.UPDATE_SECTION,
    data
  );

  return res.data;
};






export const deleteSection = async (data) => {
  const res = await api.delete(
    courseEndpoints.DELETE_SECTION,
    {
      data,
    }
  );

  return res.data;
};



export const updateSubSection = async(data) => {
  const res = await api.post(
    courseEndpoints.UPDATE_SUBSECTION,
    data
  );

  return res.data;
};
export const deleteSubSection = async (data) => {
  const res = await api.delete(courseEndpoints.DELETE_SUBSECTION, {
    data,
  });

  return res.data;
};




export const publishCourse = async ({ courseId, status }) => {
  const response = await api.patch(
    `${courseEndpoints.PUBLISHED_COURSE}/${courseId}`,
    { status }
  );

  return response.data;
};

