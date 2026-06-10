import mongoose from "mongoose";

const ratingAndReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews (1 user = 1 review per course)
ratingAndReviewSchema.index({ user: 1, course: 1 }, { unique: true });

const RatingAndReview = mongoose.model(
  "RatingAndReview",
  ratingAndReviewSchema
);

export default RatingAndReview;