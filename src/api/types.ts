export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export type EmptyResponseData = Record<string, never>;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const hasCompleteTokens = (data: unknown): data is TokenPair => {
  return (
    isRecord(data) &&
    typeof data.accessToken === 'string' &&
    data.accessToken.length > 0 &&
    typeof data.refreshToken === 'string' &&
    data.refreshToken.length > 0
  );
};
