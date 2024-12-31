import { Progress } from "@/components/ui";
import GenderForm from "./form";
import { decrypt, getCookie } from "@/lib/session";
import { redirect } from "next/navigation";
import { RegistrationSession } from "@/types/registration";
import { isRegistrationSession } from "@/lib/registration";

async function validateSession(): Promise<RegistrationSession> {
  const sessionCookie = await getCookie("registration_session");
  const registrationSession = await decrypt(sessionCookie);

  if (!registrationSession || !isRegistrationSession(registrationSession)) {
    redirect("/registration/get-started");
  }

  // Redirect if necessary based on your flow
  if (!registrationSession.dob) {
    redirect("/registration/enter-dob");
  }

  return registrationSession;
}

export default async function GenderPage() {
  await validateSession();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">
        {/* Progress Bar */}
        <Progress value={55} className="mb-6" />

        {/* Gender Selection */}
        <h1 className="text-2xl font-bold mb-4">What’s your gender?</h1>

        {/* Gender Form */}
        <GenderForm />
      </div>
    </div>
  );
}
