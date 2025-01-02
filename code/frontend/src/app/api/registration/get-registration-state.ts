"use server";

import { apiFetch } from "@/lib/api-client";
import { getRegistrationSession } from "@/lib/session";

export async function getRegistrationState() {
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
      throw new Error("Failed to fetch registration state.");
    }

    const { state } = await response.json();

    if (!state) {
      throw new Error("Registration state is missing or invalid.");
    }

    return state;
  } catch (error) {
    console.error("Error fetching registration state:", error);
    throw error;
  }
}
