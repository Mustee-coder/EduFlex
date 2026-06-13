import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//  AUTH
export const auth = (req, res, next) => {
  console.log("COOKIES RECEIVED:", req.cookies); // 🔥 ADD THIS

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token expired or invalid",
    });
  }
};
//IS STUDENT 
export const isStudent = (req, res, next) => {
	try {
		if (req.user?.accountType !== "Student") {
			return res.status(403).json({
				success: false,
				message: "This route is only for Students",
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//  IS INSTRUCTOR 
export const isInstructor = (req, res, next) => {
	try {
		if (req.user?.accountType !== "Instructor") {
			return res.status(403).json({
				success: false,
				message: "This route is only for Instructors",
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// IS ADMIN 
export const isAdmin = (req, res, next) => {
	try {
		if (req.user?.accountType !== "Admin") {
			return res.status(403).json({
				success: false,
				message: "This route is only for Admins",
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
