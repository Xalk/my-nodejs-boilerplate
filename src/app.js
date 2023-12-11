import express from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import passport from 'passport';
import config from './config/config';
import { authLimiter } from './middlewares/rateLimiter';
import routes from './routes/v1';
import globalErrorHandler from './middlewares/error';
import { AppError } from './utils/AppError';
import { httpStatus } from './utils/enums';
import jwtStrategy from './strategies/jwtStrategy.js';

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// enable cors
app.use(
  cors({
    origin: [config.cors.devOrigin, config.cors.prodOrigin],
    credentials: true,
  }),
);

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, httpStatus.NOT_FOUND));
});

// handle error
app.use(globalErrorHandler);

export default app;
