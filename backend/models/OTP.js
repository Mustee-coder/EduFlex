import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    otp: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 6,
    },

    expiresAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 5 * 60 * 1000,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model("OTP", OTPSchema);

export default OTP;