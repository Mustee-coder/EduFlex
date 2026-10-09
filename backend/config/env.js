import dotenv from "dotenv";

dotenv.config();

const requiredVariables = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLOUD_NAME",
  "CLOUD_API_KEY",
  "CLOUD_API_SECRET",
  "PAYSTACK_SECRET_KEY",
  "BREVO_API_KEY",
  "MAIL_FROM",
];

for (const name of requiredVariables) {
  if (!process.env[name] || !process.env[name].trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(process.env.MAIL_FROM)) {
  throw new Error("MAIL_FROM must be a valid email address.");
}

const validateUrl = (name) => {
  const value = process.env[name];
  if (value === undefined) return;

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error();
    }
  } catch {
    throw new Error(`${name} must be a valid HTTP or HTTPS URL.`);
  }
};

validateUrl("CLIENT_URL");
validateUrl("FRONTEND_URL");

if (process.env.NODE_ENV === "production") {
  for (const name of ["CLIENT_URL", "FRONTEND_URL"]) {
    if (!process.env[name] || !process.env[name].trim()) {
      throw new Error(`Missing required production environment variable: ${name}`);
    }
  }
}

let saltRounds = 10;
if (process.env.SALT_ROUNDS !== undefined) {
  saltRounds = Number(process.env.SALT_ROUNDS);
  if (!Number.isFinite(saltRounds) || saltRounds <= 0) {
    throw new Error("SALT_ROUNDS must be a positive number.");
  }
}

export const env = Object.freeze({
  ...Object.fromEntries(
    requiredVariables.map((name) => [name, process.env[name]])
  ),
  CLIENT_URL: process.env.CLIENT_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  MAIL_FROM: process.env.MAIL_FROM,
  FOLDER_NAME: process.env.FOLDER_NAME,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 5000,
  SALT_ROUNDS: saltRounds,
});

export default env;
