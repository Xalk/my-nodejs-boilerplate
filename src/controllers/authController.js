import catchAsync from '../utils/catchAsync';
import { httpStatus } from '../utils/enums';
import { userService, tokenService, authService } from '../services';

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.cookie('refreshToken', tokens.refresh, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.cookie('refreshToken', tokens.refresh, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
  res.status(httpStatus.CREATED).json({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  await authService.logout(refreshToken);
  res.clearCookie('refreshToken');
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const tokens = await authService.refreshAuth(refreshToken);
  res.status(httpStatus.CREATED).json({ ...tokens });
});

export default {
  register,
  login,
  logout,
  refreshTokens,
};
