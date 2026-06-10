import express from "express";
import dotenv from "dotenv";
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
    tempFileDir: "/data/data/com.termux/files/home/tmp",
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