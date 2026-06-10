import mongoose from "mongoose";

const subSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    timeDuration: {
      type: Number, // in seconds (better for LMS)
      default: 0,
    },

    description: {
      type: String,
      trim: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
  },
  { timestamps: true }
);

const SubSection = mongoose.model("SubSection", subSectionSchema);

export default SubSection;