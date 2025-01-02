import { NextResponse } from "next/server";
import { getRegistrationSession } from "@/lib/session";
import { apiFetch } from "@/lib/api-client";
import { getRouteForNextStep } from "@/lib/registration";

export async function handleRegistrationMiddleware(req: Request): Promise<NextResponse> {
  const url = new URL(req.url);
  const currentPathname = url.pathname;

  if (currentPathname === "/registration/get-started") {
    return NextResponse.next();
  }

  try {
    const registrationSession = await getRegistrationSession();
    const registrationId = registrationSession.registrationId;

    const response = await apiFetch("/user/register/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId }),
    });

    if (!response.ok) {
      console.error("Failed to fetch registration state");
      return NextResponse.redirect(new URL("/registration/get-started", req.url));
    }

    const { state } = await response.json();

    if (!state?.currentStep) {
      console.error("Missing currentStep in registration state");
      return NextResponse.redirect(new URL("/registration/get-started", req.url));
    }

    const expectedRoute = getRouteForNextStep(state.currentStep);

    if (currentPathname !== expectedRoute) {
      return NextResponse.redirect(new URL(expectedRoute, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in registration middleware:", error);
    return NextResponse.redirect(new URL("/registration/get-started", req.url));
  }
}
