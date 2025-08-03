import express from "express";
import {
  enquiries,
  getenquiries,
  login,
  logout,
  register,
  verify,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//Authentication routes
router.post("/auth/login", login);
router.post("/auth/register", register);
router.post("/auth/logout", logout);
router.get("/auth/verify", authMiddleware, verify);

//Enquiry routes
router.post("/enquiries", enquiries);
router.get("/getenquiries", getenquiries);

export default router;
