"use server";

import { createCookie, decrypt, getCookie } from "@/lib/session";
import { z } from "zod";
import { redirect } from "next/navigation";

// Validation schema for OTP
const OtpSchema = z.object({
  otp: z.string().length(4, "OTP must be exactly 4 digits"),
});

export async function verifyOtp(data: { otp: string }) {
  // Validate the OTP using zod
  const validation = OtpSchema.safeParse(data);
  if (!validation.success) {
    return { message: validation.error.errors[0].message };
  }

  const { otp } = validation.data;

  // Retrieve the registration session cookie
  const sessionCookie = await getCookie("registration_session");
  const registrationSession = await decrypt(sessionCookie);

  if (!registrationSession || !registrationSession.phoneNumber || !registrationSession.verificationId) {
    // Redirect back to the get-started page if the session is invalid or incomplete
    redirect("/registration/get-started");
  }

  const { phoneNumber, verificationId } = registrationSession;

  try {
    const response = await fetch(`${process.env.API_ENDPOINT}/registration/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, verificationId, code: otp }),
    });

    if (!response.ok) {
      return { message: "Invalid OTP. Please try again." };
    }

    const result = await response.json();
    console.log("OTP verification result:", result);

    // Update the session to mark the phone as verified
    await createCookie("registration_session", { ...registrationSession, phoneVerified: true });

    return null; // Success
  } catch (error) {
    console.error("Error verifying OTP:", (error as Error).message);
    return { message: "An unexpected error occurred." };
  }
}
