import { AuthService } from "@/lib/auth";

export async function apiFetch(url: string, options: RequestInit = {}) {
  const headers: Record<string, string> = options.headers instanceof Headers
    ? Object.fromEntries(options.headers.entries())
    : (options.headers as Record<string, string>) || {};

  let accessToken = await AuthService.getAccessToken();

  if (!accessToken) {
    try {
      const refreshToken = await AuthService.getRefreshToken();
      if (refreshToken) {
        accessToken = await AuthService.refreshAccessToken();
      } else {
        const { accessToken: newAccessToken } = await AuthService.authenticate();
        accessToken = newAccessToken;
      }
    } catch (error) {
      console.error("Unable to authenticate or refresh token:", error);
      throw new Error("Unauthorized");
    }
  }

  headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(`${process.env.API_ENDPOINT}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
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
