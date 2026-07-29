import express from "express";
const router = express.Router();

import {
  getAdminStats
} from "../controllers/getAdminStats.js";

import {
  auth,
  isAdmin
} from "../middleware/auth.js";


router.get(
  "/dashboardStats",
  auth,
  isAdmin,
  getAdminStats
);


export default router;