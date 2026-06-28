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

dotenv.config();

// Force Node DNS to use public resolvers when local DNS is unavailable for SRV lookups.
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
  console.warn("Unable to set DNS servers:", error.message || error);
}

const app = express();
const PORT = process.env.PORT || 5000;

//  MIDDLEWARE 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
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

//  DATABASE 

connectDB();
cloudinaryConnect();

//  ROUTES 

app.use("/api/auth", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/course", courseRoutes);
 app.use("/api/payment", paymentRoutes);

//  DEFAULT ROUTE

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS API is running successfully",
  });
});

// ERROR HANDLER 

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

//  START SERVER 

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});