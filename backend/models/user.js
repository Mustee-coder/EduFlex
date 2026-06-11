import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
  type: Boolean,
  default: false,
},

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
  type: String,
  required: true,
  select: false,
},

    accountType: {
      type: String,
      enum: ["Admin", "Instructor", "Student"],
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    approved: {
  type: Boolean,
  default: true,
},

    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      default: null,
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    image: {
      type: String,
      default: "",
    },

    token: {
      type: String,
      default: null,
    },

    resetPasswordTokenExpires: {
      type: Date,
    },

    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
