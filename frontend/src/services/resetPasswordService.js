import api, { authEndpoints } from "../api/apis";


export const resetPasswordToken = async (email) => {
  const res = await api.post(
    authEndpoints.RESET_PASSWORD_TOKEN,
    { email }
  );

  return res.data;
};

export const resetPassword = async (data) => {
  const res = await api.post(
    authEndpoints.RESET_PASSWORD,
    data
  );

  return res.data;
};