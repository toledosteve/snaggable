import { Progress, Button } from "@/components/ui";
import PhoneNumberForm from "./form";
import OAuthButtons from "@/components/OAuthButtons";

const WelcomePage = () => {
  // const handleOAuthLogin = async (provider: string) => {
  //   const response = await signIn(provider, { redirect: false });

  //   if (response?.ok && response?.url) {
  //     const tokenUrl = new URL(response.url);
  //     const accessToken = tokenUrl.searchParams.get("access_token");

  //     if (accessToken) {
  //      console.log("Access token:", accessToken);
  //     } else {
  //       console.error("Failed to retrieve access token");
  //     }
  //   } else {
  //     console.error("OAuth login failed");
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">
        <Progress value={11} className="mb-6" />

        <h1 className="text-2xl font-bold mb-4">Welcome! How do you want to get started?</h1>

        <div className="space-y-4">
          <OAuthButtons />
          <div className="text-gray-500 my-2">or</div>
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
