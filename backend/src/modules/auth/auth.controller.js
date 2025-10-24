const bcrypt = require('bcryptjs');
const prisma = require('../../config/database');
const { signAccessToken, signRefreshToken } = require('../../utils/jwt');
const { mergeGuestCart } = require('../../utils/cart');
const { BadRequestError, UnauthorizedError } = require('../../common/errors');
const asyncHandler = require('../../common/asyncHandler');
const { success } = require('../../common/response');

// Register new user
const register = asyncHandler(async (req, res) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new BadRequestError('Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
      role: 'CUSTOMER',
    },
  });

  // Generate tokens
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  // Set cookies
  res.cookie('token', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Merge guest cart if exists
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    await mergeGuestCart(sessionId, user.id);
  }

  success(res, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
  }, 201);
});

// Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Generate tokens
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  // Set cookies
  res.cookie('token', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Merge guest cart if exists
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    await mergeGuestCart(sessionId, user.id);
  }

  success(res, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
  });
});

// Logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  success(res, { message: 'Logged out successfully' });
});

// Get current user
const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.user.sub) },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  success(res, { user });
});

// Refresh token
const refresh = asyncHandler(async (req, res) => {
  const { verifyRefreshToken } = require('../../utils/jwt');
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedError('No refresh token provided');
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const newAccessToken = signAccessToken(user);
    res.cookie('token', newAccessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    success(res, { message: 'Token refreshed' });
  } catch (error) {
    throw new UnauthorizedError('Invalid refresh token');
  }
});

module.exports = {
  register,
  login,
  logout,
  me,
  refresh,
};

