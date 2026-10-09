import jwt from "jsonwebtoken";
import User, { getInstructorApprovalStatus } from "../models/user.js";
import { sendInternalError } from "../utils/errorResponse.js";

//  AUTH
export const auth = (req, res, next) => {


  const token =
    req.cookies?.token ||
    req.header("Authorization")?.replace("Bearer ", "");

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
		return sendInternalError(res, error);
	}
};

//  IS INSTRUCTOR 
export const isInstructor = async (req, res, next) => {
  try {
    if (req.user?.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "This route is only for Instructors",
      });
    }

    const user = await User.findById(req.user.id).select(
      "accountType approved approvalStatus"
    );

    if (
      !user ||
      user.accountType !== "Instructor" ||
      getInstructorApprovalStatus(user) !== "approved"
    ) {
      return res.status(403).json({
        success: false,
        message: "Instructor account approval is required",
      });
    }

    next();
  } catch (error) {
    return sendInternalError(res, error);
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
		return sendInternalError(res, error);
	}
};

export const isInstructorOrAdmin = async (req, res, next) => {
  try {
    if (req.user?.accountType === "Admin") {
      return next();
    }

    if (req.user?.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const user = await User.findById(req.user.id).select(
      "accountType approved approvalStatus"
    );

    if (
      !user ||
      user.accountType !== "Instructor" ||
      getInstructorApprovalStatus(user) !== "approved"
    ) {
      return res.status(403).json({
        success: false,
        message: "Instructor account approval is required",
      });
    }

    next();
  } catch (error) {
    return sendInternalError(res, error);
  }
};
