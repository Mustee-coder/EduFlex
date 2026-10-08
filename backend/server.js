import { env } from "./config/env.js";
import { sendInternalError } from "./utils/errorResponse.js";
import express from "express";
import dns from "dns";
import os from "os";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

// Config
import { connectDB } from "./config/database.js";
import { cloudinaryConnect } from "./config/cloudinary.js";

// Routes
import userRoutes from "./routes/user.js";
import profileRoutes from "./routes/profile.js";
import courseRoutes from "./routes/course.js";
import paymentRoutes from "./routes/payments.js";
import adminRoutes from "./routes/admin.js";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
  console.warn("Unable to set DNS servers:", error.message || error);
}

const app = express();
const PORT = env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allowed Origins
const configuredOrigins = [env.FRONTEND_URL, env.CLIENT_URL]
  .filter(Boolean)
  .map((url) => new URL(url).origin);
const allowedOrigins = [
  ...(env.NODE_ENV === "production" ? [] : ["http://localhost:5173"]),
  ...configuredOrigins,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    limits: { fileSize: 100 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Default Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS API is running successfully",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  sendInternalError(res, err);
});

// Start Server
await connectDB();
cloudinaryConnect();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
