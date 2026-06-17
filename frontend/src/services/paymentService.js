import api, { paymentEndpoints } from "../api/apis";

export const initializePayment = async (data) => {
  const res = await api.post(
    paymentEndpoints.INITIALIZE_PAYMENT,
    data
  );

  return res.data;
};