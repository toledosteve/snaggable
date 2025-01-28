import { SignJWT } from 'jose';
import { createPrivateKey } from 'crypto';

export async function generateAppleClientSecret() {
  const privateKeyString = process.env.APPLE_PRIVATE_KEY || '';
  const formattedKey = privateKeyString.replace(/\\n/g, '\n');
    
  const privateKey = createPrivateKey({
    key: formattedKey,
    format: 'pem',
  });

  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: process.env.APPLE_KEY_ID || '' })
    .setIssuer(process.env.APPLE_TEAM_ID || '')
    .setAudience('https://appleid.apple.com')
    .setSubject(process.env.APPLE_CLIENT_ID || '')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);

  return jwt;
}
