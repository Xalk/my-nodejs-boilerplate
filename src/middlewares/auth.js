import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { httpStatus } from '../utils/enums';
import User from '../models/userModel';
import config from '../config/config';

export const verify = catchAsync(async (req, res, next) => {
  // 1) Getting token and checking of it's therefore
  const { authorization } = req.headers || {};

  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    token = req.cookies.jwt;
  }

  // 2) Verification token

  if (!token) return next(new AppError('You are not logged in. Please login to get an access.', httpStatus.UNAUTHORIZED));

  // 3) Check if user still exist

  const { id } = await promisify(jwt.verify)(token, config.jwt.secret);

  const curUser = await User.findById(id);

  if (!curUser) return next(new AppError('The user belonging to this token does no longer exist', httpStatus.UNAUTHORIZED));

  // Grant access to protected rout
  req.user = curUser;
  res.locals.user = curUser;

  next();
});
