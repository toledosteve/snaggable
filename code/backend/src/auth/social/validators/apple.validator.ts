import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';

export async function validateAppleToken(token: string) {
  try {
    // Get Apple public keys
    const appleKeysUrl = 'https://appleid.apple.com/auth/keys';
    const keysResponse = await axios.get(appleKeysUrl);
    const keys = keysResponse.data.keys;

    // Decode token header to find the key ID (kid)
    const decodedHeader = jwt.decode(token, { complete: true });
    const kid = decodedHeader?.header?.kid;
    const alg = decodedHeader?.header?.alg;

    if (!kid || !alg) {
      throw new Error('Invalid Apple token: Missing key ID or algorithm.');
    }

    // Find the matching key
    const appleKey = keys.find((key) => key.kid === kid && key.alg === alg);
    if (!appleKey) {
      throw new Error('Invalid Apple token: Public key not found.');
    }

    // Convert JWK to PEM format
    const publicKey = jwkToPem(appleKey);

    // Verify the token
    const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

    const { sub: id, email } = decodedToken as any;
    return { id, email };
  } catch (error) {
    console.error('Error validating Apple token:', error.message);
    throw new Error('Failed to validate Apple token.');
  }
}
