import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    completedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
      },
    ],
  },
  { timestamps: true }
);

// Prevent duplicate progress records
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);

export default CourseProgress;