import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    about: {
      type: String,
      maxlength: 500,
      default: "",
    },

    contactNumber: {
      type: String,
      trim: true,
      match: /^[0-9+]{7,15}$/,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
