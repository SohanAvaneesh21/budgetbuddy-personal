import { Router } from "express";
import {
  loginController,
  registerController,
  sendVerificationOTPController,
  verifyEmailOTPController,
  sendPasswordResetOTPController,
  verifyPasswordResetOTPController,
  resetPasswordController,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);

// Email verification routes
authRoutes.post("/send-verification-otp", sendVerificationOTPController);
authRoutes.post("/verify-email-otp", verifyEmailOTPController);

// Password reset routes
authRoutes.post("/send-reset-otp", sendPasswordResetOTPController);
authRoutes.post("/verify-reset-otp", verifyPasswordResetOTPController);
authRoutes.post("/reset-password", resetPasswordController);

export default authRoutes;
