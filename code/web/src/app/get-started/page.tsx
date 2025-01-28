import { Progress } from "@/components/ui";
import PhoneNumberForm from "./form";
import { OAuthButton } from "@/lib/oauth/components/OAuthButton";
import { facebookConfig, googleConfig, appleConfig } from "@/lib/oauth/providers";

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">

        <h1 className="text-2xl font-bold mb-4">Welcome! How do you want to get started?</h1><br />

        <div className="space-y-4">
          <OAuthButton providerConfig={facebookConfig}>Login with Facebook</OAuthButton>
          <OAuthButton providerConfig={googleConfig}>Login with Google</OAuthButton>
          <OAuthButton providerConfig={appleConfig}>Login with Apple</OAuthButton>
        </div>
        <br />
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4 my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500 text-sm font-medium">or</span>
            <hr className="flex-1 border-gray-300" />
          </div>
          <PhoneNumberForm />       
        </div>
        
        

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
