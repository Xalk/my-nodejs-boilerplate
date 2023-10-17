import userService from './userService';
import { AppError } from '../utils/AppError';
import { httpStatus } from '../utils/enums';

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password, user.password))) {
    throw new AppError('Incorrect email or password', httpStatus.UNAUTHORIZED);
  }
  return user;
};

export default {
  loginUserWithEmailAndPassword,
};
