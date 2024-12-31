"use server";

import { createCookie } from "@/lib/session";
import { z } from "zod";
import { apiFetch } from "../../../lib/api-client";

// Server-side validation schema
const PhoneNumberSchema = z.object({
  countryCode: z.string().min(1, "Country code is required."),
  phoneNumber: z.string().regex(/^\d+$/, "Must be a valid phone number."),
});

export async function sendVerification(data: { countryCode: string; phoneNumber: string }) {
  // Validate the data using zod
  const validation = PhoneNumberSchema.safeParse(data);
  if (!validation.success) {
    // Return errors in a consistent format for the client
    return { message: validation.error.errors[0].message };
  }

  const { countryCode, phoneNumber } = validation.data;
  const fullPhoneNumber = `${countryCode}${phoneNumber}`;
  const loginMethod = "phone";

  try {
    const response = await apiFetch(`/user/register/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: fullPhoneNumber, loginMethod: loginMethod }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { message: error.message || "Failed to send verification code." };
    }

    const { registrationId } = await response.json();

    // Create the session for registration
    await createCookie("registration", { registrationId: registrationId }, { expiresIn: 30 * 60 * 1000 });

    return null; // No errors
  } catch (error) {
    console.error("Error sending verification:", error);
    return { message: "An unexpected error occurred. Please try again." };
  }
}
