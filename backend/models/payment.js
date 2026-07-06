import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    coursesId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "success",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);