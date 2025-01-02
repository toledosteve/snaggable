import { createCookie, getCookie, deleteCookie, decrypt } from "@/lib/session";

export class AuthService {
  static async authenticate() {
    const response = await fetch(`${process.env.API_ENDPOINT}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate.");
    }

    const { accessToken, refreshToken } = await response.json();

    await createCookie("access_token", { token: accessToken }, { expiresIn: 15 * 60 * 1000 }); 
    await createCookie("refresh_token", { token: refreshToken }, { expiresIn: 7 * 24 * 60 * 60 * 1000 }); 

    return { accessToken, refreshToken };
  }

  static async getAccessToken() {
    const encryptedToken = await getCookie("access_token");
    if (!encryptedToken) return null;

    const tokenData = await decrypt<{ token: string }>(encryptedToken);
    return tokenData?.token || null;
  }

  static async getRefreshToken() {
    const encryptedToken = await getCookie("refresh_token");
    if (!encryptedToken) return null;

    const tokenData = await decrypt<{ token: string }>(encryptedToken);
    return tokenData?.token || null;
  }

  static async refreshAccessToken() {
    const refreshToken = await AuthService.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available.");

    const response = await fetch(`${process.env.API_ENDPOINT}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token.");
    }

    const { accessToken } = await response.json();

    await createCookie("access_token", { token: accessToken }, { expiresIn: 15 * 60 * 1000 });

    return accessToken;
  }

  static async logout() {
    await deleteCookie("access_token");
    await deleteCookie("refresh_token");
  }
}
