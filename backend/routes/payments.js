import express from "express";
const router = express.Router();

import {
  initializePayment,
  verifyPayment,
  sendPaymentSuccessEmail
} from "../controllers/payments.js";

import { auth, isStudent } from "../middleware/auth.js";



// PAYMENT ROUTES
router.post("/initialize", auth, isStudent, initializePayment);

// FIXED: use params OR change controller
router.get("/verify/:reference", auth, isStudent, verifyPayment);

router.post(
  "/payment-success-email",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);

export default router;