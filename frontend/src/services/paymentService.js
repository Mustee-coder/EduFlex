import api, { paymentEndpoints } from "../api/apis";

export const initializePayment = async (data) => {
  const res = await api.post(
    paymentEndpoints.INITIALIZE_PAYMENT,
    data
  );

  return res.data;
};




export const verifyPayment = async (reference) => {
  const res = await api.get(
    `${paymentEndpoints.VERIFY_PAYMENT}/${reference}`
  );

  return res.data;
};



