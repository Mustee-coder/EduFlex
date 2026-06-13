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

    //  last video user stopped at
    lastWatched: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
      default: null,
    },

    //  all completed lessons
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
      },
    ],

    //  percentage progress (0 - 100)
    progressPercentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//  prevent duplicate progress per user per course
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model("CourseProgress", courseProgressSchema);