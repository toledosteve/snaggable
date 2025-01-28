import { facebookConfig } from './facebook';
import { googleConfig } from './google';
import { appleConfig } from './apple';

export function getProviderConfig(provider: string) {
  const configs: Record<string, any> = {
    facebook: facebookConfig,
    google: googleConfig,
    apple: appleConfig,
  };

  return configs[provider];
}

export { facebookConfig } from './facebook';
export { googleConfig } from './google';
export { appleConfig } from './apple';