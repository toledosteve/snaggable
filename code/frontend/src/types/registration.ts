import { JWTPayload } from "jose";

export interface RegistrationSession extends JWTPayload {
  registrationId: string;
}