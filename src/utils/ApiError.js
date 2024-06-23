class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
  ) {
    super(message);

    if (typeof statusCode !== "number") {
      throw new TypeError("statusCode must be a number");
    }

    if (!Array.isArray(errors)) {
      throw new TypeError("errors must be an array");
    }

    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
