import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader, ArrowLeft, Mail, Key, Shield } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useSendResetOTPMutation,
  useVerifyResetOTPMutation,
  useResetPasswordMutation,
} from "@/features/auth/authAPI";
import { useState, useEffect } from "react";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits"),
});

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type EmailFormValues = z.infer<typeof emailSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

const ForgotPasswordForm = () => {
  const [sendResetOTP] = useSendResetOTPMutation();
  const [verifyResetOTP] = useVerifyResetOTPMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Force reset form when step changes to reset
  useEffect(() => {
    if (step === 'reset') {
      resetForm.reset({
        password: "",
        confirmPassword: "",
      });
    }
  }, [step, resetForm]);

  const onEmailSubmit = async (values: EmailFormValues) => {
    setIsLoading(true);
    try {
      await sendResetOTP(values.email).unwrap();
      setResetEmail(values.email);
      setStep("otp");
      toast.success("Reset code sent to your email");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (values: OtpFormValues) => {
    setIsLoading(true);
    try {
      const response = await verifyResetOTP({
        email: resetEmail,
        otp: values.otp,
      }).unwrap();
      setResetToken(response.resetToken);
      // Reset the password form when moving to reset step
      resetForm.reset({
        password: "",
        confirmPassword: "",
      });
      setStep("reset");
      toast.success("Code verified successfully");
    } catch (error: any) {
      toast.error(error.data?.message || "Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (values: ResetFormValues) => {
    setIsLoading(true);
    try {
      await resetPassword({
        email: resetEmail,
        otp: resetToken,
        password: values.password,
      }).unwrap();
      toast.success("Password reset successfully");
      // Redirect to login after successful reset
      window.location.href = AUTH_ROUTES.SIGN_IN;
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Email Input
  if (step === "email") {
    return (
      <Form {...emailForm}>
        <form
          onSubmit={emailForm.handleSubmit(onEmailSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="grid gap-6">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your registered email"
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
              <Mail className="h-4 w-4 mr-2" />
              Send Reset Code
            </Button>
          </div>
          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link
              to={AUTH_ROUTES.SIGN_IN}
              className="underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    );
  }

  // Step 2: OTP Verification
  if (step === "otp") {
    return (
      <Form {...otpForm}>
        <form
          onSubmit={otpForm.handleSubmit(onOtpSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center gap-2 text-center mb-4">
            <Shield className="h-12 w-12 text-primary mb-2" />
            <h2 className="text-xl font-semibold">Enter Reset Code</h2>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to {resetEmail}
            </p>
          </div>
          <div className="grid gap-6">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reset Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
              Verify Code
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setStep("email")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Email
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  // Step 3: Reset Password
  return (
    <Form {...resetForm} key="reset-password-form">
      <form
        onSubmit={resetForm.handleSubmit(onResetSubmit)}
        className="flex flex-col gap-6"
        autoComplete="off"
      >
        <div className="flex flex-col items-center gap-2 text-center mb-4">
          <Key className="h-12 w-12 text-green-500 mb-2" />
          <h2 className="text-xl font-semibold">Create New Password</h2>
          <p className="text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={resetForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={resetForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name="confirm-new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
            Reset Password
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setStep("otp")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Verification
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;


