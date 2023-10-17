import catchAsync from '../utils/catchAsync';
import { httpStatus } from '../utils/enums';
import { userService, tokenService, authService } from '../services';

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const token = tokenService.createSendToken({ id: user._id });
  res.status(httpStatus.CREATED).json({ user, token });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = tokenService.createSendToken({ id: user._id });
  res.status(httpStatus.CREATED).json({ user, token });
});

export default {
  register,
  login,
};
