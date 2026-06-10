import User from "../models/user.js";
import Course from "../models/course.js";
import RatingAndReview from "../models/ratingAndReview.js";
import mongoose from "mongoose";

//  CREATE RATING 
export const createRating = async (req, res) => {
  try {
    const { rating, review, courseId } = req.body;
    const userId = req.user.id;

    if (!rating || !review || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    //  proper enrollment check
    const isEnrolled = course.studentsEnrolled.includes(userId);

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You must enroll before reviewing",
      });
    }

    const alreadyReviewed = await RatingAndReview.findOne({
      course: courseId,
      user: userId,
    });

    if (alreadyReviewed) {
      return res.status(409).json({
        success: false,
        message: "You already reviewed this course",
      });
    }

    const ratingReview = await RatingAndReview.create({
      user: userId,
      course: courseId,
      rating: Number(rating), 
      review,
    });

    await Course.findByIdAndUpdate(courseId, {
      $push: { ratingAndReviews: ratingReview._id },
    });

    return res.status(200).json({
      success: true,
      data: ratingReview,
      message: "Rating created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get avrageRatings

export const getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        averageRating: 0,
        totalReviews: 0,
      });
    }

    return res.status(200).json({
      success: true,
      averageRating: result[0].averageRating,
      totalReviews: result[0].totalReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// All ratings 
export const getAllRatingReview = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ createdAt: -1 }) // better than rating sort
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      });

    return res.status(200).json({
      success: true,
      data: allReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};