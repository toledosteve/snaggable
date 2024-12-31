import { Progress } from "@/components/ui";
import NameForm from "./form";
import { decrypt, getCookie } from "@/lib/session";
import { redirect } from "next/navigation";
import { isRegistrationSession } from "@/lib/registration";
import { RegistrationSession } from "@/types/registration";

// Helper function to validate session
async function validateSession(): Promise<RegistrationSession> {
  const sessionCookie = await getCookie("registration_session");
  const registrationSession = await decrypt(sessionCookie);

  // Use the type guard to validate the session and narrow its type
  if (!registrationSession || !isRegistrationSession(registrationSession)) {
    redirect("/registration/get-started");
  }

  // Redirect if name already defined
  if (registrationSession.name) {
    redirect("/registration/enter-dob");
  }

  return registrationSession; // The type is now narrowed to RegistrationSession
}

export default async function NamePage() {
  await validateSession();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">
        {/* Progress Bar */}
        <Progress value={33} className="mb-6" />

        {/* Name Input */}
        <h1 className="text-2xl font-bold mb-4">Nice one! So, what do you like to be called?</h1>
        <p className="text-gray-500 mb-4">This is how you’ll appear on Snaggable.</p>

        {/* Name Form */}
        <NameForm />
      </div>
    </div>
  );
}
