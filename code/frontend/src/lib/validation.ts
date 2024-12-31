import { JWTPayload } from "jose";
import { RegistrationSession } from "@/types/registration";

export function isRegistrationSession(payload: JWTPayload): payload is RegistrationSession {
    return (
      typeof payload.phoneNumber === "string" &&
      typeof payload.verificationId === "string" &&
      (typeof payload.phoneVerified === "boolean" || payload.phoneVerified === undefined)
    );
  }