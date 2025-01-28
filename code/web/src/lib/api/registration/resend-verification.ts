"use server";

import { apiFetch } from "@/lib/api-client";
import { getRegistrationSession } from "@/lib/session";

export async function resendVerification() {
  const registrationSession = await getRegistrationSession();
  const registrationId = registrationSession.registrationId;

  try {
    const response = await apiFetch(`/user/register/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId }),
    });

    if (!response.ok) {
      throw new Error("Failed to resend verification code.");
    }
    return null; 
  } catch (error) {
    console.error("Error resending verification:", error);
    throw new Error("An unexpected error occurred.");
  }
}
