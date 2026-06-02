export type AuthProvider = 'EMAIL' | 'KAKAO';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const AUTH_PROVIDER_KEY = 'authProvider';

const storage = () => (typeof window === 'undefined' ? null : window.localStorage);

export const authStorage = {
  getAccessToken: () => storage()?.getItem(ACCESS_TOKEN_KEY) ?? null,
  getRefreshToken: () => storage()?.getItem(REFRESH_TOKEN_KEY) ?? null,
  getAuthProvider: () => storage()?.getItem(AUTH_PROVIDER_KEY) as AuthProvider | null,
  hasAccessToken: () => Boolean(authStorage.getAccessToken()),
  isKakaoProvider: () => authStorage.getAuthProvider() === 'KAKAO',
  setTokens: (accessToken: string, refreshToken: string) => {
    storage()?.setItem(ACCESS_TOKEN_KEY, accessToken);
    storage()?.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  setAuthProvider: (provider: AuthProvider) => {
    storage()?.setItem(AUTH_PROVIDER_KEY, provider);
  },
  clear: () => {
    storage()?.removeItem(ACCESS_TOKEN_KEY);
    storage()?.removeItem(REFRESH_TOKEN_KEY);
    storage()?.removeItem(AUTH_PROVIDER_KEY);
  },
};
