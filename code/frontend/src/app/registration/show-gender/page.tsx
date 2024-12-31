import { Progress } from "@/components/ui";
import ShowGenderForm from "./form";
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

  // Ensure the user has selected their gender before proceeding
  if (!registrationSession.gender) {
    redirect("/registration/gender");
  }

  return registrationSession;
}

export default async function ShowGenderPage() {
  await validateSession();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">
        {/* Progress Bar */}
        <Progress value={66} className="mb-6" />

        {/* Show Gender Form */}
        <h1 className="text-2xl font-bold mb-4">Show your gender on your profile?</h1>

        {/* Show Gender Form */}
        <ShowGenderForm />
      </div>
    </div>
  );
}
