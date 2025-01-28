export const facebookConfig = {
    authorizeUrl: 'https://www.facebook.com/v21.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v21.0/oauth/access_token',
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    redirectUri: `${process.env.BASE_URL}/api/oauth/facebook/callback`,
    scope: 'email,user_birthday,user_gender,user_location',
    name: 'facebook',
  };