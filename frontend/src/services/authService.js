import api, { authEndpoints ,profileEndpoints} from "../api/apis";

// LOGIN
export const loginUser = async (data) => {
  const res = await api.post(authEndpoints.LOGIN, data);
  return res.data;
};

// SIGNUP
export const signupUser = async (data) => {
  const res = await api.post(authEndpoints.SIGNUP, data);
  return res.data;
};

// SEND OTP
export const sendOtp = async (data) => {
  const res = await api.post(authEndpoints.SEND_OTP, data);
  return res.data;
};

// VERIFY OTP
export const verifyOtp = async (data) => {
  const res = await api.post(authEndpoints.VERIFY_OTP, data);
  return res.data;
};

