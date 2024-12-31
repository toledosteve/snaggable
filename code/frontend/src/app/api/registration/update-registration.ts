"use server";

import { decrypt, getCookie, createCookie } from "@/lib/session";
import { RegistrationSession } from "@/types/registration";

// Function to update the registration session
export async function updateRegistrationSession(
  updates: Partial<RegistrationSession>
) {
  const sessionCookie = await getCookie("registration_session");
  const registrationSession = await decrypt<RegistrationSession>(sessionCookie);

  // Ensure we have a valid session
  if (!registrationSession) {
    throw new Error("Session not found or invalid.");
  }

  // Update the session with new data
  const updatedSession = { ...registrationSession, ...updates };

  // Store the updated session back into the cookie
  await createCookie("registration_session", updatedSession);
}
