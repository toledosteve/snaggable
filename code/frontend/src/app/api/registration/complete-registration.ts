"use server";

import { apiFetch } from "@/lib/api-client";
import { deleteRegistrationSession, getRegistrationSession } from "@/lib/session";

export async function completeRegistration() {
  const registrationSession = await getRegistrationSession();
  const registrationId = registrationSession.registrationId;

  const response = await apiFetch("/user/register/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registrationId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to complete registration.");
  }

  await deleteRegistrationSession();
}
