import { httpStatus, resStatus } from '../utils/enums.js';
import { AppError } from '../utils/AppError.js';
import config from '../config/config.js';

const handleJWTError = () => new AppError('Invalid token. Please login again.', httpStatus.UNAUTHORIZED);

const handleJWTExpiredError = () => new AppError('Expired session. Please login again.', httpStatus.UNAUTHORIZED);

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, httpStatus.BAD_REQUEST);
};

const handleValidationErrorDB = (err) => {
  const errorsStr = Object.values(err.errors || '')
    .map((el) => el.message)
    .join('. ');

  const message = `Invalid input data. ${errorsStr}`;
  return new AppError(message, httpStatus.BAD_REQUEST);
};

const handleDuplicateFieldsDB = (err) => {
  const dupVal = Object.values(err.keyValue || '').join(', ');
  const message = `Duplication field value: ${dupVal}. Please use another value`;
  return new AppError(message, httpStatus.BAD_REQUEST);
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.httpStatus).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
  return res.status(err.httpStatus).send(err.message);
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.httpStatus).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error: don't leak error details'
    }

    // 1) Log error
    console.error('ERROR:', err);

    // 2) Send generic message
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }

  // RENDER ERROR

  if (err.isOperational) {
    return res.status(err.httpStatus).send('Page not found');

    // Programming or other unknown error: don't leak error details'
  }

  // 1) Log error
  console.error('ERROR:', err);

  // 2) Send generic message
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Page not found');
};

// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  err.httpStatus = err.httpStatus || httpStatus.INTERNAL_SERVER_ERROR;
  err.status = err.status || resStatus.error;
  let error = { ...err };
  error.message = err.message;

  switch (config.env) {
    case 'development':
      sendErrorDev(err, req, res);
      break;
    case 'production':
    default:
      switch (err.name) {
        case 'CastError':
          error = handleCastErrorDB(error);
          break;
        case 'ValidationError':
          error = handleValidationErrorDB(error);
          break;
        case 'JsonWebTokenError':
          error = handleJWTError();
          break;
        case 'TokenExpiredError':
          error = handleJWTExpiredError();
          break;

        default:
          if (err.code === 11000) error = handleDuplicateFieldsDB(error);
          break;
      }

      sendErrorProd(error, req, res);
      break;
  }
};
