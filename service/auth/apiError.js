module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, "Unauthorized error");
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static Forbidden(message, errors = []) {
    return new ApiError(403, message, errors);
  }

  static Conflict(message, errors = []) {
    return new ApiError(409, message, errors);
  }
};
