const jwt = require('jsonwebtoken');
const { JWT_SECRET, REFRESH_SECRET } = require('../config/env');

const signAccessToken = (user) => {
  return jwt.sign(
    { 
      sub: user.id, 
      role: user.role,
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const signRefreshToken = (user) => {
  return jwt.sign(
    { sub: user.id },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

