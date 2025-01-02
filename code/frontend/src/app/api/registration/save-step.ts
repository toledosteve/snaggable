"use server";

import { apiFetch } from "@/lib/api-client";
import { getRegistrationSession } from "@/lib/session";

interface SaveStepPayload {
  registrationId?: string;
  step: string;
  data: Record<string, any>;
}

export async function saveStep(payload: SaveStepPayload) {
  const registrationSession = await getRegistrationSession();
  const registrationId = registrationSession.registrationId;

  payload.registrationId = registrationId;

  const response = await apiFetch("/user/register/save-step", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to save step.");
  }

  return response.json();
}
