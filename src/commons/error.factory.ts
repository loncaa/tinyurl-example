const createApiError = (message: string): ApiError => ({
  error: true,
  message: message,
});

export type ApiError = {
  error: boolean;
  message: string;
};

export default createApiError;

export const CommonErrorMessage = {
  NotFound: (id: string) => `Url ${id} not found.`,
};

export const AuthErrorMessage = {
  Unauthorized: "User Unauthorized",
  Forbidden: "Path Forbidden",
};
