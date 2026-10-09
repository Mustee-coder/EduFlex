import axios from "axios";

const BREVO_EMAILS_URL = "https://api.brevo.com/v3/smtp/email";

const mailSender = async (email, title, body) => {
  const content = String(body);
  const isHtml = /<\/?[a-z][^>]*>/i.test(content);
  const payload = {
    sender: { name: "EduFlex", email: process.env.MAIL_FROM },
    to: [{ email }],
    subject: title,
    ...(isHtml ? { htmlContent: content } : { textContent: content }),
  };

  try {
    const response = await axios.post(BREVO_EMAILS_URL, payload, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        accept: "application/json",
        "content-type": "application/json",
      },
      timeout: 10000,
      maxRedirects: 0,
    });

    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    const safeMessage = status
      ? `Brevo email request failed (HTTP ${status}).`
      : "Brevo email request failed due to a network error.";
    // Do not attach the Axios error: it can contain request configuration or
    // provider response data. Existing callers receive a safe, generic error.
    throw new Error(safeMessage);
  }
};

export default mailSender;
