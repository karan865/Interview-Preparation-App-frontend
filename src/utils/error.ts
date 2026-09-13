export class ApiError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(message: string, statusCode: number = 500, errors?: any[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Converts any caught error into a clean, human-readable user message.
 */
export const parseErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  if (error instanceof ApiError) {
    // 400 Validation or bad request
    if (error.statusCode === 400) {
      if (error.errors && error.errors.length > 0) {
        const first = error.errors[0];
        return first.message || error.message || 'Please check your inputs.';
      }
      return error.message || 'Invalid request. Please check your data.';
    }

    // 401 Authentication
    if (error.statusCode === 401) {
      return error.message || 'Your session has expired. Please log in again.';
    }

    // 403 Forbidden
    if (error.statusCode === 403) {
      return 'You do not have permission to perform this action.';
    }

    // 404 Not Found
    if (error.statusCode === 404) {
      return error.message || 'The requested item could not be found.';
    }

    // 409 Conflict
    if (error.statusCode === 409) {
      return error.message || 'This item or account already exists.';
    }

    // 500 Server Error
    if (error.statusCode >= 500) {
      return 'Server is currently experiencing issues. Please try again shortly.';
    }

    return error.message;
  }

  if (error instanceof Error) {
    // Network errors (Fetch failures, offline)
    if (
      error.message.includes('Network request failed') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('timeout')
    ) {
      return 'Network connection unavailable. Please check your internet or local server connection.';
    }
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};
