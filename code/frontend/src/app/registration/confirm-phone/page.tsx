import { Progress } from "@/components/ui";
import { decrypt, getCookie } from "@/lib/session";
import { isRegistrationSession } from "@/lib/registration";
import { redirect } from "next/navigation";
import OTPForm from "./form";
import ResendLink from "./resend-link";
import { RegistrationSession } from "@/types/registration";
import { JWTPayload } from "jose";

async function validateSession(): Promise<RegistrationSession> {
  const sessionCookie = await getCookie("registration_session");
  const registrationSession = await decrypt(sessionCookie);

  // Check if the session is valid and matches the RegistrationSession type
  if (!registrationSession || !isRegistrationSession(registrationSession)) {
    redirect("/registration/get-started");
  }

  // Redirect if phone is already verified
  if (registrationSession.phoneVerified) {
    redirect("/registration/enter-name");
  }

  // Return the validated session
  return registrationSession;
}

export default async function VerifyPhonePage() {
  const registrationSession = await validateSession();

  const maskedPhoneNumber = registrationSession.phoneNumber.replace(
    /^(\+\d{1,3})(.*)(\d{4})$/,
    (_, countryCode, hidden, lastFour) =>
      `${countryCode} (XXX) XXX-${lastFour}`
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">
        {/* Progress Bar */}
        <Progress value={22} className="mb-6" />

        {/* Phone Verification */}
        <h1 className="text-2xl font-bold mb-4">Enter the 4-digit code we just sent you</h1>
        <p className="text-gray-500 mb-4">
          Text to {maskedPhoneNumber} should arrive shortly.
        </p>

        {/* OTP Form */}
        <OTPForm />
        <p className="text-sm text-gray-500 mt-6">
          Didn’t receive the code? <ResendLink />.
        </p>
      </div>
    </div>
  );
}
