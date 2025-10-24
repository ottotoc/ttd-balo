const { AppError } = require('./errors');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  }

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: {
        message: 'Duplicate entry. This record already exists.',
        statusCode: 409,
      },
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: {
        message: 'Record not found.',
        statusCode: 404,
      },
    });
  }

  // Default error
  res.status(500).json({
    error: {
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
      statusCode: 500,
    },
  });
};

module.exports = errorHandler;

