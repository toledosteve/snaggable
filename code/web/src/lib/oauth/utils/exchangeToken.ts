import { getProviderConfig } from "@/lib/oauth/providers";
import { generateAppleClientSecret } from './appleClientSecret';

export async function exchangeOAuthToken(provider: string, code: string) {
  const providerConfig = getProviderConfig(provider);

  if (!providerConfig) {
    return { error: 'Unknown provider', status: 400 };
  }

  try {
    const clientSecret = provider === 'apple' ? await generateAppleClientSecret() : providerConfig.clientSecret;

    const tokenResponse = await fetch(providerConfig.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: providerConfig.clientId,
        client_secret: clientSecret,
        redirect_uri: providerConfig.redirectUri,
        grant_type: 'authorization_code',
        code,
      }).toString(),
    });

    const response = await tokenResponse.json();

    if (tokenResponse.ok) {
      return { success: true, accessToken: response.access_token, idToken: response.id_token };
    }

    return { error: 'Failed to fetch token', details: response, status: 400 };
  } catch (error) {
    if (error instanceof Error) {
      return { error: 'Internal server error', details: error.message, status: 500 };
    }
    return { error: 'Unknown error occurred', status: 500 };
  }
}
