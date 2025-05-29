class CustomApiError extends Error {
  statusCode: number;
  errorDetails?: any;

  constructor(
    statusCode: number,
    message: string | undefined,
    errorDetails?: any,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default CustomApiError;
