import { AuthService } from "@/lib/auth";

export async function apiFetch(url: string, options: RequestInit = {}) {
  // Ensure headers is a plain object
  const headers: Record<string, string> = options.headers instanceof Headers
    ? Object.fromEntries(options.headers.entries())
    : (options.headers as Record<string, string>) || {};

  let accessToken = await AuthService.getAccessToken();

  if (!accessToken) {
    try {
      accessToken = await AuthService.refreshAccessToken();
    } catch (error) {
      console.error("Unable to refresh token:", error);
      throw new Error("Unauthorized");
    }
  }

  // Add Authorization header
  headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(`${process.env.API_ENDPOINT}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Try refreshing the token
    try {
      accessToken = await AuthService.refreshAccessToken();
      headers["Authorization"] = `Bearer ${accessToken}`;
      return fetch(`${process.env.API_ENDPOINT}${url}`, { ...options, headers });
    } catch (error) {
      console.error("Retry failed:", error);
      throw new Error("Unauthorized");
    }
  }

  return response;
}
