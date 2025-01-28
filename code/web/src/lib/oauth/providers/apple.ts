export const appleConfig = {
    authorizeUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
    clientId: process.env.APPLE_CLIENT_ID,
    redirectUri: `${process.env.BASE_URL}/api/oauth/apple/callback`,
    scope: 'name email',
    name: 'apple',
    responseMode: 'form_post'
  };