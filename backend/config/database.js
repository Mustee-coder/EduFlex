import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database connected successfully");
  } catch (error) {
    const errorName = error instanceof Error && /^[A-Za-z][A-Za-z0-9]*$/.test(error.name)
      ? error.name
      : "UnknownError";
    const errorCode = Number.isInteger(error?.code) ? error.code : undefined;

    console.error("[database] connection failed", { errorName, errorCode });

    process.exit(1);
  }
};
