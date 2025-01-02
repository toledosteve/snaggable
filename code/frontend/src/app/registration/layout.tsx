import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRegistrationSession } from "@/lib/session";
import { apiFetch } from "@/lib/api-client";
import { getRouteForNextStep } from "@/lib/registration";

export default async function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  try {
    const registrationSession = await getRegistrationSession();
    const registrationId = registrationSession.registrationId;

    const response = await apiFetch("/user/register/state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ registrationId }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch registration state");
    }

    const { state } = await response.json();

    if (!state || !state.currentStep) {
      console.error("Missing currentStep in registration state:", state);
      redirect("/registration/get-started");
    }

    const expectedRoute = getRouteForNextStep(state.currentStep);

    const currentRoute = new URL(window.location.href).pathname;
    if (currentRoute !== expectedRoute) {
      console.log("Redirecting to:", expectedRoute);
      redirect(expectedRoute);
    }
  } catch (error) {
    console.error("Error validating registration state:", error);
    redirect("/registration/get-started");
  }

  return (
    <>{children}</>
  );
}
