import { Progress } from "@/components/ui";
import { decrypt, getCookie } from "@/lib/session";
import { redirect } from "next/navigation";
import DOBForm from "./form";
import { RegistrationSession } from "@/types/registration";
import { JWTPayload } from "jose";

// Type guard to check if the session is a RegistrationSession
export function isRegistrationSession(payload: JWTPayload): payload is RegistrationSession {
  return (
    typeof payload.phoneNumber === "string" &&
    typeof payload.verificationId === "string" &&
    typeof payload.phoneVerified === "boolean" &&
    typeof payload.name === "string"
  );
}

// Helper function to validate session
async function validateSession(): Promise<RegistrationSession> {
  const sessionCookie = await getCookie("registration_session");
  const registrationSession = await decrypt(sessionCookie);

  // Check if the session is valid and matches the RegistrationSession type
  if (!registrationSession || !isRegistrationSession(registrationSession)) {
    redirect("/registration/get-started");
  }

  // Redirect if the name is not set
  if (!registrationSession.name) {
    redirect("/registration/enter-name");
  }

  // Redirect if the date of birth is already set
  if (registrationSession.dob) {
    redirect("/registration/gender");
  }

  // Return the validated session
  return registrationSession;
}

export default async function BirthdayPage() {
  await validateSession();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">
        {/* Progress Bar */}
        <Progress value={44} className="mb-6" />

        {/* Birthday Input */}
        <h1 className="text-2xl font-bold mb-4">Hey there! When’s your birthday?</h1>
        <p className="text-gray-500 mb-4">You must be at least 18 years old to use Snaggable.</p>

        {/* DatePicker Component */}
        <DOBForm />

        {/* Alternate Option */}
        <p className="text-sm text-gray-500 mt-6">
          Prefer to use your Facebook birthday?{' '}
          <a href="#" className="text-blue-600">Use Facebook instead</a>.
        </p>
      </div>
    </div>
  );
}
