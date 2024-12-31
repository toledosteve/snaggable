import { Progress, Button } from "@/components/ui";
import PhoneNumberForm from "./form";

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">
        {/* Progress Bar */}
        <Progress value={11} className="mb-6" />

        {/* Welcome Message */}
        <h1 className="text-2xl font-bold mb-4">Welcome! How do you want to get started?</h1>

        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            Continue with Apple
          </Button>
          <Button variant="outline" className="w-full">
            Continue with Facebook
          </Button>
          <div className="text-gray-500 my-2">or</div>

          <PhoneNumberForm />
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-6">
          By signing up, you agree to our{" "}
          <a href="#" className="text-blue-600">
            Terms
          </a>.
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
