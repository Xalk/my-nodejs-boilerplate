import userService from './userService';
import { AppError } from '../utils/AppError';
import { httpStatus, tokenTypes } from '../utils/enums';
import Token from '../models/tokenModel.js';
import tokenService from './tokenService.js';

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password, user.password))) {
    throw new AppError('Incorrect email or password', httpStatus.UNAUTHORIZED);
  }
  return user;
};

const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new AppError('Not found', httpStatus.NOT_FOUND);
  }
  await refreshTokenDoc.remove();
};

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new AppError('Please authenticate', httpStatus.UNAUTHORIZED);
  }
};

export default {
  loginUserWithEmailAndPassword,
  refreshAuth,
  logout,
};
