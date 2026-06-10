import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    courseDescription: {
      type: String,
      required: true,
      trim: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    whatYouWillLearn: {
      type: String,
      trim: true,
    },

    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],

    ratingAndReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
      },
    ],

    price: {
      type: Number,
      default: 0,
    },

    thumbnail: {
      type: String,
      default: "",
    },
totalDuration: {
  type: Number,
  default: 0,
},
durationUnit: {
  type: String,
  enum: ["seconds", "minutes", "hours"],
  default: "seconds",
},
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    tags: {
      type: [String],
      default: [],
    },

    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    instructions: {
      type: [String],
      default: [],
    },

    status: {
  type: String,
  enum: ["Draft", "Published", "Archived"],
  default: "Draft",
}
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;