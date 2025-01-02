import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { RegistrationSession } from "@/types/registration";

const secretKey = process.env.SESSION_SECRET || "default_secret_key";
const key = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  [key: string]: any; 
  expiresAt?: Date;
}

export async function encrypt(payload: Record<string, any>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') 
    .sign(key);
}

export async function decrypt<T extends JWTPayload = JWTPayload>(token: string | undefined): Promise<T | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"], 
    });
    return payload as T; 
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function createCookie(
  cookieName: string,
  payload: SessionPayload,
  options: {
    expiresIn?: number; 
  } = {}
): Promise<void> {
  const expiresIn = options.expiresIn || 60 * 60 * 1000; 
  const expiresAt = new Date(Date.now() + expiresIn);
  const cookieValue = await encrypt({ ...payload, expiresAt });

  const cookieStore = await cookies();

  cookieStore.set(cookieName, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getCookie(name: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

export async function deleteCookie(cookieName: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getRegistrationSession(): Promise<RegistrationSession> {
  const sessionCookie = await getCookie("registration");
  const registrationSession = await decrypt<RegistrationSession>(sessionCookie);

  if (!registrationSession || !registrationSession.registrationId) {
    throw new Error("Registration session is invalid or missing.");
  }

  return registrationSession;
}

export async function deleteRegistrationSession() {
  try {
    deleteCookie("registration");
  } catch (error) {
    console.error("Failed to delete registration session:", error);
    throw new Error("Failed to delete registration session.");
  }
}


