import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: true,
      trim: true,
    },

    subSections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
      },
    ],
  },
  { timestamps: true }
);

const Section = mongoose.model("Section", sectionSchema);

export default Section;