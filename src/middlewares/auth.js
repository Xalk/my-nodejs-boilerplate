import passport from 'passport';
import catchAsync from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import { httpStatus } from '../utils/enums.js';

export const auth = catchAsync(async (req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new AppError('Invalid token, please log in or sign up', httpStatus.UNAUTHORIZED));
    }

    req.user = user;
    return next();
  })(req, res, next);
});
