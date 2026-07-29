import express from "express";
import dotenv from "dotenv";
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

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
  console.warn("Unable to set DNS servers:", error.message || error);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://edu-flex-coral.vercel.app",
  "https://edu-flex-nt5g4rbp1-mustee-coders-projects.vercel.app",
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

// Database
connectDB();
cloudinaryConnect();

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
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});