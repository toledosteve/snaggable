import { RegistrationSession } from "@/types/registration";
import { JWTPayload } from "jose";

export function isRegistrationSession(payload: JWTPayload): payload is RegistrationSession {
  return (
    typeof payload.phoneNumber === "string" &&
    (payload.phoneVerified === undefined || typeof payload.phoneVerified === "boolean")
  );
}
