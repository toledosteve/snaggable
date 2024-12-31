import { RegistrationSession } from "@/types/registration";
import { JWTPayload } from "jose";

export function isRegistrationSession(payload: JWTPayload): payload is RegistrationSession {
  const isDobValid = (dob: unknown): dob is { day: number; month: string; year: number } =>
    typeof dob === "object" &&
    dob !== null &&
    "day" in dob &&
    "month" in dob &&
    "year" in dob &&
    typeof (dob as any).day === "number" &&
    typeof (dob as any).month === "string" &&
    typeof (dob as any).year === "number";

  return (
    typeof payload.phoneNumber === "string" &&
    typeof payload.verificationId === "string" &&
    (payload.phoneVerified === undefined || typeof payload.phoneVerified === "boolean") &&
    (payload.name === undefined || typeof payload.name === "string") &&
    (payload.dob === undefined || isDobValid(payload.dob))
  );
}
