import axios from "axios";

const BREVO_EMAILS_URL = "https://api.brevo.com/v3/smtp/email";

const redactProviderMessage = (value, sensitiveValues) => {
  let message = String(value);

  for (const sensitiveValue of sensitiveValues) {
    if (sensitiveValue) {
      message = message.split(String(sensitiveValue)).join("[REDACTED]");
    }
  }

  return message
    .replace(/\b(api[-_ ]?key|authorization|x-api-key)\s*[:=]\s*[^\s,;]+/gi, "$1: [REDACTED]")
    .replace(/\bbearer\s+[^\s,;]+/gi, "Bearer [REDACTED]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]")
    .replace(/\b[A-Za-z0-9_-]{32,}\b/g, "[REDACTED_TOKEN]")
    .replace(/\b\d{6}\b/g, "[REDACTED_CODE]")
    .slice(0, 300);
};

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
    const providerMessage = error?.response?.data?.message;
    const safeProviderMessage = typeof providerMessage === "string"
      ? redactProviderMessage(providerMessage, [
          process.env.BREVO_API_KEY,
          process.env.MAIL_FROM,
          email,
          title,
          content,
        ])
      : "Provider did not include an error message.";
    const safeMessage = status
      ? `Brevo email request failed (HTTP ${status}): ${safeProviderMessage}`
      : "Brevo email request failed due to a network error.";
    // Do not attach the Axios error: it can contain request configuration or
    // provider response data. Existing callers receive a safe, generic error.
    throw new Error(safeMessage);
  }
};

export default mailSender;
