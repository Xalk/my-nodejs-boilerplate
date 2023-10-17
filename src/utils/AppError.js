export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.httpStatus = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    console.log(this);
    Error.captureStackTrace(this, this.constructor);
  }
}
