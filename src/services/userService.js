import User from '../models/userModel';
import { httpStatus } from '../utils/enums';
import { AppError } from '../utils/AppError';

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new AppError('Email already taken', httpStatus.BAD_REQUEST);
  }
  return User.create(userBody);
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new AppError('Email already taken', httpStatus.BAD_REQUEST);
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }
  await user.remove();
  return user;
};

export default {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
