export function buildOAuthUrl({ authorizeUrl, clientId, redirectUri, scope, responseMode }: any) {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      response_type: 'code',
    });

    if (responseMode) {
      params.append('response_mode', responseMode);
    }

    return `${authorizeUrl}?${params.toString()}`;
  }
  