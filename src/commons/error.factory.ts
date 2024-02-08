const createApiError = (message: string): ApiError => ({
  error: true,
  message: message,
});

export type ApiError = {
  error: boolean;
  message: string;
};

export const ShortUrlErrorMessage = {
  NotFound: (id: string) => `Url ${id} not found.`,
};

export const AuthErrorMessage = {
  Unauthorized: "User Unauthorized",
  Forbidden: "Path Forbidden",
};

export const UsageStatisticsErrorMessage = {
  NotFound: "Statistics not found",
};

export const ShortenUrlErrorMessage = {
  Failed: "Failed to create",
  ShortNotAccepted: "Short not accepted",
};

export default createApiError;
