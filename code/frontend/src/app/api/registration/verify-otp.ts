"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { getRegistrationSession } from "@/lib/session";

const OtpSchema = z.object({
  otp: z.string().length(4, "OTP must be exactly 4 digits"),
});

export async function verifyOtp(data: { otp: string }) {
  const validation = OtpSchema.safeParse(data);
  if (!validation.success) {
    return { message: validation.error.errors[0].message };
  }

  const { otp } = validation.data;

  const registrationSession = await getRegistrationSession();
  const registrationId = registrationSession.registrationId;

  if (
    !registrationSession ||
    !registrationId
  ) {
    redirect("/registration/get-started");
  }

  try {
    const response = await apiFetch(`/user/register/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId, code: otp }),
    });

    if (!response.ok) {
      return { message: "Invalid OTP. Please try again." };
    }

    const result = await response.json();
    return null; 
  } catch (error) {
    console.error("Error verifying OTP:", (error as Error).message);
    return { message: "An unexpected error occurred." };
  }
}
