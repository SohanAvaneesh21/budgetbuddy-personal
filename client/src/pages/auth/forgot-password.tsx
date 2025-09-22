import ForgotPasswordForm from "./_component/forgot-password-form";
import Logo from "@/components/logo/logo";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8">
          <div className="flex justify-center mb-8">
            <Logo url="/" />
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your email to receive a reset code
            </p>
          </div>
          <ForgotPasswordForm />
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Secure password recovery via email 🔐
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
