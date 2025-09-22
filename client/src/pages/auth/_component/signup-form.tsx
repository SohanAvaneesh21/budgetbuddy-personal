import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader, ArrowLeft, Mail, Check } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
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
import { useRegisterMutation, useSendVerificationOTPMutation, useVerifyEmailOTPMutation } from "@/features/auth/authAPI";
import { useState, useEffect, useRef } from "react";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

const completeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;
type CompleteFormValues = z.infer<typeof completeSchema>;

const SignUpForm = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [sendVerificationOTP] = useSendVerificationOTPMutation();
  const [verifyEmailOTP] = useVerifyEmailOTPMutation();
  const [step, setStep] = useState<'email' | 'otp' | 'complete'>('email');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const otpInputRef = useRef<HTMLInputElement>(null);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ""
    }
  });

  const completeForm = useForm<CompleteFormValues>({
    resolver: zodResolver(completeSchema),
  });

  // Reset OTP when transitioning to OTP step
  useEffect(() => {
    if (step === 'otp') {
      setOtpValue('');
      if (otpInputRef.current) {
        otpInputRef.current.focus();
      }
    }
  }, [step]);

  const onEmailSubmit = async (values: EmailFormValues) => {
    setIsVerifyingEmail(true);
    try {
      await sendVerificationOTP(values.email).unwrap();
      setVerifiedEmail(values.email);
      setStep('otp');
      toast.success("Verification code sent to your email");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send verification code");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }
    
    setIsVerifyingOtp(true);
    try {
      await verifyEmailOTP({ email: verifiedEmail, otp: otpValue }).unwrap();
      setStep('complete');
      toast.success("Email verified successfully");
    } catch (error: any) {
      toast.error(error.data?.message || "Invalid verification code");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const onCompleteSubmit = (values: CompleteFormValues) => {
    const finalData = {
      ...values,
      email: verifiedEmail,
    };
    
    register(finalData)
      .unwrap()
      .then(() => {
        toast.success("Account created successfully");
        navigate(AUTH_ROUTES.SIGN_IN);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data?.message || "Failed to create account");
      });
  };

  // Step 1: Email Input
  if (step === 'email') {
    return (
      <Form {...emailForm}>
        <form
          onSubmit={emailForm.handleSubmit(onEmailSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <Mail className="h-12 w-12 text-primary mb-2" />
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Enter your email to get started
            </p>
          </div>
          <div className="grid gap-6">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isVerifyingEmail} type="submit" className="w-full">
              {isVerifyingEmail && <Loader className="h-4 w-4 animate-spin mr-2" />}
              Send Verification Code
            </Button>
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
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
  if (step === 'otp') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Mail className="h-12 w-12 text-primary mb-2" />
          <h1 className="text-2xl font-bold">Verify Email</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter the 6-digit code sent to {verifiedEmail}
          </p>
        </div>
        <div className="grid gap-6">
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Verification Code
            </label>
            <input 
              ref={otpInputRef}
              placeholder="123456" 
              maxLength={6}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center text-lg tracking-widest mt-2"
              type="text"
              autoComplete="off"
              value={otpValue}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtpValue(value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && otpValue.length === 6) {
                  handleOtpSubmit();
                }
              }}
            />
          </div>
          <Button 
            disabled={isVerifyingOtp || otpValue.length !== 6} 
            onClick={handleOtpSubmit} 
            className="w-full"
          >
            {isVerifyingOtp && <Loader className="h-4 w-4 animate-spin mr-2" />}
            Verify Code
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full"
            onClick={() => setStep('email')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Email
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Complete Registration
  return (
    <Form {...completeForm}>
      <form
        onSubmit={completeForm.handleSubmit(onCompleteSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Check className="h-12 w-12 text-green-500 mb-2" />
          <h1 className="text-2xl font-bold">Complete Setup</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Create your password to finish registration
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={completeForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={completeForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Create a strong password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
            Create Account
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full"
            onClick={() => setStep('otp')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Verification
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
