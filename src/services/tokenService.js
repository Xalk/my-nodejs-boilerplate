import jwt from 'jsonwebtoken';
import config from '../config/config';

const signToken = (id) =>
  jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpirationDays,
  });

const createSendToken = ({ id }) => {
  const token = signToken(id);

  return token;
};

export default {
  createSendToken,
};
