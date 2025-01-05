"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui";

export default function OAuthButtons() {
  const handleOAuthLogin = async (provider: string) => {
    try {
      const response = await signIn(provider, { redirect: false });

      if (response?.ok && response?.url) {
        const tokenUrl = new URL(response.url);
        const accessToken = tokenUrl.searchParams.get("access_token");

        if (accessToken) {
          // Call your API to authenticate the user
          const result = await fetch("/api/auth/user-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loginMethod: provider, accessToken }),
          });

          if (!result.ok) {
            const error = await result.json();
            console.error("Authentication error:", error.message);
          }
        } else {
          console.error("Access token is missing");
        }
      } else {
        console.error("OAuth login failed");
      }
    } catch (error) {
      console.error("Error during OAuth login:", error);
    }
  };

  return (
    <>
      <Button variant="outline" className="w-full" onClick={() => handleOAuthLogin("google")}>
        Continue with Google
      </Button>
      <Button variant="outline" className="w-full" onClick={() => handleOAuthLogin("facebook")}>
        Continue with Facebook
      </Button>
      <Button variant="outline" className="w-full" onClick={() => handleOAuthLogin("facebook")}>
        Continue with Apple
      </Button>
    </>
  );
}
