import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { loginService, registerService } from "../services/auth.service";
import { sendOTPEmail, generateOTP, storeOTP, verifyOTP } from "../services/email.service";
import UserModel from "../models/user.model";
import { NotFoundException, UnauthorizedException } from "../utils/app-error";
import { z } from "zod";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    const result = await registerService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User registered successfully",
      data: result,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse({
      ...req.body,
    });
    const { user, accessToken, expiresAt, reportSetting } =
      await loginService(body);

    return res.status(HTTPSTATUS.OK).json({
      message: "User logged in successfully",
      user,
      accessToken,
      expiresAt,
      reportSetting,
    });
  }
);

// Email verification endpoints
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const otpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const sendVerificationOTPController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = emailSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException("User already exists");
    }

    const otp = generateOTP();
    storeOTP(email, otp, 'verification');
    
    await sendOTPEmail(email, otp, 'verification');

    return res.status(HTTPSTATUS.OK).json({
      message: "Verification code sent to your email",
    });
  }
);

export const verifyEmailOTPController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp } = otpSchema.parse(req.body);

    const isValid = verifyOTP(email, otp, 'verification');
    if (!isValid) {
      throw new UnauthorizedException("Invalid or expired verification code");
    }

    return res.status(HTTPSTATUS.OK).json({
      message: "Email verified successfully",
    });
  }
);

export const sendPasswordResetOTPController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = emailSchema.parse(req.body);

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundException("No account found with this email address");
    }

    const otp = generateOTP();
    storeOTP(email, otp, 'reset');
    
    await sendOTPEmail(email, otp, 'reset');

    return res.status(HTTPSTATUS.OK).json({
      message: "Password reset code sent to your email",
    });
  }
);

export const verifyPasswordResetOTPController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp } = otpSchema.parse(req.body);

    const isValid = verifyOTP(email, otp, 'reset');
    if (!isValid) {
      throw new UnauthorizedException("Invalid or expired reset code");
    }

    // Generate a temporary reset token for the final step
    const resetToken = generateOTP();
    storeOTP(email, resetToken, 'reset');

    return res.status(HTTPSTATUS.OK).json({
      message: "Reset code verified successfully",
      resetToken,
    });
  }
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp, password } = resetPasswordSchema.parse(req.body);

    const isValid = verifyOTP(email, otp, 'reset');
    if (!isValid) {
      throw new UnauthorizedException("Invalid or expired reset code");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Update password
    user.password = password;
    await user.save();

    return res.status(HTTPSTATUS.OK).json({
      message: "Password reset successfully",
    });
  }
);
