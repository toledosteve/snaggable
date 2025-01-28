import { Progress } from "@/components/ui";
import OTPForm from "./form";
import ResendLink from "./resend-link";
import { apiFetch } from "@/lib/api-client";
import { getRegistrationSession } from "@/lib/session";

function maskPhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(
    /^(\+\d{1,3})(.*)(\d{4})$/,
    (_, countryCode, hidden, lastFour) => `${countryCode} (XXX) XXX-${lastFour}`
  );
}

export default async function VerifyPhonePage() {
  const registrationSession = await getRegistrationSession();
  const registrationId = registrationSession.registrationId;

  const response = await apiFetch(`/user/register/state`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ registrationId }),
    cache: "no-store", 
  });

  if (!response.ok) {
    throw new Error("Invalid session");
  }

  const { state } = await response.json();

  if (!state || !state.phoneNumber) {
    throw new Error("Phone number is missing from the registration state.");
  }

  const { phoneNumber } = state;
  const maskedPhoneNumber = maskPhoneNumber(phoneNumber);

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
