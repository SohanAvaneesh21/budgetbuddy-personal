import SignUpForm from "./_component/signup-form"
import Logo from "@/components/logo/logo"

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8">
          <div className="flex justify-center mb-8">
            <Logo url="/" />
          </div>
          <SignUpForm />
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join thousands managing their finances with AI 
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp