import { buildOAuthUrl } from '../utils/buildUrl';

export function useOAuth(providerConfig: any) {

  const initiateOAuth = () => {
    const url = buildOAuthUrl(providerConfig);
    window.location.href = url;
  };

  return { initiateOAuth };
}
