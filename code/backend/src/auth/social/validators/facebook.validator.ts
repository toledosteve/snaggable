import axios from 'axios';

export async function validateFacebookToken(token: string) {
  try {
    const debugUrl = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${process.env.FACEBOOK_APP_ACCESS_TOKEN}`;
    const debugResponse = await axios.get(debugUrl);
    const isValid = debugResponse.data?.data?.is_valid;

    if (!isValid) {
      throw new Error('Invalid Facebook token');
    }

    const userUrl = `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`;
    const userResponse = await axios.get(userUrl);
    const { id, name, email } = userResponse.data;

    return { id, name, email };
  } catch (error) {
    console.error('Error validating Facebook token:', error.message);
    throw new Error('Failed to validate Facebook token');
  }
}