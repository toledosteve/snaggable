"use server";

import { decrypt, getCookie, createCookie } from "@/lib/session";

// Define the function to handle the API call for resending the code
export async function resendVerification() {
  const sessionCookie = await getCookie("registration_session");
  const registrationSession = await decrypt(sessionCookie);

  if (!registrationSession || !registrationSession.phoneNumber || !registrationSession.verificationId) {
    throw new Error("Session expired or invalid. Please restart the process.");
  }

  const { phoneNumber } = registrationSession;

  try {
    // Call the API to resend the verification code
    const response = await fetch(`${process.env.API_ENDPOINT}/registration/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      throw new Error("Failed to resend verification code.");
    }

    const { verificationId: newVerificationId } = await response.json();

    // Update the session with the new verificationId
    const updatedSession = {
      ...registrationSession,
      verificationId: newVerificationId, // Replace with the new ID
    };

    await createCookie("registration_session", updatedSession);

    return null; // Resend was successful
  } catch (error) {
    console.error("Error resending verification:", error);
    throw new Error("An unexpected error occurred.");
  }
}
