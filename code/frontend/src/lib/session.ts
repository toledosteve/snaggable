import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secretKey = process.env.SESSION_SECRET || "default_secret_key";
const key = new TextEncoder().encode(secretKey);

// Define a generic payload structure
export interface SessionPayload {
  [key: string]: any; // Allows dynamic properties
  expiresAt?: Date; // Optional expiration time
}

export async function encrypt(payload: Record<string, any>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') // Adjust expiration as needed
    .sign(key);
}

export async function decrypt<T extends JWTPayload = JWTPayload>(token: string | undefined): Promise<T | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"], // Specify the algorithm you're using
    });
    return payload as T; // Cast payload to the specified type
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function createCookie(
  cookieName: string,
  payload: SessionPayload,
  options: {
    expiresIn?: number; // Expiration time in milliseconds (default: 1 hour)
  } = {}
): Promise<void> {
  const expiresIn = options.expiresIn || 60 * 60 * 1000; // Default: 1 hour
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

/**
 * Delete a cookie by name
 */
export async function deleteCookie(cookieName: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

