import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies helper
import { apiFetch } from "@/lib/api-client";

export async function middleware(req: Request) {
  const url = new URL(req.url);

  // Only handle requests under /registration
  if (!url.pathname.startsWith("/registration")) {
    return NextResponse.next();
  }

  // Access cookies using the `cookies` helper
  const cookieStore = await cookies();
  const registrationId = cookieStore.get("registration")?.value;

  if (!registrationId) {
    // Redirect to the get-started page if no registration session is found
    return NextResponse.redirect(new URL("/registration/get-started", req.url));
  }

  // Fetch the registration state from the backend
  try {
    const response = await apiFetch(`/user/register/state`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Invalid registration state");
    }

    const { currentStep } = await response.json();

    // Redirect to the appropriate step if not on the correct page
    const expectedPath = `/registration/${currentStep}`;
    if (!url.pathname.startsWith(expectedPath)) {
      return NextResponse.redirect(new URL(expectedPath, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error validating registration state:", error);
    return NextResponse.redirect(new URL("/registration/get-started", req.url));
  }
}

// Apply only to registration-related routes
export const config = {
  matcher: ["/registration/:path*"],
};
