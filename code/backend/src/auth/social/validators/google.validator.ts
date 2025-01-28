import axios from 'axios';

export async function validateGoogleToken(token: string) {
    try {
      const tokenInfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
      const tokenInfoResponse = await axios.get(tokenInfoUrl);
  
      const { sub: id, name, email } = tokenInfoResponse.data;
      return { id, name, email };
    } catch (error) {
      console.error('Error validating Google token:', error.message);
      throw new Error('Failed to validate Google token');
    }
  }
  